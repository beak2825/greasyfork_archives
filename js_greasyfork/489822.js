// ==UserScript==
// @name         Evernote direct link opening, without "You are leaving Evernote"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Vitaly Zdanevich
// @match        https://www.evernote.com/client/web*
// @grant        none
// @description  Faster links opening. Git repo at https://gitlab.com/vitaly-zdanevich/evernote-direct-link-opening-without-you-are-leaving
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489822/Evernote%20direct%20link%20opening%2C%20without%20%22You%20are%20leaving%20Evernote%22.user.js
// @updateURL https://update.greasyfork.org/scripts/489822/Evernote%20direct%20link%20opening%2C%20without%20%22You%20are%20leaving%20Evernote%22.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('click', callback, false);
})()

function callback(e) {
    if (e.target.tagName !== 'A') {
        return;
    }

    e.preventDefault();
    const url = decodeURIComponent(e.target.href.match(/dest=(.*)/)[1])
    window.open(url, '_blank');
}
