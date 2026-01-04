// ==UserScript==
// @name         巴哈姆特自動顯示進板圖上傳時間
// @namespace    巴哈姆特自動顯示進板圖上傳時間
// @version      0.1
// @description  使滑鼠指向巴哈姆特哈啦區 A 頁進板圖時，在右下角顯示該進板圖上傳時間
// @author       johnny860726
// @match        https://forum.gamer.com.tw/A.php?bsn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456604/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%87%AA%E5%8B%95%E9%A1%AF%E7%A4%BA%E9%80%B2%E6%9D%BF%E5%9C%96%E4%B8%8A%E5%82%B3%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/456604/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%87%AA%E5%8B%95%E9%A1%AF%E7%A4%BA%E9%80%B2%E6%9D%BF%E5%9C%96%E4%B8%8A%E5%82%B3%E6%99%82%E9%96%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let welcomeTitleImage = document.querySelector('.FM-abox1 > a > img');
    let imageLink = welcomeTitleImage.getAttribute('src');
    let imageMainFilename = imageLink.split('welcome/')[1].split('?')[0];
    let matchGroups = imageMainFilename.match(/\d+/g);
    if (matchGroups.length === 3) {
        let timestamp = parseInt(matchGroups[2]);
        let date = new Date(timestamp * 1000 + (8 * 3600 * 1000));
        let datetimeGMT8 = date.toISOString().replace('T', ' ').split('.')[0];
        // Your CSS as text
        var styles = `
            .FM-abox1:hover::before {
                position: absolute;
                content: '進板圖上傳時間: `+datetimeGMT8+` (GMT+8)';
                bottom: 10px;
                right: 20px;
                color: #66D9EF;
                text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
                z-index: 10;
            }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
})();