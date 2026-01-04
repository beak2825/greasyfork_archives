// ==UserScript==
// @name                Backoffice Tweaks
// @namespace           zen
// @description         Improve backoffice for me
// @version             1.0.2
// @run-at              document-start
// @match               https://backoffice.ifoodxt.com.br/*
// @require             https://update.greasyfork.org/scripts/526417/1643812/USToolkit.js
// @grant               unsafeWindow
// @grant               GM_addStyle
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/546214/Backoffice%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/546214/Backoffice%20Tweaks.meta.js
// ==/UserScript==

let uuidInput;
let searchButton;
const UUIDS = [];
const onElements = new UST.OnElements();

// Popup on copy
const copyPopup = document.createElement("div");
copyPopup.id = "copyPopup";
copyPopup.textContent = "Copiado";
document.documentElement.appendChild(copyPopup);

// Search by UUID when receive UUID from Salesforce
window.addEventListener("message", (event) => {
    const UUID = event.data?.UUID;
    if (!UUID) return;

    if (!uuidInput) {
        uuidInput = document.querySelector('[data-testid="input-orders"]');
    }

    if (!searchButton) {
        searchButton = document.querySelector('[data-testid="search-button"]');
    }

    UST.setInputNativeValue(uuidInput, UUID);
    searchButton.click();
});

// Open "Oráculo" on middle click in order
document.addEventListener("mousedown", (event) => {
    if (event.button === 1) {
        const tr = event.target.closest('[data-testid="orders-list"] tbody tr');
        if (!tr) return;
        const endUUID = tr.querySelector("td:nth-child(2)");

        const selectedUUID = UUIDS.find((UUID) => UUID.endsWith(endUUID.innerText));
        window.open(`https://oraculo.ifoodxt.com.br/dashboard?requester_type=partner&type=order&id=${selectedUUID}`, "_blank");
    }
});

// Monkey patch window.fetch
const originalFetch = unsafeWindow.fetch;
unsafeWindow.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    try {
        const clone = response.clone();

        const data = await clone.json().catch(() => null);

        data.data?.getOrders?.orders?.forEach((item) => UUIDS.push(item.id));
    } catch (err) {
        console.warn("Erro ao logar response:", err);
    }

    return response;
};

function copyOnClick(element) {
    element.style.setProperty("font-weight", "bold", "important");
    element.style.setProperty("cursor", "pointer", "important");

    element.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();

        navigator.clipboard.writeText(element.innerText).then(() => {
            copyPopup.classList.add("popupActive");
            setTimeout(() => copyPopup.classList.remove("popupActive"), 2000);
        });
    });
}

onElements.per('[data-testid="orders-list"] td:nth-child(3) > div > div:nth-child(-n+2)', (element) => {
    copyOnClick(element);
});
onElements.start();

GM_addStyle(`
#copyPopup {
    position: fixed;
    z-index: 9;
    top: 0rem;
    left: 50%;
    translate: -50% -100%;
    background: hsl(240, 58%, 4%);
    color: #eee;
    padding: 15px;
    font-size: 16px;
    border-radius: .5rem;
    transition: translate .2s ease;
    font-family: system-ui;
}
.popupActive {
    translate: -50% 2rem !important;
}
`);
