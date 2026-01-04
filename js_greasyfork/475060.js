// ==UserScript==
// @name         Extract Google Business Data (v12)
// @namespace    https://example.com/
// @version      12.0
// @description  Extracts and displays Google Business data with a slide-out panel for logging and information display
// @author       sharmanhall
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/475060/Extract%20Google%20Business%20Data%20%28v12%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475060/Extract%20Google%20Business%20Data%20%28v12%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for the slide-out panel and popup
    GM_addStyle(`
        #google-panel-wrapper {
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100%;
            background-color: #1d1d1d;
            color: #fff;
            transition: right 0.3s ease;
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        }
        #google-panel-toggle {
            position: absolute;
            left: -30px;
            top: 50%;
            width: 30px;
            height: 60px;
            background-color: #F14E13;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        #google-panel-content {
            padding: 15px;
            height: 100%;
            overflow-y: auto;
        }
        #google-panel-content h3 {
            color: #F14E13;
            border-bottom: 1px solid #F14E13;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .google-info-item {
            margin-bottom: 15px;
        }
        .google-info-item strong {
            display: block;
            margin-bottom: 5px;
        }
        .google-info-item button {
            background-color: #F14E13;
            color: #fff;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 3px;
            margin-top: 5px;
        }
        #google-log {
            background-color: #2d2d2d;
            border: 1px solid #F14E13;
            padding: 10px;
            margin-top: 15px;
            height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
        }
        #google-panel-credits {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #888;
        }
        #google-popup {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #F14E13;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        #google-rescan-button {
            background-color: #F14E13;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
            box-shadow: 0 0 10px rgba(241, 78, 19, 0.5);
        }
        #google-rescan-button:hover {
            background-color: #ff6a3c;
        }
    `);

    // Create the slide-out panel
    const panelHTML = `
        <div id="google-panel-wrapper">
            <div id="google-panel-toggle">📊</div>
            <div id="google-panel-content">
                <h3>Business Information</h3>
                <button id="google-rescan-button">Rescan Page</button>
                <div id="google-business-info"></div>
                <h3>Console Log</h3>
                <div id="google-log"></div>
                <div id="google-panel-credits">
                    <small>v11.0 | by sharmanhall</small>
                </div>
            </div>
        </div>
    `;

    // Append the panel to the body
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Toggle panel visibility
    document.getElementById('google-panel-toggle').addEventListener('click', function() {
        const wrapper = document.getElementById('google-panel-wrapper');
        wrapper.style.right = wrapper.style.right === '0px' ? '-300px' : '0px';
    });

    // Function to log to both console and panel
    function logToPanel() {
        const args = Array.from(arguments);
        const logElement = document.getElementById('google-log');
        logElement.innerHTML += args.join(' ') + '<br><br>';
        logElement.scrollTop = logElement.scrollHeight;
    }

    // Popup notification system
    let popupQueue = [];
    let isShowingPopup = false;

    function showPopup(message, duration = 3000) {
        popupQueue.push({ message, duration });
        if (!isShowingPopup) {
            displayNextPopup();
        }
    }

    function displayNextPopup() {
        if (popupQueue.length === 0) {
            isShowingPopup = false;
            return;
        }
        isShowingPopup = true;
        const { message, duration } = popupQueue.shift();
        const popup = document.createElement('div');
        popup.id = 'google-popup';
        popup.textContent = message;
        document.body.appendChild(popup);
        // Fade in
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
        // Fade out and remove
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
                displayNextPopup(); // Show next popup in queue
            }, 300);
        }, duration);
    }

    // Function to update business information in the panel
    function updateBusinessInfo(info) {
        const infoElement = document.getElementById('google-business-info');
        infoElement.innerHTML = '';
        for (const [key, value] of Object.entries(info)) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'google-info-item';
            itemDiv.innerHTML = `<strong>${key}:</strong> ${value}`;
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(value).then(() => {
                    showPopup(`${key} copied to clipboard!`);
                }, () => {
                    showPopup(`Failed to copy ${key}`, 5000);
                });
            };
            itemDiv.appendChild(copyButton);
            infoElement.appendChild(itemDiv);
        }
    }

    // Function to extract data attributes
    function extractDataAttributes(element) {
        const attributes = {};
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-')) {
                attributes[attr.name] = attr.value;
            }
        }
        return attributes;
    }

    // Main script logic
    function extractBusinessInfo() {
        let businessInfo = {};

        // Extract business name (original method)
        let businessNameElement = document.querySelector('h2[data-attrid="title"]');
        if (!businessNameElement) {
            // New method for multi-location businesses
            businessNameElement = document.querySelector('.PZPZlf[data-attrid="title"]');
        }
        if (businessNameElement) {
            businessInfo['Business Name'] = businessNameElement.textContent.trim();
            console.log('%cBusiness name:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Business Name']);
            logToPanel('Business name:', businessInfo['Business Name']);
            showPopup('Business information found!');
        } else {
            console.error("Could not find the business name element on the page");
            logToPanel("Could not find the business name element on the page");
            showPopup('Failed to find business information', 5000);
        }

        // Extract PID (keep original method)
        let reviewButton = document.querySelector("#wrkpb");
        if (reviewButton) {
            businessInfo['Place ID'] = reviewButton.getAttribute("data-pid");
            businessInfo['Place ID URL'] = `https://www.google.com/maps/place/?q=place_id:${businessInfo['Place ID']}`;
            businessInfo['Write A Review URL'] = `https://search.google.com/local/writereview?placeid=${businessInfo['Place ID']}`;
            console.log('%cPlace ID:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Place ID']);
            console.log('%cPlace ID URL:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Place ID URL']);
            console.log('%cWrite A Review URL:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Write A Review URL']);
            logToPanel('Place ID:', businessInfo['Place ID']);
            logToPanel('Place ID URL:', businessInfo['Place ID URL']);
            logToPanel('Write A Review URL:', businessInfo['Write A Review URL']);

            let dataPidElement = document.createElement('div');
            dataPidElement.innerText = `PID: ${businessInfo['Place ID']}`;
            dataPidElement.style.fontSize = "14px";
            dataPidElement.style.color = "red";
            businessNameElement.append(dataPidElement);

            let pidButton = document.createElement('div');
            pidButton.className = "QqG1Sd";
            pidButton.innerHTML = `<a class="ab_button" href="${businessInfo['Place ID URL']}" role="button" target="_blank"><div>PlaceID</div></a>`;
            businessNameElement.append(pidButton);

            let writeReviewButton = document.createElement('div');
            writeReviewButton.className = "QqG1Sd";
            writeReviewButton.innerHTML = `<a class="ab_button" href="${businessInfo['Write A Review URL']}" role="button" target="_blank"><div>Write Review</div></a>`;
            businessNameElement.append(writeReviewButton);
        } else {
            console.error("Could not find the 'Write a Review' button on the page");
            logToPanel("Could not find the 'Write a Review' button on the page");
            showPopup('Failed to find PID information', 5000);
        }

        // Extract CID (multiple methods)
        let cid;
        let searchResultLink = document.querySelector('a[jscontroller="wuU7pb"]');
        if (!searchResultLink) {
            searchResultLink = document.querySelector('a[href*="ludocid"]');
        }
        if (searchResultLink) {
            if (searchResultLink.hasAttribute("data-rc_ludocids")) {
                cid = searchResultLink.getAttribute("data-rc_ludocids");
            } else {
                const href = searchResultLink.getAttribute("href");
                const match = href.match(/ludocid=(\d+)/);
                if (match) {
                    cid = match[1];
                }
            }
        }
        // New method: search for any "a.fl" selector
        if (!cid) {
            const flLinks = document.querySelectorAll('a.fl');
            for (let link of flLinks) {
                const href = link.getAttribute("href");
                const match = href.match(/ludocid=(\d+)/);
                if (match) {
                    cid = match[1];
                    break;
                }
            }
        }
        if (cid) {
            businessInfo['CID'] = cid;
            businessInfo['Local Google URL'] = `https://local.google.com/place?id=${businessInfo['CID']}&use=srp`;
            businessInfo['Maps Google URL'] = `https://maps.google.com/maps?cid=${businessInfo['CID']}`;
            businessInfo['Google Maps URL'] = `https://www.google.com/maps?cid=${businessInfo['CID']}`;
            console.log('%cCID:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['CID']);
            console.log('%cLocal Google URL:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Local Google URL']);
            console.log('%cMaps Google URL:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Maps Google URL']);
            console.log('%cGoogle Maps URL:', 'font-size: 16px; font-weight: bold; color:green', businessInfo['Google Maps URL']);
            logToPanel('CID:', businessInfo['CID']);
            logToPanel('Local Google URL:', businessInfo['Local Google URL']);
            logToPanel('Maps Google URL:', businessInfo['Maps Google URL']);
            logToPanel('Google Maps URL:', businessInfo['Google Maps URL']);

            // Extract and log all data attributes
            if (searchResultLink) {
                const dataAttributes = extractDataAttributes(searchResultLink);
                console.log('%cData Attributes:', 'font-size: 16px; font-weight: bold; color:green', dataAttributes);
                logToPanel('Data Attributes:', JSON.stringify(dataAttributes, null, 2));
            }

            let dataCidElement = document.createElement('div');
            dataCidElement.innerText = `CID: ${businessInfo['CID']}`;
            dataCidElement.style.fontSize = "14px";
            dataCidElement.style.color = "blue";
            businessNameElement.append(dataCidElement);

            let cidButton1 = document.createElement('div');
            cidButton1.className = "QqG1Sd";
            cidButton1.innerHTML = `<a class="ab_button" href="${businessInfo['Maps Google URL']}" role="button" target="_blank"><div>maps.google</div></a>`;
            businessNameElement.append(cidButton1);

            let cidButton2 = document.createElement('div');
            cidButton2.className = "QqG1Sd";
            cidButton2.innerHTML = `<a class="ab_button" href="${businessInfo['Local Google URL']}" role="button" target="_blank"><div>local.google</div></a>`;
            businessNameElement.append(cidButton2);

            let cidButton3 = document.createElement('div');
            cidButton3.className = "QqG1Sd";
            cidButton3.innerHTML = `<a class="ab_button" href="${businessInfo['Google Maps URL']}" role="button" target="_blank"><div>google.com/maps</div></a>`;
            businessNameElement.append(cidButton3);
        } else {
            console.error("Could not find the CID on the page");
            logToPanel("Could not find the CID on the page");
            showPopup('Failed to find CID information', 5000);
        }

        // Update business info in the panel
        updateBusinessInfo(businessInfo);
    }

    // Add event listener for the rescan button
    document.getElementById('google-rescan-button').addEventListener('click', function() {
        showPopup('Rescanning page...');
        extractBusinessInfo();
    });

    // Initial extraction on page load
    window.addEventListener("load", extractBusinessInfo);

    // Observe DOM changes to detect dynamic content loading
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if the added nodes contain relevant business information
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.querySelector('[data-attrid="title"]') || 
                         node.querySelector('.PZPZlf[data-attrid="title"]') ||
                         node.querySelector('#wrkpb') ||
                         node.querySelector('a[jscontroller="wuU7pb"]') ||
                         node.querySelector('a[href*="ludocid"]'))) {
                        extractBusinessInfo();
                        observer.disconnect(); // Stop observing once we've found and processed the information
                    }
                });
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();