// ==UserScript==
// @name         Shadow Healers Revive Requests
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to request a revive from the Shadow Healers
// @author       Stig [2648238]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/452524/Shadow%20Healers%20Revive%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/452524/Shadow%20Healers%20Revive%20Requests.meta.js
// ==/UserScript==
'use strict';
 
const owner = "Shadow Healers";
const source = "Shadow Healers Script 1.1";
const buttonLabel = "SH Revive Me!";
const colour = "#33B3F8";
const API_URL = 'https://api.no1irishstig.co.uk/request';

setInterval(checkButton, 500);
GM_addStyle(`
    .revive-text {
      color: ${colour};
    }
 
    .revive-icon {
      fill: ${colour} !important;
    }
 
`);
 
let btn;
 
function getButton() {
  btn = document.createElement('a');
 
  if (document.body.classList.contains('dark-mode')) {
    btn.classList.add('custom-dark-mode');
  }
 
  btn.id = 'custom-btn';
  btn.className = "custom-revive t-clear h c-pointer  m-icon line-h24 right last"
  btn.innerHTML = `
    <span class="icon-wrap svg-icon-wrap">
      <span class="link-icon-svg">
        ${icon}
      </span>
    </span>
    <span class="revive-text">${buttonLabel}</span>
  `;
  btn.href = '#custom-revive';
  btn.addEventListener('click', submitRequest);
  btn.addEventListener("mouseenter", () => {
   document.getElementsByClassName("revive-text")[0].style.color = colour;
   document.getElementsByClassName("revive-icon")[0].setAttribute("style", `fill: ${colour} !important`);
 
  });
 
  btn.addEventListener("mouseleave", () => {
    document.getElementsByClassName("revive-text")[0].style.color = null;
    document.getElementsByClassName("revive-icon")[0].removeAttribute("style");
  });
  return btn;
}
 
function checkButton() {
  if(inCloudflareChallenge()) return;
 
  const {hospital} = getSessionData();
  const exists = document.getElementById('custom-btn');
 
  if (!hospital) {
    if (btn) {
      btn.remove();
    }
    return;
  }
 
  if (exists) {
    return;
  }
 
  const location = document.getElementById("top-page-links-list");
  if (location != null) {
    const issues = document.getElementsByClassName("tt-revive");
    if (issues.length !== 0) {
      issues[0].remove();
    }
    location.children[location.children.length - 1].insertAdjacentElement('afterend', getButton());
  }
}
 
function handleResponse(response) {
  if (response?.status && response.status !== 200) {
    var responseText = response.responseText.replace(/^"|"$/g, '');
    alert(`Error Code: ${response.status}\nMessage: ${responseText}` || `An unknown error has occurred - Please report this to ${owner} leadership.`);
    return;
  }
 
  let contract = false;
  try {
    contract = !!JSON.parse(response.responseText).contract;
  } catch (e) {
  }
 
  if (contract) {
    alert(`Contract request has been sent to ${owner}. Thank you!`)
  } else {
    alert(`Request has been sent to ${owner}. Please pay your reviver a Xanax or $1m. Thank you!`);
  }
}
 
function submitRequest(e) {
  e?.preventDefault();
 
  const sessionData = getSessionData();
  if (!sessionData.hospital) {
    alert('You are not in the hospital.');
    return;
  }
 
  btn.setAttribute('disabled', true);
  btn.setAttribute('aria-pressed', true);
 
  GM.xmlHttpRequest({
    method: 'POST',
    url: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      'tornid': parseInt(sessionData.userID),
      'username': '' + sessionData.userName,
      "vendor": owner,
      'source': `${source} ${GM_info.script.version}`,
      'type': 'revive'
    }),
    onload: handleResponse,
  });
}
 
function getSessionData() {
  const sidebar = Object.keys(sessionStorage).find((k) => /sidebarData\d+/.test(k));
  const data = JSON.parse(sessionStorage.getItem(sidebar));
  return {
    userID: data.user.userID,
    userName: data.user.name,
    hospital: data.statusIcons?.icons?.hospital,
  };
}
 
function inCloudflareChallenge() {
    return document.getElementsByClassName('iAmUnderAttack').length;
}
 
GM_registerMenuCommand(`Request revive from ${owner}`, () => submitRequest());
 
const icon = `
<svg xmlns="http://www.w3.org/2000/svg"
 width="15" height="15" viewBox="0 0 1320 1316" id="svg3" >
  <path id="revive-icon" fill="none" stroke="black" stroke-width="1" 
  class="shadow-revive-icon"
  d="M 432.02,145.24 C 
  466.45,71.95 572.58,34.49 648.67,34.94
  659.29,35.01 669.95,34.54 679.46,40.11
  710.72,58.44 720.27,123.76 719.52,157.05
  719.52,157.05 715.64,200.38 715.64,200.38
  715.64,200.38 762.91,196.46 762.91,196.46
  801.12,196.01 839.73,196.45 877.14,205.25
  906.59,212.18 934.34,223.43 949.14,251.60
  963.96,279.78 950.59,311.19 951.35,326.44
  952.14,342.29 963.68,359.90 963.69,389.46
  963.71,438.76 944.60,467.30 931.93,511.58
  924.02,539.22 916.67,564.57 955.93,558.85
  955.93,558.85 940.17,574.60 940.17,574.60
  950.17,587.09 956.50,592.53 971.68,598.42
  981.48,602.23 997.47,603.82 1004.06,612.06
  1018.46,630.07 988.12,650.49 988.26,677.02
  988.35,693.67 999.71,703.86 996.38,715.99
  993.53,726.39 984.48,729.04 975.62,732.17
  983.60,777.63 967.34,759.35 955.35,787.48
  951.08,797.49 952.06,811.89 951.98,822.77
  951.72,859.53 932.71,872.25 896.84,873.82
  835.34,876.52 729.87,809.93 703.53,905.49
  700.34,917.07 699.57,928.98 700.04,940.94
  704.42,1052.86 803.93,1136.05 885.02,1199.26
  912.00,1220.29 959.59,1261.71 995.32,1257.84
  1012.49,1255.98 1037.41,1246.04 1043.45,1228.35
  1049.33,1211.15 1034.05,1186.67 1015.42,1192.44
  1005.66,1195.46 999.36,1206.20 1002.58,1216.13
  1005.88,1226.27 1026.34,1234.90 1024.86,1216.19
  1024.86,1216.19 1018.95,1204.87 1018.95,1204.87
  1028.11,1210.04 1036.23,1215.62 1032.13,1228.00
  1024.59,1250.72 983.36,1243.95 980.30,1212.74
  976.67,1175.70 1021.26,1153.36 1049.73,1175.91
  1075.38,1196.22 1075.47,1236.27 1049.73,1256.41
  1024.99,1275.77 986.31,1279.66 955.93,1279.71
  955.93,1279.71 888.96,1279.71 888.96,1279.71
  836.00,1279.63 743.19,1255.99 692.00,1238.92
  599.80,1208.19 578.88,1179.62 467.47,1161.22
  431.10,1155.21 384.86,1160.05 349.30,1170.04
  333.81,1174.39 311.25,1184.24 317.17,1204.70
  322.34,1222.53 352.29,1233.91 360.51,1212.29
  364.78,1201.05 354.80,1191.44 346.52,1194.37
  339.02,1197.03 339.54,1200.43 338.46,1206.84
  338.46,1206.84 349.30,1216.68 349.30,1216.68
  301.24,1208.43 344.74,1156.49 370.57,1190.00
  374.01,1194.46 375.63,1199.31 376.09,1204.88
  376.61,1211.29 374.98,1218.30 371.69,1223.83
  359.06,1245.12 323.32,1245.24 307.66,1227.61
  294.83,1213.17 296.58,1189.65 304.73,1173.35
  320.03,1142.75 376.00,1101.58 402.02,1075.19
  447.86,1028.70 488.29,963.61 498.40,897.61
  498.40,897.61 498.40,850.34 498.40,850.34
  409.82,842.84 349.15,745.11 331.27,665.20
  331.27,665.20 322.07,610.05 322.07,610.05
  321.39,600.11 322.70,583.38 319.37,574.76
  310.65,552.23 289.11,557.34 267.94,519.45
  245.39,479.09 258.52,451.67 257.01,432.79
  255.69,416.40 243.80,404.76 243.00,369.77
  241.90,322.04 261.18,274.33 294.83,240.18
  294.83,240.18 327.66,214.07 327.66,214.07
  327.66,214.07 350.59,180.75 350.59,180.75
  370.41,157.34 401.17,142.28 432.02,145.24 Z"/>
</svg>`;