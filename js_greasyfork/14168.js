// ==UserScript==
// @name Rickblock
// @include *
// @description The Rickroll blocker
// @run-at document-end
// @version 0.0.1.20151125001049
// @namespace https://greasyfork.org/users/12417
// @downloadURL https://update.greasyfork.org/scripts/14168/Rickblock.user.js
// @updateURL https://update.greasyfork.org/scripts/14168/Rickblock.meta.js
// ==/UserScript==
var links = document.getElementsByTagName("a");
for (var i in links)
{
    var linkto = links[i].getAttribute("href");
    var isrickroll = (linkto.indexOf("dQw4w9WgXcQ") !== -1);
    if (isrickroll)
    {
        links[i].innerHTML = "(removed Rickroll)";
        links[i].setAttribute("href", "#");
    }
}