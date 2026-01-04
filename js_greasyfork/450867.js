// ==UserScript==
// @name        Soundgasm Downloader
// @namespace   Violentmonkey Scripts
// @match       https://*soundgasm.net/*
// @grant       none
// @version     1.3
// @author      lightningund
// @description Download audios from soundgasm
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450867/Soundgasm%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/450867/Soundgasm%20Downloader.meta.js
// ==/UserScript==

// Getting the actual URL of the audio file
const url = $("html").html().match(/m4a:\s\"([^\"]+)\"/)[1];

const link_elem = `<a href="${url}" download>Download</a>`;
$("nav").append(link_elem);