// ==UserScript==
// @name         Tlačítko IIHF
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidává tlačítko k IIHF
// @author       Michal
// @match        https://www.iihf.com/en/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483323/Tla%C4%8D%C3%ADtko%20IIHF.user.js
// @updateURL https://update.greasyfork.org/scripts/483323/Tla%C4%8D%C3%ADtko%20IIHF.meta.js
// ==/UserScript==

function generateLiveLink(gameId) {
  const eventIDElement = document.querySelector('[data-eventid]');

  const eventID = eventIDElement ? eventIDElement.getAttribute('data-eventid') : '';

  return {
    statsLink: `https://stats.iihf.com/Hydra/${eventID}/gameaction_${gameId}.html`,
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

    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '10px';
    buttonContainer.appendChild(statsButton);

    const spacer = document.createElement('div');
    spacer.style.height = '10px';
    buttonContainer.appendChild(spacer);
    buttonContainer.appendChild(realtimeButton);

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
  button.style.backgroundColor = '#337ab7';
  button.style.color = '#fff';
  button.style.textDecoration = 'none';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.textAlign = 'center';
  return button;
}

setTimeout(createLiveButtons, 3000);