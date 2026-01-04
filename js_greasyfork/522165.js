// ==UserScript==
// @name         HLS(m3u8) Ad Remover
// @name:zh-CN   HLS(m3u8) 去广告
// @namespace    http://tampermonkey.net/
// @license      GNU AGPLv3
// @version      0.8.1
// @description  Remove HLS.js-based(m3u8) ad stream
// @description:zh-cn   基于HLS.js(m3u8)播放器的去视频流内插广告插件，大部分视频网站都是基于这个库的，欢迎提交视频网址的匹配规则
// @author       douniwan6
// @match        http*://xiaobaotv.net/player*
// @match        http*://xiaoxintv.cc/player*
// @match        http*://www.xiaobaotv.app/player*
// @match        http*://xiaoheimi.net/player*
// @match        http*://xiaoxintv.net/player*
// @match        http*://xbyy.app/player*
// @match        http*://www.yhpdm.net/yxsf/player*
// @match        http*://www.yhpdm.com/yxsf/player*
// @match        http*://www.yhdmz2.com/tpsf/player*
// @match        http*://player.mcue.cc/yinhua*
// @match        http*://gimy.app/jcplayer*
// @match        http*://www.haitu.tv/static/dmku/player/index.php*
// @match        http*://olevod1.com/addons/dp/player*
// @match        http*://api.tinga88.com/*
// @match        http*://www.kuaikanys.net/jiexi*
// @match        http*://w5cin.com/player*
// @match        http*://nnyy.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @supportURL   https://greasyfork.org/en/scripts/463326-hls-m3u8-ad-remover/feedback
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522165/HLS%28m3u8%29%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/522165/HLS%28m3u8%29%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*global Hls*/
    // alert(“HLS Ad Remover”);
    //debugger

    // special playlist post processing function
    function process(playlist) {
        const ts_count_threshold = 10;
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
        // ad stream usually surrounded by #EXT-X-DISCONTINUITY
        //         let adExp = new RegExp(`#EXT-X-DISCONTINUITY\n(?<ad>#EXTINF:.*\n.*\n){1,${ts_count_threshold}}#EXT-X-DISCONTINUITY`,'g');

        //         let around = new RegExp(`(?<before>(?:.*\n){0,6})(?<ads>${adExp.source})(?<after>(?:.*\n){0,6})`, adExp.flags);

        let filtered_playlist=[];
        let last_ts = '';
        let avg_distance = 0, max_distance = 0, n = 0;
        next_chunk:
        for (const chunk of playlist.split("#EXT-X-DISCONTINUITY")) {

            // FIXME: assume first chunk is not ad
            // let tss = [...chunk.matchAll(/^.*.ts$/gm)];
            // tss = [tss[0], tss[tss.length-1]];
            const ts_it = chunk.matchAll(/^.*.ts$/gm);
            const ts = ts_it.next().value;

            // no .ts in this chunk
            if (!ts) {
                filtered_playlist.push(chunk);
                continue;
            }

            // for xiaoheimi.net *.ts name is des encrypted path?
            // #EXT-X-DISCONTINUITY
            // #EXTINF:9.175832,
            // https://cdn2.ceres9350.com/fvod/430074be59c6353dd4877dec5e09fb2d65e3e3999dec95d7c0bf2a6dd6d103f8481ca74ac4f97fdf9b1743bab1ce4c0fe4ff70d0421e3090bba973b9d8dc8b6763296c6cb9b95312921c07e8bfad6789b64f007a85e475d1.ts
            // #EXTINF:0.767432,
            // https://cdn2.ceres9350.com/fvod/2c2992416ee7fc86062d2bc22a25445a782f3016b20c7a905a0c055bca70e480fa9e1e3ae34e831b3f331b87141f5156333c98cf120d457e914f90f04794a3bfa0a3e24d3ca06037921c07e8bfad678939bf281dc43136d1.ts
            // #EXT-X-DISCONTINUITY

            // #EXT-X-DISCONTINUITY
            // #EXTINF:9.175832,
            // https://cdn2.efhie.com/fvod/7f6679fdba95e92a661180bc1b10d168cebfcc031e05f09563261ee663ebcff7e90a3b34214edaa335fca78a384b94f8753b8fbf705df754c25cbb732d90744527f81406da54d181921c07e8bfad6789b64f007a85e475d1.ts
            // #EXTINF:0.767432,
            // https://cdn2.efhie.com/fvod/31d383de1e64da380b3e64fad756e1a0dce3f5289f035f087ce2b1f52eaf30dca04b67abfb5e8276756e191fd4ef4ef4bf5e0638bd85291effab844e1e9e36a9a169d046fcae23c7921c07e8bfad678939bf281dc43136d1.ts
            // #EXT-X-DISCONTINUITY

            // #EXT-X-DISCONTINUITY
            // #EXTINF:8.208200,
            // https://cdn2.efhie.com/fvod/ab8750e8fe92b9666cbe5e84307b61c5b5d032e94698460ace56f5585fc3fa0e40aedb537f88d14716284bd5b9aa5d17c062db781f2f650aba0347913ad73c4fe70cd34541520415921c07e8bfad6789b64f007a85e475d1.ts
            // #EXT-X-DISCONTINUITY
            if (chunk.includes("921c07e8bfad6789b64f007a85e475d1.ts")) {
                console.log("REMOVED CHUNK by suffix: ", chunk);
                continue;
            }

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

            const distance = levenshteinDistance(ts[0], last_ts);
            if (max_distance !==0 && max_distance < 10 && distance > max_distance) {
                console.log("REMOVED CHUNK by distance: ", distance, chunk);
                continue;
            }

            last_ts=ts[0];

            for (const ts of ts_it ){
                const distance = levenshteinDistance(ts[0], last_ts);
                if (distance > max_distance) {
                    max_distance = distance;
                }

                avg_distance = (n*avg_distance + distance) /(n+1);
                n+=1;
                console.log(distance, avg_distance, max_distance);
                last_ts=ts[0];
            }

            filtered_playlist.push(chunk);
        }

        // for (const match of playlist.matchAll(around)) {
        //     console.log(match.groups.before);
        //     console.log("*********************REMOVED*********************");
        //     console.log(match.groups.ads);
        //     let last_ts = '';
        //     for (const ts of match.groups.ads.matchAll(/^.*.ts$/gm) ){
        //         console.log(levenshteinDistance(ts[0], last_ts));
        //         last_ts=ts[0];
        //     }
        //     console.log("*********************REMOVED*********************");
        //     console.log(match.groups.after);
        //     console.log(match);
        // }

        //playlist = playlist.replace(adExp, "");
        playlist = filtered_playlist.join("#EXT-X-DISCONTINUITY");

        return playlist;
    }

    class pLoader extends Hls.DefaultConfig.loader {
        constructor(config) {
            super(config);
            var load = this.load.bind(this);
            // Todo: find a more appropriate hook point
            this.load = function (context, config, callbacks) {
                if (context.type == 'manifest' || context.type == 'level') {
                    var onSuccess = callbacks.onSuccess;
                    callbacks.onSuccess = function (response, stats, context) {
                        response.data = process(response.data);
                        onSuccess(response, stats, context);
                    };
                }
                load(context, config, callbacks);
            };
        }
    }

    console.log(Hls.DefaultConfig.pLoader);
    Hls.DefaultConfig.pLoader = pLoader;
    /**** debug */
    var loadSource = Hls.prototype.loadSource;
    Hls.prototype.loadSource = function(src) {
        console.log(src);
        loadSource.call(this, src);
    };
    /* debug ****/
    console.log(Hls.DefaultConfig.pLoader);
})();