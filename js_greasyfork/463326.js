// ==UserScript==
// @name         HLS(m3u8) Ad Remover
// @name:zh-CN   HLS(m3u8) 去广告
// @namespace    http://tampermonkey.net/
// @license      GNU AGPLv3
// @version      0.9.1
// @description  Remove HLS.js based(m3u8) ad stream
// @description:zh-cn   基于HLS.js(m3u8)播放器的去视频流内插广告插件，大部分视频网站都是基于这个库的，欢迎提交视频网址的匹配规则
// @author       douniwan6

// @include      /^https?://[^/]*xiaobaotv[^/]*/player.*/
// @include      /^https?://[^/]*xiaoheimi[^/]*/player.*/
// @include      /^https?://[^/]*xiaoxintv[^/]*/player.*/
// @match        http*://xbyy.app/player*

// @match        http*://danmu.yhdm666.top/player*
// @match        http*://danmu3.yhdm6go.top/player*
// @match        http*://www.yhdmz2.com/tpsf/player*
// @match        http*://player.mcue.cc/yinhua*

// @match        http*://*/m3u8/*
// @match        http*://*/vip/*

// @include      /^https?://[^/]*gimy[^/]*/jcplayer.*/

// @include      /^https?://[^/]*haitu[^/]*/addons/dp/player/dp.php

// @match        http*://olevod1.com/addons/dp/player*

// @match        http*://api.tinga88.com/*
// @match        http*://www.kuaikanys.net/jiexi*
// @match        http*://w5cin.com/player*
// @match        http*://nnyy.in/*
// @match        http*://fstoo.com/vod/player.html*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @supportURL   https://greasyfork.org/en/scripts/463326-hls-m3u8-ad-remover/feedback
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463326/HLS%28m3u8%29%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/463326/HLS%28m3u8%29%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*global Hls*/

    // debugger
    console.log("HLS Ad Remover loaded");

    const CACHE_BUSTER_PARAM = 'cb';
    const REQUEST_TIMEOUT = 10000;
    let FetchMethod = "HEAD";
    async function gmFetch(url, retries = 3) {
        return new Promise((resolve, reject) => {
            // Extra parameter may break signature
            // const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}${CACHE_BUSTER_PARAM}=${Date.now()}`;
            const cacheBustUrl = url;

            const tryFetch = (attemptsLeft) => {
                GM_xmlhttpRequest({
                    // some CDN only allow GET not HEAD
                    method: FetchMethod,
                    url: cacheBustUrl,
                    headers: FetchMethod === "GET" ? { Range: "bytes=0-1" } : null,
                    timeout: REQUEST_TIMEOUT,
                    onload: (response) => {
                        // may got 206
                        if (response.status >= 200 && response.status < 300) {
                            resolve({
                                data: response.responseText,
                                headers: {
                                    date: response.responseHeaders.match(/^date:(.*)/im)?.[1],
                                    contentLength: response.responseHeaders.match(/^content-length:(.*)/im)?.[1],
                                    server: response.responseHeaders.match(/^server:(.*)/im)?.[1],
                                    age: response.responseHeaders.match(/^Age:(.*)/im)?.[1],
                                    etag: response.responseHeaders.match(/^ETag:(.*)/im)?.[1],
                                    lastModified: response.responseHeaders.match(/^Last-Modified:(.*)/im)?.[1]
                                }
                            });
                        } else {
                            if (attemptsLeft > 0) {
                                console.log(`Retrying fetch, ${attemptsLeft} attempts left`);
                                tryFetch(attemptsLeft - 1);
                                FetchMethod = "GET";
                            } else {
                                reject(new Error(`Failed to fetch ${cacheBustUrl}: ${response.status}`));
                            }
                        }
                    },
                    ontimeout: () => {
                        if (attemptsLeft > 0) {
                            console.log(`Retrying fetch, ${attemptsLeft} attempts left`);
                            tryFetch(attemptsLeft - 1);
                        } else {
                            reject(new Error('Timeout fetching clean manifest after all retries'));
                        }
                    },
                    onerror: () => {
                        if (attemptsLeft > 0) {
                            console.log(`Retrying fetch, ${attemptsLeft} attempts left`);
                            tryFetch(attemptsLeft - 1);
                        } else {
                            reject(new Error('Error fetching clean manifest'))
                        }
                    },
                });
            };

            tryFetch(retries);
        });
    }

    function levenshteinDistance(s, t) {
        // 判断输入是否为空
        if (s.length === 0) return t.length;
        if (t.length === 0) return s.length;

        // 初始化距离矩阵
        const distanceMatrix = Array(t.length + 1).fill(null).map(() => Array(s.length + 1).fill(null));

        // 初始化第一行和第一列
        for (let i = 0; i <= s.length; i += 1) {
            distanceMatrix[0][i] = i;
        }

        for (let j = 0; j <= t.length; j += 1) {
            distanceMatrix[j][0] = j;
        }

        // 计算距离矩阵
        for (let j = 1; j <= t.length; j += 1) {
            for (let i = 1; i <= s.length; i += 1) {
                const substitutionCost = s.charAt(i - 1) === t.charAt(j - 1) ? 0 : 1;
                distanceMatrix[j][i] = Math.min(
                    distanceMatrix[j][i - 1] + 1, // 插入操作
                    distanceMatrix[j - 1][i] + 1, // 删除操作
                    distanceMatrix[j - 1][i - 1] + substitutionCost // 替换操作
                );
            }
        }

        // 返回编辑距离
        return distanceMatrix[t.length][s.length];
    }

    function naturalDistance(str1, str2) {
        // Remove non-alphanumeric characters
        const alphaNumeric1 = str1.replace(/\W|_/g, "");
        const alphaNumeric2 = str2.replace(/\W|_/g, "");

        // Convert to integers in base 36 (handling empty strings as 0)
        const num1 = parseInt(alphaNumeric1, 36) || 0;
        const num2 = parseInt(alphaNumeric2, 36) || 0;

        // Calculate absolute difference
        const difference = Math.abs(num1 - num2);

        return difference;
    }

    function filterSuspiciousTimestamps(arr) {
        const GAP = 24 * 3600 * 1000; // in milliseconds
        if (arr.length === 0) return [];

        // Sort timestamps
        const sorted = [...arr].sort((a, b) => a - b);

        // Find all groups
        const groups = [];
        let currentGroup = [sorted[0]];

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i - 1] < GAP) {
                currentGroup.push(sorted[i]);
            } else {
                groups.push(currentGroup);
                currentGroup = [sorted[i]];
            }
        }
        groups.push(currentGroup);

        // Get elements not in large groups
        return groups
            .filter(group => group.length <= 3)
            .flat();
    }

    // const g_ads = GM_getValue("ads", {})

    async function recordChunk(url, chunk) {
        // debug
        if (false) {
            const ts_urls = chunk.match(/^.*[.](ts|jpg|png|jpeg).*$/gm);
            if (!ts_urls) return;

            for (const ts_url of ts_urls) {
                try {
                    const fullurl = URL.parse(ts_url, url);

                    const resp = await gmFetch(fullurl);
                    const ad = g_ads[resp.headers.etag] ?? { hits: 0, urls: [] };

                    if (!ad.urls.some((u) => u.m3u8 === url)) {
                        ad.hits += 1;
                        ad.urls.push({ m3u8: url, ts: fullurl.href });
                        ad.urls = ad.urls.slice(-10);
                    }
                    ad.headers = resp.headers;

                    g_ads[resp.headers.etag] = ad;
                } catch (error) {
                    console.error("Error recordChunk:", error);
                }
            }
            GM_setValue("ads", g_ads);
        }
    }

    const playlistCache = new Map();
    // special playlist post processing function
    async function process(url, playlist) {
        if (playlistCache.has(url)) {
            console.log("REMOVE Done using playlistCache");
            return playlistCache.get(url);
        }

        // const ts_count_threshold = 10;

        // ad stream usually surrounded by #EXT-X-DISCONTINUITY
        //         let adExp = new RegExp(`#EXT-X-DISCONTINUITY\n(?<ad>#EXTINF:.*\n.*\n){1,${ts_count_threshold}}#EXT-X-DISCONTINUITY`,'g');

        //         let around = new RegExp(`(?<before>(?:.*\n){0,6})(?<ads>${adExp.source})(?<after>(?:.*\n){0,6})`, adExp.flags);

        // Collect all chunks first
        const chunks = playlist.split("#EXT-X-DISCONTINUITY");
        const lastModifiedTimes = [];

        // Sample and fetch headers from all chunks
        for (const chunk of chunks) {
            const ts_urls = chunk.match(/^.*[.](ts|jpg|png|jpeg).*$/gm);
            if (!ts_urls) continue;

            // Randomly select one ts_url from the chunk
            const ts_url = ts_urls[Math.floor(Math.random() * ts_urls.length)];
            const fullurl = URL.parse(ts_url, url);

            const resp = await gmFetch(fullurl).catch((e) => (console.error(e), { headers: { lastModified: new Date(0) } }));
            lastModifiedTimes.push(Date.parse(resp.headers.lastModified));
            console.log(fullurl.href);
            console.log("lastModified: ", resp.headers.lastModified);
        }

        const suspiciousTimestamps = filterSuspiciousTimestamps(lastModifiedTimes);
        console.log("suspiciousTimestamps: ", suspiciousTimestamps.map((t) => new Date(t).toUTCString()));

        // always keep first chunk
        let filtered_playlist = [chunks.shift()];
        lastModifiedTimes.shift();
        let avg_distance = 0, max_distance = 0, n = 0;
        let last_uri_path = '';
        let total_duration = 0;

        next_chunk:
        for (const chunk of chunks) {
            const uri_path_it = chunk.matchAll(/^.*[.](ts|jpg|png|jpeg)(?=$|\?|#)/gm);
            const uri_path = uri_path_it.next().value;

            // skip none .ts chunk
            if (!uri_path) {
                filtered_playlist.push(chunk);
                continue;
            }

            const lastModified = lastModifiedTimes.shift();

            const extinfs = [...chunk.matchAll(/EXTINF:\s*([0-9.]+)\s*,/gm)].reduce(
                (extinfs, match) => {
                    extinfs.push(match[1]);
                    return extinfs;
                }, []);

            const chunkDuation = extinfs.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
            if (chunkDuation >= 60) {
                console.log("SKIP CHUNK by duration: ", chunkDuation);
                filtered_playlist.push(chunk);
                continue;
            }

            // Need to analyze arguments
            if (new Set(extinfs).size === 1 /*all same time*/ && extinfs.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0) < 10) {
                console.log("REMOVED CHUNK by extinfs: ", chunk);
                recordChunk(url, chunk);
                total_duration += chunkDuation;
                continue
            }



            // if (document.location.host.includes("xiao")) {
            if (suspiciousTimestamps.includes(lastModified)) {
                console.log("REMOVED CHUNK by lastModified: ", new Date(lastModified).toUTCString(), chunk);
                recordChunk(url, chunk);
                total_duration += chunkDuation;
                continue
            }
            // }

            // if (chunk.includes("921c07e8bfad6789b64f007a85e475d1.ts")) {
            //     console.log("REMOVED CHUNK by suffix: ", chunk);
            //     continue;
            // }

            //             // #EXTINF:0.767432,
            //             const ad_extinfs = [...chunk.matchAll(/EXTINF:\s*(\d+\.\d+)\s*,/gm)].reduce(
            //                 (adts, match) =>{
            //                     adts.push(match[1]);
            //                     return adts;
            //                 },[]);


            //             const adts = [
            //                 ["9.175832","0.767432"],
            //                 ["9.175","0.767"],
            //                 ["8.208200"],
            //                 ["8.208"],
            //             ];

            //             for (const adt of adts){
            //                 if (adt.toString() === ad_extinfs.toString()) {
            //                     console.log("REMOVED CHUNK by extinf: ", adt.toString(), chunk);
            //                     continue;
            //                 }
            //             }

            const distance = levenshteinDistance(uri_path[0], last_uri_path);
            if (max_distance !== 0 && max_distance < 10 && distance > max_distance) {
                console.log("REMOVED CHUNK by distance: ", distance, chunk);
                recordChunk(url, chunk);
                total_duration += chunkDuation;
                continue;
            }

            last_uri_path = uri_path[0];

            for (const uri_path of uri_path_it) {
                const distance = levenshteinDistance(uri_path[0], last_uri_path);
                if (distance > max_distance) {
                    max_distance = distance;
                }

                avg_distance = (n * avg_distance + distance) / (n + 1);
                n += 1;
                console.log("dis:", distance, "avg:", avg_distance, "max:", max_distance);
                last_uri_path = uri_path[0];
            }

            filtered_playlist.push(chunk);
        }
        if (total_duration > 120) {
            console.warn("REVERT REMOVE CHUNK by total_duration: ", total_duration);
        } else {
            playlist = filtered_playlist.join("#EXT-X-DISCONTINUITY");
        }

        playlistCache.set(url, playlist);
        console.log("REMOVE Done");
        return playlist;
    }

    Object.defineProperty(unsafeWindow || window, 'Hls', {
        get() {
            return this.__TrueHls
        },
        set(value) {
            this.__TrueHls = value;
            console.log("Hls set");

            class pLoader extends this.__TrueHls.DefaultConfig.loader {
                constructor(config) {
                    super(config);
                    var load = this.load.bind(this);
                    this.load = function (context, config, callbacks) {
                        if (context.type == 'manifest' || context.type == 'level') {
                            var onSuccess = callbacks.onSuccess;
                            callbacks.onSuccess = function (response, stats, context) {
                                console.log(response, stats, context);
                                process(response.url, response.data).then((data) => {
                                    response.data = data;
                                    onSuccess(response, stats, context);
                                });
                            };
                        }
                        load(context, config, callbacks);
                    };
                }
            }

            // console.log("this.__TrueHls.DefaultConfig.pLoader", this.__TrueHls.DefaultConfig.pLoader);
            this.__TrueHls.DefaultConfig.pLoader = pLoader;
            /**** debug */
            var loadSource = this.__TrueHls.prototype.loadSource;
            this.__TrueHls.prototype.loadSource = function (src) {
                // console.log("src:", src);
                loadSource.call(this, src);
            };
            /* debug ****/
            // console.log(this.__TrueHls.DefaultConfig.pLoader);
        }
    });
})();