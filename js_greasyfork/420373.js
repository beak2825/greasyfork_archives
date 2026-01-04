// ==UserScript==
// @name               Teddit
// @namespace          https://greasyfork.org/en/users/728780-turbo-cafe-clovermail-net
// @description        Always redirects to ~teddit.net~ redlib instance
// @include            *://*.reddit.com/*
// @exclude            *://*.reddit.com/poll/*
// @version            1.06
// @run-at             document-start
// @author             turbo.cafe@clovermail.net
// @grant              none
// @icon               https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/420373/Teddit.user.js
// @updateURL https://update.greasyfork.org/scripts/420373/Teddit.meta.js
// ==/UserScript==

window.location.replace("https://rl.bloat.cat" + window.location.pathname + window.location.search);