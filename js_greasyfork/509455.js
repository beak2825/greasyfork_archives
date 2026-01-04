// ==UserScript==
// @name         Artist Finder
// @namespace    http://tampermonkey.net/
// @license MIT
// @description  Link to profile of tattoo festival artists
// @author       Leo Long
// @version      2024-09-21
// @description  try to take over the world!
// @match        https://atlantatattoofestival.com/artists/attending-artists/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlantatattoofestival.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509455/Artist%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/509455/Artist%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("hi james");
    setTimeout(function(){
        window.scrollTo(0, document.body.scrollHeight);
        jQuery('.e-gallery-item')[0].click()
    },500);
    setTimeout(function(){
        var artists=jQuery('img.elementor-lightbox-image');
        console.log(artists.length)
        for (var i = 0, len = artists.length; i < len; i++) {
          var picture=artists[i];
          var linky = "<a target='_blank' href='https://www.google.com/search?q=@"+encodeURIComponent(picture.getAttribute('data-title'))+" tattoo'</a>"
          jQuery(picture).wrap(linky);
        }
    },500);
})();