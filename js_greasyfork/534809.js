// ==UserScript==
// @name         Greasy Fork Use Markdown
// @namespace    https://maxchang.me
// @version      0.0.1
// @description  Sets the default format of the reply area on Greasy Fork to Markdown.
// @author       You
// @match        https://greasyfork.org/*
// @icon            https://greasyfork.org/vite/assets/blacklogo16-DftkYuVe.png
// @run-at       document-idle
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/534809/Greasy%20Fork%20Use%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/534809/Greasy%20Fork%20Use%20Markdown.meta.js
// ==/UserScript==

;(() => {
    document
        .querySelectorAll('[id$="markup_markdown"]')
        .forEach((x) => x.click())
})()
