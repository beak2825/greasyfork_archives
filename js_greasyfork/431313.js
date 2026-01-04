// ==UserScript==
// @name Facebook Side Game Hide
// @namespace FSGB
// @description It hides games info on right side on facebook games
// @include *apps.facebook.com/kingdomsofcamelot/*
// @author Mandalorian
// @license CC-BY-4.0
// @version 1.10
// @releasenotes <p>Release</p>
// @downloadURL https://update.greasyfork.org/scripts/431313/Facebook%20Side%20Game%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/431313/Facebook%20Side%20Game%20Hide.meta.js
// ==/UserScript==
document.querySelector('div#rightCol'). style. display = 'none';