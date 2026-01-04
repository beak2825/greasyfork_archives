// ==UserScript==
// @name         Superbuy show/hide order numbers
// @namespace    https://tharglet.me.uk/
// @version      2.0
// @description  Button to show and hide order and item numbers on Superbuy
// @author       tharglet
// @match        https://www.superbuy.com/order
// @match        https://www.superbuy.com/order?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=superbuy.com
// @grant        GM_addStyle
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/495671/Superbuy%20showhide%20order%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/495671/Superbuy%20showhide%20order%20numbers.meta.js
// ==/UserScript==
GM_addStyle(`
.hideshow-hide {
  display: none;
}

#hideshow_toggle_button {
  margin-left: 10px;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: white;
  border: 1px gray solid;
}`);

(function() {
    'use strict';

    // Initialise spans
    const tableHeaders = document.querySelectorAll('.user_orderlist thead > tr > td');
    console.log(tableHeaders);
    for (let tableHeader of tableHeaders) {
        for (let element of tableHeader.childNodes) {
            if (element.nodeType == Node.TEXT_NODE) {
                if(element.textContent.indexOf('Order No') > -1) {
                    const replacementNode = document.createElement('span');
                    replacementNode.classList.add('hideshow-order-no');
                    replacementNode.innerHTML = element.textContent;
                    element.parentNode.insertBefore(replacementNode, element);
                    element.parentNode.removeChild(element);
                }
            }
        }
    }

    // Initialise button
    const toggleButtonContainer = document.createElement('template');
    toggleButtonContainer.innerHTML = '<button id="hideshow_toggle_button">Hide Order IDs</button>';
    const statusList = document.getElementsByClassName('status-list')[0];
    statusList.after(toggleButtonContainer.content.firstChild);
    document.getElementById('hideshow_toggle_button').addEventListener('click', (event) => {
        toggleOrderIds();
    });

    const toggleOrderIds = () => {
        const showHideButton = document.getElementById('hideshow_toggle_button');
        const hide = showHideButton.textContent.startsWith('Hide');
        toggleElements(document.getElementsByClassName('hideshow-order-no'), hide);
        toggleElements(document.getElementsByClassName('tno'), hide);
        toggleElements(document.querySelectorAll('.user_orderlist_primg > span'), hide);
        if(hide) {
            showHideButton.textContent = 'Show Order IDs';
        } else {
            showHideButton.textContent = 'Hide Order IDs';
        }
    }

    const toggleElements = (elements, isHide) => {
        for(let element of elements) {
            if(isHide) {
                element.classList.add('hideshow-hide');
            } else {
                element.classList.remove('hideshow-hide');
            }
        }
    }

    })();