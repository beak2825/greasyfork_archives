// ==UserScript==
// @name        NPO
// @namespace   Violentmonkey Scripts
// @match       https://npo.nl/*
// @grant       none
// @version     1.0
// @author      Xites
// @description 11-11-2023 11:51:57
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479523/NPO.user.js
// @updateURL https://update.greasyfork.org/scripts/479523/NPO.meta.js
// ==/UserScript==
(function() {
    'use strict';

    jQuery.noConflict();
    (function($) {
        var interval = setInterval(function(){
          //console.log($('.bmpui-unmuted').length);
            if ($('.bmpui-unmuted').length > 0 || $('#bitmovinplayer-video-npo-player:visible').length > 0) {
              if ($('.bmpui-adLabel').length > 0) {
                $('.bmpui-ui-volumetogglebutton').trigger('click');
                $('.bmpui-ui-volumeslider').val(0);
                $('#bitmovinplayer-video-npo-player').css('display', 'none');
              }
            }
          if ($('.bmpui-muted').length > 0 && $('.bmpui-adLabel').length == 0) {
            $('.bmpui-ui-volumeslider').val(100);
          }
          if ($('#bitmovinplayer-video-npo-player:visible').length == 0 && $('.bmpui-adLabel').length == 0) {
            $('#bitmovinplayer-video-npo-player').css('display', '');
          }
        }, 500);
    })(jQuery);
})();
