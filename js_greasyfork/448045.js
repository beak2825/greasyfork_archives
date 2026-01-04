// ==UserScript==
// @name         奶牛快传 - 去广告
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @license      MIT
// @include      *://cowtransfer.com/*
// @description  just for remove ad!
// @author       normonkey
// @note         22-07-18 0.1.0 广告屏蔽
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448045/%E5%A5%B6%E7%89%9B%E5%BF%AB%E4%BC%A0%20-%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/448045/%E5%A5%B6%E7%89%9B%E5%BF%AB%E4%BC%A0%20-%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    let style = `
        .root{
            background: #f7ca65 !important;
        }

        .cover-image-frame{
            display: none !important;
        }
    `;
    let styleDom = document.createElement('style');
    document.lastChild.appendChild(styleDom).textContent = style;

    while(true){
        try{
            var adDom = document.getElementsByClassName("cover-image-frame")[0]
            adDom.parentNode.removeChild(adDom);
            break
        }catch(e){
            // ignore
            console.warn("while try to remove ad")
            await sleep(1000);
        }
    }
})();
