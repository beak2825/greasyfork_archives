// ==UserScript==
// @name         F1Countdown.com CSS & JS Improvements by IAmABritishGuy
// @namespace    TamperMonkey / ViolntMonkey
// @version      1.0
// @description  Improves some of the css to add better hover functionaly, cursor setting and adds "Bookmark This Page" functionalty.
// @author       reddit.com/u/IAmABritishGuy
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        http://www.f1countdown.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/35803/F1Countdowncom%20CSS%20%20JS%20Improvements%20by%20IAmABritishGuy.user.js
// @updateURL https://update.greasyfork.org/scripts/35803/F1Countdowncom%20CSS%20%20JS%20Improvements%20by%20IAmABritishGuy.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.src = "http://yourjavascript.com/117181223221/bookmark-this-1.js";
document.getElementsByTagName("head")[0].appendChild(script);

document.getElementById("newsletter").innerHTML += '<a href="javascript:void(0);" id="bookmark-this" title="F1 Countdown Bookmark This">Bookmark This Page</a>';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.eventlist li:hover { cursor: pointer; color: #ba4daa; } .timezone-selector select:hover { color: #ba4daa; cursor: pointer; } #newsletter a:hover { border-color: #ba4daa; color: #ba4daa; } #newsletter a, a:hover { color: #3ac82c; border: 2px solid #3ac82c; } a { transition: all .2s ease-in-out; } ');