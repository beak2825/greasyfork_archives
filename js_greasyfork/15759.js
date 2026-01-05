// ==UserScript==
// @name Rickrolled
// @include *
// @description Use this as a prank for your friends!
// @run-at document-end
// @namespace https://greasyfork.org/users/12417
// @version 0.0.1.20151231114136
// @downloadURL https://update.greasyfork.org/scripts/15759/Rickrolled.user.js
// @updateURL https://update.greasyfork.org/scripts/15759/Rickrolled.meta.js
// ==/UserScript==
var links = document.getElementsByTagName("a");
for (var i in links)
{
    links[i].setAttribute("href", "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
}