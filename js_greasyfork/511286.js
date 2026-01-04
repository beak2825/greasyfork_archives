// ==UserScript==
// @name         Collab-VM Turnstile JS Extension
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  makes it so xtoys can see if you actually take a turn on collabvm via hacky webhook stuff. Special thanks to Elijahr. 
// @author       Wulf715, ElijahR.dev
// @match        https://computernewb.com/collab-vm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=computernewb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511286/Collab-VM%20Turnstile%20JS%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/511286/Collab-VM%20Turnstile%20JS%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("hideFlagCheckboxLabel").insertAdjacentHTML("afterend", `<br><label for="xToysWebhook">XToys Webhook ID</label><br><input id="xToysWebhook" type="text" class="form-control" name="xtoyswebhook" required="" placeholder="Webhook Goes Here.">`);
    
    let xToysWebhook = document.getElementById("xToysWebhook");
    let accountSettingsForm = document.getElementById("accountSettingsForm");
    let xtoysurl;
    accountSettingsForm.addEventListener("submit", () => {
        xtoysurl = `https://webhook.xtoys.app/${xToysWebhook.value}`;
    });

    let mo = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) if (mutation.type === "attributes" && mutation.attributeName === "style") {
            console.log("VM was opened or closed (probably lol)");
            let vm = window.collabvm.getVM();
            if (vm === null) return;
            window.hasTurn = false;
            vm.on('turn', () => {
                window.hasTurn = (vm.users.find(u => u.username === vm.username).turn === 0);
                if (window.hasTurn === true) {
                    fetch(`${xtoysurl}?action=start`);
                }
                if (window.hasTurn === false) {
                    fetch(`${xtoysurl}?action=stop`);
                }
            });
        }
    });
    mo.observe(document.getElementById("vmview"), {attributes: true});

})();