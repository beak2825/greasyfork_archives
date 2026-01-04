// ==UserScript==
// @name         Is it Down?
// @version      0.4.3
// @namespace    https://greasyfork.org/en/users/113783-klattering
// @description  Simply pulls from TrackerStatus API.
// @match        https://redacted.ch/*
// @downloadURL https://update.greasyfork.org/scripts/395736/Is%20it%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/395736/Is%20it%20Down.meta.js
// ==/UserScript==

/**
 * Basic settings for the script.
 *
 * {string}  position      | Accepts 'relative', 'absolute' or 'fixed'.
 * {string}  placement     | Accepts 'top' or 'bottom'. Requires `position` to be 'absolute' or 'fixed'.
 * {boolean} isKuro        | Set to true if using the Kuro stylesheet.
 * {boolean} showIfStable  | Optional parameter to show this banner if everything is stable.
 */
const Settings = {
    position: 'fixed',
    placement: 'bottom',
    isKuro: false,
    showIfStable: false
}

// Set to 'true' if using the kuro stylesheet.
const isKuro = false;

(function() {
    'use strict';

    // Create the div for the trackerStatus.
    const trackerStatus = document.createElement('div');

    // Add default styling to the message.
    trackerStatus.style.position = Settings.position;
    trackerStatus.style.zIndex = '100';
    trackerStatus.style.display = 'none';
    trackerStatus.style.boxSizing = 'border-box';
    trackerStatus.style.width = '100%';

    // Create the paragraph to hold the text.
    const message = document.createElement('p');

    // Add styling to the message.
    message.style.color = 'white';
    message.style.textAlign = 'center';
    message.style.fontWeight = 'bold';
    message.style.margin = '0';

    const checkPlacement = function() {
        if (Settings.placement === 'top') {
            trackerStatus.style.top = '0';
        } else if (Settings.placement === 'bottom') {
            trackerStatus.style.position = 'fixed';
            trackerStatus.style.bottom = '0';
        }
    }

    if (Settings.position === 'absolute') {
        trackerStatus.style.position = 'absolute';
        checkPlacement();
    } else if (Settings.position === 'fixed') {
        trackerStatus.style.position = 'fixed';
        checkPlacement();
    }

    let messageText;
    let unstable = false;
    let downServiceNames = [];
    let serviceText;

    // Add 'trackerStatus' div to the beginning of the body.
    document.body.prepend(trackerStatus);

    // Add the message to the div.
    trackerStatus.append(message);

    // Open the request to the API.
    var request = new XMLHttpRequest();

    request.open('POST', 'https://red.trackerstatus.info/api/all/', true);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.onload = function() {

        var services = JSON.parse(this.response);


         Object.entries(services).forEach(service => {

                if (service[1].Status === "0") {
                   unstable = true;
                   trackerStatus.style.display = 'block';
                   if (Settings.isKuro) {
                     // Kuro styles overwrite others.
                     trackerStatus.style.position = 'absolute';
                     trackerStatus.style.top = '0';
                     trackerStatus.style.width = '100%';
                     trackerStatus.style.boxSizing = 'border-box';
                     document.body.style.position = 'relative';
                     document.body.style.top = '21px';
                     trackerStatus.style.top = '-26px';
                   }
                   trackerStatus.style.background = '#a00e0e';
                   trackerStatus.style.padding = '.25rem';
                   if (service[0] === "TrackerHTTP" || service[0] === "TrackerHTTPS") {
                        messageText = "The tracker is currently experiencing technical difficulties. <a style=\"color:white; text-decoration:underline\" href=\"https://red.trackerstatus.info\">More info</a>";
                   }
                } else {
                   trackerStatus.style.background = '#056b00';
                   messageText = 'All systems go.';
                }
            });

        if (request.status >= 200 && request.status < 400) {
            const downServices = Object.entries(services).filter(service => service[1].Status === '0');

            if (downServices.length) {
                unstable = true;
                trackerStatus.style.display = 'block';
                if (isKuro) {
                  // Kuro styles overwrite others.
                  trackerStatus.style.position = 'absolute';
                  trackerStatus.style.top = '0';
                  trackerStatus.style.width = '100%';
                  trackerStatus.style.boxSizing = 'border-box';
                  document.body.style.position = 'relative';
                  document.body.style.top = '21px';
                  trackerStatus.style.top = '-26px';
                }
                trackerStatus.style.background = '#a00e0e';
                trackerStatus.style.padding = '.25rem';
                downServices.forEach(service => {
                    downServiceNames.push(service[0]);
                });
                if (downServiceNames.length > 1) {
                    let last = downServiceNames.pop();
                    serviceText = downServiceNames.join(', ') + ' and ' + last + ' are ';
                    if (downServiceNames.includes('TrackerHTTP') || downServiceNames.includes('TrackerHTTP')) {
                        serviceText = 'tracker is ';
                    }
                } else {
                    serviceText = downServiceNames[0] + ' is ';
                }
                messageText = 'The ' + serviceText + 'currently experiencing technical difficulties. <a style="color:white; text-decoration:underline" href="https://red.trackerstatus.info">More info</a>';
            } else {
                trackerStatus.style.background = '#056b00';
                messageText = 'All systems go.';
            }

            if (unstable === false) {
                if (Settings.showIfStable) {
                    trackerStatus.style.display = 'block';
                } else {
                    trackerStatus.style.display = 'none';
                }
            }
        } else {
            console.log('error')
        }

        message.innerHTML = messageText;
    }

    request.send();

})();