// ==UserScript==
// @name         Old Reddit Adblock (Duck Fix)
// @version      1.1
// @description  Block ads on Old Reddit
// @author       Scion Duck
// @match        https://old.reddit.com/*
// @license      The Unlicense
// @match        https://np.reddit.com/*
// @match        https://*.reddit.com/
// @match        https://*.reddit.com/me/f/*
// @match        https://*.reddit.com/message/*
// @match        https://*.reddit.com/r/*
// @match        https://*.reddit.com/user/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1349477
// @downloadURL https://update.greasyfork.org/scripts/503261/Old%20Reddit%20Adblock%20%28Duck%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503261/Old%20Reddit%20Adblock%20%28Duck%20Fix%29.meta.js
// ==/UserScript==
 
document.head.appendChild(document.createElement('style')).innerHTML = 'div[class*="promotedlink"] { display: none !important; }';