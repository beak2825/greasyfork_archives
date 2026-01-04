// ==UserScript==
// @name         Bludclart Extension (watch.bludclart.com)
// @namespace    https://watch.bludclart.com/
// @version      1.6
// @description  Bludclart extension by deeone / Custom / rdwxth — bypass CORS for watch.bludclart.com and other sites
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/538940/Bludclart%20Extension%20%28watchbludclartcom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538940/Bludclart%20Extension%20%28watchbludclartcom%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[TM] Tampermonkey Fetch Bridge initialized");

    window.addEventListener("message", (event) => {
        console.log("[TM] Received message event:", event);
        const data = event.data;
        console.log("[TM] Parsed event data:", data);

        // Only listen to messages coming from the page
        if (data?.direction !== "page-to-tampermonkey") {
            console.log("[TM] Ignored message with unexpected direction:", data?.direction);
            return;
        }

        // === New: Respond to check-userscript ping ===
        if (data.type === "check-userscript") {
            console.log("[TM] ✅ Check-userscript request received");
            window.postMessage({
                direction: "tampermonkey-to-page",
                type: "check-userscript-response",
                detected: true
            }, "*");
            return;
        }

        // Only handle fetch requests after this point
        if (data.type !== "fetch-request") {
            console.log("[TM] Ignored message with unknown type:", data?.type);
            return;
        }

        const { url, method = "GET", headers = {}, body = null } = data.payload;
        const requestId = data.requestId;

        console.log(`[TM] Processing fetch-request (ID: ${requestId})`);
        console.log("[TM] → URL:", url);
        console.log("[TM] → Method:", method);
        console.log("[TM] → Headers:", headers);
        console.log("[TM] → Body:", body);

        try {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data: body,
                onload: (response) => {
                    console.log(`[TM] ✅ Fetch complete for requestId: ${requestId}`);
                    console.log("[TM] → Status:", response.status, response.statusText);
                    console.log("[TM] → Headers:", response.responseHeaders);
                    console.log("[TM] → Response Text:", response.responseText?.slice(0, 500));

                    window.postMessage({
                        direction: "tampermonkey-to-page",
                        type: "fetch-response",
                        requestId,
                        status: response.status,
                        statusText: response.statusText,
                        responseText: response.responseText,
                        headers: response.responseHeaders,
                    }, "*");
                },
                onerror: (error) => {
                    console.error(`[TM] ❌ Fetch error for requestId: ${requestId}`, error);
                    window.postMessage({
                        direction: "tampermonkey-to-page",
                        type: "fetch-error",
                        requestId,
                        error: {
                            message: error?.message || "Unknown error",
                            details: error,
                        }
                    }, "*");
                }
            });
        } catch (err) {
            console.error(`[TM] ❗ Exception during GM_xmlhttpRequest for requestId: ${requestId}`, err);
            window.postMessage({
                direction: "tampermonkey-to-page",
                type: "fetch-error",
                requestId,
                error: {
                    message: "Exception during GM_xmlhttpRequest",
                    details: err.message || err.toString()
                }
            }, "*");
        }
    });
})();
