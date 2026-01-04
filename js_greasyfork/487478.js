// ==UserScript==
// @name        Tumblr: Unfiltered
// @icon        https://primary.jwwb.nl/public/g/i/o/temp-ckosctcwkptnpwfunkxo/l3y0wp/image-17.png?enable-io=true&enable=downscale&width=16
// @namespace   MaddHub
// @match       https://*.tumblr.com/*
// @grant       GM_addStyle
// @license     MIT
// @version     1.4.6
// @author      maddjester
// @description A simple CSS tweak to remove the mature warning filter overlays on flagged tumbler images and videos.
// @supportURL  https://discord.com/servers/maddhub-official-906957649956991036
// @downloadURL https://update.greasyfork.org/scripts/487478/Tumblr%3A%20Unfiltered.user.js
// @updateURL https://update.greasyfork.org/scripts/487478/Tumblr%3A%20Unfiltered.meta.js
// ==/UserScript==

(function() {
    'use strict'
    GM_addStyle('div[data-testid="community-label-cover"] { display: none !important; }')
})()