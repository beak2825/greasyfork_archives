// ==UserScript==
// @name         動畫瘋 避免跳集觀看
// @namespace    https://ani.gamer.com.tw/
// @version      1.1
// @description  如果點擊的集數比最後觀看的集數還要高，會自動跳轉到最後觀看的下一集。若當前集數在最後觀看集數之前，則不跳轉，若無法找到最後觀看的集數，則跳轉到第一集，並在跳轉後檢查是否最後觀看集數為最新一集，若是，則跳回最新一集。
// @license      MIT
// @author       movwei
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @downloadURL https://update.greasyfork.org/scripts/505445/%E5%8B%95%E7%95%AB%E7%98%8B%20%E9%81%BF%E5%85%8D%E8%B7%B3%E9%9B%86%E8%A7%80%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/505445/%E5%8B%95%E7%95%AB%E7%98%8B%20%E9%81%BF%E5%85%8D%E8%B7%B3%E9%9B%86%E8%A7%80%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 取得當前影片的集數編號
    let currentEpisode = window.location.search;

    // 取得所有集數列表
    let episodeList = Array.from(document.querySelectorAll('.season li a'));

    // 找到播放中的集數和已觀看的集數
    let playingElement = document.querySelector('.season .playing');
    let sawElement = document.querySelector('.season .saw');

    // 若無最後觀看集數，跳轉至第一集
    if (!sawElement) {
        if (!sessionStorage.getItem('redirectedFor' + currentEpisode)) {
            let firstEpisode = document.querySelector('.season li:first-child a').href;
            sessionStorage.setItem('redirectedFor' + currentEpisode, 'true');
            window.location.href = firstEpisode;
            return; // 終止當前腳本執行
        } else {
            return; // 若已跳轉至第一集且沒有最後觀看集數，終止腳本執行
        }
    }

    // 當前集數為第一集，並且最後觀看的集數為最新一集
    if (playingElement && !sawElement.nextElementSibling) {
        let lastEpisode = document.querySelector('.season li:last-child a').href;
        let lastEpisodeSearch = new URL(lastEpisode).search;
        if (sawElement.querySelector('a').search === lastEpisodeSearch) {
            window.location.href = lastEpisode;
            return; // 終止當前腳本執行
        }
    }

    // 找到已觀看的下一集
    let nextEpisode = sawElement.nextElementSibling;

    // 取得當前集數的索引
    let currentEpisodeIndex = episodeList.findIndex(ep => ep.href.endsWith(currentEpisode));

    // 取得已觀看集數的索引
    let sawEpisodeIndex = episodeList.findIndex(ep => ep.href.endsWith(sawElement.querySelector('a').search));

    // 如果當前集數在已觀看集數之前，不跳轉
    if (currentEpisodeIndex <= sawEpisodeIndex) {
        return;
    }

    // 如果下一集存在且不是目前播放中的集數
    if (nextEpisode && !nextEpisode.classList.contains('playing')) {
        let nextEpisodeLink = nextEpisode.querySelector('a').href;
        window.location.href = nextEpisodeLink;
    }
})();