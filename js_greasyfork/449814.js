// ==UserScript==
// @name         he_feishu_wiki_toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  HE-FEISHU-WIKI页面自适应宽度
// @author       dong.luo@happyelements.com
// @include      /^http[s]*:\/\/.*feishu.cn/wiki.*
// @include      /^http[s]*:\/\/.*feishu.cn/doc.*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449814/he_feishu_wiki_toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/449814/he_feishu_wiki_toolbar.meta.js
// ==/UserScript==


(function() {
  'use strict';

  //==========================================
  // var $ = window.jQuery;
  var $ = window.jQuery.noConflict(true);

  setInterval(function(){
    $(".etherpad-container").css({"max-width": "96%"});
    $(".etherpad-container .etherpad-client-container").css({"max-width": "96%"});

    $(".page-main-item.editor").css("cssText", "max-width: 96%; margin-left: 0px !important;");
    //$(".page-main-item").css({"max-width": "96%"});

    $(".section-nav").css({"max-width": "350px", "background-color": "#ffffff", "border": "1px solid #f5f5f5"});
  }, 500);

})();