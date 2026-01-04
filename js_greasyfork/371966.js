// ==UserScript==
// @name         ORSM Gallery Keybindings
// @name:de      ORSM Cursornavigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Navigate trough orsm.net galleries with the arrow keys
// @description:de Navigation mittels Cursortasten durch die orsm.net Gallerien
// @author       You
// @match        http*://www.orsm.net/i/gallery/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371966/ORSM%20Gallery%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/371966/ORSM%20Gallery%20Keybindings.meta.js
// ==/UserScript==

var next = 0;
var prev = 0;

(function() {
    'use strict';
    if (window.top != window.self) { //-- Don't run on frames or iframes.
        return;
    }
    document.onkeydown = checkKey;
    window.onload = function () {
        document.getElementById("bigimg").scrollIntoView({block: "end", inline: "center"});

        var links = document.links;
        for(var i=0; i<links.length; i++) {
            if(links[i].innerHTML.valueOf() == "Next &gt;&gt;&gt;") {
                next = links[i].href;
            } else if(links[i].innerHTML.valueOf() == "&lt;&lt;&lt; Prev") {
                prev = links[i].href;
            }
        }
    }
}
)();

function checkKey(e) {
    var links = document.links;
    for(var i=0; i<links.length; i++) {
        if(links[i].innerHTML.valueOf() == "Next &gt;&gt;&gt;") {
            next = links[i].href;
        } else if(links[i].innerHTML.valueOf() == "&lt;&lt;&lt; Prev") {
            prev = links[i].href;
        }
    }
    e = e || window.event;
    if (e.keyCode == '37') {
        if (prev.length > 0) {
            window.open(prev, "_self");
        }
    }
    else if (e.keyCode == '39') {
        if (next.length > 0) {
            window.open(next, "_self");
        }
    }

}
