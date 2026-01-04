// ==UserScript==
// @name         refrosh me
// @version      0.1
// @description  become as gods
// @author       hackaman
// @match        https://neopetsclassic.com/quests/
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/430821/refrosh%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/430821/refrosh%20me.meta.js
// ==/UserScript==

window.addEventListener('load', refrosh);

function refrosh() {
    var LookFor = "RF Now!"; // Change this to find a different string
    var content = document.body.textContent || document.body.innerText;
    var hasText = content.indexOf(LookFor) !== -1;
    var min = 60,
        max = 90;
    var rand = Math.floor(Math.random() * (max - min) + min);

    if(hasText) {
        console.log("Refreshing!");
        location.reload();
    } else {
        console.log('owo...waiting ' + rand + 's...');
    }
    setTimeout(refrosh, rand * 1000);
};

(function() {
    'use strict';

//first check
refrosh()

//refresh script 1000ms = 1 second
// setInterval(refrosh, 2000);

})();