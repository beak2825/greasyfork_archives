// ==UserScript==
// @name          IA Always focus (music playback in background tabs)
// @version      0.2
// @match        https://archive.org/*
// @include      https://archive.org/*
// @description   Some pages check the document.hidden property and won't render content unless the page is in focus. This script will trick them to think they are in focus so you can preload them in a tab and visit them when they have finished loading.
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/407780/IA%20Always%20focus%20%28music%20playback%20in%20background%20tabs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407780/IA%20Always%20focus%20%28music%20playback%20in%20background%20tabs%29.meta.js
// ==/UserScript==

//https://userscripts-mirror.org/scripts/review/177284

Object.defineProperty(document, "hidden", { value : false});