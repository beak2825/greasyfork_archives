// ==UserScript==
// @name         yeeet
// @namespace    yeeeet
// @version      0.1
// @description  d
// @author       Jimmy has big peen
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403903/yeeet.user.js
// @updateURL https://update.greasyfork.org/scripts/403903/yeeet.meta.js
// ==/UserScript==

var YeEt = "http://cdn-238178979185.glitch.me/textbooks/"

window.onkeydown = function(event) {
    if (event.ctrlKey && event.keyCode === 76) {
        if(window.location.href.indexOf(YeEt) === -1) {
            var webpage = window.location.href,
            result = YeEt + webpage;
            window.location.replace(result);
        } else {
            window.location.replace(window.location.href.replace(YeEt,""));
        }
    }
};