// ==UserScript==
// @name           9gag.com video controls on hover (fork)
// @namespace      pl.srsbiz
// @description    Show video controls on mouse hover
// @include        https://9gag.com/*
// @grant          none
// @require       https://code.jquery.com/jquery-3.5.1.min.js
// @version 0.0.1.20180611200256
// @downloadURL https://update.greasyfork.org/scripts/403814/9gagcom%20video%20controls%20on%20hover%20%28fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/403814/9gagcom%20video%20controls%20on%20hover%20%28fork%29.meta.js
// ==/UserScript==

jQuery(document).ready(function($){
  var attachVideoControls = function(){
    console.log('got here');
    var containers = $('#list-view-2,#individual-post,.listview,.post-page,.video-post');
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
