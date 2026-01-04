// ==UserScript==
// @name        JAV在线播放
// @version     0.0.4
// @namespace   http://tampermonkey.net/
// @match       https://javdb.com/v/*
// @match       https://www.javbus.com/*
// @match       https://www.javlibrary.com/*
// @author      none
// @description JavDB、JavBus、JavLibrary 添加在线播放
// @license MIT
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_notification
// @connect     missav.ai, jable.tv, www.av.gl
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/527650/JAV%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/527650/JAV%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const SOURCES = ['MissAV', 'Jable.tv', 'AVgle'];
    const currentSource = GM_getValue('source', SOURCES[0]);
    registerMenu(null, SOURCES);

    const domain = location.hostname.split('.').slice(-2).join('.');
    console.log('<JAV_ONLINE> Detect domain: ' + domain);

    let plate = null;
    switch (domain) {
        case 'javdb.com':
            plate = $('.first-block .value').text().trim();
            break;
        case 'javbus.com':
            plate = $('div.movie > div.info > p:first-child > span:last-child').text().trim();
            break;
        case 'javlibrary.com':
            plate = $('#video_id td.text').text().trim();
            break;
    }

    if (plate) {
        //javlibrary fancybox
        if (domain == 'javlibrary.com') {

            $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/6.0.5/fancybox/fancybox.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />');
            $('.previewthumbs a').attr('data-fancybox', 'gallery');
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/6.0.5/fancybox/fancybox.umd.js').always(() => Fancybox.bind("[data-fancybox]", {}));
        }

        search_movie(plate, currentSource, (playAlt, playUrl) => {
            if (domain === 'javdb.com') {
                const $cover = $('.column-video-cover > a');
                if ($cover.length === 0) return;

                let $pb = $cover.find('.play-button');
                if ($pb.length === 0) {
                    $pb = $(`
                        <div class="play-button">
                            <span class="icon"><img src="/packs/media/images/btn-play-b414746c.svg"></span>
                            <span class="text">${playAlt}</span>
                        </div>
                    `);
                    $cover.append($pb);
                    $cover.addClass('cover-container');
                    $cover.removeAttr('data-fancybox');
                } else {
                    $pb.find('.text').text(playAlt);
                }

                $cover.attr({
                    href: playUrl,
                    target: '_blank'
                });
            }

            if (domain === 'javbus.com') {
                const $cover = $('div.screencap > a.bigImage');
                if ($cover.find('.overlay-play-btn').length === 0) {
                    const $btn = $(`
                        <a class="overlay-play-btn" href="${playUrl}" target="_blank" onclick="event.stopPropagation();"
                            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                            color: white; background-color: rgba(0,0,0,0.5); padding: 8px 16px;
                            text-decoration: none; border-radius: 4px; font-weight: bold; font-size: x-large;">
                            ${playAlt}
                        </a>
                    `);
                    $cover.css('position', 'relative').append($btn);
                }
            }

            if (domain === 'javlibrary.com') {
                const $cover = $('#video_jacket_img');
                const $btn = $(`
                    <a class="overlay-play-btn" href="${playUrl}" target="_blank" onclick="event.stopPropagation();"
                        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        color: white; background-color: rgba(0,0,0,0.5); padding: 8px 16px;
                        text-decoration: none; border-radius: 4px; font-weight: bold; font-size: x-large;">
                        ${playAlt}
                    </a>
                `);
                $cover.css('position', 'relative').after($btn);
            }
        });
    }

    async function search_movie(plate, source, callback) {

        const sourceStrategies = {
            'MissAV': {
                buildSearchUrl: plate => `https://missav.ai/en/search/${plate}`,
                referer: 'https://missav.ai',
                parseResult: doc => {
                    const a = doc.querySelector('.thumbnail div:first-child a');
                    if (!a) return null;
                    const href = a.href;
                    const alt = a.getAttribute('alt') || '';
                    const playAlt = alt.includes('uncensored') ? '跳转播放-无码' : '跳转播放';
                    return { playAlt, playUrl: href };
                }
            },
            'Jable.tv': {
                buildSearchUrl: plate => `https://jable.tv/search/${plate}/`,
                referer: 'https://jable.tv',
                parseResult: doc => {
                    const a = doc.querySelector('#list_videos_videos_list_search_result > div > section > div > div:nth-child(1) > div > div.img-box.cover-md > a');
                    if (!a) return null;
                    return { playAlt: '跳转播放', playUrl: a.href };
                }
            },
            'AVgle': {
                buildSearchUrl: plate => `https://www.av.gl/vod/search.html?wd=${plate}`,
                referer: 'https://www.av.gl/',
                parseResult: doc => {
                    const a = doc.querySelector('div.thumbnail > div.relative > a:first-child');
                    if (!a) return null;
                    return { playAlt: '跳转播放', playUrl: 'https://www.av.gl' + a.getAttribute('href') };
                }
            }
        };

        try {
            const strategy = sourceStrategies[source];
            const searchUrl = strategy.buildSearchUrl(plate);
            const html = await gmFetch(searchUrl, strategy.referer);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const result = strategy.parseResult(doc);

            if (result) {
                console.log(`[${source}] 搜索成功: ${result.playUrl}`);
                callback(result.playAlt, result.playUrl);
            } else {
                console.log(`[${source}] 没有找到结果`);
                callback('暂无资源', '#');
            }
        } catch (err) {
            console.error(`搜索失败 [${source}]:`, err);
            callback('暂无资源', '#');
        }
    }

    function gmFetch(url, referer = '') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                    'Referer': referer
                },
                onload: response => resolve(response.responseText),
                onerror: error => reject(error)
            });
        });
    }

    function registerMenu(prevMenu, sources) {
        let currentSource = GM_getValue('source', sources[0]);
        if (prevMenu) GM_unregisterMenuCommand(prevMenu);

        const menu = GM_registerMenuCommand(`数据源(点击切换): ${currentSource}`, () => {
            const index = sources.indexOf(currentSource);
            const nextSource = sources[(index + 1) % sources.length];
            GM_setValue('source', nextSource);

            GM_notification({
                title: '数据源已切换，刷新页面生效',
                text: '当前数据源: ' + nextSource,
                timeout: 2000
            });

            registerMenu(menu, sources);
        });
    }

})();