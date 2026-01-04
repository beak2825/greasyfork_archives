// ==UserScript==
// @name         Unlock Nyan model
// @namespace    https://github.com/irsat000/cai-unlock-nyan
// @version      2025-03-02
// @description  Can make CAI+ "Nyan" model the default ai model for chats
// @author       İrşat Akdeniz
// @match        https://character.ai/chat/*
// @icon         https://character.ai/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528547/Unlock%20Nyan%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/528547/Unlock%20Nyan%20model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAccessToken() {
        const meta = document.querySelector('meta[cai_token]');
        const tokenFromMeta = meta?.getAttribute('cai_token');
        if (tokenFromMeta) return tokenFromMeta;
        else null;
    }

    GM_registerMenuCommand('Make Nyan default', makeNyanDefault);

    function makeNyanDefault () {
        const AccessToken = getAccessToken();
        if (!AccessToken) {
            alert("Token not found, you need CAI Tools for resources.");
            return;
        }
        fetch("https://plus.character.ai/chat/user/update_settings/", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "authorization": AccessToken,
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                "modelPreferenceSettings": {
                    "defaultModelType": "MODEL_TYPE_SMART"
                }
            }),
            "method": "POST",
        }).then(res => {
            if (res.ok) {
                alert("SUCCESS! Nyan model is set to default. Refresh the page!");
            } else {
                throw new Error("Request rejected with code: " + res.statusCode)
            }
        }).catch((error) => {
            alert("Couldn't set to Nyan: " + error.message);
        })
    };
})();