// ==UserScript==
// @name         eTickerLoad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download ticker
// @author       You
// @match        https://www.etoro.com/discover/markets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etoro.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460677/eTickerLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/460677/eTickerLoad.meta.js
// ==/UserScript==

async function getSymbols() {
  const symbolElements = new Set();

  // Get the initial page of symbols
  let nextPage = getSymbolsPage();
  nextPage.forEach(el => symbolElements.add(el));

  // Check if there are more pages
  let nextButton = document.querySelector('[automation-id="discover-market-next-button"]');
  while (nextButton && !nextButton.classList.contains('disabled')) {
    // Click the next page button
    nextButton.click();

    // Wait for the next page to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the symbols from the next page
    nextPage = getSymbolsPage();
    nextPage.forEach(el => symbolElements.add(el));

    // Get the next button
    nextButton = document.querySelector('[automation-id="discover-market-next-button"]');
  }

  // Extract the symbol text from each element and return as an array
  return Array.from(symbolElements);
}

function getSymbolsPage() {
  // Get all the symbol elements from the website
  const symbolElements = document.querySelectorAll('.symbol');

  // Return an array of symbol elements
  return Array.from(symbolElements).map(el => el.textContent.trim());
}


function downloadLink(symbols){
    const data = 'data:text/plain;charset=utf-8,' + encodeURIComponent(symbols.join('\n'));

    // Create a download link for the plain text file
    const downloadLink = document.createElement('a');
    const fileName = location.href.match(/\/([^/?]+)(\?|$)/)[1] + '.txt';
    downloadLink.setAttribute('href', data);
    downloadLink.setAttribute('download', fileName);
    downloadLink.click();
}

async function getSymbolsDownload(){
    const symbolsArray = await getSymbols();
    downloadLink(symbolsArray)
}

//downloadLink(getSymbolsPage())
//downloadLink(getSymbols())

const buttonStyle = `
        --et-flag-28-20-2-width: 28px;
    --et-flag-28-20-2-height: 20px;
    --et-flag-28-20-2-radius: 2px;
    --primary-100: #3FB923;
    --primary-100-hover: #48C328;
    --primary-110: #3DAE23;
    --primary-110-hover: #46BA28;
    --primary-10: #E7F9EA;
    --primary-10-hover: #F1FBF3;
    --primary-100-dm: #ADF68D;
    --primary-100-dm-hover: #C1F8A9;
    --primary-var-100: #E8464A;
    --primary-var-100-hover: #F95E63;
    --primary-var-110: #D0021B;
    --primary-var-110-hover: #D7021F;
    --primary-var-10: #F8E4E6;
    --primary-var-10-hover: #FBEFF1;
    --primary-var-100-dm: #FF6A6A;
    --primary-var-100-dm-hover: #FF9494;
    --secondary-100: #2999F5;
    --secondary-100-hover: #2FA8F6;
    --secondary-100-dm: #80CDFF;
    --secondary-100-dm-hover: #9CD8FF;
    --neutral-100: #2c2c2c;
    --neutral-90: #777;
    --neutral-70: #bababa;
    --neutral-40: #ddd;
    --neutral-20: #f1f1f1;
    --neutral-10: #f7f7f7;
    --neutral-0: #fff;
    --neutral-100-dm: #fff;
    --neutral-90-dm: #CACBD1;
    --neutral-70-dm: #85899B;
    --neutral-40-dm: #555B70;
    --neutral-20-dm: #32374B;
    --neutral-10-dm: #272B3A;
    --neutral-0-dm: #181C27;
    --button-basic-transition-delay-border-color: .65s;
    --button-basic-transition-delay-background-color: .5s;
    --button-basic-transition-delay-color-transform: .5s;
    --input-transition-delay-border-color: .25s;
    --input-line-animation-transition-delay-transform: .5s;
    --input-label-transition-delay-transform: .25s;
    --input-label-transition-delay-padding: .25s;
    --input-error-transition-delay-opacity: 1s;
    text-size-adjust: 100%;
    font-family: 'Open Sans',sans-serif;
    --et-layout-position-top-start: 0px;
    --et-layout-header-height: 71px;
    --et-layout-header-animation-speed: 0.4s;
    --et-layout-sidenav-animation-speed: 0.3s;
    --et-layout-footer-height: 0px;
    --layout-sidenav-expanded-container-width: 340px;
    --layout-sidenav-expanded-body-width: 100%;
    --layout-sidenav-collapsed-container-width: 80px;
    --layout-sidenav-collapsed-body-width: 100%;
    --layout-sidenav-expanded-collapsed-ratio: 4.25;
    --layout-sidenav-expanded-minus-collapsed-size: 260px;
    --et-layout-sidenav-state-container-width: var(--layout-sidenav-expanded-container-width);
    direction: ltr;
    text-align: left;
    white-space: nowrap;
    margin: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    font-size: 14px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color .2s linear;
    box-sizing: border-box;
    box-shadow: inset 0 1px #c8c8c866,0 1px 2px #0000004d;
    user-select: none;
    display: flex;
    align-items: center;
    background-color: #3d99da;
    border: 1px solid #1e6ca4;
    padding: 7px 10px;
    text-transform: none;
    color: #fff;
    font-weight: 400;
    height: 34px;
`;

var addButtonInterval
//= setInterval(addButton, 1000);

 function addGetSymbolButton(){
     if (!window.location.href.includes("discover/markets")) {
      return;
     }
     if (document.getElementById("symbolDownloadButton") !== null) {
        return;
     }

    // create button element
    const button = document.createElement('button');
    button.innerText = "Get Tickers";
    button.style = buttonStyle;
    button.id = "symbolDownloadButton";
        // Add a click event listener to the button
    button.addEventListener('click', () => {
        // Call the get_symbols() function to extract the symbols
        getSymbolsDownload()
        // Convert the symbols to plain text
    });

    const lastTagMarket = document.querySelector('.tag-market:last-of-type');
   lastTagMarket.parentElement.insertBefore(button, lastTagMarket.nextSibling);

     //clearInterval(addButtonInterval);
}

window.addGetSymbolButton = addGetSymbolButton

document.addEventListener('DOMContentLoaded', () => {
  addGetSymbolButton();
});

(function() {
  'start';

    // Create a new observer object
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if the mutation added new nodes to the page
            if (mutation.addedNodes.length > 0) {
                // Call addButton() to add the button to the new nodes
                addGetSymbolButton();
            }
        });
    });

    // Start observing the page for changes
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.onload = function() {
        addGetSymbolButton();
    };

})();