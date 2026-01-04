// ==UserScript==
// @name        Shorts fixer
// @namespace   Violentmonkey Scripts
// @match       *://*youtube.com/shorts/*
// @grant       none
// @version     1.0
// @author      Braden
// @license     Public Domain
// @description Makes youtube shorts pages usable.
// @downloadURL https://update.greasyfork.org/scripts/462116/Shorts%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/462116/Shorts%20fixer.meta.js
// ==/UserScript==

const video_id = location.pathname.split("/")[2];
location.href = `https://youtube.com/watch?v=${video_id}`;