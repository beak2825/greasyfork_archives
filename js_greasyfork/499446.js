// ==UserScript==
// @name         测试环境提醒
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  test warning!
// @author       linxiang.chen
// @match        http://devops.smartcloud.com:10082/*
// @match        http://192.168.144.160:10082/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartcloud.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499446/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/499446/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.match('http://devops\.smartcloud\.com:10082/ztf-zixun/.*/test|http://192.168.144.160:10082/ztf-zixun/.*/test')) {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        GM_addStyle(`.overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   pointer-events: none;
   background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><text x="50" y="200" font-size="40" fill="rgba(0, 0, 0, 0.2)" transform="rotate(-30, 50, 200)">测试环境</text></svg>');
   background-repeat: repeat;
   z-index: 999999;
}`);
        document.body.appendChild(overlay);
        setTimeout(() => {
            document.title = '【测试】'+document.title;
        }, 3000);

    }

})();