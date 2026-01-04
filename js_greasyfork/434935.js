// ==UserScript==
// @name         Performance Improver
// @namespace    -
// @version      0.1
// @description  Try to take over the world!
// @author       D4rk574rX#3100
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434935/Performance%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/434935/Performance%20Improver.meta.js
// ==/UserScript==

var ping = document.getElementById("pingDisplay"); // Ping Display
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "20px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

setInterval(() => { // Auto reload (when disconnected)
    var text = document.getElementById("loadingText").innerText;
    if (text == "disconnected\nreload") {
        window.onbeforeunload = null;
        document.body.remove();
        window.location.href = window.location.href;
    }
}, 0);

setInterval(() => { // Starter Resource
    window.follmoo && follmoo()
}, 10);

setInterval(() => { // Ad and Cookie Preferences remover
    document.getElementById('ot-sdk-btn-floating').remove();
    document.getElementById('pre-content-container').remove()
}, 0);