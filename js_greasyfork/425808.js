// ==UserScript==
// @name         DiepBot
// @namespace    -
// @version      0.1
// @description  skfskjdfsdfk
// @author       You
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425808/DiepBot.user.js
// @updateURL https://update.greasyfork.org/scripts/425808/DiepBot.meta.js
// ==/UserScript==

    function keyPress(key, upDown) {
        var eventObj;
        if (upDown == true) {
            eventObj = document.createEvent("Events");
            eventObj.initEvent("keydown", true, true);
            eventObj.keyCode = key;
            window.dispatchEvent(eventObj);
        }
        if(upDown == false) {
            eventObj = document.createEvent("Events");
            eventObj.initEvent("keyup", true, true);
            eventObj.keyCode = key;
            window.dispatchEvent(eventObj);
        }
    }

let keyCodes = [87, 65, 83, 68]

setInterval(() => {
    keyPress(keyCodes[Math.floor(Math.random() * keyCodes.length)], true)
}, 100)
setInterval(() => {
    keyPress(keyCodes[Math.floor(Math.random() * keyCodes.length)], false)
}, 100)
