// ==UserScript==
// @name            Imgur: Direct Link Copy
// @namespace       https://github.com/Zren/
// @description     Replace the link on hover with direct link to the image (with https).
// @icon            https://imgur.com/favicon.ico
// @author          Chris H (Zren / Shade)
// @version         1
// @match           *://imgur.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/23236/Imgur%3A%20Direct%20Link%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/23236/Imgur%3A%20Direct%20Link%20Copy.meta.js
// ==/UserScript==

function getParent(e, selector) {
    var parent = e.parentNode;
    while (parent && !parent.matches(selector)) { // exit when no parent or parent matches selector
        parent = parent.parentNode;
    }
    return parent; // null or parent with selector
}

function replaceLinks() {
    for (var e of document.querySelectorAll('input.copy-input')) {
        if (e.value.startsWith('http://')) {
            var post = getParent(e, '.image.post-image');
            var zoom = post.querySelector('.zoom')
            var directLink;
            if (zoom) {
                directLink = zoom.getAttribute('href');
            } else {
                directLink = post.querySelector('img').getAttribute('src');
            }
            directLink = 'https:' + directLink;
            e.value = directLink;
        }
    }
}

replaceLinks();
setInterval(replaceLinks, 1000);
