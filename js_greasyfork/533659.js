// ==UserScript==
// @name         Claude Extended Mode Enforcer v1.4
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Force Claude AI to always use extended thinking mode
// @author       LituDev
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533659/Claude%20Extended%20Mode%20Enforcer%20v14.user.js
// @updateURL https://update.greasyfork.org/scripts/533659/Claude%20Extended%20Mode%20Enforcer%20v14.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalFetch = window.fetch;
    const targetPathEnd = '/chat_conversations'; // More specific target

    console.log("[Claude Extended Mode Enforcer] Initializing v1.4...");

    window.fetch = async function(input, init) {

        let resourceUrl = '';
        let requestMethod = '';
        let isChatCreationPOST = false;

        // --- Determine URL and Method ---
        if (input instanceof Request) {
            resourceUrl = input.url;
            requestMethod = input.method;
        } else if (typeof input === 'string' || input instanceof URL) {
            resourceUrl = input.toString();
            requestMethod = init?.method || 'GET'; // Use optional chaining and default
        } else {
             // Unknown input type, proceed with original fetch
             console.warn("[Claude Extended Mode Enforcer] Unknown fetch input type:", input);
             return originalFetch.apply(this, arguments);
        }

        // --- Check if it's the target POST request for chat creation ---
        // Be specific: ends with /chat_conversations and is POST
        isChatCreationPOST = resourceUrl.includes('/api/organizations/') &&
                             resourceUrl.endsWith(targetPathEnd) && // Use endsWith for specificity
                             requestMethod.toUpperCase() === 'POST';

        if (!isChatCreationPOST) {
             // Not the target request, proceed with original fetch
             return originalFetch.apply(this, arguments);
        }

        console.log(`[Claude Extended Mode Enforcer] Intercepted Chat Creation POST: ${resourceUrl}`);

        try {
            let modifiedInput = input;
            let modifiedInit = init;

            if (input instanceof Request) {
                // --- Handle Request Object Input ---
                const clonedRequest = input.clone(); // Clone to read body
                const bodyData = await clonedRequest.json(); // Read body as JSON

                bodyData.paprika_mode = "extended";
                console.log("[Claude Extended Mode Enforcer] Modifying Request body:", bodyData);

                // Create a NEW Request object with the modified body and necessary headers
                const headers = new Headers(input.headers); // Copy original headers
                headers.set('Content-Type', 'application/json'); // Ensure correct Content-Type

                // Create new Request based on the original one but override body/headers
                modifiedInput = new Request(input, {
                    body: JSON.stringify(bodyData),
                    headers: headers
                    // Method, credentials, mode etc. are inherited
                });
                modifiedInit = undefined; // Init is not used when fetch's first arg is a Request

            } else if (init?.body) {
                // --- Handle URL + Init Object Input ---
                const originalBody = init.body;
                let bodyText = '';

                // Need to handle different body types before parsing
                if (typeof originalBody === 'string') {
                    bodyText = originalBody;
                } else if (originalBody instanceof ReadableStream) {
                    // This is complex to handle reliably *within* the sync wrapper
                    console.warn("[Claude Extended Mode Enforcer] ReadableStream body detected in init - modification skipped.");
                    return originalFetch.apply(this, arguments); // Skip modification for streams in init
                } else if (originalBody instanceof Blob) {
                     bodyText = await originalBody.text();
                } else if (originalBody instanceof ArrayBuffer || ArrayBuffer.isView(originalBody)) {
                     bodyText = new TextDecoder().decode(originalBody);
                } else {
                     console.warn("[Claude Extended Mode Enforcer] Unsupported init.body type - modification skipped:", typeof originalBody);
                     return originalFetch.apply(this, arguments); // Skip modification
                }


                if (bodyText) {
                    const bodyData = JSON.parse(bodyText);
                    bodyData.paprika_mode = "extended";
                    console.log("[Claude Extended Mode Enforcer] Modifying init.body:", bodyData);

                    // Create a *new* init object to avoid side effects, copying properties
                    modifiedInit = { ...init }; // Shallow copy is usually sufficient here
                    modifiedInit.body = JSON.stringify(bodyData);

                    // Ensure headers object exists if we need to modify it
                    if (!modifiedInit.headers) {
                         modifiedInit.headers = {};
                    } else if (modifiedInit.headers instanceof Headers) {
                         // Convert Headers object to plain object if needed, or work with Headers API
                         // For simplicity, just ensure Content-Type is set if needed
                    }

                    // Ensure Content-Type is correctly set (might be redundant, but safe)
                    if (typeof modifiedInit.headers === 'object' && !Array.isArray(modifiedInit.headers)) {
                         modifiedInit.headers['Content-Type'] = 'application/json';
                         // Let the browser handle Content-Length
                         delete modifiedInit.headers['Content-Length'];
                     } else if (modifiedInit.headers instanceof Headers) {
                          modifiedInit.headers.set('Content-Type', 'application/json');
                          modifiedInit.headers.delete('Content-Length');
                     }

                } else {
                     console.warn("[Claude Extended Mode Enforcer] init.body present but could not be read as text.");
                     return originalFetch.apply(this, arguments); // Skip if body couldn't be read
                }
            } else {
                console.warn("[Claude Extended Mode Enforcer] Chat Creation POST detected, but no body found to modify.");
                // Still proceed, maybe it's a request type we don't expect?
                 return originalFetch.apply(this, arguments);
            }

            // --- Call original fetch with potentially modified arguments ---
            console.log("[Claude Extended Mode Enforcer] Proceeding with fetch call.");
            return originalFetch.apply(this, [modifiedInput, modifiedInit]);

        } catch (error) {
            console.error("[Claude Extended Mode Enforcer] Error during modification:", error);
            // Fallback to original fetch if any error occurs during modification
            return originalFetch.apply(this, arguments);
        }
    };

    console.log("[Claude Extended Mode Enforcer] v1.4 Hooked into fetch.");

})();