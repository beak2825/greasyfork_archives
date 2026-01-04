// ==UserScript==
// @name         IMDB Large Images [fork]
// @version      1.0.11-joey7
// @description  Large iMDB images when you hover over them.
// @namespace    https://greasyfork.org/en/scripts/11249-imdb-large-images
// @homepage     https://greasyfork.org/en/scripts/11249-imdb-large-images
// @license      ISC
// @contributors joeytwiddle
// @match        http://imdb.com/*
// @match        https://imdb.com/*
// @match        http://*.imdb.com/*
// @match        https://*.imdb.com/*
// @icon         data:image/png;base64,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
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41042/IMDB%20Large%20Images%20%5Bfork%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/41042/IMDB%20Large%20Images%20%5Bfork%5D.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);

$(document).ready(function() {

  var cssCode = "\
#largeImagePopover { \
position: absolute; \
box-shadow: 0 0 80px #0009; \
cursor: pointer; \
z-index: 1000; \
} \
";

  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName("head")[0].appendChild(styleElement);

  var hoverInFunction = function (e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;

    //console.log("[imdb_large_images.user.js] Hover detected", mouseX, mouseY);

    var hoveredImage = this.src ? this : $(this).find('img').get(0) || $(this).closest('.ipc-avatar, .ipc-photo, .ipc-poster').find('img').get(0);
    hoveredImage.style.cursor = 'progress';

    $('div#largeImagePopover, div.largeImagePopover').remove();
    $("body").css("overflow", "auto");

    // setup the large image
    var popImage = document.createElement("img");
    var src = hoveredImage.src;

    src = src.replace(/_V1\.?.*?_\./g,"_V1_.");
    src = src.replace(/_V1_?\.jpg/,"_V1_SY"+window.innerHeight+"_.jpg");

    popImage.src = src
    popImage.alt = hoveredImage.alt;
    popImage.border = 0;

    // setup the image link
    var popLink = document.createElement("a");
    popLink.href = $(hoveredImage).parents('a').attr('href');
    popLink.appendChild(popImage);

    // setup the image div
    var popDiv = document.createElement("div");
    popDiv.id = 'largeImagePopover';
    popDiv['class'] = 'largeImagePopover';
    popDiv.appendChild(popLink);
    $(popDiv).hide();

    // attach events to new image
    $(popImage).mouseout( function() {
      $(popDiv).remove();
    });
    $(popImage).mousemove( function(e) {
      var distX = e.pageX - mouseX;
      var distY = e.pageY - mouseY;
      var dist = Math.sqrt(distX * distX + distY * distY);
      //console.log("[imdb_large_images.user.js] Motion detected", dist);
      if (dist > 25) {
        $(popDiv).remove();
      }
    });
    $(popImage).css('cursor','crosshair');

    $(popImage).load( function() {
      // these assignments may differ per browser
      var pageXOffset = window.pageXOffset;
      var pageYOffset = window.pageYOffset;
      var innerWidth = window.innerWidth;
      var innerHeight = window.innerHeight;

      // shrink image if wider than screen
      if(popImage.width > innerWidth-17) {
        var tmpW = popImage.width;
        popImage.width = Math.min(popImage.width,innerWidth-17);
        popImage.height = (popImage.width/tmpW) * popImage.height;
      }
      if(popImage.height > innerHeight) {
        var tmpH = popImage.height;
        popImage.height = Math.min(popImage.height,innerHeight);
        popImage.width = (popImage.height/tmpH) * popImage.width;
      }

      // center image on mouse cursor
      var x = mouseX - parseInt(popImage.width/2);
      var y = mouseY - parseInt(popImage.height/2);

      // move image down and right if off screen to the left or top
      x = Math.max(x,pageXOffset);
      y = Math.max(y,pageYOffset);

      // move image up or left if off screen to the right or bottom
      x = Math.min(x, pageXOffset + innerWidth - 17 - popImage.width);
      y = Math.min(y, pageYOffset + innerHeight - popImage.height);

      // move image down and right if off screen to the left or top
      x = Math.max(x,pageXOffset);
      y = Math.max(y,pageYOffset);

      $(popImage.parentNode.parentNode).css('left',x);
      $(popImage.parentNode.parentNode).css('top',y);
      $(popImage.parentNode.parentNode).show();

      // For some reason the <div> is 5 pixels taller than the image, which leaves a little transparent box below the image, before the shadow starts
      // To prevent that, we force the desired size of the <div>
      $(popImage.parentNode.parentNode).css({ width: popImage.width, height: popImage.height });

      hoveredImage.style.cursor = 'crosshair';
    });

    $('body').append($(popDiv));
  };

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      $('div#largeImagePopover, div.largeImagePopover').remove();
    }
  });

  function checkImages() {
    $("img[src*='_V1']").not("img[src*='_ZA']").not(".imageDone").each(function() {
      // For thumbnails in the recommended "More Like This" section, we need to give IMDB time to select the item and show the overview, before we overlay the large image.
      var interval = $(this).closest('.rec_item').length ? 300 : 100;
      // The 2021 layout introduced a separate `a.ipc-lockup-overlay` which blocks focus of the img
      // We could target the `.ipc-avatar` container but targetting the overlay itself makes the crosshair appear how we expect
      //var target = $(this).closest('.ipc-avatar')[0] || this;
      var target = findOverlayFor(this, '.ipc-avatar') || findOverlayFor(this, '.ipc-photo') || findOverlayFor(this, '.ipc-poster') || this;
      $(target).addClass('imageDone').css('cursor','crosshair').hoverIntent({ over: hoverInFunction, interval: interval });
    });
    window.setTimeout(checkImages, 1000);
  }

  function findOverlayFor(img, className) {
    return $(img).closest(className).find('a.ipc-lockup-overlay')[0];
  }

  checkImages();

});
