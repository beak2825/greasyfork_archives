// ==UserScript==
// @name         Mark Coinbase Reward Transactions as Staked on CoinTracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tool to mark CoinTracker Coinbase Reward Transactions as Staked, since CoinTracker does not currently have bulk edit functionality. It will add a button to the 'transactions' page that will allow you to update all matched 'Coinbase Reward' transaction per page, or automatically for all pages.
// @author       Tim Fau
// @match        https://www.cointracker.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439329/Mark%20Coinbase%20Reward%20Transactions%20as%20Staked%20on%20CoinTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/439329/Mark%20Coinbase%20Reward%20Transactions%20as%20Staked%20on%20CoinTracker.meta.js
// ==/UserScript==

// Global Variables
let tamperMonkeyButton = document.querySelector('.tampermonkey-alogrand-button');
let isTransactionsPage = window.location.pathname.includes('transactions');

function addButtonToCoinTracker () {
    if (isTransactionsPage) {
        if (!tamperMonkeyButton) {
            let flashContainer = document.querySelector('#main .container > .flex-wrap')
            let buttonElement = `
                <div class="d-flex flex-wrap tampermonkey-alogrand-button">
                    <a class="ct btn btn-light mt-3 mt-md-0 ml-3" style="position: relative;">
                        <span class="btn-txt">Mark Coinbase Rewards as staked</span>
                        <span class="btn-loading-msg" style="visibility: hidden; position: absolute; left: 50%; transform: translate(-50%);"></span>
                    </a>
                </div>
            `;
            flashContainer.innerHTML = flashContainer.innerHTML + buttonElement
            tamperMonkeyButton = document.querySelector('.tampermonkey-alogrand-button')
        }
        tamperMonkeyButton.addEventListener('click', initCheckNextUnmarkedItem)
    }
};

addButtonToCoinTracker()

function setButtonToLoadingState (msg) {
    console.log(msg)
    let loadingButton = tamperMonkeyButton.querySelector('.btn-loading-msg')
    tamperMonkeyButton.querySelector('.btn-txt').style.visibility = 'hidden'
    loadingButton.style.visibility = 'visible'
    loadingButton.innerHTML = msg
};

// Function that checks if there is an Coinbase Reward item and if it is marked as 'Staked'
// If it is not, then it submits the selector option for 'Staked' for that item
function checkNextUnmarkedItem () {
    let listGroupItems = document.querySelectorAll('.list-group-item')
    let stakedCount = 0;
    for (var i = 0; i <= listGroupItems.length; i++) {
        let item = listGroupItems[i];
        let isReward = item ? item.querySelector('.text-nowrap [data-original-title*="reward<br>From Coinbase"]') : '';
        if (isReward) {
            let itemBadge = item.querySelectorAll('.badge.px-2')
            // Check if item is is marked as 'Staked'; add to count if so
            let transactionIsStaked = false
            for (var j = 0; j < itemBadge.length; j++) {
                if (itemBadge[j].innerHTML === 'Staked') {
                    transactionIsStaked = true
                    break;
                }
            }
            if (transactionIsStaked) {
                stakedCount++;
            // If not 'Staked', mark as staked
            } else {
                let markAsStakedButton = item.querySelector('.dropdown-menu form[action*="meta_type=8"] button')
                setButtonToLoadingState('Updating...')
                localStorage.setItem('runAgain', true)
                markAsStakedButton.click();
                break;
            }
        }
        // If All Rewards Transactions on page are maked as staked
        if (i === listGroupItems.length && stakedCount === document.querySelectorAll('.text-nowrap [data-original-title*="reward<br>From Coinbase"]').length / 2) {
            let nextPage = document.querySelector('.page-item.active + .page-item a')
            // If there is another page
            if (nextPage) {
                // If Set to continue to Next page automatically
                if (localStorage.getItem('iterateThroughAllPages') === 'true') {
                    let msg = 'Loading next page...'
                    setButtonToLoadingState(msg)
                    localStorage.setItem('runAgain', true)
                    nextPage.click()
                // If not set to continue to Next page automatically
                } else {
                    let continueToNextPage = window.confirm('All Reward Transactions on this page are marked as "Staked". Continue to next page?')
                    if (continueToNextPage) {
                        localStorage.setItem('runAgain', true)
                        nextPage.click()
                    } else {
                        localStorage.setItem('runAgain', false)
                        localStorage.setItem('iterateThroughAllPages', false)
                    }
                }
            // If there is not another page
            } else {
                alert('All Reward Transactions on this page are marked as "Staked" and you have reached the last page.')
                localStorage.setItem('runAgain', false)
                localStorage.setItem('iterateThroughAllPages', false)
                tamperMonkeyButton.querySelector('a').classList.add('disabled')
            }
        }
    }
}

function initCheckNextUnmarkedItem () {
    let iterateThroughAllPages = window.confirm('Would you like to run this script automatically for all pages?')
    if (iterateThroughAllPages) {
        localStorage.setItem('iterateThroughAllPages', true)
    } else {
        localStorage.setItem('iterateThroughAllPages', false)
    }
    checkNextUnmarkedItem();
}

if (localStorage.getItem('runAgain') === 'true') {
    checkNextUnmarkedItem();
}


