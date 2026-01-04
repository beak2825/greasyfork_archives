// ==UserScript==
// @name         Auto Login for DataRangers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically fills username and password fields and submits the login form on DataRangers login page.
// @author       Your Name
// @match        *://*.volces.com/portal/auth/login*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494472/Auto%20Login%20for%20DataRangers.user.js
// @updateURL https://update.greasyfork.org/scripts/494472/Auto%20Login%20for%20DataRangers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeReactInputValue(inputDom,newText){
        let lastValue = inputDom.value;
        inputDom.value = newText;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputDom.dispatchEvent(event);
    }
    window.setTimeout(function() {
        fetch("https://cloudapi.bytedance.net/faas/services/ttwy2i/invoke/query_onpremise_env_record?page=1&limit=10&domain_name="+location.hostname).then(res => res.json()).then(res => {
            console.log(res.data)
            const target = res.data.find(it => {
                if (it.datarangers_url && it.admin_account && it.admin_password) {
                    if (location.href.includes(it.datarangers_url)) {
                        return true;
                    }
                }
                return false;
            })
            console.log(target)
            const usernameInput = document.querySelector('input[id="account_input"]');
            const passwordInput = document.querySelector('input[id="password_input"]');
            if (usernameInput && passwordInput) {
                changeReactInputValue(usernameInput, target.admin_account);
                changeReactInputValue(passwordInput, target.admin_password);
                // usernameInput.value = target.admin_account;
                // passwordInput.value = target.admin_password;

            }
            document.querySelector('button[type="submit"]').click();
        })
    }, 1000)
})();