// ==UserScript==
// @name         Discourse perfect support
// @namespace    http://sample.net/
// @version      0.1
// @description  Overrides unsupportedBrowser, so you don't get locked out of most of a forums functionalities because your browser doesn't support some dumb function that is basically never used, in my particular case CSS.supports("aspect-ratio: 1")
// @author       Fuim
// @match        *://foro.iminecrafting.com/*
// @match        *://discuss.bevry.me/*
// @match        *://discuss.huggingface.co/*
// @match        *://discourse.slicer.org/*
// @match        *://forum.torproject.net/*
// @include       *://*
// @icon         https://www.google.com/s2/favicons?domain=www.discourse.org
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/465760/Discourse%20perfect%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/465760/Discourse%20perfect%20support.meta.js
// ==/UserScript==

Object.defineProperty(unsafeWindow, 'unsupportedBrowser', {
  value: false,
  writable: false
});
