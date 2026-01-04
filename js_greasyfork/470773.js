// ==UserScript==
// @name        Change navigator.userAgent
// @namespace   Rob W
// @description Changes navigator.userAgent to IE on all site
// @match       https://www.ipsorgu.com/*
// @run-at      document-start
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/470773/Change%20navigatoruserAgent.user.js
// @updateURL https://update.greasyfork.org/scripts/470773/Change%20navigatoruserAgent.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582'
});