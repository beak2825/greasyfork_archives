// ==UserScript==
// @name         Instagram Direct Message Chat
// @namespace    https://greasyfork.org/users/28373
// @description  Activate Direct Message on Instagram for any browser by changing useragent to iPhone
// @version      1.2
// @author       Kirsch
// @run-at       document-start
// @include      *.instagram.com/*
// @icon         https://www.google.com/s2/favicons?domain=Instagram.com
// @downloadURL https://update.greasyfork.org/scripts/387735/Instagram%20Direct%20Message%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/387735/Instagram%20Direct%20Message%20Chat.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
});