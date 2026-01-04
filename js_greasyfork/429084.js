// ==UserScript==
// @name         SCPLite
// @namespace    https://scp-wiki.wikidot.com/
// @version      1.0
// @author       NextDev65
// @description  removes many things except the text
// @match        https://scp-wiki.wikidot.com*/*
// @resource      https://gist.github.com/NextDev65/ab1d091bc30f04bb9c2b13ab1d0dd44f/raw/hover_fade.js
// @run-at       document-end
// @grant        GM_getResourceText
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429084/SCPLite.user.js
// @updateURL https://update.greasyfork.org/scripts/429084/SCPLite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://www.tampermonkey.net/documentation.php#_require
    // Points to a JavaScript file that is loaded and executed before the script itself starts running.
    // @require      https://gist.github.com/NextDev65/ab1d091bc30f04bb9c2b13ab1d0dd44f/raw/hover_fade.js

    // https://www.tampermonkey.net/documentation.php#_resource
    // Preloads resources that can by accessed via GM_getResourceURL and GM_getResourceText by the script.
    // @resource     hover_fadejs https://gist.github.com/NextDev65/ab1d091bc30f04bb9c2b13ab1d0dd44f/raw/hover_fade.js

    // external
    Function(GM_getResourceText('hover_fadejs'))();
    hover_fade(); // eslint-disable-line no-undef

    document.getElementById('header').remove();
    document.getElementById('side-bar').remove();
    document.getElementById('container-wrap').id = "container-wrap-o";
    document.getElementById('page-content').scrollIntoView();
    document.getElementById('footer').remove();
    document.getElementById('license-area').remove();
    document.getElementById('footer-bar').remove();
})();