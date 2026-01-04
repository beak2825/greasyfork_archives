// ==UserScript==
// @name         不人気の動画を非表示
// @namespace    https://www.tampermonkey.net/
// @version      1.5
// @description  YouTubeの視聴回数が1000回以下の動画を非表示
// @author       theta
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526433/%E4%B8%8D%E4%BA%BA%E6%B0%97%E3%81%AE%E5%8B%95%E7%94%BB%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/526433/%E4%B8%8D%E4%BA%BA%E6%B0%97%E3%81%AE%E5%8B%95%E7%94%BB%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideLowViewCountVideos() {
        document.querySelectorAll('ytd-rich-grid-media, ytd-video-renderer').forEach(video => {
            let viewCountElements = video.querySelectorAll('span.inline-metadata-item.style-scope.ytd-video-meta-block');
            let shouldHide = false;

          
            viewCountElements.forEach(viewCountElement => {
                let viewCountText = viewCountElement.innerText;
                let match = viewCountText.match(/(\d+)\s*回視聴/);
                if (match) {
                    let viewCount = parseInt(match[1].replace(/,/g, ''), 10);
                    if (viewCount < 1000) {
                        shouldHide = true;
                    }
                }
            });

            if (shouldHide) {
                video.style.display = 'none';
            }
        });
    }

    function checkShortsLikeCount() {
        let likeElement = document.querySelector('yt-formatted-string.ytd-toggle-button-renderer[aria-label]');
        if (likeElement) {
            let likeText = likeElement.getAttribute('aria-label');

           
            if (likeText.includes("高く評価") || (likeText.match(/(\d+)/) && parseInt(likeText.match(/(\d+)/)[1].replace(/,/g, ''), 10) < 1000)) {
                sendArrowDownKey(); 
            }
        }
    }

    function sendArrowDownKey() {
        let event = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    // 初回実行
    hideLowViewCountVideos();

    // 動的に追加された要素にも適用
    let observer = new MutationObserver(hideLowViewCountVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(checkShortsLikeCount, 2000);

})();
