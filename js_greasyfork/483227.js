// ==UserScript==
// @name         TORN: Prefill Item Send
// @namespace    http://torn.city.com.dot.com.com
// @version      1.1.1
// @description  Allows Prefill values to be set for amounts and players
// @author       IronHydeDragon[2428902]
// @match        https://www.torn.com/item.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483227/TORN%3A%20Prefill%20Item%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/483227/TORN%3A%20Prefill%20Item%20Send.meta.js
// ==/UserScript==

//////// PREFILL VALUES ////////
const prefillAmountVal = ['2', '5', '999999', '']; // 999999 is just some rediculous number that should be equivalent to 'max'
const prefillPlayerVal = ['Kv0the [2153277]', ''];
const prefillMessageVal = ['Edit script message prefills', ''];

//////// INDEXES USED BY FUNCTIONS
// DO NOT CHANGE
let amountIndex = 0;
let playerIndex = 0;
let messageIndex = 0;

//////// FUNCIONS ////////
function prefillAmount(inputEl) {
  const maxAmount = inputEl.dataset.max;

  inputEl.value = +prefillAmountVal[amountIndex] > +maxAmount ? +maxAmount : +prefillAmountVal[amountIndex];
  console.log('input', inputEl.value); // TEST
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
}
function prefillPlayer(inputEl) {
  inputEl.value = prefillPlayerVal[playerIndex];
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
}
function prefillMessage(inputEl, message) {
  console.log('message', message); // TEST
  if (message === undefined) {
    inputEl.value = prefillMessageVal[messageIndex];
  }
  if (message !== undefined) {
    inputEl.value = '';
  }
  inputEl.dispatchEvent(new Event('input', { bubbles: true }));
}

function amountClickHandler(e) {
  const max = prefillAmountVal.length - 1;
  if (++amountIndex > max) amountIndex = 0;

  prefillAmount(e.target);
  e.target.focus();
  e.target.select();
}
function playerClickHandler(e) {
  const max = prefillPlayerVal.length - 1;
  if (++playerIndex > max) playerIndex = 0;

  prefillPlayer(e.target);
  e.target.focus();
  e.target.select();
}
function messageClickHandler(e) {
  const max = prefillMessageVal.length - 1;
  if (++messageIndex > max) messageIndex = 0;

  prefillMessage(e.target);
  e.target.focus();
  e.target.select();
}
function removeMessageClickHandler(e, inputEl) {
  console.log('removeMessage'); // TEST
  prefillMessage(inputEl, '');
}

async function sendItemObserverCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.target.classList.contains('cont-wrap') && mutation.type !== 'attributes') {
      if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList.length > 0 && mutation.addedNodes[0].classList.contains('send-act')) {
        const sendActionEl = mutation.addedNodes[0];
        const amountInputEl = sendActionEl.querySelector('input.amount[type="text"]');
        const playerInputEl = sendActionEl.querySelector('input.user-id');

        prefillAmount(amountInputEl);
        prefillPlayer(playerInputEl);

        amountInputEl.addEventListener('click', amountClickHandler);
        playerInputEl.addEventListener('click', playerClickHandler);
      }
    }
    if (mutation.target.classList.contains('msg-active')) {
      console.log(mutation); // TEST
      const messageContainerEl = mutation.target;
      const messageInput = messageContainerEl.querySelector('input.message');
      const removeMessageBtn = messageContainerEl.querySelector('.action-remove');

      prefillMessage(messageInput);
      messageInput.addEventListener('click', messageClickHandler);
      removeMessageBtn.addEventListener('click', (e, messageInput) => removeMessageClickHandler(e, messageInput));
    }
  }
}

function createSenditemMutationObserver() {
  const observer = new MutationObserver(sendItemObserverCallback);
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

// document.addEventListener('input', (e) => console.log(e)); // TEST)

(async () => {
  console.log('🎁 Prefill item send script is ON!'); // TEST

  createSenditemMutationObserver();
})();
