// ==UserScript==
// @name     YouTube - Remove Explore button
// @description Hides the Explore button from YouTube
// @version  3
// @grant    none
// @include	*://youtube.com/*
// @include	*://*.youtube.com/*
// @author	@sverigevader
// @namespace https://greasyfork.org/users/692021
// @downloadURL https://update.greasyfork.org/scripts/412355/YouTube%20-%20Remove%20Explore%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/412355/YouTube%20-%20Remove%20Explore%20button.meta.js
// ==/UserScript==

window.setTimeout(
    function check() {
        if (document.querySelector('[title="Explore"]')) {
            explore();
        }
        if (document.querySelector('[title="Shorts"]')) {
            shorts();
        }
        window.setTimeout(check, 250);
    }, 250
);

function explore() {
    var node = document.querySelector('[title="Explore"]');
    node.style.display = "none";
}

function shorts() {
    var node = document.querySelector('[title="Shorts"]');
    node.style.display = "none";
}
