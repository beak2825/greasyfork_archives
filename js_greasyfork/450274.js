// ==UserScript==
// @name         抖音网页版添加下载按钮
// @namespace    Slothful
// @version      0.1
// @description  给抖音网页版添加一个下载按钮，下载短视频
// @author       @公众号Slothful
// @license      GPL-3.0 License
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450274/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450274/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const douyinDownBtn = () => {
        const shareBtns = document.querySelectorAll('div[data-e2e=video-player-share');
        shareBtns.forEach(current => {
            if(!current.dataset.jump){
                const parent = current.parentElement.parentElement;
                const area = parent.parentElement;
                const player = $(area).parents('.xgplayer')[0];
                if(player) {
                    current.dataset.jump = 1;
                    const source = player.querySelector('video source');
                    const el = parent.cloneNode(true);
                    el.dataset.jump = 1;
                    el.style.transform = 'rotate(90deg)';
                    el.onclick = () => { open(source.src); };
                    area.appendChild(el);
                }
            }
        })
    }
    setInterval(() => {douyinDownBtn()}, 2000)
})();
