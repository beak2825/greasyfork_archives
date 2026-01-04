// ==UserScript==
// @name         Instagram mobile on Desktop
// @namespace    http://bit.ly/sepehrsohrabi
// @version      1.1
// @description  Change the User Agent on Instagram to use mobile version on Desktop
// @icon         https://www.google.com/s2/favicons?domain=Instagram.com
// @author       Sepehr Sohrabi
// @match        https://www.instagram.com/
// @include        https://www.Instagram.com/*
// @match        https://instagram.com/
// @include        https://Instagram.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/386788/Instagram%20mobile%20on%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/386788/Instagram%20mobile%20on%20Desktop.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/ 604.1.21 (KHTML, like Gecko) Version/ 12.0 Mobile/17A6278a Safari/602.1.26'
});