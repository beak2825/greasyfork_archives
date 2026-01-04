// ==UserScript==
// @name         YouTube - Shorts Redirect
// @namespace    q1k
// @version      0.1
// @description  YouTube shorts redirect to regular watch page
// @author       q1k
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/445879/YouTube%20-%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/445879/YouTube%20-%20Shorts%20Redirect.meta.js
// ==/UserScript==

if (window.location.href.indexOf('youtube.com/shorts/') > -1) {
    window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
}

var redirecting = false;
var mo = new MutationObserver(function(mutations) {
    if (window.location.href.indexOf('youtube.com/shorts/') > -1) {
        if(redirecting){ return; }
        window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
        redirecting = true;
    }
});
function watchUrlForChange(e) {
    mo.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

window.addEventListener('load', watchUrlForChange, true);

