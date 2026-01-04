// ==UserScript==
// @name        No passkey in TMD magnet links
// @namespace   XXN@TMD
// @description Remove passkey from TMD magnet links - free download
// @include     *torrentsmd.com/*
// @include     *torrentsmd.eu/*
// @include     *torrentsmd.me/*
// @include     *torrentsmoldova.com/*
// @include     *torrentsmoldova.org/*
// @include     *torrentsmoldova.net/*
// @exclude     *torrentsmd.com/inbox.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30761/No%20passkey%20in%20TMD%20magnet%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/30761/No%20passkey%20in%20TMD%20magnet%20links.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", modifyLink, false );

if( document.readyState === "complete" ) {
    modifyLink();
}

function modifyLink() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace(/passkey\%3D.*?\&tr/g, "passkey%3D&tr" );// first passkey in link
        a.href = a.href.replace(/passkey\%3D[^\.\&=]*?$/g, "passkey%3D" );// second&last passkey, end of link
    });
}