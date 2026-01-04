// ==UserScript==
// @name               yewtu.be
// @namespace          https://greasyfork.org/en/users/728780-turbo-cafe-clovermail-net
// @description        Always redirects to yewtu.be.
// @include            *://*.youtube.com/*
// @version            1.07
// @run-at             document-start
// @author             turbo.cafe@clovermail.net
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/420775/yewtube.user.js
// @updateURL https://update.greasyfork.org/scripts/420775/yewtube.meta.js
// ==/UserScript==

window.location.replace("https://yewtu.be" + window.location.pathname + window.location.search);