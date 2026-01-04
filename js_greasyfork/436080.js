// ==UserScript==
// @name         Amazonの商品画像を追加 [仮]
// @description  AmazonアソシエイトのAPIを使用してレス末尾に商品画像のサムネイルを追加します。
// @version      1.3.0
// @match        *://*.2chan.net/*
// @icon         https://icons.duckduckgo.com/ip2/www.2chan.net.ico
// @grant        none
// @namespace    https://greasyfork.org/users/809755
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436080/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E5%83%8F%E3%82%92%E8%BF%BD%E5%8A%A0%20%5B%E4%BB%AE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/436080/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E5%83%8F%E3%82%92%E8%BF%BD%E5%8A%A0%20%5B%E4%BB%AE%5D.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function () {
    'use strict';
    function a() {
        if (document.querySelector('details.previewArea')) {
            clearInterval(timer);
            return;
        }
        document.querySelectorAll("blockquote a[href*=amazon]:not(.checked):not(.imgAdded)").forEach(a => {
            const m = a.href.match(/amazon[^/]+jp\/.*?(?:dp|gp\/(?:product|aw\/d)|ASIN)\/(\w+)/);
            if (m) {
                a.classList.add('imgAdded');

                const img = document.createElement('img');
                img.src = `https://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=${m[1]}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL120_`;
                img.setAttribute("loading", "lazy");
                img.setAttribute('style', 'margin: 5px; border: 1px solid #ccc;');

                const a2 = document.createElement('a');
                a2.setAttribute('target', '_blank');
                a2.classList.add('imgAdded');
                a2.href = a.href = a.innerText = `https://www.amazon.co.jp/dp/${m[1]}`;

                a2.appendChild(img);

                let parent = a;
                for (let i = 0; i < 3; i++) {
                    parent = parent.parentNode;
                    if (parent.nodeName === 'BLOCKQUOTE') {
                        let div;
                        if (!(div = parent.querySelector('.amazonThumb'))) {
                            div = document.createElement('div');
                            div.classList.add('amazonThumb');
                            parent.appendChild(div);
                        }
                        div.appendChild(a2);
                        break;
                    }
                }
            }
        });
    }
    const timer = setInterval(a, 2 * 1000);
})();