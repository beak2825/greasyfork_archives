// ==UserScript==
// @name         马蹄网查看原图（F2）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  ======================
// @author       Zero
// @match        http://www.mt-bbs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32547/%E9%A9%AC%E8%B9%84%E7%BD%91%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%EF%BC%88F2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/32547/%E9%A9%AC%E8%B9%84%E7%BD%91%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%EF%BC%88F2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    jQuery(window).keydown(function(event){
        if(event.keyCode == 113){
            jQuery(".pcb img").attr({
                src:    function(){return this.src.replace(/.thumb.jpg/, "");},
                width:  function(){return Math.max(this.width, 700);}
            });
            jQuery(".pcb img").before("<div>Size:" + jQuery(this).width() + "X" + jQuery(this).height() + "</div>");
        }
    });
})();