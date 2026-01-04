// ==UserScript==
// @name         Torn booster cooldown
// @author       Raichuq
// @description  自用
// @match        https://www.torn.com/crimes.php*
// @run-at       document-start
// @version      0.11
// @namespace https://greasyfork.org/users/237923
// @downloadURL https://update.greasyfork.org/scripts/430274/Torn%20booster%20cooldown.user.js
// @updateURL https://update.greasyfork.org/scripts/430274/Torn%20booster%20cooldown.meta.js
// ==/UserScript==
/* jshint esversion: 6 */



function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    secondsI = Math.floor((duration / 1000) % 60),
    minutesI = Math.floor((duration / (1000 * 60)) % 60),
    hoursI = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 365);

  var hours = (hoursI < 10) ? "0" + hoursI : hoursI;
  var minutes = (minutesI < 10) ? "0" + minutesI : minutesI;
  var seconds = (secondsI < 10) ? "0" + secondsI : secondsI;

  return (days > 0 ? (days + ":") : "") +
      (hoursI > 0 || days > 0 ? (hours + ":") : "") +
      minutes + ":" + seconds;
}

function showCountdown(time) {
    if (!document.querySelector(".boosterCooldown")) {
        let node = document.createElement("div");
        node.className = "boosterCooldown t-clear m-icon line-h24 left last";
        document.querySelector("#top-page-links-list").appendChild(node);
        document.querySelector(".boosterCooldown").innerHTML = `
           -Booster
           <div style="display: inline-block;" class="boosterTime">${msToTime(time)}</div>
        </div>`;
    } else {
        document.querySelector(".boosterTime").innerHTML = msToTime(time);
    }
}


function getSidebarData() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    let sidebarData = JSON.parse(sessionStorage.getItem(key))
    return sidebarData;
}




(function() {
	'use strict';

    var hospCountdown = setInterval(function(){
        const sidebarData = getSidebarData();
        if (sidebarData.statusIcons.icons.booster_cooldown) {
            let millis = (sidebarData.statusIcons.icons.booster_cooldown.timerExpiresAt - Date.now() / 1000) * 1000
            showCountdown(millis);
            showBestOption(millis);
        } else {
            if (document.querySelector(".boosterCooldown")) {
                document.querySelector(".boosterCooldown").remove();
            }
        }
    }, 1000);
})();
