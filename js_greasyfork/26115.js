// ==UserScript==
// @name         Yande.re 键盘翻页 Keyboard flip
// @namespace    https://www.mokeyjay.com/
// @version      0.1
// @description  使用键盘方向键左右翻页
// @author       mokeyjay
// @match        https://yande.re/post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26115/Yandere%20%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20Keyboard%20flip.user.js
// @updateURL https://update.greasyfork.org/scripts/26115/Yandere%20%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5%20Keyboard%20flip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keyup', function(e){
        if(e.keyCode == 37){
            document.querySelector('a.previous_page').click();
        } else if(e.keyCode == 39){
            document.querySelector('a.next_page').click();
        }
    });
})();