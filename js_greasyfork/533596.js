// ==UserScript==
// @name         Life Percentage
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show's life percentage in fights
// @author       tophd7
// @match        https://www.torn.com/loader.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533596/Life%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/533596/Life%20Percentage.meta.js
// ==/UserScript==

(function(){
    let playerName = "null";
    function scrapeData(){
        if(window.location.href.startsWith("https://www.torn.com/loader.php?sid=attack&user2ID=")){
            while(playerName == "null"){
                let usernameLocations = document.querySelectorAll('[id^="playername_"]');
                let playersInFight = Array.from(usernameLocations);
                let enemyPlayer = playersInFight[1];
                playerName = enemyPlayer.innerHTML;
            }
            let usernameLocation = document.querySelector(`#playername_${playerName}`);
            let healthSpan = document.querySelectorAll('[id^="player-health-value"]');
            healthSpan = healthSpan[1];
            let healthText = healthSpan.textContent.trim();
            let [cur_life, max_life] = healthText.split(" / ").map(num => parseInt(num.replace(/,/g, ""), 10));
            usernameLocation.innerHTML = playerName.substring(0,5) + ": " + ((cur_life/max_life)*100).toFixed(2) + "%";
        }else{
            playerName = "null";
        }
    }
    setInterval(scrapeData, 100)
})();