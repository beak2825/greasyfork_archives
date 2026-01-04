// ==UserScript==
// @name           Video controls on hover for i.imgur.com
// @description    Show video controls on mouse hover for for imgur.com
// @include        https://i.imgur.com/*
// @grant          none
// @icon           https://imgur.com/favicon.ico
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author         flowscript
// @version 1.0
// @namespace https://greasyfork.org/users/158563
// @downloadURL https://update.greasyfork.org/scripts/393596/Video%20controls%20on%20hover%20for%20iimgurcom.user.js
// @updateURL https://update.greasyfork.org/scripts/393596/Video%20controls%20on%20hover%20for%20iimgurcom.meta.js
// ==/UserScript==

jQuery(document).ready(function($){    
  var attachVideoControls = function(){
    var containers = $('.video-container');
    if (containers.length) {
      containers.on('mouseenter', 'video', function(evt){
        $(this).prop('controls', true);
      }).on('mouseleave', 'video', function(evt){
        $(this).prop('controls', false);
      });
    } else {
      window.setTimeout(attachVideoControls, 250);
    }
  };
  window.setTimeout(attachVideoControls, 250);
});
