// ==UserScript==
// @name         Conceptual VideoFX API Redirect Attempt (v0.6 - Force Random Seed per Output)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Redirects & transforms body. FORCES a new RANDOM SEED for each output. MAJOR ISSUES REMAIN (AUTH, RESPONSE)! LIKELY TO FAIL/BREAK SITE!
// @match        https://labs.google/*
// @grant        unsafeWindow
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535853/Conceptual%20VideoFX%20API%20Redirect%20Attempt%20%28v06%20-%20Force%20Random%20Seed%20per%20Output%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535853/Conceptual%20VideoFX%20API%20Redirect%20Attempt%20%28v06%20-%20Force%20Random%20Seed%20per%20Output%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newApiUrlPattern = 'https://aisandbox-pa.googleapis.com/v1/video:batchAsyncGenerateVideoText';
    const oldApiUrl = 'https://aisandbox-pa.googleapis.com/v1:runVideoFxSingleClips';

    const originalFetch = unsafeWindow.fetch;

    // Base structure for the OLD API body
    const oldApiRequestBodyStructure = {
        "aspectRatio": "VIDEO_ASPECT_RATIO_LANDSCAPE",
        "modelInput": { "modelNameType": "VEO_2_0_T2V" }, // WARNING: Is this model correct for the old API?
        "flags": { "consumeInternalQuota": false },
        "clientContext": { "sessionId": "", "tool": "VIDEO_FX" },
        "userInput": { "promptImageInputs": [] }
    };

    unsafeWindow.fetch = function(...args) {
        let url = args[0] instanceof Request ? args[0].url : args[0];
        let options = args[0] instanceof Request ? {} : args[1] || {};

        if (args[0] instanceof Request) {
            options.method = args[0].method;
            options.headers = {};
            args[0].headers.forEach((value, key) => { options.headers[key] = value; });
            options.body = args[0].body;
            options.credentials = args[0].credentials;
            options.mode = args[0].mode;
            options.signal = args[0].signal;
            options.referrer = args[0].referrer;
            options.referrerPolicy = args[0].referrerPolicy;
        }

        if (typeof url === 'string' && url.startsWith(newApiUrlPattern) && options.method === 'POST') {
            GM_log('Attempting to intercept VideoFX POST call to: ' + url);

            try {
                const modifiedOptions = { ...options };
                if (options.signal) {
                    modifiedOptions.signal = options.signal;
                    GM_log('AbortSignal preserved.');
                }

                let originalBodyData;
                let newBodyData = JSON.parse(JSON.stringify(oldApiRequestBodyStructure));

                if (typeof options.body === 'string') {
                    try {
                        originalBodyData = JSON.parse(options.body);

                        const originalSessionId = originalBodyData?.clientContext?.sessionId;
                        const originalRequests = originalBodyData?.requests || [];

                        if (originalSessionId) {
                            newBodyData.clientContext.sessionId = originalSessionId;
                        } else {
                            GM_log("Warning: Could not find sessionId in original request.");
                            newBodyData.clientContext.sessionId = "MISSING_SESSION_" + Date.now();
                        }

                        if (originalRequests.length > 0) {
                            newBodyData.userInput.promptImageInputs = originalRequests.map((req, index) => {
                                const prompt = req?.textInput?.prompt || `MISSING_PROMPT_${index}`;
                                const sceneId = req?.metadata?.sceneId || `MISSING_SCENEID_${index}`;

                                const mappedItem = {
                                    prompt,
                                    sceneId
                                };

                                // MODIFIED SECTION FOR SEED:
                                // Always generate a new random seed for each item (output/candidate).
                                // This overrides any seed from the original request.
                                mappedItem.seed = Math.floor(Math.random() * 2000000000); // Generates a random integer up to 2 billion
                                GM_log(`Mapping request ${index}: Prompt='${prompt}', SceneId=${sceneId}, Seed=${mappedItem.seed} (FORCED RANDOM)`);

                                return mappedItem;
                            });
                            newBodyData.aspectRatio = originalRequests[0]?.aspectRatio || oldApiRequestBodyStructure.aspectRatio;
                            newBodyData.modelInput.modelNameType = originalRequests[0]?.videoModelKey || oldApiRequestBodyStructure.modelInput.modelNameType;
                        } else {
                            GM_log("Warning: Original request body had no 'requests' array data.");
                            newBodyData.userInput.promptImageInputs = [];
                        }

                        modifiedOptions.body = JSON.stringify(newBodyData);
                        GM_log('Transformed request body (forced random seed per output).');

                    } catch (parseError) {
                        GM_log('ERROR parsing original request body or transforming data: ' + parseError);
                        modifiedOptions.body = JSON.stringify(oldApiRequestBodyStructure);
                    }
                } else {
                    GM_log('WARNING: Original request body was not a string. Cannot transform.');
                    modifiedOptions.body = JSON.stringify(oldApiRequestBodyStructure);
                }

                if (modifiedOptions.headers && modifiedOptions.headers.authorization) {
                    GM_log('WARNING: Using existing auth token. It is probably invalid for the old API!');
                } else {
                    GM_log('WARNING: No authorization header found/intercepted?');
                }

                const newUrl = oldApiUrl;
                GM_log('Redirecting to OLD API URL: ' + newUrl);

                args[0] = newUrl;
                args[1] = modifiedOptions;

                GM_log('WARNING: UI expects response format from NEW API. Response from OLD API will likely cause errors.');

            } catch (e) {
                GM_log('Error during fetch interception: ' + e);
                return originalFetch.apply(unsafeWindow, arguments);
            }
        }

        return originalFetch.apply(unsafeWindow, args);
    };

    GM_log('Conceptual VideoFX API redirect script loaded (v0.6 - Force Random Seed per Output). MAJOR ISSUES REMAIN!');

})();