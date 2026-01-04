// ==UserScript==
// @name         电信光猫灰色选项强制开启
// @author         Initsnow
// @version      0.1
// @license      MIT
// @match        http://192.168.1.1/*
// @description        清除电信光猫管理网页灰色选项的disabled属性
// @noframes
// @namespace https://greasyfork.org/users/982891
// @downloadURL https://update.greasyfork.org/scripts/468988/%E7%94%B5%E4%BF%A1%E5%85%89%E7%8C%AB%E7%81%B0%E8%89%B2%E9%80%89%E9%A1%B9%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/468988/%E7%94%B5%E4%BF%A1%E5%85%89%E7%8C%AB%E7%81%B0%E8%89%B2%E9%80%89%E9%A1%B9%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn = document.createElement("button");
    btn.style="position: absolute;right: 10px;top: 50vh;";
    btn.innerHTML="解灰";
    btn.addEventListener('click', function(){
        var iframes = document.getElementsByTagName('iframe');
        for (const iframe of iframes) {
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            var selects = innerDoc.getElementsByTagName("select");
            for (const select of selects) {
                select.removeAttribute('disabled');
            }

            var inputs = innerDoc.getElementsByTagName("input");
            for (const input of inputs) {
                input.removeAttribute('disabled');
            }
        }
    });
    document.body.appendChild(btn);

})();