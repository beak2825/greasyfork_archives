// ==UserScript==
// @name         精简MOJi辞书
// @name:ja      簡潔MOJi辞書
// @name:zh-TW   精簡MOJi辭書
// @namespace    https://github.com/scarletkc/StreamlineMOJiDict
// @version      1.0
// @description  A Tampermonkey browser script is used to make MOJiDict more streamlined to use.
// @description:zh-TW  A Tampermonkey browser script is used to make MOJiDict more streamlined to use.
// @description:ja  A Tampermonkey browser script is used to make MOJiDict more streamlined to use.
// @author       Kc
// @match        *://www.mojidict.com/search
// @match        *://www.mojidict.com/
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/452705/%E7%B2%BE%E7%AE%80MOJi%E8%BE%9E%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/452705/%E7%B2%BE%E7%AE%80MOJi%E8%BE%9E%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var counters = 0;

    function DeleteDiv(className) {
        var elements = document.getElementsByClassName(className);
        var loop = setInterval(function(){            
            if(elements.length > 0) {              
                for (var i = 0; i < elements.length; i++) {
                    elements[i].remove();
                } 
                clearInterval(loop);
            }
            else{
                counters++;
                if(counters > 10){ 
                    clearInterval(loop);
                }
            }
        },3000);  
    }

    DeleteDiv("advertising-banner");
    DeleteDiv("sidebar-container hidden_scrollbar sidebar hidden_scrollbar");
    DeleteDiv("sidebar-container hidden_scrollbar sidebar hidden_scrollbar isfold");
    DeleteDiv("header-basic sideBarisfold");
    DeleteDiv("header-basic");
    DeleteDiv("footer-main");
    DeleteDiv("feedback-container");
    
})();