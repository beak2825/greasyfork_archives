// ==UserScript==
// @name         Neopets Auction Safely
// @description  When you go to start an auction, there will be a popup to double-check values.
// @version      2025.05.14
// @license      GNU GPLv3
// @match        https://www.neopets.com/inventory.phtml
// @author       Posterboy
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @namespace    https://youtube.com/@Neo_Posterboy
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504476/Neopets%20Auction%20Safely.user.js
// @updateURL https://update.greasyfork.org/scripts/504476/Neopets%20Auction%20Safely.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // Styling
    // ==============================
    const style = document.createElement('style');
    style.textContent = `
        .customConfirmDialog {
            max-width: 440px;
            border-radius: 15px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .customConfirmDialog.show {
            display: block;
            opacity: 1;
        }
        .customConfirmDialog .popup-header__2020 {
            background-color: #E6E4DD;
            border-bottom: 1px solid #949494;
            padding: 10px;
            position: relative;
        }
        .customConfirmDialog .popup-body__2020 {
            padding: 10px;
        }
        .customConfirmDialog .popup-footer__2020 {
            display: flex;
            justify-content: center;
            padding: 10px;
        }
        .customConfirmDialog .button-default__2020 {
            padding: 2px 5px 7px 5px !important;
            border-radius: 12px;
            min-height: 25px;
            cursor: pointer;
            border: none;
            color: #fff;
        }
        .customConfirmDialog .button-yellow__2020 {
            background-color: #ffcc00;
            margin-right: 10px;
        }
        .customConfirmDialog .button-red__2020 {
            background-color: #ff6666;
        }
        .customConfirmDialog .inv-popup-exit {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // ==============================
    // Inject dialog HTML (if not present)
    // ==============================
    if (!document.getElementById('customConfirmDialog')) {
        const dialogHtml = `
        <div id="customConfirmDialog" class="customConfirmDialog" tabindex="-1">
            <div class="popup-header__2020">
                <h3>Confirm Auction</h3>
                <div class="inv-popup-exit button-default__2020 button-red__2020" id="dialogClose">
                    <div class="button-x__2020"></div>
                </div>
            </div>
            <div class="popup-body__2020">
                <p id="customDialogMessage"></p>
            </div>
            <div class="popup-footer__2020">
                <button id="customDialogConfirm" class="button-default__2020 button-yellow__2020">Yes</button>
                <button id="customDialogCancel" class="button-default__2020 button-red__2020">No</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
    }

    // ==============================
    // Utility Functions
    // ==============================
    function formatNumberWithCommas(number) {
        return number.toLocaleString();
    }

    function showCustomDialog(message, callback) {
        const dialog = document.getElementById('customConfirmDialog');
        const messageElem = document.getElementById('customDialogMessage');
        const confirmButton = document.getElementById('customDialogConfirm');
        const cancelButton = document.getElementById('customDialogCancel');
        const closeButton = document.getElementById('dialogClose');

        messageElem.textContent = message;
        dialog.classList.add('show');
        dialog.focus();

        const close = () => {
            dialog.classList.remove('show');
            setTimeout(() => {
                dialog.style.display = 'none';
            }, 300);
        };

        confirmButton.onclick = () => { close(); callback(true); };
        cancelButton.onclick = () => { close(); callback(false); };
        closeButton.onclick = () => { close(); callback(false); };
        window.onclick = (event) => {
            if (event.target === dialog) {
                close(); callback(false);
            }
        };
    }

    // ==============================
    // Replace auction button
    // ==============================
    function replaceButton() {
        const existingButton = Array.from(document.querySelectorAll('.button-default__2020.button-yellow__2020.btn-single__2020'))
            .find(button => button.getAttribute('onclick') === 'auctionItem()');

        if (existingButton) {
            console.log('Auction button found and restyled');

            // Style like native but centered/wide
            existingButton.textContent = 'Proceed to Confirmation';
            existingButton.className = 'button-default__2020 button-purple__2020';
            existingButton.style.margin = '10px auto';
            existingButton.style.width = '50%';
            existingButton.style.display = 'block';

            existingButton.onclick = function(event) {
                event.preventDefault();
                existingButton.disabled = true;
                existingButton.textContent = 'Processing...';

                const startPriceElem = document.querySelector('input[name="start_price"]');
                const minIncrementElem = document.querySelector('input[name="min_increment"]');

                let startPrice = parseFloat(startPriceElem?.value.replace(/,/g, '') || 0);
                let minIncrement = parseFloat(minIncrementElem?.value.replace(/,/g, '') || 0);
                let total = startPrice + minIncrement;
                let formattedTotal = formatNumberWithCommas(total);

                showCustomDialog(`Are you sure you wish to auction this item starting at ${formattedTotal} Neopoints?`, function(confirmed) {
                    if (confirmed) {
                        if (typeof auctionItem === 'function') {
                            auctionItem();
                        } else {
                            console.error('auctionItem function not found.');
                        }
                    } else {
                        console.log('User canceled auction.');
                    }

                    // Reset button state
                    existingButton.disabled = false;
                    existingButton.textContent = 'Proceed to Confirmation';
                });
            };
        }
    }

    // ==============================
    // MutationObserver
    // ==============================
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                replaceButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    replaceButton(); // Initial run

})();
