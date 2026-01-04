// ==UserScript==
// @name         贴吧去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简单的贴吧去广告
// @author       You
// @match        https://tieba.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/433551/%E8%B4%B4%E5%90%A7%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433551/%E8%B4%B4%E5%90%A7%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';




    function removeGg(){
        $(".fengchao-wrap-feed").remove();
        $('[id="pagelet_frs-aside/pagelet/fengchao_ad"]').remove();
    }

    setInterval(function(){
      removeGg()
    }, 800);
    // Your code here...
})();