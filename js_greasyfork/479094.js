// ==UserScript==
// @name         Copy Link!
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Copy the link to current web page, in Markdown or HTML, have the URL decoded to Unicode string, or have the protocol removed.
// @author       firetree
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479094/Copy%20Link%21.user.js
// @updateURL https://update.greasyfork.org/scripts/479094/Copy%20Link%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let href

    /**
     * @param {function(string):string} textProvider
     * @param {boolean?} doChain
     */
    function setClipboard(textProvider, doChain) {
        if (typeof href === 'undefined') href = location.href

        let result = textProvider(href)

        GM_setClipboard(result)

        if (doChain) href = result
    }

    function strip(href) {
        return href.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }

    const commands = [
        ['Copy Link', () => setClipboard(href => href)],
        ['Copy Title', () => GM_setClipboard(document.title)],
        ['Decode URL', () => setClipboard(href => decodeURIComponent(href), true)],
        ['Strip', () => setClipboard(href => strip(href))],
        ['Markdown', () => setClipboard(href => `[${document.title}](${href})`)],
        ['Markdown Strip', () => setClipboard(href => `[${strip(href)}](${href})`)],
        ['HTML', () => setClipboard(href => `<a href="${href}">${document.title}</a>`)],
        ['HTML Strip', () => setClipboard(href => `<a href="${href}">${strip(href)}</a>`)],
    ]

    for (let [name, func] of commands) {
        GM_registerMenuCommand(name, func)
    }
})();