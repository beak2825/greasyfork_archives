// ==UserScript==
// @name        Reveal Lobbies Players
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       GM.xmlHttpRequest
// @connect     sklobbies.herokuapp.com
// @version     1.0
// @author      Bell
// @license     MIT
// @copyright   2021, Faux (https://greasyfork.org/users/281093)
// @description Right click on the Lobbies tab to send a bot on a little journi to gather information about lobbies' players.
// @downloadURL https://update.greasyfork.org/scripts/426534/Reveal%20Lobbies%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/426534/Reveal%20Lobbies%20Players.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const lobbyAnchor = document.querySelector("#menu > div.menuNav > ul > li:nth-child(2) > a");
const localUrl = 'https://sklobbies.herokuapp.com';
const lobbiesTable = document.querySelector("#menuLobbiesTable");
const tooltip = createTooltip();

(function init() {
  lobbyAnchor.addEventListener('contextmenu', (e) => {
    lobbyAnchor.style.background = '#3b84d65e';
    e.preventDefault();
    document.querySelector("#menuLobbiesRefresh").click();
    getPlayers();
  });

  lobbiesTable.addEventListener('mouseover', updateTooltip);

  lobbiesTable.addEventListener('click', () => {
    tooltip.style.display = 'none';
  });

  initHeroku();
})();

function getLanguage() {
  return JSON.parse(localStorage.settings).language;
}

function updateTooltip(e) {
  tooltip.style.display = 'none';

  const lobby = e.target.parentNode;
  const hash = getLobbyHash(lobby);

  const { top } = lobby.getBoundingClientRect();

  if (!hash) return;

  const savedLobbies = JSON.parse(sessionStorage.getItem('savedLobbies'));

  if (!savedLobbies) return;

  const savedLobby = savedLobbies.find(lobby => lobby.code === hash);

  if (!savedLobby) return;

  tooltip.style.display = '';
  tooltip.style.top = `${top - 30}px`;
  tooltip.textContent = savedLobby.players.join(', ');
}

lobbiesTable.addEventListener('pointerleave', (e) => {
  tooltip.style.display = 'none';
});

function getLobbyHash(lobby) {
    const hashRegexp = /lobbyConnect\([^#]+(#[\w]+)/;
    const match = lobby.outerHTML.match(hashRegexp);

    if (!match) return;

    return match[1];
}

function getPlayers() {
  GM.xmlHttpRequest({
    method: 'GET',
    url: `${localUrl}/getplayers?language=${getLanguage()}`,
    onload: (res) => {
      if (res.status > 300) {
        lobbyAnchor.style.background = 'red';

        setTimeout(() => {
          lobbyAnchor.style.background = '';
        }, 3000);

        return;
      }

      lobbyAnchor.style.background = '';

      const lobbies = JSON.parse(res.responseText);

      console.log(lobbies);
      sessionStorage.setItem('savedLobbies', JSON.stringify(lobbies));
    },
    onerror: (e) => {
      console.log(e);

      lobbyAnchor.style.background = 'red';
      setTimeout(() => {
        lobbyAnchor.style.background = '';
      }, 3000);
    }
  });
}

function createTooltip() {
  const div = document.createElement('div');
  div.textContent = 'LALALALA';

  div.style.position = 'absolute';
  div.style.left = '50%';
  div.style.top = '50%';
  div.style.transform = 'translate(-50%, -50%)'
  div.style.fontSize = '16px';
  div.style.backgroundColor = '#201f1ff7';
  div.style.color = 'white';
  div.style.padding = '10px 20px';
  div.style.borderRadius = '20px';
  div.style.display = 'none';
  div.style.pointerEvents = 'none';

  document.body.appendChild(div);

  return div;
}

function initHeroku() {
  GM.xmlHttpRequest({
    method: 'GET',
    url: `${localUrl}/`,
  });
}