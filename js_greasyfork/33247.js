// ==UserScript==
// @name         InstaZoom
// @namespace    http://www.jeroendekort.nl
// @version      0.16
// @description  Show actual size image when clicking on it. It also unmutes the stories automatically
// @icon         https://cdn.iconscout.com/icon/free/png-256/instagram-53-151118.png
// @author       nljuggler
// @license      MIT
// @match        https://*.instagram.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/33247/InstaZoom.user.js
// @updateURL https://update.greasyfork.org/scripts/33247/InstaZoom.meta.js
// ==/UserScript==

$(function(){
  var muteOverride = false;
  addStyleSheet();
  createLightbox();
  $(document).on("click","._si7dy, .FFVAD, .KL4Bh, ._9AhH0, .eLAPa _23QFA,._aagu ._aagw", function() {
    var $divWithImage = $(this).parent().find('img');
    $('body').find('#nljugglerLightbox #lightboxImage').attr('src', $divWithImage.attr('src'));
    $('#nljugglerLightbox').show();

    if ($(this).hasClass("_si7dy")){
      $(this).remove();
    }
    // Remove Instagrams own overlay (if at all displayed),
    // so you don't need to click twice to hide the current image.

    var $imageInTimeline = $(this).closest('._8Rm4L');
    if ($imageInTimeline.length == 0){
        $('[role="dialog"] > div > button.wpO6b').click();
    }
  });

    // Right click on insta video to enable video controls
    $(document).on("contextmenu","._aakl", function(e) {
        //alert($(this).InnerHtml);
        e.currentTarget.previousSibling.remove();
        e.currentTarget.remove();
    });

  $('#lightboxImage').click(function() {
    $(this).parent().hide();
    $(this).attr('src', '');
  });

  // Unmute story when muted
  $('body').on('DOMSubtreeModified', '._ac0a', function(){
    if (!muteOverride && $('button[aria-label*="udio"] svg')[0] != undefined && $('button[aria-label*="udio"] svg').attr('aria-label').includes('muted'))
     {
       $('button[aria-label*="udio"]').click();
     }
  });

  // (Un)mute by hitting the M key
  $(document).keyup(function(e) {
     if (e.which == 77)
     {
       $('button[aria-label*="udio"]').click();
       muteOverride = true;
     }
  });

  function createLightbox(){
    var lightbox = "<div id='nljugglerLightbox'><img id='lightboxImage'/></div>";
    $('body').append(lightbox);
    $('#nljugglerLightbox').hide();
  }

  function addStyleSheet (){
    addCss('#nljugglerLightbox { position: fixed; top: 10px; left: 40%; width: auto; transform: translateX(-40%); max-height:1000px; z-index:1000; overflow:scroll; border:solid 2px black; }'+
           '#lightboxImage {width: auto; }');
    console.log('InstaZoom styles added');
  }

  function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
  }
});