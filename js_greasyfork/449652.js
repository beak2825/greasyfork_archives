// ==UserScript==
// @name         he_wiki_toolbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  HE-WIKI页面净化
// @author       dong.luo
// @include      /^http[s]*:\/\/wiki.happyelements.net
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449652/he_wiki_toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/449652/he_wiki_toolbar.meta.js
// ==/UserScript==


(function() {
  'use strict';

  //==========================================
  // var $ = window.jQuery;
  var $ = window.jQuery.noConflict(true);

  // 移除顶部栏中的提示
  $("#header-precursor .cell").remove();
  // 移除侧边栏中的提示
  $(".custom-sidebar-content .content").remove();
  // 修正侧边栏是顶部对齐高度
  $(".ia-splitter-left .ia-fixed-sidebar").css({"top":"40px"});


})();