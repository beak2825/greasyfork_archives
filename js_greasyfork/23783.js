// ==UserScript==
// @name            Gotceleb Direct Full-Size Images
// @name:tr         Gotceleb Direkt Büyük Resim Açıcı
// @namespace       https://greasyfork.org/en/users/68133-nevertheless
// @description     Allows you to view full-sized images of thumbnails on a new tab with one click
// @description:tr  Küçük resimlere tek tıklama ile büyük boy resimleri görüntülemenizi sağlar
// @author          Nevertheless
// @match           *://*.gotceleb.com/*
// @version         1.04
// @license         MIT
// @require         https://code.jquery.com/jquery-3.1.0.min.js
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/23783/Gotceleb%20Direct%20Full-Size%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/23783/Gotceleb%20Direct%20Full-Size%20Images.meta.js
// ==/UserScript==

function qstring(name, url) {
  if (!url) {
    url = window.location.href;
  }
  var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(url);
  if (!results) {
    return undefined;
  }
  return results[1] || undefined;
}

(function() {
  "use strict";

  $(".gallery-icon").each(function() {
    var childLink = $(this)
      .children("a")
      .first();
    var childImage = childLink.children("img").first();
    //var thumbWidth = childImage.attr('width');
    //var thumbHeight = childImage.attr('height');
    //var strRemove = '-' + thumbWidth + 'x' + thumbHeight;
    var imageLinkClean = childImage.attr("src").replace(/-\d{3}x\d{3}/g, "");
    childLink.attr("href", imageLinkClean);
    childLink.attr("target", "_blank");
  });

  // Support for old albums
  $("a[title^='Pics of:']").each(function() {
    var oldChildImage = $(this)
      .children("img")
      .first();
    var oldImageLink = oldChildImage.attr("src");
    var oldImageLinkClean = qstring("src", oldImageLink);
    $(this).attr("href", oldImageLinkClean);
    $(this).attr("target", "_blank");
  });
})();
