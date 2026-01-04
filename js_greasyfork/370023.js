// ==UserScript==
// @name         HDBits Viewport
// @version      1.0
// @author       Boltex
// @description  Add viewport to head section
// @namespace    none
// @match        http://hdbits.org/*
// @match		 https://hdbits.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370023/HDBits%20Viewport.user.js
// @updateURL https://update.greasyfork.org/scripts/370023/HDBits%20Viewport.meta.js
// ==/UserScript==

var getHead = document.getElementsByTagName('head')[0].innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1">';


var viewport = document.querySelector('meta[name=viewport]');
var viewportContent = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0';

if (viewport === null) {
  var head = document.getElementsByTagName('head')[0];
  viewport = document.createElement('meta');
  viewport.setAttribute('name', 'viewport');
  head.appendChild(viewport);
}

viewport.setAttribute('content', viewportContent);