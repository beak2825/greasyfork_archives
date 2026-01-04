// ==UserScript==
// @name         Torn: Hospital Time
// @author       Rescender [2526540]
// @match        https://www.torn.com/*.php*
// @run-at       document-end
// @description  Shows you a timer with hospital time left on item page
// @version      0.4.5
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/543667
// @downloadURL https://update.greasyfork.org/scripts/423134/Torn%3A%20Hospital%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/423134/Torn%3A%20Hospital%20Time.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

let settingSvg = `<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="14px" height="14px"><path d="M 9.6660156 2 L 9.1757812 4.5234375 C 8.3516137 4.8342536 7.5947862 5.2699307 6.9316406 5.8144531 L 4.5078125 4.9785156 L 2.171875 9.0214844 L 4.1132812 10.708984 C 4.0386488 11.16721 4 11.591845 4 12 C 4 12.408768 4.0398071 12.832626 4.1132812 13.291016 L 4.1132812 13.292969 L 2.171875 14.980469 L 4.5078125 19.021484 L 6.9296875 18.1875 C 7.5928951 18.732319 8.3514346 19.165567 9.1757812 19.476562 L 9.6660156 22 L 14.333984 22 L 14.824219 19.476562 C 15.648925 19.165543 16.404903 18.73057 17.068359 18.185547 L 19.492188 19.021484 L 21.826172 14.980469 L 19.886719 13.291016 C 19.961351 12.83279 20 12.408155 20 12 C 20 11.592457 19.96113 11.168374 19.886719 10.710938 L 19.886719 10.708984 L 21.828125 9.0195312 L 19.492188 4.9785156 L 17.070312 5.8125 C 16.407106 5.2676813 15.648565 4.8344327 14.824219 4.5234375 L 14.333984 2 L 9.6660156 2 z M 11.314453 4 L 12.685547 4 L 13.074219 6 L 14.117188 6.3945312 C 14.745852 6.63147 15.310672 6.9567546 15.800781 7.359375 L 16.664062 8.0664062 L 18.585938 7.40625 L 19.271484 8.5917969 L 17.736328 9.9277344 L 17.912109 11.027344 L 17.912109 11.029297 C 17.973258 11.404235 18 11.718768 18 12 C 18 12.281232 17.973259 12.595718 17.912109 12.970703 L 17.734375 14.070312 L 19.269531 15.40625 L 18.583984 16.59375 L 16.664062 15.931641 L 15.798828 16.640625 C 15.308719 17.043245 14.745852 17.36853 14.117188 17.605469 L 14.115234 17.605469 L 13.072266 18 L 12.683594 20 L 11.314453 20 L 10.925781 18 L 9.8828125 17.605469 C 9.2541467 17.36853 8.6893282 17.043245 8.1992188 16.640625 L 7.3359375 15.933594 L 5.4140625 16.59375 L 4.7285156 15.408203 L 6.265625 14.070312 L 6.0878906 12.974609 L 6.0878906 12.972656 C 6.0276183 12.596088 6 12.280673 6 12 C 6 11.718768 6.026742 11.404282 6.0878906 11.029297 L 6.265625 9.9296875 L 4.7285156 8.59375 L 5.4140625 7.40625 L 7.3359375 8.0683594 L 8.1992188 7.359375 C 8.6893282 6.9567546 9.2541467 6.6314701 9.8828125 6.3945312 L 10.925781 6 L 11.314453 4 z M 12 8 C 9.8034768 8 8 9.8034768 8 12 C 8 14.196523 9.8034768 16 12 16 C 14.196523 16 16 14.196523 16 12 C 16 9.8034768 14.196523 8 12 8 z M 12 10 C 13.111477 10 14 10.888523 14 12 C 14 13.111477 13.111477 14 12 14 C 10.888523 14 10 13.111477 10 12 C 10 10.888523 10.888523 10 12 10 z"/></svg>`;
let hospitalSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="plus_img" stroke="transparent" stroke-width="0" fill="#b3382c" width="13" height="13" viewBox="0 1 16 16"><polygon points="6 1 6 7 0 7 0 11 6 11 6 17 10 17 10 11 16 11 16 7 10 7 10 1 6 1"></polygon></svg>`;

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

function settingsPrompt() {
    var currVal = GM_getValue("med_effectiveness", 0);
    var enteredVal = prompt("Medical item effectiveness bonus % (0, 10 or 20)", currVal);
    GM_setValue("med_effectiveness", enteredVal ?? currVal);
}

function showCountdown(time) {
    if (!document.querySelector(".hospitalTime1")) {
        let node = document.createElement("div");
        let node2 = document.createElement("div");
        node.className = "hospitalTime1 t-clear m-icon";
        node2.className = "hospitalTime2 t-clear";
        document.querySelector("#skip-to-content").appendChild(node);
        document.querySelector('a[class*="life___"] [class^="bar-descr"]').replaceWith(node2);

        document.querySelector(".hospitalTime1").innerHTML = `<div class="wrapper">
               ${hospitalSvg}
               <div class="hospTime1">${msToTime(time)}</div>
               <span id="settings">${settingSvg}</span>
            </div>`;
        document.querySelector(".hospitalTime2").innerHTML = `<div class="wrapper">
               ${hospitalSvg}
               <div class="hospTime2">${msToTime(time)}</div>
            </div>`;
        var myspan = document.querySelector("#settings");
        if (myspan) {
            myspan.addEventListener("click", settingsPrompt, false);
        }
    } else {
        document.querySelector(".hospTime1").innerHTML = msToTime(time);
        document.querySelector(".hospTime2").innerHTML = msToTime(time);
    }
}

function removeAnimations() {
    const items = document.querySelectorAll('.animate-health');

    items.forEach(item => {
        item.classList.remove('animate-health')
    });
}

function showBestOption(time) {
    var eff = GM_getValue("med_effectiveness", 0);
    var effmult = 1 + eff/100;
    removeAnimations();
    switch(true) {
        case time < (1200000 * effmult) :
            document.querySelectorAll('[data-id="68"]')[0]?.classList.add('animate-health');
            var sfaks = document.querySelectorAll('li[data-rowkey="g68"]');
            document.querySelectorAll('[data-item="68"]')[0]?.classList.add('animate-health');
            document.querySelectorAll('[data-itemid="68"]')[0]?.closest('li').classList.add('animate-health');
            for (var i = 0; i < sfaks.length; i++) {
                sfaks[i].classList.add('animate-health');
            }
            break;
        case time < (2400000 * effmult):
            document.querySelectorAll('[data-id="67"]')[0]?.classList.add('animate-health');
            var faks = document.querySelectorAll('li[data-rowkey="g67"]');
            document.querySelectorAll('[data-item="67"]')[0]?.classList.add('animate-health');
            document.querySelectorAll('[data-itemid="67"]')[0]?.closest('li').classList.add('animate-health');
            for (var j = 0; j < faks.length; j++) {
                faks[j].classList.add('animate-health');
            }
            break;
        default:
            document.querySelectorAll('[data-id="66"]')[0]?.classList.add('animate-health');
            var morphs = document.querySelectorAll('li[data-rowkey="g66"]');
            document.querySelectorAll('[data-item="66"]')[0]?.classList.add('animate-health');
            document.querySelectorAll('[data-itemid="66"]')[0]?.closest('li').classList.add('animate-health');
            for (var k = 0; k < morphs.length; k++) {
                morphs[k].classList.add('animate-health');
            }
    }
}

function getSidebarData() {
    let key = Object.keys(sessionStorage).find(key => /sidebarData\d+/.test(key));
    let sidebarData = JSON.parse(sessionStorage.getItem(key))
    return sidebarData;
}

GM_addStyle(`
        .hospitalTime1, .hospitalTime2 { position: relative; font-size: initial; display: inline-block; }
        .hospitalTime1 .wrapper { border:2px solid #b3382c; padding: 0 4px; border-radius: 6px; }
        .hospitalTime2 .wrapper { font-size: 12px; right: -12px; position: relative; }
		.hospTime1, .hospTime2  { display: inline-block; }
        .plus_img { top: 1px; position: relative; margin-right: 2px; }
        .animate-health { animation: healthpulse 1s infinite; }
        #settings { top: 1px; position: relative; }
		@keyframes healthpulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(248, 5, 5, 0.85); }
	        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
	        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
		`);

(function() {
	'use strict';
    var currVal = GM_getValue("med_effectiveness", 0);
    var hospCountdown = setInterval(function() {
        const sidebarData = getSidebarData();
        //console.log("data", sidebarData)
        if (sidebarData.statusIcons.icons.hospital) {
            let millis = (sidebarData.statusIcons.icons.hospital.timerExpiresAt - Date.now() / 1000) * 1000
            showCountdown(millis);
            showBestOption(millis);
        } else {
            removeAnimations();
            let elems = document.querySelectorAll('[class^="hospitalTime"]')
            if (elems.length) {
                elems.forEach(e => e.remove());
                //document.querySelector('.hospitalTime1').remove();

                //let node = document.createElement("p");
                //node.className = "bar-descr___MSj1p";
                //document.querySelector('.hospitalTime2').replaceWith(node);
            }
        }
    }, 1000);
})();