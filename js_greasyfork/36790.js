// ==UserScript==
// @name        model-kartei.de Original Image Size
// @description Display photos in original size on details page
// @version     1.0.0
// @namespace   e84b2405-73f9-475f-b7f2-ec28c0d2a4f0
// @match       *://*.model-kartei.de/fotos/foto/*
// @require     https://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36790/model-karteide%20Original%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/36790/model-karteide%20Original%20Image%20Size.meta.js
// ==/UserScript==

(function(){
  $('img#gofullscreen')
    .css('width', 'auto')
    .css('height', 'auto')
    .css('max-width', '100%')
    .css('max-height', 'none');
  $('div#outerImageContainer')
    .css('max-width', 'none');
})();