// ==UserScript==
// @name         Transparency for Darkmoders
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Transparent darkmode theme for moonbounce extension
// @author       frkl
// @match        *://*/*
// @icon         https://imagebucketmoonbounce-production.s3.amazonaws.com/profile_pictures/icons/monster_pfp.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499233/Transparency%20for%20Darkmoders.user.js
// @updateURL https://update.greasyfork.org/scripts/499233/Transparency%20for%20Darkmoders.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function checkPresence() {
        return (
            document.getElementById("moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem")?.shadowRoot != null
        );
    }

    function injectCSS() {
        const shadowRoot = document.querySelector("div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem")?.shadowRoot;

        if (!shadowRoot) {
            console.log("Shadow root not found. Retrying...");
            setTimeout(injectCSS, 500);
            return;
        }

        const moonbouncePortal = shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL");

        if (!moonbouncePortal) {
            console.log("Moonbounce portal not found. Retrying...");
            setTimeout(injectCSS, 500);
            return;
        }

        const Chatbox = document.createElement("style");
        Chatbox.textContent = `._middle_18nkb_19, ._form_base_bkmm0_27, ._container_k54cr_1._chat_k54cr_48, ._middle_chat_18nkb_44 {
            background-color: transparent; !important;
        }`;

                const Chatbox2 = document.createElement("style");
        Chatbox2.textContent = `._overlay_card_18nkb_9 {
            background-color: #0000008c; !important;
        }`;

         const Text = document.createElement("style");
        Text.textContent = `._base_lt12z_1, ._message_1v20q_29, ._base_1p6ux_1 ._title_1p6ux_4 {
            color: #777e90; !important;
        }`;

         const Button = document.createElement("style");
        Button.textContent = `._base_1htaw_1, ._base_1htaw_1._secondary_1htaw_22, ._base_1b9zj_1, ._base_1htaw_1._secondary_1htaw_22._open_1htaw_27, ._base_1htaw_1._secondary_1htaw_22._closed_1htaw_30, ._base_1htaw_1._secondary_1htaw_22:hover, ._base_1htaw_1._secondary_1htaw_22:hover._open_1htaw_27 {
            background-color: transparent; !important;
        }`;

        const UserName = document.createElement("style");
        UserName.textContent = `._base_15xaj_1._small_15xaj_22 {
            color: #777E90; !important;
            text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        }`;

        const UserNameBackplate = document.createElement("style");
        UserNameBackplate.textContent = `._base_5l9jc_1 {
            background-color: #777e9017; !important;
        }`;

        const LootPickupPopup = document.createElement("style");
        LootPickupPopup.textContent = `._base_h9f2n_1, _in_h9f2n_27, _default_h9f2n_48, ._base_vq53y_1 {
            background-color: #777e9017; !important;
        }`;
        shadowRoot.append(Chatbox, Chatbox2, Button, Text, UserName, UserNameBackplate, LootPickupPopup)
        console.log("CSS injected successfully.");
    }

    function runner() {
        const timeStart = performance.now();
        if (!checkPresence()) {
            setTimeout(runner, 500);
            return;
        }
        const timeEnd = performance.now();
        console.log("Shadow-root took " + (timeEnd - timeStart) + "ms to load.");
        // Inject CSS
        console.log("Injecting CSS...");
        injectCSS();
    }

    runner();
})();
