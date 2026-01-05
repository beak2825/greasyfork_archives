// ==UserScript==
// @name        NexusHD Auto Sign in
// @author      AsukaSong
// @description NexusHD 自动签到
// @include     http*://www.nexushd.org/*
// @include     http*://v6.nexushd.org/*
// @icon        http://www.nexushd.org/favicon.ico
// @run-at      document-end
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       none
// @version     2.3.0
// @namespace   https://greasyfork.org/users/111695
// @downloadURL https://update.greasyfork.org/scripts/28343/NexusHD%20Auto%20Sign%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/28343/NexusHD%20Auto%20Sign%20in.meta.js
// ==/UserScript==

(function($) {
  'use strict';
  //签到
  if($("#info_block .faqlink").text() === '签到'){
    $.ajax({
      url: '/signin.php',
      type: 'POST',
      data: $.param({action: 'post', content: '[em28]'}),
      success: function () {
        $("#info_block .faqlink").replaceWith('已签到');
      }
    });
  }
})(window.$.noConflict(true));