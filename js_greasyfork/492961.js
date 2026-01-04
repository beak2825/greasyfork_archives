// ==UserScript==
// @name         MFGUA
// @namespace    com.github.brink182
// @version      0.3.1
// @license      GPL3
// @description  make FlowGPT usable again
// @author       brink182
// @match        https://flowgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowgpt.com
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/492961/MFGUA.user.js
// @updateURL https://update.greasyfork.org/scripts/492961/MFGUA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const last = {};
    const marker = window.crypto.randomUUID().toLowerCase().replaceAll('-','');
    const state = JSON.parse(localStorage.getItem('7093d631034d4924a69c6148f4577f46') || '{"deviceIds":{}}');
    console.log(last, marker, state);

    function storeState() {
        localStorage.setItem('7093d631034d4924a69c6148f4577f46', JSON.stringify(state));
    }

    function addSendButton(ref) {
        const text = ref.parentNode.firstElementChild;
        for (const old of document.querySelectorAll(`button[data-${marker}='true']`)) {
            old.parentNode.removeChild(old);
        }
        if (text instanceof HTMLTextAreaElement === false) {
            console.log("Textarea expected ", text);
            return;
        }

        const send = document.createElement("button");
        send.ariaLabel = "Send";
        send.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" focusable="false" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 13.0001H9V11.0001H3V1.8457C3 1.56956 3.22386 1.3457 3.5 1.3457C3.58425 1.3457 3.66714 1.36699 3.74096 1.4076L22.2034 11.562C22.4454 11.695 22.5337 11.9991 22.4006 12.241C22.3549 12.3241 22.2865 12.3925 22.2034 12.4382L3.74096 22.5925C3.499 22.7256 3.19497 22.6374 3.06189 22.3954C3.02129 22.3216 3 22.2387 3 22.1544V13.0001Z"></path></svg>';
        send.className = ref.className;
        send.dataset[marker] = 'true';
        send.addEventListener('click', () => text.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true, code: 'Enter', keyCode: 13})));

        ref.parentNode.insertBefore(send, ref);
    }

    function getCurrentDeviceId() {
        const result = /(?:^|;\s*)deviceId=([^;]*)(?:;|$)/.exec(document.cookie);
        return result === null ? null : result[1];
    }

    function setCurrentDeviceId(deviceId) {
        document.cookie = "deviceId=" + deviceId;
    }

    async function toggleUiVariant() {
        const classic = (document.getElementsByTagName("aside").length === 0);
        const oldVariant = classic ? "classic" : "modern";
        const oldDeviceId = getCurrentDeviceId();
        state.deviceIds[oldVariant] = oldDeviceId;
        storeState();
        const newVariant = classic ? "modern" : "classic";
        const newDeviceId = state.deviceIds[newVariant];
        if (newDeviceId && newDeviceId !== oldDeviceId) {
            setCurrentDeviceId(newDeviceId);
            window.location.reload(true);
            return;
        }
        var stillClassic = classic;
        for (var i = 0; stillClassic === classic && i < 4; i++) {
            setCurrentDeviceId("");
            const loc = document.location;
            const response = await fetch(loc.protocol + "//" + loc.host, {cache: "no-store"});
            stillClassic = !(await response.text()).includes("</aside>");
            console.log("Got ", stillClassic ? "classic" : "modern", " deviceId: ", getCurrentDeviceId(), response);
        }
        if (stillClassic === classic) {
            setCurrentDeviceId(oldDeviceId);
            GM_notification("MFGUA - Error", "Could not switch to " + newVariant + " UI");
        } else {
            state.deviceIds[newVariant] = getCurrentDeviceId();
            storeState();
            window.location.reload(true);
        }
    }

    function addUserMenuItems() {
        const logout = document.querySelector('button[data-testid="user-menu-logout"]')
        if (logout === null || document.querySelector(`[data-${marker}='toggleUiVariant']`) !== null) {
            //menu closed or processed
            return;
        }
        const toggleUi = logout.previousElementSibling;
        toggleUi.hidden = false;
        toggleUi.addEventListener('click', () => toggleUiVariant());
        toggleUi.ariaLabel = 'Toggle UI';
        toggleUi.dataset[marker] = 'toggleUiVariant';
        toggleUi.lastElementChild.lastElementChild.innerText='Toggle UI';
        const menu = logout.parentNode.insertBefore(toggleUi, logout);
    }

    new MutationObserver(() => {
        const chatMenu = document.querySelector("button[id^='menu-button-:r'].chakra-button.chakra-menu__menu-button");
        if (chatMenu !== null && !Object.is(last.chatMenu, chatMenu)) {
            last.chatMenu = chatMenu;
            addSendButton(chatMenu);
        }
        addUserMenuItems();
    }).observe(document, {childList: true, subtree: true });
})();
