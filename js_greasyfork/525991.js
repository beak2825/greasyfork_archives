// ==UserScript==
// @name         X(No_Media);
// @namespace    https://cdn.jsdelivr.net/gh/orangeZSCB/X-No-Media/MediaX.user.js
// @version      0.2
// @description  自动为 X 的所有媒体内容添加模糊层
// @author       Orange
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/525991/X%28No_Media%29%3B.user.js
// @updateURL https://update.greasyfork.org/scripts/525991/X%28No_Media%29%3B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 敏感内容警告层模板
    const warningHTML = `
        <div class="css-175oi2r r-drfeu3 r-1p0dtai r-eqz5dr r-16y2uox r-1777fci r-1d2f490 r-1mmae3n r-3pj75a r-u8s1d r-zchlnj r-ipm5af r-1867qdf">
            <div class="css-175oi2r r-1kihuf0 r-3o4zer">
                <div class="css-175oi2r">
                    <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-jwli3a r-1472mwg r-6gpygo">
                        <g><path d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"></path></g>
                    </svg>
                    <div dir="auto" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-b88u0q r-6gpygo" style="color: rgb(255, 255, 255);">
                        <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">内容警告：敏感内容</span>
                    </div>
                    <div dir="auto" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41" style="color: rgb(255, 255, 255);">
                        <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">帖子作者已将这个帖子标记为显示敏感内容。</span>
                    </div>
                </div>
                <button role="button" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-173mn98 r-1s2bzr4 r-15ysp7h r-4wgw6l r-3pj75a r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" type="button" style="background-color: rgba(255, 255, 255, 0.25); border-color: rgba(0, 0, 0, 0); backdrop-filter: blur(50px);">
                    <div dir="ltr" class="css-146c3p1 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(255, 255, 255);">
                        <span class="css-1jxf684 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0">
                            <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">显示</span>
                        </span>
                    </div>
                </button>
            </div>
        </div>
    `;
    function addWarningLayer(mediaContainer) {
        if (mediaContainer.querySelector('.r-drfeu3')) return;

        const warningLayer = document.createElement('div');
        warningLayer.innerHTML = warningHTML;
        mediaContainer.prepend(warningLayer);

        const showButton = warningLayer.querySelector('button');
        showButton.addEventListener('click', () => {
            warningLayer.remove();
            mediaContainer.style.filter = 'none';
        });
        mediaContainer.style.filter = 'blur(50px)';
    }
    function checkMediaContainers() {
        document.querySelectorAll([
            'div[data-testid="tweetPhoto"]',
            'div[data-testid="videoPlayer"]'
        ].join(',')).forEach(media => {
            const container = media.closest('.r-1kqtdi0, .r-1udh08x');
            if (container) addWarningLayer(container);
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) checkMediaContainers();
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    checkMediaContainers();
})();
