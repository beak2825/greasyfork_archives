// ==UserScript==
// @name         🐭️ MouseHunt - Open All
// @version      1.0.3
// @description  be careful lol only tested once so hopefully it doesn't break
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.6.0/mousehunt-utils.js
// @downloadURL https://update.greasyfork.org/scripts/464435/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Open%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/464435/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Open%20All.meta.js
// ==/UserScript==
((function () {
  'use strict';

  addStyles(`.open-all-button {
    margin-left: 1em;
    margin-top: -1px;
    margin-bottom: 1px;
  }

  .open-all-confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .open-all-confirm-box {
    background: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .open-all-confirm-buttons {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  .open-all-confirm-yes,
  .open-all-confirm-no {
    background-color: #fff600;
    border: 1px solid #000;
    border-radius: 5px;
    box-shadow: inset 0 0 5px #fff, 1px 1px 1px #fff;
    line-height: 24px;
    padding: 0 15px;
    text-shadow: 0 0 1px #fff;
    margin-left: 1rem;
  }

  .open-all-confirm-no {
    background-color: #b3edff;
  }`);

  const openAll = (cat) => {
    const items = cat.querySelectorAll('.inventoryPage-item.convertible');
    if (!items || !items.length) {
      return;
    }

    let count = 0;
    items.forEach( async (item) => {
      const button = item.querySelectorAll('input[type="button"]')
      if (!button) {
        return;
      }

      let buttonToClick = null;
      if (button.length > 1) {
        buttonToClick = button[1];
      } else {
        buttonToClick = button[0];
      }

      // For each button, click it and wait for waitForComplete to resolve before moving on
      setTimeout(() => {
        buttonToClick.click();
      }, 1000 * count);
    });
  };

  const main = () => {
    const category = document.querySelectorAll('.inventoryPage-tagContent-tagGroup');
    if (!category) {
      return;
    }

    category.forEach((cat) => {
      const type = cat.getAttribute('data-name');

      const openAllButton = makeElement('div', ['open-all-button', 'mousehuntActionButton', 'tiny']);
      makeElement('span', 'open-all', 'Open All', openAllButton)

      openAllButton.addEventListener('click', (e) => {

        // Add a popup to confirm
        const confirm = makeElement('div', 'open-all-confirm');
        const confirmBox = makeElement('div', 'open-all-confirm-box');
        makeElement('p', 'open-all-confirm-text', `Are you sure you want to open all convertibles in <em>${type}</em>?`, confirmBox);
        const confirmButtons = makeElement('div', 'open-all-confirm-buttons', '');

        const confirmNo = makeElement('button', 'open-all-confirm-no', 'No', confirmButtons);
        confirmNo.addEventListener('click', () => {
          confirm.remove();
        });

        const confirmYes = makeElement('button', 'open-all-confirm-yes', 'Yes', confirmButtons);
        confirmYes.addEventListener('click', () => {
          openAll(cat);
          confirm.remove();
        });

        confirmBox.appendChild(confirmButtons);
        confirm.appendChild(confirmBox);

        document.body.appendChild(confirm);
      });

      const header = cat.querySelector('.inventoryPage-tagContent-tagTitle');
      if (! header) {
        return;
      }

      header.appendChild(openAllButton);
    });
  };

  main();

})());
