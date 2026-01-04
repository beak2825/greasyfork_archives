// ==UserScript==
// @name         Colab Save History
// @namespace    http://tampermonkey.net/
// @version      2025-03-18
// @description  Automatically save code & chat history on Colab notebook and button download
// @author       DSPM
// @match        https://colab.research.google.com/drive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527667/Colab%20Save%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/527667/Colab%20Save%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================================================================================
    //                                     Core infrastructure
    // ================================================================================================

    const localStorageKeyPrefix = "DSPMcollabHistory-";

    // ID of the current homework (e.g., "HW0", "HW1", etc.), or null if not known yet
    let DSPM_HWid = null;

    // Storage for all user history data. Periodically saved to localStorage
    // and loaded if the user refreshes the page
    let userHistoryData = null;

    // Request hooks look at outgoing XHR requests and can log information about the
    // contents of the request payload/body or the response body/payloud. Each hook
    // has two parts, a boolean function that takes the request and decides whether it
    // wants to analyze this specific request, and a function that takes the request
    // and response, which it can use to log any information that it wants.
    let requestHooks = [];

    // We need to spy on WebSockets to get information being sent to/from the kernel
    // to the backend.
    let wsSendHooks = [];
    let wsReceiveHooks = [];

    // Execution results often come in streams asynchronously so we need to capture
    // all the results and only log them once they have completed.
    let executionResults = {};

    // When the user focuses a cell, we remember the contents so that we can see the
    // difference between the code before and after, and also how long the user spent
    // editing the code in that cell
    let currentCell = null;
    let currentCellInitialCode = "";
    let currentCellPreviousCode = "";
    let currentCellFocusTime = 0;
    let currentCellFirstEditTime = 0;
    let currentCellLastEditTime = 0;


    let createdToolbar = false;


    // Given a textarea element, find all the code associated with that cell. This is not always equal to the
    // contents of the textarea because the notebook for some reason splits the code into chunks, so only one
    // chunk might be in the textarea.
    function getCodeInCell(textAreaElem) {
        return textAreaElem.closest('.editor').innerText;
    }

    // Returns the identifier of the homework (e.g., "HW0", "HW1", ...) if the current page is
    // the collab notebook for a homework, otherwise returns null
    function getHomeworkIdentifier() {
        const re = /Unique identifier for (HW[\d+]) Tampermonkey script, do not modify or delete!/;
        const outputElements = document.querySelectorAll(".output-content");
        for (let output of outputElements) {
            const match = output.innerText.match(re);
            if (match != null) {
                console.log(`✅ Found notebook identifier message: "${match[0]}"`);
                return match[1];
            }
        }
        return null;
    }

    // Initialize the user history either from localStorage if it has previously
    // been set, or initialize it from scratch if it has not been set before
    function initializeUserData() {
        console.assert(DSPM_HWid != null);
        let item = localStorage.getItem(localStorageKeyPrefix + DSPM_HWid);
        if (item == null) {
            console.log(`No previous user history data found for ${localStorageKeyPrefix + DSPM_HWid}`);
            console.log(`✅ Initializing fresh user history for ${localStorageKeyPrefix + DSPM_HWid}`);
            userHistoryData = {
                started: Date.now(),
                version: 0,
                events: []
            };
            saveUserData();
        }
        else {
            console.log(`Existing user history data found for ${localStorageKeyPrefix + DSPM_HWid}`);
            userHistoryData = JSON.parse(item);
            console.log("✅ Loaded existing data from localStorage:", userHistoryData);
        }

        // Save user history data back to localStorage every 30 seconds
        // setInterval(function() { saveUserData(); }, 30000);
    }

    // Save the current state of the user history to localStorage. We don't do this on every single
    // event because as the history gets large that might actually be noticable to performance.
    function saveUserData() {
        console.assert(DSPM_HWid != null);
        console.assert(userHistoryData != null);
        // https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
        try {
            localStorage.setItem(localStorageKeyPrefix + DSPM_HWid, JSON.stringify(userHistoryData));
            console.log(`✅ Saved user data to localStorage under key "${localStorageKeyPrefix + DSPM_HWid}"`);
            console.log("Current data:", userHistoryData);
        } catch (err) {
            // not enough space to store item in localStorage, ask user to save history and clear data
            console.warn("⚠️ Colab localStorage is full; QuotaExceededError", err);
            // window.alert("Colab localStorage is full, please download history now and the old history will be deleted.");
            downloadUserData();
            localStorage.removeItem(localStorageKeyPrefix + DSPM_HWid);
            initializeUserData();
        }
    }

    // Download the user data as a JSON file.
    //
    // For whatever reason, browsers don't particularly give a proper way to do this, so the hack
    // is to create a link to the file and click it programatically then delete it...
    //
    // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
    function downloadUserData() {
        console.assert(DSPM_HWid != null);
        console.assert(userHistoryData != null);

        let blob = new Blob([JSON.stringify(userHistoryData, undefined, 2)], {
            type: 'application/json'
        });

        const link = document.createElement("a");

        link.download = "DSPMuserData-" + DSPM_HWid + ".json";
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const evt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(evt);
        link.remove()
    }

    // Create the download button in the toolbar.
    function createToolbarDownloadButton() {
        console.assert(DSPM_HWid != null);
        console.assert(createdToolbar == false);

        let toolbar = document.querySelector("colab-notebook-toolbar");
        let textButton = document.querySelector("#toolbar-add-text");

        if (!toolbar || !textButton) {
            console.warn("⚠️ Colab toolbar not found.");
            return;
        }

        let downloadButton = document.createElement("colab-toolbar-button");
        downloadButton.innerHTML = "📥 Download History";
        downloadButton.style.marginLeft = "10px";
        downloadButton.style.padding = "5px 10px";

        downloadButton.addEventListener("click", downloadUserData);

        // Insert button after "+ Text"
        textButton.parentNode.insertBefore(downloadButton, textButton.nextSibling);
        createdToolbar = true;
        console.log("✅ Add Download History button added to Colab toolbar.");
    }

    function recordUserData(event) {
        console.assert(DSPM_HWid != null);
        console.assert(userHistoryData != null);

        userHistoryData.events.push({timestamp: Date.now(), event: event});
        saveUserData();
    }

    // Hook the fetch function so that we can spy on requests/responses to/from the LLM
    function hookFetch() {

        let originalFetch = window.fetch;
        window.fetch = async function(resource, options) {

            const hooksToRun = requestHooks.filter((hook) => hook.hookRequest(resource));

            return originalFetch(resource, options).then(async response => {
                if (!response.ok) {
                    console.error(`❌ Fetch request failed with status: ${response.status}`);
                    return response;
                }

                // response.clone() is critical. Clone allows us to read the response body multiple times.
                hooksToRun.forEach((hook) => { hook.processResponse(resource, options, response.clone()); });
                return response;
            });
        };
    }

    // Hook WebSockets since these are how the collab notebook kernel communicates with the backend
    function hookWebSockets() {
        const nativeWebSocket = window.WebSocket;

        window.WebSocket = new Proxy(nativeWebSocket, {
            construct(target, args) {
                const socket = new target(...args);

                // Only hook the kernel backend socket, which for whatever reason seems
                // to be the one with the endpoint called /channels
                if (args[0].includes("/channels")) {

                    const nativeSend = socket.send;
                    socket.send = function(data) {
                        const msg = JSON.parse(data);
                        for (const sendHook of wsSendHooks) {
                            sendHook(msg);
                        }
                        nativeSend.apply(socket, arguments);
                    };

                    socket.addEventListener('message', (event) => {
                        const msg = JSON.parse(event.data);
                        for (const receiveHook of wsReceiveHooks) {
                            receiveHook(msg);
                        }
                    });
                }

                return socket;
            }
        });
    }

    // Add a new hook that can log information about requests and their responses
    //
    // hookRequest : Request -> bool   return true if the given request should be analyzed
    // processResponse : (Request, RequestInit, Response) -> void
    //
    function addRequestHook(hookRequest, processResponse) {
        requestHooks.push({
            hookRequest: hookRequest,
            processResponse: processResponse
        });
    }


    function addWsSendHook(onSend) {
        wsSendHooks.push(onSend);
    }

    function addWsReceiveHook(onMessage) {
        wsReceiveHooks.push(onMessage);
    }


    // Periodically check that we are in the HW collab
    // notebook and if so, set up data collection
    setInterval(function() {
        if (DSPM_HWid == null) {
            DSPM_HWid = getHomeworkIdentifier();
        }
        if (DSPM_HWid != null && !createdToolbar) {
            createToolbarDownloadButton();
        }
        if (DSPM_HWid != null && userHistoryData == null) {
            initializeUserData();
            setupDataCollection();
        }
    }, 5000);

    // Hook the fetch funtion and WebSockets so we can extract LLM data
    // and user code cell execution data, which are communicated via
    // requests and WebSockets respectively.
    hookFetch();
    hookWebSockets();


    // ================================================================================================
    //                                     Data collection
    // ================================================================================================

    function setupDataCollection() {
        // Log when the user sends a prompt to generate code
        addRequestHook(
            function(resource, options) {
                return (typeof resource == 'string' && resource.includes("/language-services/generateCode")) ||
                    (typeof resource == 'Request' && resource.url.includes("/language-services/generateCode"));
            },
            function(resource, options, response) {
                const requestPayload = options?.body ? JSON.parse(options.body) : {};
                const userPrompt = requestPayload[0] || "n/a";
                const systemPrompt = requestPayload[5] || "n/a";
                const currentCode = requestPayload[7][0][0] || "n/a";
                response.json().then((responseData) => {
                    const responseText = responseData[0][0][0] || "n/a";
                    recordUserData({
                        eventType: 'generateCode',
                        request: {user_prompt: userPrompt, system_prompt: systemPrompt, current_code: currentCode},
                        response: responseText
                    });
                });
            });

        // Log when the user has a conversation with the AI. Note that this includes "explain code", "explain bugs", etc.,
        // since these all go through the same endpoint, so we can't distinguish them by the request. Distinguishing them
        // can probably be done by examining the contents of the prompt.
        addRequestHook(
            function(resource, options) {
                return (typeof resource == 'string' && resource.includes("/language-services/converse")) ||
                    (typeof resource == 'Request' && resource.url.includes("/language-services/converse"));
            },
            function(resource, options, response) {
                const requestPayload = options?.body ? JSON.parse(options.body) : {};
                const userPrompt = requestPayload[0] || "n/a";
                const systemPrompt = requestPayload[2] || "n/a";
                const currentCode = requestPayload[7][2][0][0] || "n/a";
                response.text().then((responseText) => {
                    recordUserData({
                        eventType: 'converse',
                        request: {user_prompt: userPrompt, system_prompt: systemPrompt, current_code: currentCode},
                        response: responseText
                    });
                });
            });

        // Log when the user executes code
        addWsSendHook(function(msg) {
            if (msg?.header?.msg_type == "execute_request" && msg?.content?.silent == false) {
                console.log("Found an execute request!", msg.content.code);
                executionResults[msg.header.msg_id] = {
                    code: msg.content.code,
                    stdout: '',
                    stderr: '',
                    status: '',
                    error: null
                };
                recordUserData({
                    eventType: 'executeCode',
                    code: msg.content.code,
                    id: msg.header.msg_id,
                    silent: msg.content.silent // silent seems to indicate system code that was not run by the user?
                });
            }
        });

        // Log when the result of code execution becomes available
        addWsReceiveHook(function(msg) {
            const msgType = msg?.header?.msg_type;
            if (msgType == "stream") { // stream messages give output of stdout and stderr
                const msgId = msg.parent_header.msg_id;
                if (executionResults[msgId]) {
                    executionResults[msgId][msg.content.name] = (executionResults[msgId][msg.content.name] || '') + msg.content.text;
                }
            }
            else if (msgType == "error") {
                const msgId = msg.parent_header.msg_id;
                if (executionResults[msgId]) {
                    executionResults[msgId].error = msg.content;
                }
            }
            else if (msgType == "execute_result") { // execute_result seems to contain non-stdout/stderr output, e.g., formatted HTML output such as a table
                const msgId = msg.parent_header.msg_id;
                if (executionResults[msgId]) {
                    executionResults[msgId].data = msg.content.data;
                }
            }
            else if (msgType == "display_data") { // usually image display
                const msgId = msg.parent_header.msg_id;
                if (executionResults[msgId]) {
                    executionResults[msgId].display_data = true;
                    executionResults[msgId].data = msg.content.data;
                }
            }
            else if (msgType == "execute_reply") {
                const msgId = msg.parent_header.msg_id;
                if (executionResults[msgId]) {
                    executionResults[msgId].status = msg.content.status;
                    recordUserData({
                        eventType: 'executeCodeComplete',
                        results: executionResults[msgId]
                    });
                }
            }
        });

        // Capture focus events so that we can watch when the user starts editing code in a cell
        window.addEventListener("focusin", (e) => {
            let elem = document.activeElement;
            if (elem?.tagName == 'TEXTAREA' && elem?.closest('.editor') && elem?.closest('.cell.code')) {
                currentCell = elem;
                currentCellInitialCode = getCodeInCell(elem);
                currentCellPreviousCode = getCodeInCell(elem);
                currentCellFocusTime = Date.now();
                currentCellFirstEditTime = Infinity;
                currentCellLastEditTime = 0;
            }
        });

        // Capture unfocus events so that we know when the user has stopped editing a cell
        window.addEventListener("focusout", (e) => {
            if (currentCell) {
                checkForCodeChange();
                let currentContents = getCodeInCell(currentCell);
                if (currentContents != currentCellInitialCode) {
                    recordUserData({
                        eventType: 'editCodeCell',
                        cellId: currentCell.closest('.cell.code').id,
                        oldCode: currentCellInitialCode,
                        newCode: currentContents,
                        focusTime: currentCellFocusTime,
                        firstEditTime: currentCellFirstEditTime,
                        lastEditTime: currentCellLastEditTime,
                        unfocusTime: Date.now()
                    });
                }
                currentCell = null;
            }
        });
    }

    // Track when the user made the first and last change to the code cell (which should
    // be marginally more useful/precice than when they focused and unfocused the cell).
    function checkForCodeChange() {
        if (currentCell && getCodeInCell(currentCell) != currentCellPreviousCode) {
            currentCellFirstEditTime = Math.min(currentCellFirstEditTime, Date.now());
            currentCellLastEditTime = Math.max(currentCellLastEditTime, Date.now());
            currentCellPreviousCode = getCodeInCell(currentCell);
        }
    }
    setInterval(checkForCodeChange, 1000);


})();