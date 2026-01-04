// ==UserScript==
// @name        gennji.com image gallery
// @namespace   abdrool
// @match       https://gennji.com/post-*
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version     1.0
// @author      abdrool
// @icon        https://gennji.com/wp-content/uploads/2020/01/ddf800ca93715b2925d8013c210de622-32x32.png
// @description Click any of the images in articles for a gallery overlay.
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/baguettebox.js/1.11.1/baguetteBox.min.js
// @resource     css https://cdnjs.cloudflare.com/ajax/libs/baguettebox.js/1.11.1/baguetteBox.min.css
// @downloadURL https://update.greasyfork.org/scripts/427990/gennjicom%20image%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/427990/gennjicom%20image%20gallery.meta.js
// ==/UserScript==

let customCss = `
#gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
}

#gallery img {
  padding-bottom: 20px;
}
`

$(document).ready(function() {
  let urls = $("article .blocks-gallery-item img").map(function() { return this.src }).get();
  
  $("article figure").empty();
  $("article figure").prepend("<div id='gallery'></div>");
  
  let galleryItems = urls.map(url => {
    return "<a href='" + url + "'><img src='" + url + "'></a>"
  });
  $("#gallery").append(galleryItems);
  
  GM_addStyle(GM_getResourceText('css'))
  GM_addStyle(customCss);
  baguetteBox.run("#gallery");
});