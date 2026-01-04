// ==UserScript==
// @name Rickblock (WORKING VERSION)
// @include *
// @description The (WORKING) Rickroll blocker Shout out to whatismyname for the code I just edited it so that it blocks the rickroll'd link instead
// @run-at document-end
// @version 1.1
// @namespace 
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/419200/Rickblock%20%28WORKING%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419200/Rickblock%20%28WORKING%20VERSION%29.meta.js
// ==/UserScript==
var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
    var linkto = links[i].getAttribute("href");
    var isrickroll = false;
    if (linkto)
       var isrickroll = (linkto.indexOf("oHg5SJYRHA0") !== -1);
    if (isrickroll) {
        links[i].innerHTML = "(They tried to rickroll you)";
        links[i].setAttribute("href", "#");
    }
}