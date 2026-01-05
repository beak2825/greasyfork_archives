// ==UserScript==
// @name       Lazyload Unveil
// @version    2.0
// @description  load images on scroll. Universal img tags. lol@greasyfork for not letting me call to github
// @match       http://*/*
// @match       https://*/*
// @require http://code.jquery.com/jquery-latest.min.js
// @copyright  some dude on the internet, compiled to greasyfork by zingy
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/5111/Lazyload%20Unveil.user.js
// @updateURL https://update.greasyfork.org/scripts/5111/Lazyload%20Unveil.meta.js
// ==/UserScript==

/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    unveil();

    return this;

  };

})(window.jQuery || window.Zepto);
$(document).ready(function() {
  $("img").unveil();
});