// ==UserScript==
// @name               Nitter
// @namespace          https://greasyfork.org/en/users/728780-turbo-cafe-clovermail-net
// @description        Always redirects to nitter
// @include            *://x.com/*
// @version            1.04
// @run-at             document-start
// @author             turbo.cafe@clovermail.net
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/420776/Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/420776/Nitter.meta.js
// ==/UserScript==

window.location.replace("https://xcancel.com" + window.location.pathname + window.location.search);