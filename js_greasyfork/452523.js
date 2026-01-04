// ==UserScript==
// @name         HeLa Revives
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  Adds a button to request a revive from HeLa
// @author       Lazerpent [2112641] & Stig [2648238]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/452523/HeLa%20Revives.user.js
// @updateURL https://update.greasyfork.org/scripts/452523/HeLa%20Revives.meta.js
// ==/UserScript==
'use strict';

const owner = "HeLa";
const source = "HeLa Script";
const API_URL = 'https://api.no1irishstig.co.uk/request';

setInterval(checkButton, 500);

GM_addStyle(`
  .hela-revive {
    margin: auto;
    display: table;
    cursor: pointer;
    border-radius: .5em;
    padding: .25em .5em;
    text-decoration: none;

    color: black;
    background: lightgreen;
    border: 1px solid black;
    box-shadow: inset 0px 1px 0px 0px white;
  }

  .hela-revive:hover {
    background: green;
  }

  .hela-desktop:hover {
    background: #3cb371;
  }

  .hela-revive[disabled='true'] {
      opacity: 0.5;
  }

  .hela-desktop {
    margin-bottom: 8px;
  }

  .hela-mobile {
    display: inline;
  }

  .hela-dark-mode {
    color: white;
    background: darkgreen;
    border: 1px solid white;
    box-shadow: inset 0px 1px 0px 0px black;
  }

  .hela-desktop:before {
    content: 'HeLa Quick ';
  }

  @media(min-width: 380px) {
    .hela-mobile:before {
      content: 'HeLa ';
    }
  }
`);

let btn;

function getButton(mobile) {
  btn = document.createElement('a');

  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-live', 'polite');

  btn.classList.add('hela-revive');
  btn.classList.add('hela-' + (mobile ? 'mobile' : 'desktop'));

  if (mobile || document.body.classList.contains('dark-mode')) {
    btn.classList.add('hela-dark-mode');
  }

  btn.id = 'hela-btn';
  btn.innerHTML = 'Revive';
  btn.href = '#hela-revive';
  btn.addEventListener('click', submitRequest);
  return btn;
}

function checkButton() {
  if(inCloudflareChallenge()) return;
  const {hospital, mobile} = getSessionData();
  const exists = document.getElementById('hela-btn');

  if (!hospital) {
    if (btn) {
      btn.remove();
    }
    return;
  }

  if (exists) {
    return;
  }

  const location = document.querySelector(mobile ? '.header-buttons-wrapper' : '.life___PlnzK');
  if (location != null) {
    location.children[0].insertAdjacentElement('beforebegin', getButton(mobile));
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
    alert(`Request has been sent to ${owner}. Please pay your reviver 2 Xanax or $1.8m. Thank you!`);
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
    mobile: data.windowSize === 'mobile',
    hospital: data.statusIcons?.icons?.hospital,
  };
}

function inCloudflareChallenge() {
  return document.getElementsByClassName('iAmUnderAttack').length;
}

GM_registerMenuCommand(`Request revive from ${owner}`, () => submitRequest());