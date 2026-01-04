// ==UserScript==
// @name         MessageCounter
// @namespace    Dicks
// @version      0.1
// @description  Counter messages sent on perplexity.ai
// @author       You
// @match        https://*.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473875/MessageCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/473875/MessageCounter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const { fetch: originalFetch } = unsafeWindow;

    let messageCounter = GM_getValue("sentMessages", 0);

    console.log("[MessageCounter] user has sent", messageCounter, "message(s)");
    unsafeWindow.fetch = async (...args) => {
        let [resource, config] = args;
        const response = await originalFetch(resource, config);

        if (/https:\/\/\w+.beta.perplexity.ai\/api\/\w+/gi.test(resource)) {
            try {
                const text = config.body;
                const data = JSON.parse(text);

                if (data.type !== "event") return response;
                if (!data.payload || !data.payload.event_name) return response;

                console.log("[MessageCounter] New event detected with name:", data.payload.event_name)

                if (data.payload.event_name === "submit query") {
                    messageCounter++;
                    console.log("[MessageCounter] New message sent, increased counter to", messageCounter);
                    GM_setValue("sentMessages", messageCounter);
                }
            } catch(err) {
                return response
            }
        }

        return response;
    };

})();