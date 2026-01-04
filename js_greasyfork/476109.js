// ==UserScript==
// @name         Stigs Torn Scripts
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Adds options to request an assist on the attack page
// @author       Stig [2648238]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.no1irishstig.co.uk
// @downloadURL https://update.greasyfork.org/scripts/476109/Stigs%20Torn%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/476109/Stigs%20Torn%20Scripts.meta.js
// ==/UserScript==
'use strict';

GM_registerMenuCommand('Select Assist Location', () => addLocID());

const source = 'Stigs Script';

function getCustomButtons() {
    GM.xmlHttpRequest({
        method: 'GET',
        url: `https:/api.no1irishstig.co.uk/abtns?locID=${localStorage['assistLocID']}`,
        headers: {
            'Content-Type': 'application/json',
        },
        onload: function(response) {
            handleResponse(response, 'button');
        }
    });
}

var buttonList = [];
function handleResponse(response, actionType) {
    if (response?.status && response.status !== 200) {
        var responseText = response.responseText.replace(/^"|"$/g, '');
        if (actionType === 'button') {
            alert(`Error Code: ${response.status}\nMessage: ${responseText}` || `An unknown error has occurred - Please report this to ${owner} leadership.`);
        } else {
            this.classList.replace('arb-default', 'arb-red');
            setTimeout(() => alert(`Error Code: ${response.status}\nMessage: ${responseText}` || `An unknown error has occurred - Please report this to the Developer.`), 20);
        }
        return;
    }

    if (actionType === 'button') {
        let json = JSON.parse(response.responseText);
        for (const [key, value] of Object.entries(json)) {
            buttonList.push({name: key, value: value});
        }
    } else {
        this.classList.replace('arb-default', 'arb-green');
    }
}

if (localStorage['assistLocID'] !== undefined) {
    getCustomButtons();
}

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
let bar = null;

window.addEventListener('load', function () {
    render();
    interval = setInterval(render, 100);
}, false);

document.addEventListener('visibilitychange', render);


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

    if (localStorage['assistLocID'] === undefined) {
        element.innerHTML = `
      <div id='assist-request' class='info-msg-cont border-round m-top10 assist-request-top'>
        <div class='info-msg border-round assist-request-top'>
          <a class='assist-request-button arb-default msg border-round' tabindex='0' href='#' id='setup_location'>
            Set Assist Location
           </a>
        </div>
      </div>
      <hr class='page-head-delimiter m-top10 m-bottom10 '>
    `;
        document.getElementById("setup_location").addEventListener("click", addLocID);
        return;
    }

    if (buttonList.length === 0) {
        return;
    }

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


async function request() {
    const mode = this.getAttribute('data-assist-type');
    const res = await fetch(`https://www.torn.com/loader.php?sid=attackData&mode=json&step=poll&user2ID=${window.location.href.match(/user2ID=(\d+)/)[1]}&rfcv=${document.cookie.split("; ").map(c=>c.split("=")).find(([k])=>k==="rfc_v")?.[1]}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
    const obj = await res.json();

    if (obj.DB.hasOwnProperty('error')) {
        setTimeout(() => alert(obj.DB.error), 20);
        return;
    }

    GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://api.no1irishstig.co.uk/request',
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            'tornid': obj.DB.attackerUser.userID,
            'username': obj.DB.attackerUser.playername,
            'targetid': obj.DB.defenderUser.userID,
            'targetname': obj.DB.defenderUser.playername,
            'vendor': `${source} ${GM_info.script.version}`,
            'source': source,
            'type': 'Assist',
            'mode': mode,
            'locid': localStorage['assistLocID'],
        }),
        onload: function(response) {
            handleResponse.call(this, response, 'status');
        }.bind(this)
    });
}

function addLocID() {
  const locID = prompt("Please provide a Location, this should be provided by your Faction");

  if (locID) {
    localStorage.setItem('assistLocID', locID);
    location.reload();
  }
}