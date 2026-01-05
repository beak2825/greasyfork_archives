// ==UserScript==
// @name        WorldCosplay Download
// @author      Arnold François Lecherche
// @namespace   https://greasyfork.org
// @icon        http://worldcosplay.net/favicon.ico
// @version     0.1
// @description Download the linked image on WorldCosplay photo pages
// @include     http://worldcosplay.net/photo/*
// @include     http://*.worldcosplay.net/photo/*
// @include     https://worldcosplay.net/photo/*
// @include     https://*.worldcosplay.net/photo/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/10475/WorldCosplay%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/10475/WorldCosplay%20Download.meta.js
// ==/UserScript==

setTimeout(function imgdl() {
  'use strict';
  var clks = document.getElementsByClassName('clickable'), sgn = document.getElementById('headerShader'), imgs = [], i, clk, isrc;
  for (i = clks.length; i--;) {
    clk = clks[i];
    if (clk.nodeName.toLowerCase() === 'img') {
      isrc = clk.src;
      if (/\.(?:jpe?g|png|gif)$/.test(isrc)) imgs.push(isrc);
    }
  }
  if (imgs.length) sgn.innerHTML += '<ul><li><a href="' + imgs.join('">Download</a></li><li><a href="') + '">Download</a></li></ul>';
  else setTimeout(imgdl, 16);
}, 16);