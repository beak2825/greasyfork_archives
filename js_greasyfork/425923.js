// ==UserScript==
// @name        NPCs
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       GM.xmlHttpRequest
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2021, Faux (https://greasyfork.org/users/281093)
// @description 5/3/2021, 1:13:14 PM
// @downloadURL https://update.greasyfork.org/scripts/425923/NPCs.user.js
// @updateURL https://update.greasyfork.org/scripts/425923/NPCs.meta.js
// ==/UserScript==
/* jshint esversion: 8 */ 

const css = `
  .botLoader {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #4B4B4B; /* Blue */
    border-radius: 50%;
    width: 25px;
    height: 25px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .botButton {
    width: 65px !important;
    height: 38px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

addCSS(css);
addButtons();

const { apiUrl, secret } = JSON.parse(localStorage.getItem('fillerAPI'));

const localUrl = 'http://localhost:3000';

let currentUrl = localUrl;

function addCSS(style) {
	const stylesheet = document.createElement('style');
	stylesheet.type = 'text/css';
	stylesheet.innerText = style;
	document.head.appendChild(stylesheet);
}

function getRoomCode() {
  const regexp = /room\/(\w+)/;
  return document.querySelector('#roomInfoLink').value.match(regexp)[1];
}

function spotsToFill() {
  const [ currentPlayers, maxPlayers ] = document.querySelector("#roomInfoPlayerCount > b").textContent
    .match(/(\d+)\s?\/\s?(\d+)/).slice(1).map(i => parseInt(i));
  
  return Math.min(maxPlayers - currentPlayers, 10);
}

function addBots() {
  if (spotsToFill() <= 0) return;
  
  const btnLoader = document.querySelector('#botLoader');
  const startBtn = document.querySelector('#botFillButton');
  const stopBtn = document.querySelector('#stopBotButton');
  btnLoader.classList.add('botLoader');
  btnLoader.textContent = '';
    
  GM.xmlHttpRequest({
    method: 'GET',
    url: `${currentUrl}/bot?code=${getRoomCode()}&bots=${spotsToFill()}&secret=${secret}`,
    onload: (res) => {
      btnLoader.classList.remove('botLoader');
      btnLoader.textContent = 'FILL';
      // if (res.statusText === 'OK') {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'flex';
      // }
    },
    onerror: () => {
      btnLoader.classList.remove('botLoader');
      btnLoader.textContent = 'FILL';
    }
  });
}

function removeBots() {
  const startBtn = document.querySelector('#botFillButton');
  const stopBtn = document.querySelector('#stopBotButton');
  
    GM.xmlHttpRequest({
    method: 'GET',
    url: `${currentUrl}/stop?secret=${secret}`,
    onload: () => {
      startBtn.style.display = 'flex';
      stopBtn.style.display = 'none';
    }
  });
}

function addButtons() {
  const modal = document.querySelector("#roomInfoModal > div > div > div");
  const modalTitle = document.querySelector("#roomInfoModal > div > div > div > h3.modal-title");
  const fillButton = document.createElement('div');
  const loader = document.createElement('div');
  
  loader.id = 'botLoader';
  loader.textContent = 'FILL';
  fillButton.appendChild(loader);
  
  fillButton.classList.add('btn');
  fillButton.classList.add('btn-primary');
  fillButton.classList.add('botButton');
  fillButton.style.marginRight = '10px';
  fillButton.id = 'botFillButton';
  fillButton.setAttribute('data-toggle', 'tooltip');
  fillButton.setAttribute('data-placement', 'top');
  fillButton.setAttribute('data-original-title', `Left Click: Local<br>Right Click: Heroku`);
  
  const stopButton = document.createElement('button');
  
  stopButton.classList.add('btn');
  stopButton.classList.add('btn-danger');
  stopButton.classList.add('botButton');
  stopButton.textContent = 'KILL';
  stopButton.id = 'stopBotButton';
  stopButton.style.display = 'none';
  
  modal.insertBefore(fillButton, modalTitle);
  modal.insertBefore(stopButton, modalTitle);
  
  fillButton.onclick = () => {
    currentUrl = localUrl;
    addBots();
  };
  stopButton.onclick = removeBots;
  
  fillButton.oncontextmenu = (e) => {
    e.preventDefault();
    
    currentUrl = apiUrl;
    addBots();
  };
}