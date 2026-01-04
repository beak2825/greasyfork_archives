// ==UserScript==
// @name         豆瓣隐私协议更新屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Defending your life, and I care about my fucking privacy.
// @author       Kai S
// @match        https://www.douban.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444076/%E8%B1%86%E7%93%A3%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE%E6%9B%B4%E6%96%B0%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444076/%E8%B1%86%E7%93%A3%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE%E6%9B%B4%E6%96%B0%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timer = setInterval(function(){
        var dialog = $("div[id^='dui-dialog0']");
        if(dialog['length'] == 1) {
            dialog.remove();
            console.log("隐私协议更新移除");
            clearInterval(timer);
        }
    },100);

    // Your code here...
})();