// ==UserScript==
// @name         石瓦坡毛概挂科屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助您欺骗自己
// @author       眼不见心不烦
// @match        https://njwxt.swupl.edu.cn/jwglxt/cjcx/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451221/%E7%9F%B3%E7%93%A6%E5%9D%A1%E6%AF%9B%E6%A6%82%E6%8C%82%E7%A7%91%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451221/%E7%9F%B3%E7%93%A6%E5%9D%A1%E6%AF%9B%E6%A6%82%E6%8C%82%E7%A7%91%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetNode = document.getElementById('tabGrid');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function () {
        let beGuale = document.querySelectorAll("tr.ui-widget-content[style='color:red']")
        beGuale.forEach((obj) => {
            obj.style.color = "black"
            obj.children[7].innerText = '60'
            obj.children[9].innerText = '1.50'
        })
    }
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();