// ==UserScript==
// @name Onche Redirect
// @namespace Violentmonkey Scripts
// @match       https://www.jeuxvideo.com/forums/*-51-*.htm
// @match       https://www.jeuxvideo.com/recherche/forums/0-51-0-1-0-*
// @grant none
// @version 1.0
// @author -
// @description redirige jvc vers onche.org
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/461904/Onche%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/461904/Onche%20Redirect.meta.js
// ==/UserScript==

location = Object.assign(new URL("https://onche.org/forum/1/blabla-general"));