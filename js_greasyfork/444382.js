// ==UserScript==
// @name         Youtube Mini-player
// @name:zh-CN   Youtube 微播放器
// @namespace    youtube
// @version      1.0-beta
// @description  A mini player is enabled in bottom right of the page while scolling down to look through the comments.
// @description:zh-CN 滚动浏览Youtube评论时，右下角启用微播放器
// @license     GNU
// @author       glorywong1001@gmail.com
// @match        https://*.youtube.com/watch*
// @icon         <$ICON$>
// @grant        GM_log
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/444382/Youtube%20Mini-player.user.js
// @updateURL https://update.greasyfork.org/scripts/444382/Youtube%20Mini-player.meta.js
// ==/UserScript==

let isMOSupported = 'MutationObserver' in window;
let isIOSupported = 'IntersectionObserver' in window;

!isMOSupported && GM_log('[Youtube Mini-player]', 'MutationObserver not supported');
!isIOSupported && GM_log('[Youtube Mini-player]', 'IntersectionObserver not supported');

if (isMOSupported && isIOSupported) {
    const $ = document.querySelector.bind(document);
    const body = document.body;
    const mutationObserver = new MutationObserver((mutationList, observer) => {
        const el = Array.prototype.find.call(mutationList, ((m) => {
            if (m.type !== 'childList') return false;
            return !!Array.prototype.find.call(m.addedNodes, node => node.id === 'movie_player');
        }))
        if (el) {
            listenToInteraction();
            observer.disconnect();
        }
    });
    mutationObserver.observe(body, {
        childList: true,
        subtree: true
    });
    GM_log('[Youtube Mini-player]', 'Start to observe mutation on body');

    function listenToInteraction() {
        GM_log('[Youtube Mini-player]', 'Start to listen to interaction on #YtdPlayer');
        const ytdPlayer = $('#ytd-player');
        const { backgroundColor: ytdpBgClr } = getComputedStyle(ytdPlayer);
        const container = ytdPlayer.querySelector('#container');
        const videoEl = container.querySelector('video');
        const { position, right, bottom, zIndex, boxShadow } = getComputedStyle(container);
        const { width, height } = getComputedStyle(videoEl);
        const ratio = parseInt(width) / parseInt(height);
        const secondary = $('#secondary');
        const { paddingRight, width: sWidth } = getComputedStyle(secondary);

        const floatWidth = parseInt(sWidth) + 20;
        const floatHeight = floatWidth / ratio;

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            const { isIntersecting } = entry;
            if (isIntersecting) {
                GM_log('[Youtube Mini-player]','Disabled mini player');
                container.style.position = position;
                container.style.right = right;
                container.style.bottom = bottom;
                container.style.zIndex = zIndex;
                container.style.boxShadow = boxShadow;
                container.style.width = videoEl.style.width = width;
                container.style.height = videoEl.style.height = height;
                ytdPlayer.style.backgroundColor = ytdpBgClr;
            } else {
                GM_log('[Youtube Mini-player]','Enabled mini player');
                container.style.position = 'fixed';
                container.style.right = container.style.bottom = paddingRight;
                container.style.zIndex = '99999';
                container.style.boxShadow = '0px 0px 20px rgb(0 0 0 / 50%)';
                container.style.width = videoEl.style.width = `${floatWidth}px`;
                container.style.height = videoEl.style.height = `${floatHeight}px`;
                ytdPlayer.style.backgroundColor = '#222';
            }
        }, {
            threshold: 0.5
        });

        intersectionObserver.observe(ytdPlayer);
    }

}