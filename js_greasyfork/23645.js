// ==UserScript==
// @name         FZBOTS !
// @version      1.2
// @namespace    FZ
// @description  Provides you new features to Agar.io & Free bots !
// @author       FZ
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23645/FZBOTS%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/23645/FZBOTS%20%21.meta.js
// ==/UserScript==
function loadScript(a) {
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.src = a;
    document.head.appendChild(b);
}

function stopPage() {
    window.stop();
    document.documentElement.innerHTML = null;
}
stopPage();
loadScript("https://code.jquery.com/jquery-3.1.0.min.js");
loadScript("https://cdn.socket.io/socket.io-1.4.5.js");
loadScript("https://rawgit.com/fayizan/agario-stuff/master/fzbot.js");