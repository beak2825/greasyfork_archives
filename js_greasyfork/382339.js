// ==UserScript==
// @name         Disable Reddit Lightbox
// @namespace    http://naatan.com/
// @version      0.1
// @description  Disable the damn lightbox on the reddit redesign
// @author       Nathan Rijksen
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382339/Disable%20Reddit%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/382339/Disable%20Reddit%20Lightbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var node = document.createElement('style');
    node.innerHTML = "div { cursor: auto !important; }";
    document.body.appendChild(node);

    var onClick = function(e) {
        if (e.button != 0) // only left mouse
            return;
        if (e.target.nodeName == "DIV")
            preventClick(e);
        if (e.target.nodeName == "H2" && e.target.parentNode.nodeName == "A")
            clickLink(e);
    }

    var preventClick = function(e) {
        console.log("Preventing click on", e.target);
        e.preventDefault();
        e.stopPropagation();
    }

    var clickLink = function(e) {
        console.log("Preventing lightbox on", e.target);
        preventClick(e);

        var link = e.target.parentNode
        document.location.href = link.getAttribute("href");
    }

    document.body.addEventListener("click", onClick);
})();