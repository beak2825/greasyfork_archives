// ==UserScript==
// @name         Get Stuffed Revive Requests
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Adds a button to request a revive from Get Stuffed
// @author       Stig [2648238]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/489014/Get%20Stuffed%20Revive%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/489014/Get%20Stuffed%20Revive%20Requests.meta.js
// ==/UserScript==
'use strict';
 
const owner = "Get Stuffed";
const source = "Get Stuffed Script";
const buttonLabel = "Get Revived!";
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
 width="15" height="15" viewBox="0 0 20 20" id="svg3" >
  <path id="revive-icon" fill="none"
  class="revive-icon"
  d="M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z"/>
</svg>`;