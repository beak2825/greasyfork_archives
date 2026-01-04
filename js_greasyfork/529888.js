// ==UserScript==
// @name         显示网盘二维码 (SeedHub)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  强制显示 SeedHub 页面上隐藏的网盘二维码
// @author       fpoint
// @match        https://www.seedhub.cc/link_start/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529888/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%9B%98%E4%BA%8C%E7%BB%B4%E7%A0%81%20%28SeedHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529888/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%9B%98%E4%BA%8C%E7%BB%B4%E7%A0%81%20%28SeedHub%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mobilePanDiv = document.querySelector('div.mobile-pan');
    if (mobilePanDiv) {
        mobilePanDiv.style.display = 'inline-block';

        let qrcodeDiv = mobilePanDiv.querySelector('#qrcode');
        if (qrcodeDiv) {
            qrcodeDiv.style.display = 'block';

            let qrcodeImage = qrcodeDiv.querySelector('img');
            if (qrcodeImage) {
                qrcodeImage.style.display = 'block';
            }

             let qrcodeCanvas = qrcodeDiv.querySelector('canvas');
            if(qrcodeCanvas){
                qrcodeCanvas.style.display = "none"; //隐藏canvas，如果canvas也被显示的话
            }
        }
    }
})();
