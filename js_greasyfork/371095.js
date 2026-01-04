// ==UserScript==
// @name         Bilibili风纪委员会键盘翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用键盘左右方向键对Bilbili风纪委员会被举报评论翻页。
// @author       Runshin
// @match        https://www.bilibili.com/judgement/vote*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371095/Bilibili%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E4%BC%9A%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/371095/Bilibili%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E4%BC%9A%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keyup', function(e){
        if(e.keyCode == 37){
            document.querySelector('a.prev').click();
        } else if(e.keyCode == 39){
            document.querySelector('a.next').click();
        }
    });
})();