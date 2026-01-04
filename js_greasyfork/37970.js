// ==UserScript==
// @name         Bilibili番剧显示单集信息
// @namespace    http://tampermonkey.net/
// @version      3.0
// @include     http*://www.bilibili.com/bangumi/play/ss*
// @include     http*://www.bilibili.com/bangumi/play/ep*
// @description  看番时让B站显示单集的的播放量和弹幕量
// @author       ementt
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/37970/Bilibili%E7%95%AA%E5%89%A7%E6%98%BE%E7%A4%BA%E5%8D%95%E9%9B%86%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/37970/Bilibili%E7%95%AA%E5%89%A7%E6%98%BE%E7%A4%BA%E5%8D%95%E9%9B%86%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const url = 'https://api.bilibili.com/x/web-interface/view';
    let all_view;


    async function getBvid(ep_id) {
        try {
            const res = await fetch(`https://api.bilibili.com/pgc/view/web/season?ep_id=${ep_id}`);
            const data = await res.json();
            const ep = data.result.episodes.find(e => e.ep_id == ep_id);
            console.log("当前 bvid:", ep.bvid);
            return ep.bvid; // 可以返回给调用方
        } catch (err) {
            console.error(err);
        }
    }

    function search() {
        const mediaCount = document.querySelector('.mediainfo_mediaDesc__jjRiB');
        if (!mediaCount) {
            console.log("media count not found");
            return};

        const _view = mediaCount.textContent.split('·')[0];
        if (!all_view) {
            all_view = _view.substring(0, _view.length - 4) + '总播放';
        }
        (async () => {
            const ep_id = location.pathname.match(/ep(\d+)/)[1];
            const bvid = await getBvid(ep_id);
            console.log("拿到 bvid:", bvid);

            fetch(`${url}?bvid=${bvid}`)
                .then(res => res.json())
                .then(response => {
                const data = response.data;
                console.log(data);
                const view = Number(data.stat.view);
                const danmaku = Number(data.stat.danmaku);
                const coin = Number(data.stat.coin);

                let view_write = '--';
                if (view) {
                    view_write = view < 10000 ? view : Math.floor(view / 10000) + '万';
                }

                let danmu_write = '--';
                if (danmaku) {
                    danmu_write = danmaku < 10000 ? danmaku : Math.floor(danmaku / 10000) + '万';
                }

                const coinSpan = document.querySelector('#toolbar_module > div.coin-info > span');
                if (coinSpan) {
                    coinSpan.textContent = coin;
                }

                const text2 = mediaCount.textContent.split('·')[2] || '';
                mediaCount.textContent = `${view_write}播放  ·  ${danmu_write}弹幕  ·${text2}  ·  ${all_view}`;
            })
                .catch(err => {
                console.error('请求失败:', err);
            });
        })();

    }
    function bind() {

        const aidElement = document.querySelector("#__next > div.home-container > div.main-container > div.plp-l.sticky > div > div.mediainfo_mediaInfoWrap__nCwhA > div > div:nth-child(3) > span:nth-child(4) > span > a");
        if (!aidElement) return;

        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            console.log("find new episode")
            search();
        });
        observer.observe(aidElement, { childList: true,
                                      attributes: true,
                                      characterData: true,
                                      subtree: true});
    }

    bind();

    setTimeout(search, 2000)
    setTimeout(bind, 2000)

})();