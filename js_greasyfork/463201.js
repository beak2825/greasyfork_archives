// ==UserScript==
// @name         🐭️ MouseHunt - Gift Buttons (with Raffle)
// @version      1.5.2
// @description  Add buttons to easily accept and return all daily gifts.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.2.0/mousehunt-utils.js
// @downloadURL https://update.greasyfork.org/scripts/463201/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Gift%20Buttons%20%28with%20Raffle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463201/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Gift%20Buttons%20%28with%20Raffle%29.meta.js
// ==/UserScript==

((function () {
  /**
   * Send the gifts.
   *
   * @param {string} buttonClass The class of the button to click.
   */
  const sendGifts = (buttonClass) => {
    if (hg && hg.views?.GiftSelectorView?.show) { // eslint-disable-line no-undef
      hg.views.GiftSelectorView.show(); // eslint-disable-line no-undef
    }

    const innerButtons = document.querySelectorAll('.giftSelectorView-friendRow-action.' + buttonClass + ':not(.disbled):not(.selected)');
    if (! innerButtons.length) {
      return;
    }

    innerButtons.forEach((button) => {
      button.click();
    });

    const confirm = document.querySelector('.mousehuntActionButton.giftSelectorView-action-confirm.small');
    if (confirm) {
      confirm.click();
    }
  };

  /**
   * Make a button.
   *
   * @param {string} text        The text to put in the button.
   * @param {string} buttonClass Class selector to use to grab the button.
   * @param {string} limitClass  Class selector to use to grab the limit.
   */
  const makeButton = (text, buttonClass, limitClass) => {
    const btn = document.createElement('a');
    btn.innerHTML = text;

    const limit = document.querySelector('.giftSelectorView-num' + limitClass + 'ActionsRemaining');
    if (limit && limit.innerText === '0') {
      btn.classList.add('disabled');
      btn.classList.add('disabled');
    } else {
      btn.addEventListener('click', () => {
        sendGifts(buttonClass);
      });
    }

    return btn;
  };

  /**
   * Make the buttons and add them to the page.
   */
  const makeButtons = () => {
    if (document.getElementById('bulk-gifting-gift-buttons')) {
      return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'bulk-gifting-gift-buttons';

    const acceptButton = makeButton('Accept All', 'claim', 'Claim');
    buttonContainer.appendChild(acceptButton);

    const returnButton = makeButton('Accept & Return All', 'return', 'Send');
    buttonContainer.appendChild(returnButton);

    const giftFooter = document.querySelector('.giftSelectorView-inbox-footer');
    if (giftFooter && giftFooter.firstChild) {
      giftFooter.insertBefore(buttonContainer, giftFooter.firstChild);
    }
  };

  /**
   * On a sucessful send, close the modal.
   *
   * @param {Object} request The request.
   */
  const checkForSuccessfulGiftSend = (request) => {
    if (! request || 'undefined' === request.friends_sent_gifts || ! request.friends_sent_gifts.length > 1) {
      return;
    }

    const okayBtn = document.querySelector('.giftSelectorView-confirmPopup-submitConfirmButton');
    if (! okayBtn) {
      return;
    }

    setTimeout(() => {
      okayBtn.click();

      if ('undefined' === typeof activejsDialog || ! activejsDialog || ! activejsDialog.hide) { // eslint-disable-line no-undef
        return;
      }

      activejsDialog.hide(); // eslint-disable-line no-undef
    }, 2000);
  };

  const addReturnRaffleListener = () => {
    const inbox = document.getElementById('hgbar_messages');
    if (! inbox) {
      return;
    }

    inbox.addEventListener('click', addReturnRaffleTicketsButton);
  };

  const returnRaffleTickets = async () => {
    const draws = document.querySelectorAll('.message.daily_draw.notification.ballot');
    if (draws.length <= 0) {
      return;
    }

    for (let i = 0; i <= 20; i++) {
      const draw = draws[ i ];

      const returnButton = draw.querySelector('input');
      if (! returnButton) {
        continue;
      }

      const previousSibling = draw.previousSibling;
      if (previousSibling) {
        const error = previousSibling.querySelector('.error');
        if (error) {
          break;
        }
      }
      returnButton.click();

      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  };

  const addReturnRaffleTicketsButton = () => {
    const drawTab = document.querySelector('[data-tab="daily_draw"]');
    if (! drawTab) {
      return;
    }

    const exists = document.getElementById('return-raffle-tickets');
    if (exists) {
      return;
    }

    // Create a button and append it to the draw tab
    const btn = document.createElement('button');
    btn.innerText = 'Return';
    btn.id = 'return-raffle-tickets';

    btn.addEventListener('click', returnRaffleTickets);

    drawTab.insertBefore(btn, drawTab.firstChild.nextSibling);
  };

  addStyles(`
		#bulk-gifting-gift-buttons {
			text-align: right;
			margin: 0 0 10px;
		}

		#bulk-gifting-gift-buttons a {
			display: inline-block;
			background-color: #eee;
			box-shadow: 1px 1px 1px #eee;
			border: 1px solid #000;
			border-radius: 5px;
			font-size: 12px;
			text-align: center;
			line-height: 30px;
			text-decoration: none;
			color: black;
			padding: 0 10px;
		}

		#bulk-gifting-gift-buttons a:last-child:hover,
		#bulk-gifting-gift-buttons a:hover {
			background-color: #ffae00;
			box-shadow: 0 0 5px #fff inset, 1px 1px 1px #fff;
		}

		#bulk-gifting-gift-buttons a:last-child {
			background-color: #fff600;
			margin-left: 10px;
		}

		#bulk-gifting-gift-buttons a.disabled,
		#bulk-gifting-gift-buttons a:last-child.disabled {
			background-color: #eee;
		}


		#bulk-gifting-gift-buttons a.disabled:hover {
			cursor: default;
			box-shadow: 0 0 3px #ff0000;
		}

		#messengerUINotification .tabs a[data-tab="daily_draw"] .counter {
			right: -1px;
			z-index: 10;
			top: 3px;
		}

		#return-raffle-tickets {
			box-shadow: 1px 1px 1px #eee;
			font-size: 10px;
			text-align: center;
			text-decoration: none;
			margin-left: 10px;
			background-color: #f5f5f5;
			border: 1px solid #ccc;
			border-radius: 3px;
			padding: 3px 7px;
			font-weight: 600;
			color: #333;
			cursor: pointer;

			opacity: 0.5;
		}

		.active #return-raffle-tickets {
			opacity: 1;
		}

		#return-raffle-tickets:hover {
			background-color: #ececec;
			box-shadow: inset 0px 1px 2px #cccccc;
		}

		.giftSelectorView-inbox-giftContainer {
			min-height: 300px;
			max-height: 75vh;
			height: auto;
		}

		.giftSelectorView-inbox-giftRow.complete {
			height: 25px;
			padding-top: 5px;
			padding-left: 15px;
			border: none;
			box-shadow: none;
		}

		.giftSelectorView-inbox-giftRow.complete .giftSelectorView-inbox-gift-thumb {
			display: inline;
		}

		.giftSelectorView-inbox-giftRow.complete .itemImage {
			width: 25px;
			height: 25px;
			display: inline-block;
		}

		.giftSelectorView-inbox-giftRow.complete .giftSelectorView-inbox-gift-details {
			width: 90%;
		}
	`);

  onAjaxRequest(makeButtons, '/managers/ajax/users/socialGift.php');
  onAjaxRequest(checkForSuccessfulGiftSend, '/managers/ajax/users/socialGift.php');

  onAjaxRequest(addReturnRaffleTicketsButton, '/managers/ajax/users/messages.php');
  addReturnRaffleListener();

  const buttonLink = document.querySelector('#hgbar_freegifts');
  if (buttonLink) {
    buttonLink.addEventListener('click', function () {
      makeButtons();
    });
  }
})());
