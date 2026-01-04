// ==UserScript==
// @name         ORSM Gallery Keybindings
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http*://www.orsm.net/i/gallery/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374678/ORSM%20Gallery%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/374678/ORSM%20Gallery%20Keybindings.meta.js
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
        if (next.length > 0) {
            document.body.innerHTML += '<iframe style="display:none" src="' + next +'"></iframe>'
        }
        if (prev.length > 0) {
            document.body.innerHTML += '<iframe style="display:none" src="' + prev +'"></iframe>'
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