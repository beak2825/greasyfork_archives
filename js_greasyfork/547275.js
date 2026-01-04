// ==UserScript==
// @name         Transfer Entire Inventory to Hunter
// @version      0.0.1
// @description
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @description Are you sure about this?
// @downloadURL https://update.greasyfork.org/scripts/547275/Transfer%20Entire%20Inventory%20to%20Hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/547275/Transfer%20Entire%20Inventory%20to%20Hunter.meta.js
// ==/UserScript==

(function () {
'use strict';

  const addStyles = () => {
    app.mhutils.addStyles(`.mh-improved-flrt-helper-popup {
        display: flex;
        justify-items: center;
        flex-direction: column;
        flex-wrap: wrap;
        }

        .mh-improved-flrt-helper-popup .flrt-search-form {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px;
        background-color: #dcf7ff;
        border: 1px solid #a1a1a1;
        border-radius: 5px;
        box-shadow: 0 1px 2px -1px #b5b5b5;
        }

        .mh-improved-flrt-helper-popup .flrt-friend-finder {
        display: flex;
        gap: 1em;
        flex-direction: row;
        min-width: 320px;
        align-items: center;
        justify-content: center;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow.friendsPage-requestRow {
        border-radius: 5px;
        box-shadow: 1px 1px 4px #cdb495;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-imageContainer {
        width: 75px;
        height: 75px;
        margin-left: 3px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-content {
        max-width: 226px;
        min-height: 75px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-titleBar-icon {
        top: -10px;
        left: 0;
        height: 35px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-titleBar-name {
        padding-left: 15px;
        font-size: 14px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-titleBar {
        padding-left: 20px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-titleBar-titleDetail {
        left: 7px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-environment {
        position: relative;
        margin-left: -10px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-environment-icon {
        position: absolute;
        top: -5px;
        left: 0;
        width: 20px;
        height: 20px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-environment-name {
        position: absolute;
        left: 25px;
        font-size: 10px;
        vertical-align: top;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow .friendsPage-friendRow-actions {
        top: 40px;
        right: 0;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-actions-interactionButtons {
        padding-right: 0;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-actions .mousehuntTooltip,
        .mh-improved-flrt-helper-popup .friendsPage-requestRow-actionStatus.accepted,
        .mh-improved-flrt-helper-popup .userInteractionButtonsView-action[data-action="send_daily_gift"],
        .mh-improved-flrt-helper-popup .userInteractionButtonsView-action[data-action="send_draw_ballot"] {
        display: none !important;
        }

        .mh-improved-flrt-helper-popup .userInteractionButtonsView-button {
        width: 45px;
        height: 45px;
        background-size: 45px;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-statsContainer {
        border-radius: 0;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-stat.map,
        .mh-improved-flrt-helper-popup .friendsPage-friendRow-stat.team,
        .mh-improved-flrt-helper-popup .friendsPage-friendRow-stat-label {
        display: none !important;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-stat.online span {
        width: auto;
        }

        .mh-improved-flrt-helper-popup .friendsPage-friendRow-stat {
        width: auto;
        margin-right: 10px;
        }

        .mh-improved-flrt-helper-popup .instructions {
        padding: 10px;
        margin-top: auto;
        font-style: italic;
        }

        .mh-improved-flrt-helper-popup .flrt-items-to-send {
        min-width: 90%;
        }

        .flrt-items-to-send {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1em;
        justify-content: space-evenly;
        }

        .mh-improved-flrt-helper-popup .flrt-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 150px;
        padding: 5px;
        margin-bottom: 5px;
        cursor: pointer;
        background-color: #eee;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 1px 2px -1px #b5b5b5;
        }

        .mh-improved-flrt-helper-popup .flrt-item .itemImage,
        .mh-improved-flrt-helper-popup .flrt-item .itemImage img {
        width: 45px;
        height: 45px;
        }

        .mh-improved-flrt-helper-popup .flrt-item-info {
        display: flex;
        align-items: center;
        margin-left: 5px;
        }

        .mh-improved-flrt-helper-popup .flrt-item-name {
        font-weight: 900;
        vertical-align: top;
        }

        .mh-improved-flrt-helper-popup .flrt-item-disabled .itemImage {
        filter: grayscale(1);
        opacity: 0.5;
        }

        .mh-improved-flrt-helper-popup .flrt-item-info input[type="checkbox"]:disabled {
        opacity: 0;
        }

        .mh-improved-flrt-helper-popup .flrt-item.flrt-item-sending {
        background-color: #f3c019;
        }

        .mh-improved-flrt-helper-popup .flrt-item.flrt-item-sent {
        position: relative;
        background-color: #3fcd84;
        }

        .mh-improved-flrt-helper-popup .flrt-item.flrt-item-sent-success::after {
        position: absolute;
        right: 55px;
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-right: 5px;
        margin-bottom: -2px;
        vertical-align: middle;
        content: "";
        background-image: url(https://www.mousehuntgame.com/images/ui/events/winter_hunt_2013/checkmark.png);
        background-repeat: no-repeat;
        background-size: 100%;
        }

        .flrt-item-send.mousehuntActionButton {
        margin-right: 3px;
        margin-left: auto;
        }

        #overlayPopup.flrt-helper-popup .jsDialogContainer .suffix {
        display: none;
        }

        .mh-dark .flrt-helper-popup .jsDialog.background .content {
        color: var(--d-text);
        background-color: var(--d-bg);
        }

        .mh-dark .flrt-helper-popup h2.title {
        color: var(--d-text);
        }

        .mh-dark .mh-improved-flrt-helper-popup .flrt-item {
        background-color: var(--d-alt);
        border-color: var(--d-border);
        }

        .mh-dark .mh-improved-flrt-helper-popup .flrt-item.flrt-item-sending {
        color: var(--d-text-dark);
        background-color: var(--d-yellow);
        }

        .mh-dark .mh-improved-flrt-helper-popup .flrt-item.flrt-item-sent {
        color: var(--d-text-dark);
        background-color: var(--d-green);
        }

        .mh-dark .mh-improved-flrt-helper-popup .friendsPage-community-hunterResult .error {
        color: var(--d-text);
        background-color: var(--d);
        }

        .mh-dark .mh-improved-flrt-helper-popup .flrt-search-form {
        background-color: var(--d-blue-dark);
        border-color: var(--d-blue);
        }
  `, 'transfer-inventory');}

    let itemsToSend = [];

    const getItems = async () => {
      const items = await fetch('https://www.mousehuntgame.com/api/get/user/me').then((response) => response.json()).then((data) => data.inventory);
      const allItems = await app.mhutils.getData('items');

      for (const item of items) {
        const itemInfo = allItems.find((i) => i.id == item.item_id);
        if (itemInfo && itemInfo.is_tradable && item.quantity > 0) {
          itemsToSend.push({
            id: itemInfo.id,
            type: itemInfo.type,
            name: itemInfo.name,
            image: itemInfo.images.thumbnail,
            quantity: item.quantity,
          });
        }
      }

      console.log('Tradable items:', itemsToSend);

      return itemsToSend;
    }

    const showTransferInventoryDialog = async () => {
      const items = await getItems();
      let itemContent = '';
      for (const item of items) {
            itemContent += `<div class="flrt-item" data-item-type="${item.type}" data-item-quantity="${item.quantity}">
            <div class="itemImage">
                <img src="${item.image}" alt="${item.name}" title="${item.name}" />
                <div class="quantity">${item.quantity}</div>
            </div>
            <div class="flrt-item-info">
                <span class="flrt-item-name">${item.name}</span>
            </div>
            <input type="checkbox" class="flrt-item-select" checked />
        </div>`;
      }

      const popup = app.mhutils.createPopup({
        template: 'ajax',
        className: 'flrt-helper-popup',
        title: 'Transfer inventory to another hunter',
        content: `<div class="mh-improved-flrt-helper-popup">
            <div class="flrt-friend-finder">
                    <label for="hunter-id" class="instructions">Enter the Hunter ID of the hunter you want to send your tradable items to, then select the items below and click "Send".</label>
                        <input id="hunter-id" type="number" value="8209591" name="hunter-id" maxlength="10" class="friendsPage-community-hunterIdForm-input">
                    </label>
                    <button class="mousehuntActionButton" id="send-items-button"><span>Send</span></button>
                </form>
            </div>
            <div class="flrt-items-to-send">
                ${itemContent}
            </div>
            </div>`,
      });

      popup.addToken('{*prefix*}', '<h2 class="title">Send tradable items</h2>');
      popup.addToken('{*suffix*}', '');
      popup.show();

      const sendButton = document.querySelector('#send-items-button');
      sendButton.addEventListener('click', async () => {
        const hunterId = document.querySelector('#hunter-id').value;
        if (!hunterId || hunterId.length < 5) {
          alert('Please enter a valid Hunter ID.');
          return;
        }

        const selectedItems = Array.from(document.querySelectorAll('.flrt-item')).filter((item) => item.querySelector('.flrt-item-select').checked);
        if (selectedItems.length === 0) {
          alert('Please select at least one item to send.');
          return;
        }

        for (const itemElement of selectedItems) {
          const itemType = itemElement.getAttribute('data-item-type');
          const itemQuantity = parseInt(itemElement.getAttribute('data-item-quantity'), 10);

          itemElement.classList.add('flrt-item-sending');

          console.log(`Sending ${itemQuantity} of ${itemType} to hunter ID ${hunterId}`);
          try {
            const url = `https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php?sn=Hitgrab&hg_is_ajax=1&receiver=${snuid}&uh=${user.unique_hash}&item=${itemType}&item_quantity=${itemQuantity}`;

            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            const result = await response.json();

            if (result && result.success) {
              itemElement.classList.remove('flrt-item-sending');
              itemElement.classList.add('flrt-item-sent', 'flrt-item-sent-success');
            } else {
              itemElement.classList.remove('flrt-item-sending');
              itemElement.classList.add('flrt-item-disabled');
              alert(`Failed to send ${itemElement.querySelector('.flrt-item-name').textContent}: ${result.message || 'Unknown error'}`);
            }
          } catch (error) {
            itemElement.classList.remove('flrt-item-sending');
            itemElement.classList.add('flrt-item-disabled');
            alert(`Error sending ${itemElement.querySelector('.flrt-item-name').textContent}: ${error.message}`);
          }
        }
      });
    };


    document.addEventListener('mh-improved-loaded', () => {
      addStyles();
      app.mhutils.addSubmenuItem({
        id: 'transfer-inventory',
        menu: 'camp',
        label: 'Transfer Inventory',
        callback: showTransferInventoryDialog,
      });
    });
  })();
