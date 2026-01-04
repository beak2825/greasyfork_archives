// ==UserScript==
// @name         TornBuddy
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Display your favorite user as a button.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/messages.php
// @match        https://www.torn.com/item.php
// @match        https://www.torn.com/trade.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496998/TornBuddy.user.js
// @updateURL https://update.greasyfork.org/scripts/496998/TornBuddy.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // In case you want to disable the script from running in inventory, put the next value at "false" like this : let displayInInventory = false.
    let displayInInventory = true;

    // Is Object (needed to upgrade from version 1.3 to 2.0)
    const isObject = (value) => {
        return typeof value === 'object'
            && value !== null
            && !Array.isArray(value)
            && !(value instanceof RegExp)
            && !(value instanceof Date)
            && !(value instanceof Set)
            && !(value instanceof Map)
    }

    // Get localStorage stored value for time
    function getLocalStorage() {
        let contactList = localStorage.getItem("upscript_tornbuddy2");
        if (contactList === null) {
            localStorage.setItem("upscript_tornbuddy2", JSON.stringify([{
                label: "Upsilon",
                contactId: "Upsilon [3212478]"
            }]))
            return getLocalStorage();
        }
        let parsedLocalStorage = JSON.parse(contactList);
        console.log("ContactList", parsedLocalStorage);
        if (parsedLocalStorage.userId) {
            console.log("Object found, converting to array");
            localStorage.setItem("upscript_tornbuddy2", JSON.stringify([{
                label: `${parsedLocalStorage.btnName !== null ? parsedLocalStorage.btnName :  "Upsilon"}`,
                contactId: `${parsedLocalStorage.userId !== null ? parsedLocalStorage.userId : "Upsilon [3212478]"}`
            }]))
            return getLocalStorage();
        }
        if (contactList.length === 0) {
            localStorage.setItem("upscript_tornbuddy2", JSON.stringify([{
                label: "Upsilon",
                contactId: "Upsilon [3212478]"
            }]))
            return getLocalStorage();
        }
        return parsedLocalStorage;
    }

    // Append element to localStorage
    function addToLocalStorage(item) {
        let contactList = localStorage.getItem("upscript_tornbuddy2");
        let parsedLocalStorage = JSON.parse(contactList);

        parsedLocalStorage.push(item);
        localStorage.setItem("upscript_tornbuddy2", JSON.stringify(parsedLocalStorage));
        refreshTornTable();
    }

    // Delete element from localStorage
    function deleteFromLocalStorage(item) {
        let contactList = localStorage.getItem("upscript_tornbuddy2");
        let parsedLocalStorage = JSON.parse(contactList);

        for (let index = 0; index < parsedLocalStorage.length; index++) {
            if (parsedLocalStorage[index].label === item.label && parsedLocalStorage[index].contactId === item.contactId) {
                parsedLocalStorage.splice(index, 1);
            }
        }
        localStorage.setItem("upscript_tornbuddy2", JSON.stringify(parsedLocalStorage));
        if (parsedLocalStorage.length === 0)
            localStorage.setItem("upscript_tornbuddy2", JSON.stringify([{
                label: "Upsilon",
                contactId: "Upsilon [3212478]"
            }]))
        refreshTornTable();
    }

    function bindSendOptionsOnce() {
        let sendOptions = document.getElementsByClassName("option-send");
        for (let sendOption of sendOptions) {
            if (sendOption.dataset.upsBound === "1") continue;
            sendOption.dataset.upsBound = "1";
            sendOption.addEventListener("click", () => scheduleInventoryCheck());
        }
    }


    // Create the form to modify the value
    function createForm(contentWrapper) {
        let form = document.createElement("div");
        let inputLabel = document.createElement("input");
        let contactId = document.createElement("input");
        let buttonAddContact = document.createElement("button");

        form.classList.add("ups-tornbudy-form");
        inputLabel.classList.add("ups-tornbudy-input");
        inputLabel.placeholder = 'Enter the label';
        inputLabel.id = "input_label";
        contactId.classList.add("ups-tornbudy-input");
        contactId.placeholder = 'Enter the contact ID';
        contactId.id = "input_contactId";
        buttonAddContact.textContent = "Add a new contact";
        buttonAddContact.classList.add("torn-btn");
        buttonAddContact.id = "btn_add_contact";

        form.appendChild(inputLabel);
        form.appendChild(contactId);
        form.appendChild(buttonAddContact);
        contentWrapper.appendChild(form);

        buttonAddContact.addEventListener("click", () => {
            let label = document.getElementById("input_label");
            let contactId = document.getElementById("input_contactId");
            if (label.value.length > 9) {
                return alert("Label can't have more than 9 characters");
            }

            addToLocalStorage({label: label.value, contactId: contactId.value});
            label.value = "";
            contactId.value = "";
        });
    }

    // Create headers for the tbale
    function createTornTableHeader(table) {
        let myTableHead = document.createElement("thead");
        let myTableTr = document.createElement("tr");
        let myTableTh = document.createElement("th");

        myTableHead.classList.add("ups-tornbudy-table-head");
        myTableTr.classList.add("ups-tornbudy-table-row");
        myTableTh.classList.add("ups-tornbudy-table-cell");
        myTableTh.textContent = "Label";
        myTableTr.appendChild(myTableTh);
        myTableTh = document.createElement("th");
        myTableTh.classList.add("ups-tornbudy-table-cell");
        myTableTh.textContent = "Contact ID";
        myTableTh.colSpan = 2;
        myTableTr.appendChild(myTableTh);

        myTableHead.appendChild(myTableTr);
        table.appendChild(myTableHead);
    }

    // Fill table with values from localStorage
    function fillTornTable(table) {
        let myTableTBody = document.createElement("tbody");
        let information = getLocalStorage();
        let trashIcon = `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#999"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;

        for (let info of information) {
            let myTableTr = document.createElement("tr");
            let myTableTd = document.createElement("td");

            myTableTr.classList.add("ups-tornbudy-table-row");
            myTableTd.classList.add("ups-tornbudy-table-cell");
            myTableTd.style.width = "45%";
            myTableTd.textContent = info.label;
            myTableTr.appendChild(myTableTd);
            myTableTd = document.createElement("td");
            myTableTd.classList.add("ups-tornbudy-table-cell");
            myTableTd.style.width = "45%";
            myTableTd.textContent = info.contactId;
            myTableTr.appendChild(myTableTd);
            myTableTd = document.createElement("td");
            myTableTd.classList.add("ups-tornbudy-table-cell", "ups-tornbudy-trash");
            myTableTd.style.cssText = `display: flex; justify-content: center; align-items: center`
            myTableTd.innerHTML = trashIcon;
            myTableTd.addEventListener("click", () => {
                deleteFromLocalStorage({label: info.label, contactId: info.contactId});
            });
            myTableTr.appendChild(myTableTd);
            myTableTBody.appendChild(myTableTr);
        }
        myTableTBody.classList.add("ups-tornbudy-table-body");
        table.appendChild(myTableTBody);
    }

    // Refresh Torn Table Values
    function refreshTornTable() {
        let oldTable = document.getElementById("tornbudy_manager_table");

        oldTable.lastChild.remove();
        fillTornTable(oldTable);
    }

    // Create the base table display
    function createTornTable(contentWrapper) {
        let myTable = document.createElement("table");
        let message = document.createElement("p");
        let message2 = document.createElement("p");

        myTable.classList.add("ups-tornbudy-table");
        message.textContent = "Minimum 1 Contact (you can't delete me until you add another one)";
        message.style = "text-align: center; font-size: 16px; margin: 0 0 16px 0;"
        message2.style = "text-align: center; font-size: 16px; margin: 16px 0 16px 0;"
        myTable.id = "tornbudy_manager_table"
        createTornTableHeader(myTable);
        fillTornTable(myTable);

        contentWrapper.appendChild(message);
        contentWrapper.appendChild(myTable);
        message2.textContent = "Refresh when you are done!";
        contentWrapper.appendChild(message2);
    }

    // Open the menu
    function modifyBtnValue() {
        let mailboxMain = document.getElementById("mailbox-main");
        let children = mailboxMain.children;

        if (mailboxMain.children[2].style.display === "none") {
            let mailboxModify = document.getElementById("mailbox-modify");
            for (let i = 2; i < children.length; i++) {
                children[i].style.display = "block";
            }
            mailboxModify.remove();
            return;
        }
        for (let i = 2; i < children.length; i++) {
            children[i].style.display = "none";
        }
        let mailboxModify = document.createElement("div");
        mailboxModify.id = "mailbox-modify";
        mailboxMain.after(mailboxModify)
        createForm(mailboxModify);
        createTornTable(mailboxModify);
    }

    // Listen until element is found
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function onRouteChange(cb) {
        const _pushState = history.pushState;
        const _replaceState = history.replaceState;

        history.pushState = function () {
            _pushState.apply(this, arguments);
            cb();
        };
        history.replaceState = function () {
            _replaceState.apply(this, arguments);
            cb();
        };

        window.addEventListener("popstate", cb);
    }

    let upsScheduled = false;
    function scheduleRefresh() {
        if (upsScheduled) return;
        upsScheduled = true;
        requestAnimationFrame(() => {
            upsScheduled = false;
            refreshTriggers();
        });
    }

    function observeDom() {
        const observer = new MutationObserver(() => scheduleRefresh());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Add further input
    function addFurtherOptions(wrapper, input) {
        let localStorage = getLocalStorage();

        for (let i = 1; i < localStorage.length; i++) {
            let div = document.createElement("div");

            div.style.bottom = -23 * i - 24 + "px";
            if (i === 1)
                div.style.bottom = -48 + "px";
            div.classList.add("ups-tornbudy-options");
            div.textContent = localStorage[i].label;
            div.addEventListener("click", () => input.value = localStorage[i].contactId);
            wrapper.appendChild(div);
        }
    }

    // Change input for player to create another space for favorite.
    function changeInputSize(wrapper, input, searchContainer) {
        let localStorage = getLocalStorage();
        let firstContact = localStorage[0];
        if (searchContainer.firstChild.textContent.includes(firstContact.label))
            return;
        let searchList = searchContainer.firstChild;
        let searchChild;
        let wifeOption = document.createElement("li");

        wifeOption.classList.add("ac-favorite");
        input.style.width = "265px";
        wifeOption.textContent = firstContact.label;
        searchList.prepend(wifeOption);
        searchChild = searchList.children;
        for (let child of searchChild)
            child.style.width = "20%";

        wifeOption.addEventListener("click", () => input.value = firstContact.contactId);
        addFurtherOptions(wrapper, input);
    }

    function scheduleInventoryCheck(tries = 0) {
        const wrapper = document.getElementsByClassName("ac-wrapper");
        const searchContainer = document.getElementsByClassName("autocomplete-wrap");

        // Torn pas encore prêt (DOM pas injecté)
        if (!wrapper.length || !searchContainer.length || !wrapper[0]?.firstChild) {
            if (tries >= 30) return; // évite boucle infinie
            return requestAnimationFrame(() => scheduleInventoryCheck(tries + 1));
        }

        checkInventory();
    }


    // Loop over all inputs
    async function checkInventory() {
        let wrapper = document.getElementsByClassName("ac-wrapper");
        let searchContainer = document.getElementsByClassName("autocomplete-wrap");
        for (let index = 0; index < wrapper.length; index++)
            changeInputSize(wrapper[index], wrapper[index].firstChild, searchContainer[index]);
    }

    // Check if new send options available
    function updateSendOptions() {
        bindSendOptionsOnce();
    }

    async function createButtonModifyValue() {
        const tutorialBtn = document.getElementsByClassName("tutorial-switcher")[0];
        if (!tutorialBtn) return;

        let svg = `<svg fill="#B6B7B8" width="16px" height="16px" viewBox="0 -6 44 44" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" stroke="#B6B7B8"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M42.001,32.000 L14.010,32.000 C12.908,32.000 12.010,31.104 12.010,30.001 L12.010,28.002 C12.010,27.636 12.211,27.300 12.532,27.124 L22.318,21.787 C19.040,18.242 19.004,13.227 19.004,12.995 L19.010,7.002 C19.010,6.946 19.015,6.891 19.024,6.837 C19.713,2.751 24.224,0.007 28.005,0.007 C28.006,0.007 28.008,0.007 28.009,0.007 C31.788,0.007 36.298,2.749 36.989,6.834 C36.998,6.889 37.003,6.945 37.003,7.000 L37.006,12.994 C37.006,13.225 36.970,18.240 33.693,21.785 L43.479,27.122 C43.800,27.298 44.000,27.634 44.000,28.000 L44.000,30.001 C44.000,31.104 43.103,32.000 42.001,32.000 ZM31.526,22.880 C31.233,22.720 31.039,22.425 31.008,22.093 C30.978,21.761 31.116,21.436 31.374,21.226 C34.971,18.310 35.007,13.048 35.007,12.995 L35.003,7.089 C34.441,4.089 30.883,2.005 28.005,2.005 C25.126,2.006 21.570,4.091 21.010,7.091 L21.004,12.997 C21.004,13.048 21.059,18.327 24.636,21.228 C24.895,21.438 25.033,21.763 25.002,22.095 C24.972,22.427 24.778,22.722 24.485,22.882 L14.010,28.596 L14.010,30.001 L41.999,30.001 L42.000,28.595 L31.526,22.880 ZM18.647,2.520 C17.764,2.177 16.848,1.997 15.995,1.997 C13.116,1.998 9.559,4.083 8.999,7.083 L8.993,12.989 C8.993,13.041 9.047,18.319 12.625,21.220 C12.884,21.430 13.022,21.755 12.992,22.087 C12.961,22.419 12.767,22.714 12.474,22.874 L1.999,28.588 L1.999,29.993 L8.998,29.993 C9.550,29.993 9.997,30.441 9.997,30.993 C9.997,31.545 9.550,31.993 8.998,31.993 L1.999,31.993 C0.897,31.993 -0.000,31.096 -0.000,29.993 L-0.000,27.994 C-0.000,27.629 0.200,27.292 0.521,27.117 L10.307,21.779 C7.030,18.234 6.993,13.219 6.993,12.988 L6.999,6.994 C6.999,6.939 7.004,6.883 7.013,6.829 C7.702,2.744 12.213,-0.000 15.995,-0.000 C15.999,-0.000 16.005,-0.000 16.010,-0.000 C17.101,-0.000 18.262,0.227 19.369,0.656 C19.885,0.856 20.140,1.435 19.941,1.949 C19.740,2.464 19.158,2.720 18.647,2.520 Z"></path> </g></svg>`;

        let btn = document.createElement("a");
        let svgContainer = document.createElement("div");
        let span = document.createElement("span");

        svgContainer.innerHTML = svg;
        svgContainer.style.cssText = `display: flex; justify-content: center; align-items: center`;
        span.textContent = "TornBuddy";
        span.style.marginLeft = "2px";

        btn.classList.add("back-to", "t-clear", "h", "c-pointer", "m-icon", "line-h24", "right", "last");
        if (window.innerWidth < 800) {
            btn.style.display = "flex";
            btn.style.alignItems = "end";
            svgContainer.style.paddingBottom = "2px";
        }
        btn.style.height = "28px";
        btn.id = "mod-favorite";

        btn.appendChild(svgContainer);
        btn.appendChild(span);

        tutorialBtn.after(btn);

        btn.addEventListener("click", () => {
            modifyBtnValue();
        });
    }

    function refreshTriggers() {
        const href = window.location.href;

        // === trade.php ===
        if (href.includes("https://www.torn.com/trade.php")) {
            if (document.querySelector("#user-id")) {
                let wrapper = document.getElementsByClassName("ac-wrapper")[0];
                let searchContainer = document.getElementsByClassName("autocomplete-wrap")[0];
                if (wrapper && searchContainer) {
                    changeInputSize(wrapper, wrapper.firstChild, searchContainer);
                }
            }
        }

        // === messages.php ===
        if (href.includes("https://www.torn.com/messages.php")) {
            getLocalStorage();

            // Compose view => button
            if (href.includes("compose")) {
                if (!document.getElementById("mod-favorite")) {
                    createButtonModifyValue();
                }
            }

            // autocomplete input
            if (document.querySelector("#ac-search-0")) {
                let wrapper = document.getElementsByClassName("ac-wrapper")[0];
                let searchContainer = document.getElementsByClassName("autocomplete-wrap")[0];
                if (wrapper && searchContainer) {
                    changeInputSize(wrapper, wrapper.firstChild, searchContainer);
                }
            }
        }

        // === item.php ===
        if (href.includes("https://www.torn.com/item.php") && displayInInventory == true) {
            bindSendOptionsOnce();
        }
    }

    // Just here for trade page, nothing much to do.
    if (window.location.href.includes("https://www.torn.com/trade.php") || window.location.href.includes("https://www.torn.com/messages.php")) {
        refreshTriggers();
    }

    // Update send options for inventory lazy loading
    if (window.location.href.includes("https://www.torn.com/item.php") && displayInInventory == true) {
        bindSendOptionsOnce();
    }

    refreshTriggers();
    observeDom();
    onRouteChange(refreshTriggers);
    GM_addStyle(`
    .ups-tornbudy-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        margin: 32px 0 32px 0;
    }
    .ups-tornbudy-input {
        padding: 9px 5px;
        display: inline-block;
        vertical-align: middle;
        background: linear-gradient(0deg, #111111 0%, #000000 100%);
        font-family: Arial, serif;
        border-radius: 5px;
        color: #FFF;
        min-width: 160px;
        margin-bottom: 8px;
    }
    .ups-tornbudy-svg-container {
        align-items: center;
        display: flex;
        flex-direction: row;
        height: 23px;
        justify-content: center;
        margin-left: 5px;
        width: 21px;
        float: left;
    }
    .ups-tornbudy-table {
        background: var(--default-bg-panel-color);
        border-radius: 0 0 5px 5px;
        color: var(--default-color);
        overflow: hidden;
        text-align: left;
        width: 100%;
    }
    .ups-tornbudy-table-head {
        background: linear-gradient(180deg,#fff,#ddd);
        background: var(--default-panel-gradient);
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-tornbudy-table-body {
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-tornbudy-table-row {
        border-bottom: 1px solid #ccc;
        border-bottom-color: rgb(204, 204, 204);
        border-bottom-color: var(--default-panel-divider-outer-side-color);
        border-top: 1px solid #fff;
        border-top-color: rgb(255, 255, 255);
        border-top-color: var(--default-panel-divider-inner-side-color);
    }
    .ups-tornbudy-table-cell {
        box-sizing: border-box;
        color: var(--default-color);
        height: 30px !important;
        line-height: 30px !important;
        padding: 0 7px !important;
        vertical-align: middle !important;
        white-space: nowrap;
    }
    .ups-tornbudy-table-cell:not(:first-child) {
        border-left: 2px solid #ccc;
        border-left-color: rgb(204, 204, 204);
        border-left-color: var(--default-panel-divider-outer-side-color);
    }
    .ups-tornbudy-table-head .ups-tornbudy-table-row .ups-tornbudy-table-cell {
        font-weight: bold;
    }
    .ups-tornbudy-trash {
        cursor: pointer;
    }
    .ups-tornbudy-trash:hover  svg, .ups-tornbudy-trash:hover path {
        stroke: #ccc;
    }
    .ups-tornbudy-options {
    width: 20%;
    float: left;
    height: 24px;
    line-height: 24px;
    width: 20%;
    box-sizing: border-box;
    border: 1px solid #444;
    text-align: center;
    color: #999;
    color: var(--autocomplete-options-color);
    background: #111;
    cursor: pointer;
    font-size: 12px;
    position: absolute;
    display: none;
    }
    .ac-focus ~ .ups-tornbudy-options {
        display: block;
    }
    .d .autocomplete-wrap.open .viewport {
        margin: 0 0 0 20%;
        width: 80%;
    }
    `);
})();