// ==UserScript==
// @name        Gizmodo Brasil remove image
// @namespace   http://github.com/tcelestino
// @include     http://gizmodo.uol.com.br/*
// @description remove image to header post pages
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16571/Gizmodo%20Brasil%20remove%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/16571/Gizmodo%20Brasil%20remove%20image.meta.js
// ==/UserScript==

var header = document.querySelector('.destaque-titulo');
var image_header = document.querySelector('.img');

if (header) {
  header.removeChild(image_header);
}