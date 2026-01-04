// ==UserScript==
// @name         F12 Newmenu private
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用的F12查看menu
// @author       白水
// @match        *
// @grant        none
// @home-url     https://greasyfork.org/zh-CN/scripts/418796
// @downloadURL https://update.greasyfork.org/scripts/418796/F12%20Newmenu%20private.user.js
// @updateURL https://update.greasyfork.org/scripts/418796/F12%20Newmenu%20private.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //通过 <H1> 判断是否存在目录
    if (document.getElementsByTagName("h1").length !== 0) {
        var j = 0; //var j = 1; //当前的层级是多少?因为最低是1
        for (var i = 0, ilen = document.all.length; i < ilen; i++) {
            if (document.all[i].tagName.length == 2 && document.all[i].tagName.toString()[0] == "H") {
                if (j < document.all[i].tagName.toString()[1]) {
                    console.group(document.all[i].textContent);
                } else if (j >= document.all[i].tagName.toString()[1]) {
                    for (var k = 0; k < j - document.all[i].tagName.toString()[1] + 1; k++) { console.groupEnd(); }
                    console.group(document.all[i].textContent);
                } else;
                j = document.all[i].tagName.toString()[1];
            }
        }
        for (var l = 0; l < j; l++) { console.groupEnd(); }
    }
})();