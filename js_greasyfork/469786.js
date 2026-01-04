// ==UserScript==
// @name         Wendy's energy
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Collect energy
// @author       k4ng0u
// @include      https://wendy-shop.nexters.com/*
// @icon         https://wendy-shop.nexters.com/vip.png
// @grant        unsafeWindow
// @grant        GM.setClipboard
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/469786/Wendy%27s%20energy.user.js
// @updateURL https://update.greasyfork.org/scripts/469786/Wendy%27s%20energy.meta.js
// ==/UserScript==

(async function () {
  const BUTTON_BUY = '.big_bundle__button_buy:not(.skeleton)';
  const BUNDLE_TITLE = '.small_bundle__title_container';
  const SMALL_BUY_BUTTON = '.small_bundle__button_buy';
  const YOUR_ID = '#yourId';
  const FRIEND_ID = '#friendId';
  const SWITCH_COLLECT_MODE_BUTTON = '.payment_modal__button.primary_ghost_button';
  const VALID_ID_ICON = '.input_component__icon_placeholder.green';
  const INVALID_ID_1 = '.input_component__tip_container.error';
  const INVALID_ID_2 = '.input_component__tip_error_text';
  const CONFIRM_COLLECTION_BUTTON = '.payment_modal__button.main_button';
  const SUCCESS_BACK_BUTTON = '.successful_payment__button_back';
  const BACK_BUTTON = '.payment_modal__icon_back';
  const PAYMENT_MODAL = '.payment_modal';
  const GAME_IDS_KEY = 'gids'

  let BUTTON_TEMPLATE;

  await waitForElement(BUTTON_BUY);
  createButtonBar();

  async function collectEnergy() {
    const gameIds = await getGameIds();
    // map gameIds to username (used to log failures)
    const idToName = {};
    for (let name of Object.keys(gameIds)) {
      idToName[gameIds[name]] = name;
    }
    const idList = Object.values(gameIds);

    // id of a random member that will be sending the gifts.
    const yId = idList[Math.floor(Math.random() * idList.length)];

    // Array to collect failures
    const failures = [];
    // Array to collect ids to which the gift was successfully sent
    const successes = [];

    // loop on every id to send the gift
    for (let fId of idList) {
      try {
        // collect energy button on the main page
        var collectButton;
        document
          .querySelectorAll(BUNDLE_TITLE)
          .forEach((a) => {
            if (a.textContent.toLowerCase().includes('free energy')) {
              collectButton = a.parentElement.querySelector(SMALL_BUY_BUTTON);
            }
          });
        collectButton?.click();

        // wait for the modal to open
        await waitForElement(YOUR_ID);

        var friendId = document.querySelector(FRIEND_ID);

        // switch to collect for friend mode if it's not already the case (it can be the case when a previous gift failed)
        const switchModeButton = document.querySelector(SWITCH_COLLECT_MODE_BUTTON);
        if (switchModeButton.textContent.toLowerCase().includes('friend')) {
          switchModeButton.click();
        }

        // fill in ids for the sender and the receiver
        var idInput = document.querySelector(YOUR_ID);
        idInput.value = yId;
        friendId = document.querySelector(FRIEND_ID);
        friendId.value = fId;
        idInput.dispatchEvent(new Event('input', { bubbles: true }));
        friendId.dispatchEvent(new Event('input', { bubbles: true }));

        await waitForElement( VALID_ID_ICON,
          [INVALID_ID_1,INVALID_ID_2],
          2,
          20000,
        );
        console.log(`Successfully found ${yId} and ${fId}`);

        // collect the energy
        document.querySelector(CONFIRM_COLLECTION_BUTTON).click();

        // go back to homepage
        await waitForElement(SUCCESS_BACK_BUTTON);
        document.querySelector(SUCCESS_BACK_BUTTON).click();

        successes.push(fId);
      } catch (e) {
        console.error(e);
        let hasFound = false;
        if (Array.isArray(e)) {
            e.forEach(err => {
                failures.push({ id: fId, reason: err });
            })
        }
        // add error reason and ids to the failure list
        document
          .querySelectorAll('.input_component__tip_container')
          .forEach((f) => {
            if (f.className.includes('error')) {
              failures.push({ id: fId, reason: f.textContent || 'unknown' });
              console.error(fId, f.textContent);
              hasFound = true;
            }
          });
        // if no error is displayed we log a default 'unknown' error
        !hasFound && failures.push({ id: fId, reason: 'unknown' });
      }
    }

    let result = logSuccess();
    if (result) result += '\n';
    result += logErrors() || '';
    GM.setClipboard(result);
    alert(`Results are set in the clipboard, you can paste them with the standard shortcuts ctrl+v (windows/linux) or cmd+v (macOS): \n${result}`);

    function getDisplayName(f) {
      return `${idToName[f]} (${f})`;
    }

    function logErrors() {
      let failureMap = {};
      for (let failure of failures) {
        let key = btoa(failure.reason);
        let failureSet = failureMap[key];
        if (!failureSet) {
          failureSet = new Set();
          failureMap[key] = failureSet;
        }
        failureSet.add(failure.id);
      }

      const errorMsgs = [];
      for (let failure of Object.keys(failureMap)) {
        const failedIds = Array.from(failureMap[failure])
          .map((f) => {
            const name = getDisplayName(f);
            return name;
          })
          .join(', ');
        errorMsgs.push(`${atob(failure)}: ${failedIds}`);
      }

      const message = errorMsgs.join('\n');
      console.error(message);
      return message;
    }

    function logSuccess() {
        if (!successes.length) return '';
        const message = `Energy gift were successfully sent to ${successes.map(s => getDisplayName(s)).join(', ')}`;
        console.log(message);
        return message;
    }
  }

      // utils to wait for an element to appear on the page
    async function waitForElement(
      selector,
      errorSelectors = [],
      count = 1,
      timeout = 2000,
    ) {
      var resolveWait;
      var rejectWait;
      const waitPromise = new Promise((resolve, reject) => {
        resolveWait = resolve;
        rejectWait = reject;
      });
      const intervalId = setInterval(() => {
        if (document.querySelectorAll(selector)?.length === count) {
          clearTimers();
          resolveWait();
          return;
        }
        for (let errSelector of errorSelectors) {
          if (document.querySelectorAll(errSelector)?.length) {
            let errors = [];
            console.log(errSelector, document.querySelectorAll(errSelector));
            document.querySelectorAll(errSelector).forEach((e) => {
              console.log(errSelector, e.textContent);
              console.log(errSelector, e.parentElement.classList);
              if (
                !e.parentElement?.classList?.contains('green') &&
                e.textContent
              ) {
                errors.push(e.textContent);
              }
            });
            if (errors.length) {
              rejectWait(errors);
              clearTimers();
              break;
            }
          }
        }
      }, 100);
      const timeoutId = setTimeout(() => {
        rejectWait();
        clearTimers();
      }, timeout);

      function clearTimers() {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
      return waitPromise;
    }

    // utils to wait a give time in milliseconds
    async function waitTimeout(timeout = 2000) {
      var res;
      const waitPromise = new Promise((resolve, reject) => {
        res = resolve;
      });
      setTimeout(() => res(), timeout);
      return waitPromise;
    }

  function createButton(text) {
    const button = BUTTON_TEMPLATE || document.querySelector(BUTTON_BUY).cloneNode();
    button.style.margin = '10px';
    BUTTON_TEMPLATE = button.cloneNode();
    button.textContent = text;
    return button;
  }

  function createDiv() {
    return document.createElement('div');
  }

  async function openModal(element) {
    document.querySelector(BUTTON_BUY).click();
    await waitForElement(PAYMENT_MODAL);
    const modal = document.querySelector(PAYMENT_MODAL);
    modal.innerHTML = '';
    modal.appendChild(element);
  }

  function closeModal() {
    document.querySelector(BACK_BUTTON).click();
  }

  function createButtonBar() {
    const div = createDiv();
    const collectButton = createButton('Collect Energy');
    collectButton.onclick = () => collectEnergy();
    const updateGuildMembers = createButton('Update guild members');
    updateGuildMembers.onclick = () => openEditModal();
    div.appendChild(collectButton);
    div.appendChild(updateGuildMembers);
    div.style.position = 'fixed';
    div.style.top = '60px';
    div.style.left = '0';
    div.style.zIndex = 200;
    div.style.padding = '10px'
    document.body.appendChild(div);
  }

  async function getGameIds() {
    const storedValue = await GM.getValue(GAME_IDS_KEY);
    if (!storedValue) {
        alert('No game ids found. Please click on "Update guild members" and fill in players\' information.')
        throw new Error('no game ids found');
    }
    const pairArray = storedValue.split(';');
    const gameIds = {};
    for (let pair of pairArray) {
        const [name, id] = pair.split(':').map((el) => el.trim());
        if (name) {
            gameIds[name] = id;
        }
    }
    return gameIds;
  }

  async function openEditModal() {
    const container = createDiv();

    const descriptionDiv = createDiv();
    descriptionDiv.textContent = 'Fill in your guild members name and ids as per the following example:'

    const example =`player1: 123456;
player2: 111111;
player3: 934812;`;
    const code = document.createElement('pre');
    code.innerHTML = example;
    code.style.paddingTop = '10px';
    code.style.paddingBottom = '10px';

    const textArea = document.createElement('textarea');
    textArea.rows = 32;
    textArea.cols = 60;
    textArea.style.display = 'block';
    textArea.placeholder = example;

    const storedValue = await GM.getValue(GAME_IDS_KEY);
    if (storedValue) {
        textArea.value = storedValue;
    }

    const saveButton = createButton('Save');
    saveButton.onclick = async () => {
        try {
            const guildMembersInputValue = textArea.value.trim();
            let valueToStore = '';
            guildMembersInputValue.split(';').forEach((pair) => {
                if (pair?.trim()) {
                    const pairArray = pair.split(':');
                    if (pairArray.length !== 2) {
                        throw new Error(`Error parsing ${pair}, name or game id is missing`)
                    }
                    const value = pairArray[1].trim();
                    if (isNaN(value) || isNaN(Number.parseInt(value))) {
                        throw new Error(`Error parsing ${pair}, game ids should be numbers`)
                    }
                    valueToStore += `${pairArray[0].trim()}: ${value};`;
                }
            });
            await GM.setValue(GAME_IDS_KEY, guildMembersInputValue);
            closeModal();
        } catch (e) {
            alert(e.message);
        }
    }

    const cancelButton = createButton('Cancel');
    cancelButton.onclick = () => closeModal();

    container.appendChild(descriptionDiv);
    container.appendChild(code);
    container.appendChild(textArea);
    container.appendChild(saveButton);
    container.appendChild(cancelButton);

    openModal(container);
  }
})();
