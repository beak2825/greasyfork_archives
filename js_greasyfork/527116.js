// ==UserScript==
// @name         Patreon - sort list of memberships and make them compacter
// @namespace    http://tampermonkey.net/
// @version      2025-02-15
// @description  Sort the memberships by the creator name and make list compacter.
// @author       You
// @match        https://www.patreon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=patreon.com
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527116/Patreon%20-%20sort%20list%20of%20memberships%20and%20make%20them%20compacter.user.js
// @updateURL https://update.greasyfork.org/scripts/527116/Patreon%20-%20sort%20list%20of%20memberships%20and%20make%20them%20compacter.meta.js
// ==/UserScript==

(function () {
    setTimeout(wait_until_main_script_starts, 50);
})();

if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => {
        previous_numbers_of_memberships = 0;
        setTimeout(wait_until_main_script_starts, 100);
        setTimeout(wait_until_main_script_starts, 5000); //failover if something did not work
    })
}

let previous_numbers_of_memberships = 0;

function wait_until_main_script_starts() {
    let current_numbers_of_memberships = find_node_by_attribute(document, "ul", "aria-label", "Memberships")?.childNodes?.length;
    if (current_numbers_of_memberships > 1) {
        if (previous_numbers_of_memberships === current_numbers_of_memberships) {
            setTimeout(main_script_logic, 50);
            return;
        }

        previous_numbers_of_memberships = current_numbers_of_memberships;
        setTimeout(wait_until_main_script_starts, 50);
        return;
    }

    setTimeout(wait_until_main_script_starts, 50);
}

function main_script_logic() {
    const membershipNode = find_node_by_attribute(document, "ul", "aria-label", "Memberships")
    if (!membershipNode) {
        return;
    }

    // https://www.w3schools.com/howto/howto_js_sort_list.asp
    let list, i, switching, b, shouldSwitch;
    list = membershipNode;
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("li");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // start by saying there should be no switching:
            shouldSwitch = false;
            /* check if the next item should
            switch place with the current item: */
            const prevText = find_value_by_attribute(b[i], "p", "textContent");
            const nextText = find_value_by_attribute(b[i + 1], "p", "textContent");
            if (prevText.toLowerCase() > nextText.toLowerCase()) {
                /* if next item is alphabetically
                lower than current item, mark as a switch
                and break the loop: */
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark the switch as done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }

    for (let membership of membershipNode.getElementsByTagName("a")) {
        console.error(membership);
        membership.style.marginTop = "0";
        membership.style.marginBottom = "0";
        membership.style.paddingTop = "2px";
        membership.style.paddingBottom = "2px";
    }
}

const find_node_by_attribute = (start, tagName, attributeName, attributeValue) => {
    let possibleResults = start.getElementsByTagName(tagName);
    for (let possibleResult of possibleResults) {
        var a = possibleResult;
        if (attributeName === "textContent" && possibleResult.textContent === attributeValue) {
            return possibleResult;
        }
        if (possibleResult.attributes[attributeName]?.value === attributeValue) {
            return possibleResult;
        }
    }
    return undefined;
}

const find_value_by_attribute = (start, tagName, attributeName) => {
    let possibleResults = start.getElementsByTagName(tagName);
    for (let possibleResult of possibleResults) {
        var a = possibleResult;
        if (attributeName === "textContent" && possibleResult.textContent) {
            return possibleResult.textContent;
        }
        if (possibleResult.attributes[attributeName]?.value) {
            return possibleResult.attributes[attributeName];
        }
    }
    return undefined;
}
