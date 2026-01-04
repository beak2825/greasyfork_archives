// ==UserScript==
// @name         QnK Assist Request
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds options to request an assist on the attack page
// @author       Misakishi [1968437]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/475970/QnK%20Assist%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/475970/QnK%20Assist%20Request.meta.js
// ==/UserScript==
'use strict';

{
  const name = 'The Quidnunks HQ';

  GM_addStyle(`
    .assist-request-top {
      justify-content: center !important;
      gap: 5px;
      flex-wrap: wrap;
      padding: 0 5px;
    }

    .assist-request-button {
      width: unset !important;
      margin: 5px 0;
      cursor: pointer;
    }

    .arb-default:hover {
      background: #AAAAAA !important;
    }

    :root .dark-mode .arb-default:hover {
      background: #666666 !important;
    }

    .arb-green {
      background: linear-gradient(180deg,#f8f2eb,#d2e8bc) !important;
      cursor: not-allowed !important;
    }

    :root .dark-mode .arb-green {
      background: linear-gradient(180deg,#7e9160,#363636) !important;
    }

    .arb-red {
      background: linear-gradient(180deg, #f8ebeb, #e8b3b3) !important;
      cursor: not-allowed !important;
    }

    :root .dark-mode .arb-red {
      background: linear-gradient(180deg, #8e4343, #363636) !important;
    }
  `);

  let interval;

  window.addEventListener('load', function () {
    render();
    interval = setInterval(render, 3000);
  }, false);

  document.addEventListener('visibilitychange', render);

  let bar = null;

  const buttonList = [
    {name: 'Smoke', value: 'smoke'},
    {name: 'Tear', value: 'tear'},
    {name: 'Squad 3', value: '0b-1b'},
    {name: 'Squad 2', value: '3b-5b'},
    {name: 'Squad 1', value: '10b+'},
  ];

  function render() {
    bar = document.getElementById('assist-request');
    if (bar != null) {
      clearInterval(interval);
      return;
    }

    const header = document.getElementById('react-root');
    const element = document.createElement('div');
    element.className = 'msg-info-wrap'
    header.parentNode.insertBefore(element, header);
    let buttons = '';
    for (const b of buttonList) {
      buttons += `
      <div class='assist-request-button arb-default msg border-round' tabindex='0' data-assist-type='${b.value}' >
            ${b.name}
      </div>
      `;
    }
    element.innerHTML = `
      <div id='assist-request' class='info-msg-cont border-round m-top10 assist-request-top'>
        <div class='info-msg border-round assist-request-top'>
          ${buttons}
        </div>
      </div>
      <hr class='page-head-delimiter m-top10 m-bottom10 '>
    `;
    bar = document.getElementById('assist-request');
    const buttonSet = document.getElementsByClassName('assist-request-button');
    for (let i = 0; i < buttonSet.length; i++) {
      buttonSet[i].addEventListener('click', request.bind(buttonSet[i]));
    }
  }

  const requested = [];

  function request() {
    const value = this.getAttribute('data-assist-type');
    if (requested.indexOf(value) !== -1) {
      return;
    }
    requested.push(value);

    const avatarImage = document.getElementsByClassName('mini-avatar-image')[0].getAttribute('src').split('-');
    const backToProfile = document.querySelector('a[aria-labelledby="back-to-profile"]');
    const attackerHeader = document.getElementById('attacker');
    const defenderHeader = document.getElementById('defender');

    GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://api.no1irishstig.co.uk/request',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        'vendor': `${name} Script ${GM_info.script.version}`,
        'tornid': avatarImage[avatarImage.length - 1].split(/\./)[0],
        'username': attackerHeader.querySelector('span[id^="playername_"]').textContent,
        'targetid': backToProfile.getAttribute('href').split('=')[1],
        'targetname': defenderHeader.querySelector('span[id^="playername_"]').textContent,
        'source': name + ' Script',
        'type': value,
      }),
      onload: handleResponse.bind(this),
    });
  }

  function handleResponse(response) {
    const errors = {
      401: 'Request denied - Please contact leadership.',
      429: 'You have already submitted a request.',
      499: 'Outdated Script - Please update.',
      500: 'An unknown error has occurred - Please report this to leadership.',
    };

    if (response?.status && response.status !== 200) {
      console.log(response);
      this.classList.replace('arb-default', 'arb-red');
      setTimeout(() => alert(errors[response.status] || errors[500]), 20);
      return;
    }
    this.classList.replace('arb-default', 'arb-green');
  }
}