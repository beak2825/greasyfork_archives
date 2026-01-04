// ==UserScript==
// @name         Torn drug cooldown
// @author       RaichuQ
// @description:zh-cn
// @description  自用！根据论坛Rescender大佬的Torn: Hospital Time修改而成，在道具和锻炼页面显示Drug冷却时间。已知问题：无法自动更新。
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/gym.php
// @run-at       document-start
// @version      0.11
// @namespace https://greasyfork.org/users/237923
// @downloadURL https://update.greasyfork.org/scripts/430273/Torn%20drug%20cooldown.user.js
// @updateURL https://update.greasyfork.org/scripts/430273/Torn%20drug%20cooldown.meta.js
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
    if (!document.querySelector(".drugCooldown")) {
        let node = document.createElement("div");
        node.className = "drugCooldown t-clear m-icon line-h24 left first";
        document.querySelector("#top-page-links-list").appendChild(node);
        document.querySelector(".drugCooldown").innerHTML = `
           -Drug
           <div style="display: inline-block;" class="drugTime">${msToTime(time)}</div>
        </div>`;
    } else {
        document.querySelector(".drugTime").innerHTML = msToTime(time);
    }
}


function getSidebarData() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    let sidebarData = JSON.parse(sessionStorage.getItem(key))
    return sidebarData;
}




(function() {
	'use strict';

    var drugCountdown = setInterval(function(){
        const sidebarData = getSidebarData();
        if (sidebarData.statusIcons.icons.drug_cooldown) {
            let millis = (sidebarData.statusIcons.icons.drug_cooldown.timerExpiresAt - Date.now() / 1000) * 1000
            showCountdown(millis);
            showBestOption(millis);
        } else {
            if (document.querySelector(".drugCooldown")) {
                document.querySelector(".drugCooldown").remove();
            }
        }
    }, 1000);
})();
