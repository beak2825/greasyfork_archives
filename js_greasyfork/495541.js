// ==UserScript==
// @name         Haxball Avatar Auto Change
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically change avatar every second in Haxball
// @author       Your Name
// @match        https://www.haxball.com/play
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/495541/Haxball%20Avatar%20Auto%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/495541/Haxball%20Avatar%20Auto%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of emojis to use as avatars
    const avatars = ['👊🏿', '😝', '🖕🏿', '😢', '🍆', '😍', '💩', '😎', '🤡', '🥳', '👋🏿', '🤬', '❄️', '🤣', '👶🏻', '🤫', '👄', '😴'];
    let currentIndex = 0; // Index to track the current avatar

    // Function to change the avatar
    const changeAvatar = function(key) {
        let inputHax = document.querySelector('.input input');
        let buttonHax = document.querySelector('.input button');
        inputHax.value = '/avatar ' + key;
        buttonHax.click();
        removeAvatarSet();
    };

    // Function to remove the "Avatar set" notice
    const removeAvatarSet = function() {
        let noticeList = document.querySelectorAll('div.log p.notice');
        for (let i = 0; i < noticeList.length; i++) {
            if (noticeList[i].innerText === 'Avatar set') {
                noticeList[i].parentNode.removeChild(noticeList[i]);
            }
        }
    };

    // Function to cycle through avatars
    const cycleAvatars = function() {
        changeAvatar(avatars[currentIndex]);
        currentIndex = (currentIndex + 1) % avatars.length;
    };

    // Set an interval to change the avatar every second
    setInterval(cycleAvatars, 1000);

})();
