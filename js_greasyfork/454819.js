// ==UserScript==
// @name         TBD: TorrentBD Ratio Guard
// @namespace    https://naeembolchhi.github.io/
// @version      0.10
// @description  Warns you if you're trying to download a torrent that will push your ratio into the danger zone.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,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
// @match        https://*.torrentbd.com/torrents-details.php?id=*
// @match        https://*.torrentbd.net/torrents-details.php?id=*
// @match        https://*.torrentbd.org/torrents-details.php?id=*
// @match        https://*.torrentbd.me/torrents-details.php?id=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454819/TBD%3A%20TorrentBD%20Ratio%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/454819/TBD%3A%20TorrentBD%20Ratio%20Guard.meta.js
// ==/UserScript==

// Update Material Icons Font
try {document.querySelector("link[href*='material-icons.css']").href = "https://fonts.googleapis.com/icon?family=Material+Icons";} catch(e) {}

// Global reusable flags
let infinite, freeleech;

// Upload value, download value, ratio value.
const coreValue = document.querySelectorAll(".card-content .profile-info-table tbody tr"),
      coreUpload = coreValue[0].children[1].innerText.replace(": ","").replace(",","").replace(" ",""),
      coreDownload = coreValue[1].children[1].innerText.replace(": ","").replace(",","").replace(" ",""),
      coreRatio = coreValue[2].children[1].innerText.replace(": ","").replace(",","").replace(" ",""),
      torrentSize = document.querySelectorAll(".torrent-info tbody tr")[0].children[1].innerText.replace(",","").replace(" ","");

if (coreDownload.match(/inf/i)) {
    infinite = true;
}

if (document.querySelectorAll(".torrent-info tbody tr")[0].querySelector("img[src*='free']")) {
    freeleech = true;
}

// Units and conversion values
const unitCalc = [
    {"unit": "YiB", "math": "80"},
    {"unit": "ZiB", "math": "70"},
    {"unit": "EiB", "math": "60"},
    {"unit": "PiB", "math": "50"},
    {"unit": "TiB", "math": "40"},
    {"unit": "GiB", "math": "30"},
    {"unit": "MiB", "math": "20"},
    {"unit": "KiB", "math": "10"},
    {"unit": "B", "math": "0"}
];

function byteGet(value) {
    for (let x = 0; x < unitCalc.length; x++) {
        if (value.match(unitCalc[x].unit)) {
            let multiplicand = parseFloat(value.replace(unitCalc[x].unit,"")),
                multiplier = Math.pow(2,parseInt(unitCalc[x].math)),
                product = multiplicand*multiplier;
            return product;
        }
    }
}

// Calculate future ratio after downloading the viewing torrent
function futureRatio() {
    let realize;
    if (infinite === true) {
        realize = byteGet(coreUpload)/byteGet(torrentSize);
    } else {
        realize = byteGet(coreUpload)/(byteGet(coreDownload)+byteGet(torrentSize));
    }
    return realize.toFixed(2);
}

// Guard info for various ratio levels
const ratioState = [
    {"state": "1.0", "icon": "gpp_good", "text": "Safe", "color": "#4caf50"},
    {"state": "0.9", "icon": "notification_important", "text": "Risky", "color": "#63b04e"},
    {"state": "0.8", "icon": "notification_important", "text": "Risky", "color": "#97b246"},
    {"state": "0.7", "icon": "warning", "text": "Dangerous", "color": "#cab33a"},
    {"state": "0.6", "icon": "warning", "text": "Dangerous", "color": "#f3ad2b"},
    {"state": "0.5", "icon": "file_download_off", "text": "Critical", "color": "#ff9f25"},
    {"state": "0.4", "icon": "file_download_off", "text": "Critical", "color": "#ff862b"},
    {"state": "0.3", "icon": "do_not_disturb_on", "text": "Fatal", "color": "#ff6931"},
    {"state": "0.2", "icon": "do_not_disturb_on", "text": "Fatal", "color": "#f64d35"},
    {"state": "0.1", "icon": "gpp_maybe", "text": "Deadly", "color": "#f44336"}
];

// Ratio Guard Button
let guardIcon = "sync_problem",
    guardText = "Sync Error",
    guardColor = "#400307",
    guardRatio = "???";

(function() {
    let ratio = parseFloat(futureRatio());
    guardRatio = futureRatio();
    for (let x = 0; x < ratioState.length; x++) {
        if (ratio <= parseFloat(ratioState[x].state)) {
            guardIcon = ratioState[x].icon;
            guardText = ratioState[x].text;
            guardColor = ratioState[x].color;
        }
    }
    if (ratio > parseFloat(ratioState[0].state)) {
        guardIcon = ratioState[0].icon;
        guardText = ratioState[0].text;
        guardColor = ratioState[0].color;
    }
    if (freeleech) {
        guardIcon = ratioState[0].icon;
        guardText = ratioState[0].text;
        guardColor = ratioState[0].color;
        guardRatio = "No Change";
    }
})();

// Content of Guard Button
const guardInfo = `
<style>
  #guard-btn {
    color: ${guardColor};
    border-color: ${guardColor};
    background: transparent;
  }
  #guard-btn:hover, #guard-btn:active {
    color: whitesmoke;
    background: ${guardColor};
  }
  #guard-btn span.hide-guard {
    display: none;
  }
</style>
<a id="guard-btn" class="btn waves-effect inline tgaction" onclick="swapGuard()">
  <i class="material-icons left">${guardIcon}</i>
  <span>${guardText}</span>
  <span class="hide-guard">${guardRatio}</span>
</a>
`;
const guardJS = `
function swapGuard() {
  let spanGuard = document.querySelectorAll("#guard-btn span");
  if (spanGuard[0].className.match(/hide/)) {
    spanGuard[0].classList.remove("hide-guard");
    spanGuard[1].classList.add("hide-guard");
  } else {
    spanGuard[1].classList.remove("hide-guard");
    spanGuard[0].classList.add("hide-guard");
  }
}
`;

// Button Wrapper Elements
const downBtn = document.getElementById("dl-btn"),
      downWrp = downBtn.parentNode,
      downDiv = downWrp.parentNode;

// Function for adding Guard Button
function addGuard(info, js) {
    let guard, script;
    guard = document.createElement("div");
    guard.classList.add("torrtopbtn-wrapper");
    guard.innerHTML = info;
    downDiv.insertBefore(guard, downWrp);
    downDiv.innerHTML = downDiv.innerHTML.replace(/>\s+</g,'><');
    script = document.createElement("script");
    script.setAttribute("type","text/javascript");
    script.innerHTML = js;
    downDiv.appendChild(script);
}

// Appending Guard Button
addGuard(guardInfo, guardJS);