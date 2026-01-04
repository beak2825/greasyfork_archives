// ==UserScript==
// @name     Remove medium Bar
// @version  1
// @grant    none
// @include https://medium.com/*
// @description Remove top and bottom bars in medium.com blogs
// @namespace https://greasyfork.org/users/245076
// @downloadURL https://update.greasyfork.org/scripts/377531/Remove%20medium%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/377531/Remove%20medium%20Bar.meta.js
// ==/UserScript==

document.getElementsByClassName("metabar")[0].remove();
for (x of document.getElementsByClassName("js-stickyFooter")){x.remove();}