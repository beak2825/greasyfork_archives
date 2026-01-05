// ==UserScript==
// @name Disable Voat's share overlay
// @description This will disable Voat's share overlay.
// @homepageURL https://github.com/HyphenSam/Voat-Share-Overlay
// @author HyphenSam
// @version 1.0.1
// @date 2015-07-17
// @namespace https://github.com/HyphenSam/Voat-Share-Overlay
// @include http://voat.co/*
// @match http://voat.co/*
// @include https://voat.co/*
// @match https://voat.co/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11017/Disable%20Voat%27s%20share%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/11017/Disable%20Voat%27s%20share%20overlay.meta.js
// ==/UserScript==
    $('div#share-a-link-overlay').remove();
    $("body").removeAttr("ondrop");
    $("body").removeAttr("ondragover");
