// ==UserScript==
// @name         textarea jsfuck
// @namespace    http://tampermonkey.net/
// @version      1337
// @license MIT
// @description  haha
// @author       xmr
// @include      http://www.jsfuck.com/
// @icon         https://r.n-mc.co/skin/face.png?id=522edbf8c7630e5b&scale=256
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436185/textarea%20jsfuck.user.js
// @updateURL https://update.greasyfork.org/scripts/436185/textarea%20jsfuck.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let input = await document.getElementById("input");
    let textarea = await document.createElement("textarea");
    textarea.id = "input";
    textarea.value = "alert(1);";
    await input.parentNode.replaceChild(textarea, input);
})();