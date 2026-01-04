// ==UserScript==
// @name         GTPlanet TT Assistant
// @license      MIT
// @namespace    http://www.romeyke.de
// @version      2.4
// @description  Enhance user info with details about current time trial
// @match        https://www.gtplanet.net/forum/threads/*.409515/*
// @match        https://www.gtplanet.net/forum/threads/*.424113/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497244/GTPlanet%20TT%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/497244/GTPlanet%20TT%20Assistant.meta.js
// ==/UserScript==

(function() {
  // loaded from cache -> do nothing
  if (document.querySelectorAll('.gtp-assistant').length) {
      return;
  }
  // extract from the current page all text children of span elements with itemprop="name"
  const nameElements = document.querySelectorAll('.message-name span[itemprop="name"]');
  process(nameElements);

})();

async function process(nameElements) {
  const names = Array.from(new Set(Array.from(nameElements).map(e => e.textContent)));
  const myName = document.querySelector('.p-navgroup-link--user').title;
  names.push(myName);
  const namesStr = names.join(',');
  const data = await fetch(`https://home.romeyke.de:35043/api/entries?gtpNames=${namesStr}&eventFilter=current-all`).then(r => r.json());

  // navigate to the closest ancestor of the name element that has a class of "message-cell--user" and append a div
  nameElements.forEach(nameElement => {
    const userElement = nameElement.closest('.message-cell--user');
    const div = createDivForUser(nameElement.textContent, data);
    if (userElement && div) {
        userElement.appendChild(div);
    }
  });
  const myDiv = createDivForUser(myName, data);
    if (myDiv) {
    // Use MutationObserver to detect when accountPopupElement is added
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const accountPopupElement = document.querySelector('.js-visitorMenuBody .contentRow-main');
                if (accountPopupElement) {
                    accountPopupElement.appendChild(myDiv);
                    observer.disconnect();
                }
            }
        }
    });

    // Start observing the document body for additions
    observer.observe(document.body, { childList: true, subtree: true });
    }
}

function createDivForUser(user, data) {
    const entries = data.entries.filter(e => e.gtpName === user).sort((a, b) => a.index - b.index);
    if (entries.length) {
      const div = document.createElement('div');

      // const div = document.createElement('div');
      // define div using inner HTML template string
      let divContent = '';
      data.events.forEach(event => {
        const entry = entries.find(e => e.eventNumber === event.eventNumber);
        const title = `${event.name}&#013;Last update: ${new Date(event.lastScanned).toLocaleString()}`
        const eventName = event.type === 'special' ? `Special TT ${event.index}` : `TT ${event.index}`
        divContent += `<div title="${title}" class="gtp-assistant" style="margin-top:2px;font-size:12px;background-color:${getBackgroundColor(entry ? entry.tier : 'none')};">
        <a style="text-decoration:underline" href="https://www.gran-turismo.com/gb/gt7/sportmode/event/${event.eventNumber}/"><b>${eventName}</b></a>
        <span style="font-size:10px">
        <br>Time: <b>${entry ? formatTime(entry.score, event.worldRecord) : '-:--.---'}</b>
        <br>Rank: <b>${entry ? entry.rank.toLocaleString(): '--'}</b>
        </span>
        </div>`;
      });
      div.innerHTML = divContent;
      return div;
    }
}

function getBackgroundColor(tier) {
  switch (tier) {
    case 'gold':
      return 'rgba(255,215,0,0.5)';
    case 'silver':
      return 'rgba(192,192,192,0.5)';
    case 'bronze':
      return 'rgba(205, 127, 50,0.5)';
  }
  return 'rgba(0,0,0,0)';
}

function formatTime(userScore, worldRecord) {
  const minutes = Math.floor(userScore / 60000);
  const seconds = Math.floor((userScore % 60000) / 1000);
  const millisecondsFormatted = (userScore % 1000).toFixed(0).padStart(3, '0');

  const percent = (userScore * 100 / worldRecord - 100).toFixed(2)

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${millisecondsFormatted} - ${percent}%`;
}