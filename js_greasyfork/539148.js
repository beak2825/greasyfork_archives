// ==UserScript==
// @name         Wildhare Shoplifting Observer
// @namespace    wildhareShopliftingObserver
// @version      2025-06-11.2
// @description  watch for security to be disabled at shoplifting locations
// @author       Wildhare
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_xmlhttpRequest
// @connect      api.pushover.net
// @downloadURL https://update.greasyfork.org/scripts/539148/Wildhare%20Shoplifting%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/539148/Wildhare%20Shoplifting%20Observer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let APP_TOKEN = '';
    let USER_KEY = '';

    function _sendNotification(notification_text) {
        var options = {
              body: ""
          }
        var notification = new Notification(notification_text, options);
        new Audio('https://www.torn.com/audio/chat/Double_2.mp3').play()
        if (APP_TOKEN && USER_KEY) {
            let pushoverUrl = `https://api.pushover.net/1/messages.json?token=${APP_TOKEN}&user=${USER_KEY}&message=${notification_text}`
            GM_xmlhttpRequest({
                method: 'POST', // Specify the HTTP method
                url: pushoverUrl, // Replace with your API endpoint URL
                onload: function(responseDetails) {
                    // Handle the API response here
                    console.log("API response:", responseDetails.responseText);
                },
                onerror: function(responseDetails) {
                    // Handle errors here
                    console.error("API error:", responseDetails);
                }
            });
        }

    }

    function notifyMe(notification_text) {

        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else {
            _sendNotification(notification_text);
        }

    }

    function checkSecurityIsDown(node) {
        let securityAttributeValue = node.getAttribute('aria-label');
        let cameraString = 'recording';
        let guardString = 'patrolling';
        let checkpointString = 'enabled';
        if (securityAttributeValue.includes('Camera') && !securityAttributeValue.includes(cameraString) && !securityAttributeValue.includes(guardString) && !securityAttributeValue.includes(guardString)) {
            return true;
        } else {
            return false;
        }
    }

    function processNode(node) {
        // Comment out jewelry store condition to check all subcrimes
         let jewelryStoreNode = document.querySelector('div.virtualList___noLef > div:nth-child(7) > div.crimeOptionWrapper___IOnLO > div > div > div.crimeOptionSection___hslpu.securityMeasuresSection___kkAst');
         let gunShopNode = document.querySelector('div.virtualList___noLef > div:nth-child(8) > div.crimeOptionWrapper___IOnLO > div > div > div.crimeOptionSection___hslpu.securityMeasuresSection___kkAst');
        if (node === jewelryStoreNode || node === gunShopNode) {
            if (checkSecurityIsDown(node)) {
                notifyMe("Torn shoplifting security is down!")
            }
         }
    }

    function getCrimesContainer() {
        const crimesContainerName = document.querySelectorAll('[class^="currentCrime"]')[0].classList[0];
        return document.getElementsByClassName(crimesContainerName)[0].children[3];
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The part of the script that starts listening to the page is below
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// If we land directly on shoplift page, these handle it correctly.
  if (window.location.href.includes('#/shoplifting')) {
    setTimeout(startListeningToAlertOnSecurity, 650);
  }

//
// GreaseMonkey can't listen for Shoplifting page directly, so we run this on all crimes pages.
// however if we navigate away from Pickpocket, we stop listening with our observer
//
  function handleCrimesHeaderMutation(mutations) {
    const headerText = mutations[0].target.textContent;
    if (headerText === 'Shoplifting') {
      setTimeout(startListeningToAlertOnSecurity, 650);
    } else if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  }

  let crimesHeaderTarget = document.querySelector('.crimes-app h4[class^="heading"');
  let crimesHeaderObserver = new MutationObserver(handleCrimesHeaderMutation);
  crimesHeaderObserver.observe(crimesHeaderTarget, { characterData: true, attributes: false, childList: false, subtree: true});

  let observer;
  function startListeningToAlertOnSecurity() {
    if (observer) {
      return;
    }

    // Select the node that will be observed for mutations
    const targetNode = getCrimesContainer();
    const securityAttributeName = 'aria-label'

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true, attributeFilter: [ securityAttributeName ] };

    // Callback function to execute when mutations are observed
    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === securityAttributeName) {
            processNode(mutation.target);
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }


})();