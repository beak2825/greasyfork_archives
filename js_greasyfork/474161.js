// ==UserScript==
// @name         Github relative-time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  github returns datetimes instead of vague descriptions
// @author       Justin Kahrs
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474161/Github%20relative-time.user.js
// @updateURL https://update.greasyfork.org/scripts/474161/Github%20relative-time.meta.js
// ==/UserScript==
function relativeTime() {
    document.querySelectorAll("relative-time").forEach(function(el) {
        var parent = el.parentNode;
        var timestamp = el.title;
        var span = document.createElement("span");
        span.innerHTML = timestamp;
        parent.removeChild(el);
        parent.appendChild(span);
    });
}

document.addEventListener('DOMNodeInserted', relativeTime, false);