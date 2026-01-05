// ==UserScript==
// @author Mike (SirStendec)
// @author Dan Salvato
// @contributor James Edward Lewis II
// @namespace greasyfork.org
// @name FrankerFaceZ
// @description Loads the main FrankerFaceZ script in browsers that don't support the extension but do support UserScripts; updated from http://userscripts-mirror.org/scripts/show/167158 and may break in your browser, UserScript version does not reflect actual FFZ version.
// @icon http://cdn.frankerfacez.com/icon32.png
// @include	http://*.twitch.tv/*
// @include	http://twitch.tv/*
// @include	https://*.twitch.tv/*
// @include	https://twitch.tv/*
// @exclude http://api.twitch.tv/*
// @exclude https://api.twitch.tv/*
// @grant none
// @version 0.0.1
// @run-at document-end
// @copyright 2015 FrankerFaceZ
// @downloadURL https://update.greasyfork.org/scripts/12262/FrankerFaceZ.user.js
// @updateURL https://update.greasyfork.org/scripts/12262/FrankerFaceZ.meta.js
// ==/UserScript==

(function (document) {
  'use strict';
  (document.head || document.getElementsByTagName('head')[0]).
    appendChild(document.createElement('script')).
      src = '//cdn.frankerfacez.com/script/script.min.js';
})(document);
