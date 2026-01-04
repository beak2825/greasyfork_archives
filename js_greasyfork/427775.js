// ==UserScript==
// @name        Better BookSusi.com gallery - no gallery transitions, indicator moved to the side
// @namespace   Violentmonkey Scripts
// @match       https://booksusi.com/*
// @grant       GM_addStyle
// @version     1.3
// @author      -
// @description Disable slide transitions because they're annoying; move indicator to the side where it doesn't obscure the image; preload images. 2021-09-26 03:20:14
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/427775/Better%20BookSusicom%20gallery%20-%20no%20gallery%20transitions%2C%20indicator%20moved%20to%20the%20side.user.js
// @updateURL https://update.greasyfork.org/scripts/427775/Better%20BookSusicom%20gallery%20-%20no%20gallery%20transitions%2C%20indicator%20moved%20to%20the%20side.meta.js
// ==/UserScript==


// Disable slide transitions and blend-in transitions.
// Note that blend-in transitions need to be kept (even if very short) because setting
// the transitions to "none" breaks the script and after exiting the image you cannot
// click on anything any more.
GM_addStyle(`
  .blueimp-gallery > .slides > .slide {
    transition: none !important;
  }
  div#blueimp-gallery {
    transition: opacity 0.01s linear !important;
  }
  img.slide-content {
    transition: opacity 0.01s linear !important;
  }
  .blueimp-gallery > .indicator {
    left: 90% !important;
  }
`);


// Preload images so you don't have to wait for them to load when browsing the gallery
var pics = [] // list of images

// Find image links
$("div.flickity-slider").ready(function () {
  $("a.slick-image").each(function(i, elm) {
    pics.push(elm.href)
  })
})

// Place images in the page, making them invisible (0px * 0px)
$("div.girl_description").ready(function () {
  pics_str = "   "
  pics.forEach(function (url, i) {
    pics_str = pics_str + " <img src=" + '"' + url + '"' + " style=" + '"' + "width: 0px; height: 0px;" + '"' + "/>"
  })
  $("div.girl_description").append(pics_str)
})
