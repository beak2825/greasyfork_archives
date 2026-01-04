// ==UserScript==
// @name         屏蔽百度搜索热点
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度作为业界毒瘤，其搜索热点大多是低俗内容。该脚本会屏蔽这些内容，彰显格调，品味。
// @author       c4r
// @match        *://www.baidu.com/s?*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/386407/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%83%AD%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/386407/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%83%AD%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
        #content_right {
            display: none;
        }
    `)
    'use strict';
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("readystatechange", function() {
                //console.warn('UI', this.readyState)
                if(this.readyState == 1){
                    document.getElementById('content_right').style.display = 'none'
                }
            }, false);
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
})();