// ==UserScript==
// @name         Reddit: Direct Links2
// @namespace    https://reddit.com/
// @description  Removes redirect on outbound links.2
// @version      1.2
// @match        *://*.reddit.com/*
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371232/Reddit%3A%20Direct%20Links2.user.js
// @updateURL https://update.greasyfork.org/scripts/371232/Reddit%3A%20Direct%20Links2.meta.js
// ==/UserScript==


// March 16: 2016: (Source Code) https://www.reddit.com/r/privacy/comments/4aqdg0/reddit_started_tracking_the_links_we_click_heres/
// July 6, 2016: https://www.reddit.com/r/changelog/comments/4rl5to/outbound_clicks_rollout_complete/
// July 7: 2016: https://www.reddit.com/r/technology/comments/4rpkt8/reddit_now_tracks_all_outbound_link_clicks_by/

// Note that the second version of the origional script doesn't work, as it will send you to https://www.reddit.com/undefined since the javascript event listeners are still attached.
// We fix this by replacing the link with a new element.

var el = function(html) {
    var e = document.createElement('div');
    e.innerHTML = html;
    return e.removeChild(e.firstChild);
};

function main() {
    for(var a of document.getElementsByTagName('a')) {
        if (a.hasAttribute('data-href-url')) {
            var actualFuckingUrl = a.getAttribute('data-href-url');
            //a.setAttribute('href', actualFuckingUrl);
            //a.removeAttribute('data-href-url');
            //a.removeAttribute('data-outbound-url');
            //a.removeAttribute('data-outbound-expiration');
            a.classList.remove('outbound');
            
            var b = el('<a />');
            b.href = actualFuckingUrl;
            b.classList = a.classList;
            b.setAttribute('title', a.getAttribute('title'));
            b.setAttribute('tabindex', a.getAttribute('tabindex'));
            b.innerHTML = a.innerHTML;
            b.setAttribute('rel', 'noreferrer');
            
            a.parentNode.insertBefore(b, a);
            a.remove();
        }
    }
}

main();
setInterval(main, 3000);