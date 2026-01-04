// ==UserScript==
// @name         屏蔽一些不想看的广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽GM部落、藏宝湾、趣游的广告
// @author       月神
// @match        *://www.gmbuluo.net/*
// @match        *://www.iopq.net/*
// @match        *://www.quyoubbk.com/*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443051/%E5%B1%8F%E8%94%BD%E4%B8%80%E4%BA%9B%E4%B8%8D%E6%83%B3%E7%9C%8B%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/443051/%E5%B1%8F%E8%94%BD%E4%B8%80%E4%BA%9B%E4%B8%8D%E6%83%B3%E7%9C%8B%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    //GM部落
    $('.iframe').hide();

    $('#wp').children().each(function(){
        $(this).children("img").hide();
    });

    //藏宝湾 趣游
    $('.a_mu').hide();

    //藏宝湾文字
    $('.a_t').hide();
})();