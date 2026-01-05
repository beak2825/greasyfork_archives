// ==UserScript==
// @name        reddit-stream youtube
// @description Inline embed for youtube links in reddit-stream.com
// @namespace   org.stevenhoward
// @include     http://reddit-stream.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23095/reddit-stream%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/23095/reddit-stream%20youtube.meta.js
// ==/UserScript==

function createYoutubeEmbed (link) {
    let match = /.*[/]watch\?v=(.*)/.exec(link.href);
    let frame = document.createElement('iframe');

    if (match && match.length && match.length == 2) {
        frame.width = 640;
        frame.height = 390;
        frame.frameBorder = 0;
        frame.style.display = 'block';
        frame.src = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }

    /* Return an empty iframe for malformed urls. Don't care about errors for now. */
    return frame;
}

function addVideoExpando (link) {
    let toggle = document.createElement('a');
    toggle.href = 'javascript: void(0)';
    toggle.innerHTML = ' (+)';
    toggle.style.opacity = 0.5;

    toggle.addEventListener('click', function () {
        let existingFrame = link.parentNode.querySelector('iframe');
        if (existingFrame) {
            existingFrame.remove();
            toggle.innerHTML = ' (+)';
        }
        else {
            let frame = createYoutubeEmbed(link);
            toggle.parentNode.insertBefore(frame, toggle.nextSibling);
            toggle.innerHTML = ' (-)';
        }
    });

    link.parentNode.insertBefore(toggle, link.nextSibling);
}

new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.nodeType == Node.ELEMENT_NODE) {
                for (let video of node.querySelectorAll('a[href*="youtube.com"]')) {
                    addVideoExpando(video);
                }
            }
        }
    }
}).observe(document.getElementById('c-main'), {
    childList: true,
    subtree: true
});

for (let video of document.querySelectorAll('#c-main a[href*="youtube.com"]')) {
    addVideoExpando(video);
}