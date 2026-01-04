// ==UserScript==
// @name         DredDEC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dectalk in drednot using https://tts.cyzon.us/
// @author       You
// @match        https://test.drednot.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drednot.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449195/DredDEC.user.js
// @updateURL https://update.greasyfork.org/scripts/449195/DredDEC.meta.js
// ==/UserScript==

(function() {
'use strict';
//credit to ACRS on test.drednot.io for compacting this
let observer = new MutationObserver((b, c) => {
    let a = b[0].addedNodes[0].innerText;
    a.length < 999 && -1 !== a.indexOf(":") && function(b) {
        let a = new Audio(`https://tts.cyzon.us/tts?text=${encodeURI(b)}`);
        a && a.play()
    }(a.substring(a.indexOf(":") + 1))
}).observe(document.querySelector("#chat-content"), {
    childList: !0
})
})();