// ==UserScript==
// @name         pr0gramm.com 10% volume
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically adjusts the volume to 10% on direct HTML5/MP4 video-links on pr0gramm.com.
// @author       Taizun
// @match        https://vid.pr0gramm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385276/pr0grammcom%2010%25%20volume.user.js
// @updateURL https://update.greasyfork.org/scripts/385276/pr0grammcom%2010%25%20volume.meta.js
// ==/UserScript==

document.getElementsByTagName('video')[0].volume = 0.1;