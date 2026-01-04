// ==UserScript==
// @name         Skip YouTube Ads with embed
// @description  Skip YouTube Ads 
// @include      https://www.youtube.com/*
// @exclude      https://www.youtube.com/watch*
// @namespace    https://greasyfork.org/users/14346
// @author       wOxxOm
// @version      2.0.3
// @license      MIT License
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/493867/Skip%20YouTube%20Ads%20with%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/493867/Skip%20YouTube%20Ads%20with%20embed.meta.js
// ==/UserScript==

var suppressing;
window.addEventListener('mouseup', function(e) {
    if (e.button > 1 || e.altKey)
        return;
    var link = e.target.closest('[href^="/watch"]');
    if (!link ||
        (link.getAttribute('href') || '').match(/^(javascript|#|$)/) ||
        link.href.replace(/#.*/, '') == location.href.replace(/#.*/, '')
       )
        return;

    var videoId = extractVideoId(link.href);
    if (!videoId)
        return;

    var modifiedHref = 'https://www.youtube.com/embed/' + videoId;
    GM_openInTab(modifiedHref, e.button || e.ctrlKey);
    suppressing = true;
    prevent(e);
}, true);

window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);

function prevent(e) {
    if (!suppressing)
        return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    setTimeout(function() {
        suppressing = false;
    }, 100);
}

function extractVideoId(url) {
    var match = url.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}
