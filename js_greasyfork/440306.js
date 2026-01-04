// ==UserScript==
// @name         按Alt点链接阻止下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按下Alt，点链接后不会自动下载链接，兼容划词弹图标
// @author       You
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @exclude      http*://mail.qq.com/*
// @exclude      http*://*.mail.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/440306/%E6%8C%89Alt%E7%82%B9%E9%93%BE%E6%8E%A5%E9%98%BB%E6%AD%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440306/%E6%8C%89Alt%E7%82%B9%E9%93%BE%E6%8E%A5%E9%98%BB%E6%AD%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("a").forEach(function(elem){
        if(elem.href != 'javascript:;') {
            elem.onclick=function(event){
                if (!event.altKey){
                    return;
                }
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }
    });
})();