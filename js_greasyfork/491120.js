// ==UserScript==
// @name         Stats Vanis
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stats script
// @author       qwd
// @match        https://vanis.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vanis.io
// @grant        none
// @license      qwd
// @downloadURL https://update.greasyfork.org/scripts/491120/Stats%20Vanis.user.js
// @updateURL https://update.greasyfork.org/scripts/491120/Stats%20Vanis.meta.js
// ==/UserScript==

function info() {
    var body = document.getElementById("app");
    var infobox = document.createElement("div");
    infobox.style.border="2px solid white"; infobox.style.borderRadius="7px"; infobox.style.width="200px"; infobox.style.height="auto"; infobox.style.position="absolute";
    infobox.style.marginTop="120px"; infobox.style.padding="10px";
    infobox.innerHTML = `
    <div id="level">Level: 1</div>
    <div id="xp">XP: </div>
    <div id="xpGained">Gained XP: 120</div>
    `;
    body.appendChild(infobox);
    var xpDivOld = document.querySelector('.xp-data');
    var xpValueOld = xpDivOld.querySelector('div:nth-child(2)');
    var xpOld = xpValueOld.textContent.trim();
    var killCount = 0 ;

    function update() {
        // Get XP
        var xpDiv = document.querySelector('.xp-data');
        var xpValue = xpDiv.querySelector('div:nth-child(2)');
        var xp = xpValue.textContent.trim();
        document.getElementById("xp").innerHTML = "XP: " + xp;
        // Get Lvl
        var lvlValue = xpDiv.querySelector('div:nth-child(1)');
        var lvl = lvlValue.textContent;
        document.getElementById("level").innerHTML = lvl;
        // Gained XP
        var xpGained = xp - xpOld;
        document.getElementById("xpGained").innerHTML = "Gained XP: "+ xpGained;
        // fps
        var hudElement = document.getElementById('hud');
        var fpsDiv = hudElement.querySelector('div[data-v-0b74fc8f] div:nth-child(1)');
        var fpsValue = fpsDiv.textContent.trim().split(':')[1].trim();
        var fpsInt = parseInt(fpsValue);
        if (fpsInt >= 60) {
            fpsDiv.style.color="lime";
        } else if (fpsInt <= 30) {
            fpsDiv.style.color="orange";
        } else {
            fpsDiv.style.color="red";
        }
        var pingDiv = hudElement.querySelector('div[data-v-0b74fc8f] div:nth-child(2)');
        var pingValue = pingDiv.textContent.trim().split(':')[1].trim();
        var pingInt = parseInt(pingValue);
        if (pingInt <= 20) {
            pingDiv.style.color="lime";
        }
        else if (pingInt <= 50) {
            pingDiv.style.color="orange";
        }
        else {
            pingDiv.style.color="red";
        }
    } setInterval(update, 1000);

}
setTimeout(info, 1500);