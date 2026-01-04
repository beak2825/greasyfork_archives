// ==UserScript==
// @name         CSGO Empire Coin to Dollar
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Setting the CSGOEmpire Coin Value to a Dollar Value Equivalent.
// @author       Discord - vlad.mp
// @match        *csgoempire.com/*
// @match        *csgoempire.com/*
// @match        *csgoempire.gg/*
// @match        *csgoempire.tv/*
// @match        *csgoempiretr.com/*
// @match        *csgoempire88.com/*
// @match        *csgoempire.cam/*
// @match        *csgoempirev2.com/*
// @match        *csgoempire.io/*
// @match        *csgoempire.info/*
// @match        *csgoempire.vip/*
// @match        *csgoempire.fun/*
// @match        *csgoempire.biz/*
// @match        *csgoempire.vegas/*
// @match        *csgoempire.link/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470522/CSGO%20Empire%20Coin%20to%20Dollar.user.js
// @updateURL https://update.greasyfork.org/scripts/470522/CSGO%20Empire%20Coin%20to%20Dollar.meta.js
// ==/UserScript==

(function() {
    let coinValue = 0.614; // The conversion rate between CSGO Empire coins and dollars

    const localesWithCommaDecimalSeparator = [
        'af', 'ca', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'fr-FR', 'hu', 'it', 'nl', 'pl', 'pl-PL', 'pt', 'pt-PT', 'ro', 'ru', 'sk', 'sv', 'tr', 'uk'
    ];      

    function setDollarValue() {
        const coinsElement = document.querySelector('.font-numeric > div > span');
        if (!coinsElement) return;
      
        const userLocale = navigator.language; 
        const currentValue = localesWithCommaDecimalSeparator.includes(userLocale) ? 
                                    parseFloat(coinsElement.textContent.replace(",", '.')) : // Replace comma with dot for locales that use comma as decimal separator
                                    parseFloat(coinsElement.textContent.replace(",", '')); 

        const dollarValue = currentValue * coinValue;
        const htmlString = `${currencyFormat(currentValue)} (<a style='color:white;'>$${currencyFormat(dollarValue)}</a>)`;
        coinsElement.innerHTML = htmlString;
    }
      
    function setWithdrawDollarValue(withdrawRow) {
        if (!withdrawRow) return;
        
        const userLocale = navigator.language;
        const currentValue = localesWithCommaDecimalSeparator.includes(userLocale) ? 
                                    parseFloat(coinsElement.textContent.replace(",", '.')) : // Replace comma with dot for locales that use comma as decimal separator
                                    parseFloat(coinsElement.textContent.replace(",", '')); 

        const dollarValue = currentValue * coinValue;
        const htmlString = `${currencyFormat(currentValue)} (<a style='color:white;'>$${currencyFormat(dollarValue)}</a>)`;
        withdrawRow.innerHTML = htmlString;
    }

    function currencyFormat(amount) {
        return new Intl.NumberFormat('en-US').format(amount);
    }

    function RefreshButton()
    {
        setDollarValue();
        let elements = document.querySelectorAll('.item__price > span > div');
        for (let element of elements) {
            if (element) {
                setWithdrawDollarValue(element); // Update the displayed values
            }
        }
    }

    function addRefreshButton() {
        // Create the wrapper div element
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('mr-2', 'flex', 'items-center');

        // Create the refresh button element
        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.classList.add('button-primary', 'pop', 'stretch', 'flex');
        refreshButton.style.backgroundColor = 'orange';
        refreshButton.style.color = 'white';
        refreshButton.style.border = 'none';
        refreshButton.style.borderRadius = '4px';
        refreshButton.style.padding = '5px';
        refreshButton.style.height = '30px';
        refreshButton.style.fontSize = '25px';
        refreshButton.textContent = '\u27F3';

        // Append the refresh button to the wrapper div
        wrapperDiv.appendChild(refreshButton);

        // Insert the wrapper div before the last div inside the container element with class "flex pr-lg"
        document.querySelector('.flex.pr-lg').insertBefore(wrapperDiv, document.querySelector('.flex.pr-lg').lastElementChild);

        // Add event listener to the refresh button
        refreshButton.addEventListener('click', RefreshButton);
    }

    const observer = new MutationObserver(function(mutationsList) { // Create a MutationObserver to monitor changes to the document
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (document.querySelector('.font-numeric > div > span')) { // Check if the desired element is now available
                    setDollarValue(); // Update the displayed values
                    addRefreshButton();
                    observer.disconnect(); // Stop observing changes once the element is found
                    break;
                }
            }
        }
    });

    const withdrawObserver = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                let elements = document.querySelectorAll('.item__price > span > div');
                for (let element of elements) {
                    if (element) {
                        setWithdrawDollarValue(element); // Update the displayed values
                    }
                }
                withdrawObserver.disconnect(); // Stop observing changes
            }
        }
    });

    const pageLayoutObserver = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let pageLayoutInner = document.querySelector('.items-grid');
                if (pageLayoutInner.childElementCount >= 80) {
                    // Start observing the target node for configured mutations
                    withdrawObserver.observe(pageLayoutInner, { childList: true, subtree: true });
                    pageLayoutObserver.disconnect(); // Stop observing for the page-layout__inner
                }
            }
        }
    });

    const config = { childList: true, subtree: true }; // Configuration for the observer

    observer.observe(document.documentElement, config); // Start observing the website
    pageLayoutObserver.observe(document, config);
})();
