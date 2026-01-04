// ==UserScript==
// @name         123网盘复制分享链接时带pwd=提取码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如名，建议搭配`自动填写提取码、关闭广告`脚本使用
// @author       CCCC-L
// @match        https://www.123pan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        none
// @run-at      document_end
// @downloadURL https://update.greasyfork.org/scripts/484313/123%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%97%B6%E5%B8%A6pwd%3D%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/484313/123%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%97%B6%E5%B8%A6pwd%3D%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var originalAppendChild = document.body.appendChild;
    document.body.appendChild = (node) => {
        if (node.innerHTML.includes("提取码:")) {
            node.innerHTML = node.innerHTML.replace("提取码:", "?pwd=")
            let pwd = node.innerHTML.slice(-4)
            node.innerHTML = node.innerHTML += "\n提取码:" + pwd
        }
        return originalAppendChild.call(document.body, node);
    }

})();