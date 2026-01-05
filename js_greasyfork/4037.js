// ==UserScript==
// @name           Flickr Img src
// @namespace      AfzalivE
// @description    Removes the stupid div in from of the image
// @include        http://www.flickr.com/photos/*
// @include        http://flickr.com/photos/*
// @version 0.0.1.20140811015305
// @downloadURL https://update.greasyfork.org/scripts/4037/Flickr%20Img%20src.user.js
// @updateURL https://update.greasyfork.org/scripts/4037/Flickr%20Img%20src.meta.js
// ==/UserScript==

function removeElement(divNum) {
  var d = document.getElementById('photo');
  var olddiv = document.getElementById(divNum);
  d.removeChild(olddiv);
}

removeElement("photo-drag-proxy");
