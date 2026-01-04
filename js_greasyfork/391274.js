// ==UserScript==
// @name         网道翻页
// @namespace    https://greasyfork.org/users/212360
// @version      0.1
// @description  在网道网站实现方向键翻页
// @author       zelricx
// @match        http://wangdoc.com/*/*.html
// @icon         http://wangdoc.com/assets/icons//favicon-96x96.png
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/391274/%E7%BD%91%E9%81%93%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/391274/%E7%BD%91%E9%81%93%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = function(event){
        switch(event.keyCode) {
            case 37:
                goto(document.querySelector('.level-left a'));
                break;
            case 39:
                goto(document.querySelector('.level-right a'));
                break;
            default:
                break;
        }
    };


    function goto(el) {
        if (el) {
            el.click();
        }
    }

})();