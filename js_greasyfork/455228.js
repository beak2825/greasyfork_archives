// ==UserScript==
// @name         Bitwarden Select Enhance
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Enable shift-click checkbox to select items bulkly in Bitwarden web.
// @author       moeakwak
// @match        https://vault.bitwarden.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitwarden.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455228/Bitwarden%20Select%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/455228/Bitwarden%20Select%20Enhance.meta.js
// ==/UserScript==

function waitForElment(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function selectBetween(tbody, from, to) {
    tbody.children("tr").each(function (index) {
        if (index > from && index < to)
            $(this).find("td.table-list-checkbox > input").click();
    })
}


function bindOnClick(tbody) {
    tbody.children("tr").each(function (index) {
        $(this).find("td.table-list-checkbox > input").click(function (ev) {
            // console.log("clicked", index, ev);
            if (ev.shiftKey) {
                selectBetween(tbody, lastClickIndex, index);
            } else {
                lastClickIndex = index;
            }
        })
    })
}


let lastClickIndex = null;


$(document).ready(async function() {
    await waitForElment("app-vault-ciphers > table");

    const tbody = $("app-vault-ciphers > table > tbody");

    bindOnClick(tbody);

    tbody.bind('DOMSubtreeModified', function(e) {
        if (e.target.innerHTML.length > 0) {
            bindOnClick(tbody);
        }
    });
});