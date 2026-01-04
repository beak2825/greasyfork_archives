// ==UserScript==
// @name         Game Start Notifier
// @namespace    http://tampermonkey.net/
// @version      2023-12-22
// @description  plays a badass alarm when a new turn starts
// @author       JK_3
// @match        https://www.warzone.com/MultiPlayer?GameID=*
// @match        https://www.warzone.com/multiPlayer?GameID=*
// @match        http://www.warzone.com/MultiPlayer?GameID=*
// @match        http://www.warzone.com/multiPlayer?GameID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=warzone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482906/Game%20Start%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/482906/Game%20Start%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const alarmSound = new Audio("https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3")
    var alreadyPlayed = false

    function playSound() {
        if (alreadyPlayed) return
        console.log("Turn started!")
        alarmSound.play()
    }

    function checkTabTitle() {
        if (document.title.includes("*")) {
            playSound()
            alreadyPlayed = true;
        } else {
            alreadyPlayed = false;
        }
    }

    var id = window.setInterval(checkTabTitle, 1000)

    window.onclose = () => {window.clearInterval(id)}
})();