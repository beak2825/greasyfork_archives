// ==UserScript==
// @name         360文库美化
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  隐藏广告与推荐文档
// @author       AN drew
// @match        https://wenku.so.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403723/360%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403723/360%E6%96%87%E5%BA%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setInterval(function(){
        $("#hot-docs").hide();
        $("#e_idea_wk_detail_hot").hide()
        $("#interest").hide()
        $("#js-search-one").hide()
        $(".search-rela").hide()
        $("#js-busi").hide()
        $("#js-busi-base").hide()
        $("[id*='busiPage']").hide()
        $(".side-mod").hide()
        $(".rec-left").hide()
        $("#onesearch").parent().hide()
    },1)
    $(".js-doc-more").click()

})();