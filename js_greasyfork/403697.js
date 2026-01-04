// ==UserScript==
// @name           Sign-Off Trello
// @namespace      https://openuserjs.org/users/clemente
// @match          https://trello.com/*
// @version        1.0
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @connect        trello.com
// @author         clemente
// @license        MIT
// @description    Create a Sign-Off file from a selected list
// @icon           https://images.emojiterra.com/mozilla/128px/1f4c4.png
// @inject-into    content
// @run-at         document-idle
// @homepageURL    https://openuserjs.org/scripts/clemente/Sign-Off_Trello
// @supportURL     https://openuserjs.org/scripts/clemente/Sign-Off_Trello/issues
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/403697/Sign-Off%20Trello.user.js
// @updateURL https://update.greasyfork.org/scripts/403697/Sign-Off%20Trello.meta.js
// ==/UserScript==

/* Logic to get the validations from a list */

function gm_fetch(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function({ status, responseText }) {
        if (status < 200 && status >= 300) return reject();
        resolve(JSON.parse(responseText));
      },
      onerror: function() { reject(); },
    });
  });
}

async function getBoardId() {
  const url = `${document.URL}.json?fields=id`;
  const boardInformation = await gm_fetch(url);
  return boardInformation.id;
}

async function getBoardsLists(boardId) {
  const url = `https://trello.com/1/boards/${boardId}/lists`;
  const lists = await gm_fetch(url);
  return lists;
}

async function getListCards(listId) {
  const url = `https://trello.com/1/lists/${listId}/cards?fields=id`;
  const cards = await gm_fetch(url);
  return cards.map(card => card.id);
}

async function getCardLastAction(cardId) {
  const url = `https://trello.com/1/cards/${cardId}?actions=updateCard%3AidList&actions_display=true&action_memberCreator_fields=fullNam%2Cusername&actions_limit=1&fields=email`;
  const card = await gm_fetch(url);
  return card.actions[0];
}

async function getInformation(cardId) {
  const action = await getCardLastAction(cardId);
  const date = action.date;
  const validator = action.display.entities.memberCreator.text;
  const shortLink = action.display.entities.card.shortLink;
  const name = action.display.entities.card.text;
  const id = action.data.card.idShort;
  return { date, validator, shortLink, name, id };
}

async function getListValidations(listId) {
  const cards = await getListCards(listId);
  const validations = await Promise.all(cards.map(getInformation));
  return validations;
}

function formatValidations(validations) {
  const headers = "id,nom du ticket,lien,date de validation,validateur\n";
  const content = validations
    .map(({ date, validator, shortLink, name, id }) => `${id},"${name}",https://trello.com/c/${shortLink},${date},"${validator}"`)
    .join('\n');
  return headers + content;
}

async function downloadSignOff(formattedValidations) {
  const content = 'data:application/csv;charset=utf-8,' + encodeURIComponent(formattedValidations);
  GM_download({ url: content, name: 'sign-off.csv' });
}

async function setValidationsInClipboard(listName) {
  try { 
    const boardId = await getBoardId();
    const lists = await getBoardsLists(boardId);
    const listId = lists.find(list => list.name === listName).id;
    const validations = await getListValidations(listId);
    const formattedValidations = formatValidations(validations);
    downloadSignOff(formattedValidations);
  } catch (e) {
    console.log(e);
    alert('Erreur lors de la création du rapport. Veuillez regarder les logs.');
  }
}

/* Logic to add a button to the list options */


function addReportValidationButton(popoverNode, listName) {
  const reportButton = document.createElement('li');
  const reportButtonLink = document.createElement('a');
  reportButtonLink.textContent = "Créer le rapport de Sign-Off";
  reportButtonLink.href = '#';
  reportButton.append(reportButtonLink);
  reportButton.onclick = () => {
    setValidationsInClipboard(listName);
    popoverNode.querySelector('.icon-close').click();
  };
  popoverNode.querySelector('.pop-over-list').append(reportButton);
}

function onPopoverShown(mutations, observer, listName) {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach(node => {
        addReportValidationButton(node, listName);
        observer.disconnect();
      });
    }
  });
}

function onListOptionsClick(event) {
  const listName = event.target.parentNode.parentNode.querySelector('.js-list-name-input').textContent;
  // Create a mutation observer instead of adding directly the button because the popover is mounted a bit after the click
  const popoverObserver = new MutationObserver((mutations, observer) => onPopoverShown(mutations, observer, listName));
  popoverObserver.observe(document.querySelector('.pop-over'), { childList: true });
}

function initListOptionsWatch() {
  document.querySelectorAll('.js-open-list-menu').forEach(node => {
    node.removeEventListener('click', onListOptionsClick); // Remove previous event listener if already set
    node.addEventListener('click', onListOptionsClick);
  });
}

// Wait 30 secondes for the board to load
setTimeout(initListOptionsWatch, 30000);
