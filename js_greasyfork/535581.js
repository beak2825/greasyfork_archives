// ==UserScript==
// @name         MWI Simulator Auto Import
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Tools for Milky Way Idle Combat Simulator. Automatically imports set group settings from URL parameters. Also provides a share feature to share the current settings to online storage.
// @homepage     https://github.com/leonardodalinky/MWI-Simulator-Auto-Import
// @author       AyajiLin
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/*
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.textdb.online
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/535581/MWI%20Simulator%20Auto%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/535581/MWI%20Simulator%20Auto%20Import.meta.js
// ==/UserScript==

unsafeWindow.isAlertEnabled = true;

(function () {
    'use strict';

    /////////////////////
    //                 //
    //    Utilities    //
    //                 //
    /////////////////////
    // Function to create and show a floating message
    function showFloatingMessage(message, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${options.backgroundColor || 'rgba(0, 0, 0, 0.8)'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            transition: opacity 0.3s ease-in-out;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Auto-remove after delay (default: 3 seconds)
        const duration = options.duration || 3000;
        if (duration > 0) {
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300); // Match the CSS transition
            }, duration);
        }

        
        return messageDiv;
    }

    // Function to show error message
    function showErrorMessage(message, duration = 3000) {
        return showFloatingMessage(message, {
            backgroundColor: 'rgba(220, 53, 69, 0.9)', // Bootstrap danger color
            duration: duration
        });
    }

    // Function to show success message
    function showSuccessMessage(message, duration = 3000) {
        return showFloatingMessage(message, {
            backgroundColor: 'rgba(25, 135, 84, 0.9)', // Bootstrap success color
            duration: duration
        });
    }

    function clickGetPriceButton() {
        const getPriceButton = document.querySelector(`button#buttonGetPrices`);
        if (getPriceButton) {
            console.log("Click getPriceButton");
            getPriceButton.click();
        }
    }

    async function getGroupJson() {
        // Temporary disable alert
        unsafeWindow.isAlertEnabled = false;
        document.querySelector(`a#group-combat-tab`).click();
        document.getElementById('buttonExportSet').click();
        // Get json from clipboard
        const json = await navigator.clipboard.readText().finally(() => {
            unsafeWindow.isAlertEnabled = true;
        });
        return json;
    }

    //////////////////////
    //                  //
    //    TextDB API    //
    //                  //
    //////////////////////
    // Generate a random TextDB key (20-40 characters long)
    function generateTextDBKey() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
        const keyLength = 20 + Math.floor(Math.random() * 11); // Random length between 20 and 30
        let result = '';
        const randomValues = new Uint32Array(keyLength);
        window.crypto.getRandomValues(randomValues);
        
        for (let i = 0; i < keyLength; i++) {
            result += chars[randomValues[i] % chars.length];
        }
        return result;
    }

    async function save2TextDB(text) {
        // Generate a random key for TextDB
        let key = generateTextDBKey();
        console.log('Generated TextDB key:', key);

        // Encode the parameters for x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('key', key);
        params.append('value', text);

        // Check if the key already exists
        const checkResponse = await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.textdb.online/${encodeURIComponent(key)}`,
                onload: resolve,
                onerror: (error) => resolve({ status: 500, responseText: '' })
            });
        });
        
        if (checkResponse.status === 200 && checkResponse.responseText) {
            console.log('Key already exists, generating a new one...');
            key = generateTextDBKey();
            params.set('key', key);
        }
        
        // Save text to textdb.online
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.textdb.online/update/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: params.toString(),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status === 200 && result.status === 1) {
                            console.log('Text saved to TextDB successfully!', result);
                            resolve({
                                success: true,
                                key: result.data.key,
                                url: result.data.url,
                                reqId: result.req_id
                            });
                        } else {
                            console.error('Failed to save to TextDB:', result);
                            reject(new Error(`API Error: ${result.message || 'Unknown error'}`));
                        }
                    } catch (error) {
                        console.error('Error parsing API response:', error);
                        reject(new Error('Invalid response from TextDB API'));
                    }
                },
                onerror: function(error) {
                    console.error('Error saving to TextDB:', error);
                    reject(error);
                }
            });
        });
    }

    /////////////////
    //             //
    //    Share    //
    //             //
    /////////////////
    var shareURL = "";

    function showShareDialog() {
        const dialog = document.getElementById('shareModal');
        if (dialog) {
            dialog.style.display = "block";
            dialog.className = "modal show";
            dialog.ariaModal = "true";
            dialog.role = "dialog";
            dialog.removeAttribute("aria-hidden");
            document.body.classList.add("modal-open");
            document.body.style.overflow = "hidden";
            const modalBackdrop = document.createElement('div');
            modalBackdrop.className = "modal-backdrop show";
            document.body.appendChild(modalBackdrop);
        } else {
            console.error("Dialog not found");
        }
    }

    function hideShareDialog() {
        const dialog = document.getElementById('shareModal');
        if (dialog) {
            dialog.style.display = "none";
            dialog.className = "modal";
            dialog.removeAttribute("aria-modal");
            dialog.removeAttribute("role");
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
        } else {
            console.error("Share Dialog not found");
        }
    }

    function enableCopyButton() {
        const button = document.getElementById('buttonCopyShareURL');
        if (button) {
            button.disabled = false;
        }
    }

    function copyShareURL() {
        navigator.clipboard.writeText(shareURL)
            .then(() => {
                console.log('Share URL copied to clipboard!', shareURL);
                showSuccessMessage('Share URL copied to clipboard!');
            })
            .catch(error => {
                console.error('Error copying URL to clipboard:', error);
                showErrorMessage('Failed to copy share URL to clipboard');
            });
    }

    function setShareURLText() {
        // Set share URL textbox value and scroll to the end
        const input = document.getElementById('shareURLText');
        if (input) {
            input.value = shareURL;
            // Scroll to the end of the input
            input.scrollLeft = input.scrollWidth;
            // Set selection to the end (optional, shows cursor at end)
            input.selectionStart = input.selectionEnd = shareURL.length;
        }
    }

    async function share2TextDB() {
        try {
            const json = await getGroupJson();
            const response = await save2TextDB(json);
            console.log('Text saved to TextDB successfully!', response);
            
            // Get the current page's base URL (without query parameters)
            const baseURL = window.location.href.split('?')[0];
            shareURL = `${baseURL}?textdb=${response.key}`;
            showSuccessMessage('Text saved to TextDB successfully!');
            setShareURLText();
            enableCopyButton();
        } catch (error) {
            console.error('Error sharing to TextDB:', error);
            showErrorMessage(error.message || 'Failed to share to TextDB');
        }
    }


    function addShareDialog() {
        const dialogHtml = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Share / 分享</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" id="buttonCloseShare1"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row mb-3">
                                <div class="col-12">
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="shareURLText" value="Generated Share URL To Be Here..." readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-md-auto">
                                    <button type="button" class="btn btn-primary" id="buttonShareTextDB">TextDB</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="buttonCopyShareURL" disabled>Copy URL/复制链接</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="buttonCloseShare2">Close/关闭</button>
                    </div>
                </div>
            </div>
        `;
        const dialogDiv = document.createElement('div');
        dialogDiv.className = "modal";
        dialogDiv.id = "shareModal";
        dialogDiv.tabIndex = "-1";
        dialogDiv.style.display = "none";
        dialogDiv.ariaHidden = "true";
        dialogDiv.innerHTML = dialogHtml;
        const targetDiv = document.getElementById('houseRoomsModal');
        targetDiv.parentNode.insertBefore(dialogDiv, targetDiv.nextSibling);
        // Add `Share` button
        const button = document.createElement('button');
        button.id = "buttonShare";
        button.className = "btn btn-primary";
        button.type = "button";
        button.textContent = "Share/分享";
        button.onclick = showShareDialog;
        const buttonDiv = document.createElement('div');
        buttonDiv.className = "col-md-auto";
        buttonDiv.appendChild(button);
        const targetButton = document.getElementById('buttonImportExport');
        targetButton.parentNode.parentNode.insertBefore(buttonDiv, targetButton.parentNode.nextSibling);
        document.getElementById('buttonCloseShare1').onclick = hideShareDialog;
        document.getElementById('buttonCloseShare2').onclick = hideShareDialog;
        // Bind share logics
        document.getElementById('buttonShareTextDB').onclick = share2TextDB;
        document.getElementById('buttonCopyShareURL').onclick = copyShareURL;
    }

    //////////////////
    //              //
    //    Import    //
    //              //
    //////////////////
    // Function that runs when the page is fully loaded
    // This function is used to automatically import the set group combat all
    function onPageLoadForAutoImport() {
        // parse the url for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        // get url parameter "textdb" if exists
        const textdbID = urlParams.get('textdb');
        // get the import input element
        const importInputElem = document.querySelector(`input#inputSetGroupCombatAll`);
        if (importInputElem == null) {
            return;
        }
        if (textdbID) {
            // Fetch text from textdb.online using the token
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.textdb.online/${textdbID}`,
                onload: function(response) {
                    if (response.status === 200) {
                        if (response.responseText) {
                            document.querySelector(`a#group-combat-tab`).click();
                            importInputElem.value = response.responseText;
                            document.querySelector(`button#buttonImportSet`).click();
                            showSuccessMessage('Settings loaded successfully!');
                            clickGetPriceButton();
                        } else {
                            showErrorMessage('No settings found!');
                        }
                    } else {
                        showErrorMessage('Error loading settings!');
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching from textdb.online:', error);
                    showErrorMessage('Error loading settings!');
                }
            });
        }
    }

    // Add event listener for page load
    window.addEventListener('load', onPageLoadForAutoImport);
    // Add Share button
    addShareDialog();
    // Hook alert function
    unsafeWindow.alert = function(msg) {
        console.log("[alert]", msg);
        if (unsafeWindow.isAlertEnabled) {
            showFloatingMessage(msg);
        }
    };

})();