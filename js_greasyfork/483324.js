// ==UserScript==
// @name         Tlačítko IIHF 2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidává tlačítko k IIHF
// @author       Michal
// @match        https://www.iihf.com/en/events/2024/wm20/schedule
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483324/Tla%C4%8D%C3%ADtko%20IIHF%202.user.js
// @updateURL https://update.greasyfork.org/scripts/483324/Tla%C4%8D%C3%ADtko%20IIHF%202.meta.js
// ==/UserScript==

function generateLiveLink(gameId) {
  return {
    statsLink: `https://stats.iihf.com/Hydra/978/gameaction_${gameId}.html`,
    realtimeLink: `https://realtime.iihf.com/gamestate/GetLatestState/${gameId}`
  };
}

function createLiveButtons() {
  const gameCards = document.querySelectorAll('div.b-card-schedule[data-game-id]');

  gameCards.forEach(card => {
    const gameId = card.getAttribute('data-game-id');
    const { statsLink, realtimeLink } = generateLiveLink(gameId);

    const statsButton = createButton('Stats', statsLink);

    const realtimeButton = createButton('Realtime', realtimeLink);

    const buttonContainer = document.createElement('table');
    buttonContainer.style.borderCollapse = 'collapse';
    buttonContainer.style.border = '1px solid black';

    const row = document.createElement('tr');
    const statsCell = document.createElement('td');
    statsCell.style.border = '1px solid black';
    statsCell.style.width = '50%';
    statsCell.appendChild(statsButton);
    const realtimeCell = document.createElement('td');
    realtimeCell.style.border = '1px solid black';
    realtimeCell.style.width = '50%';
    realtimeCell.appendChild(realtimeButton);

    row.appendChild(statsCell);
    row.appendChild(realtimeCell);
    buttonContainer.appendChild(row);

    card.parentNode.insertBefore(buttonContainer, card.nextSibling);
  });
}

function createButton(text, link) {
  const button = document.createElement('a');
  button.textContent = text;
  button.href = link;
  button.target = '_blank';
  button.style.display = 'block';
  button.style.padding = '10px';
  button.style.backgroundColor = '#fff'
  button.style.color = '#000';
  button.style.textDecoration = 'none';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.textAlign = 'center';
  return button;
}

setTimeout(createLiveButtons, 3000);