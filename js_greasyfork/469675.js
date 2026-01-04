// ==UserScript==
// @name         Kanka Subpage Elements Counter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      5
// @description  Shows the count of attributes, relations, assets, etc. on each entity's corresponding submenu item
// @author       Salvatos
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @connect      kanka.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469675/Kanka%20Subpage%20Elements%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/469675/Kanka%20Subpage%20Elements%20Counter.meta.js
// ==/UserScript==

// Get JSON export URL for the current entity
const exportLink = document.querySelector('a[href$=".json"]');

if (exportLink) {

    var apiURL = exportLink.href;

    // Request JSON for the target entity
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, true);
    xhr.responseType = 'json';
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let abilities = xhr.response.data.entity_abilities.length,
                    attributes = xhr.response.data.attributes.length,
                    events = xhr.response.data.entity_events.length,
                    inventory = xhr.response.data.inventory.length,
                    elements = (xhr.response.data.elements) ? xhr.response.data.elements.length : null;

                // Quick little function for recurring HTML
                function badgeTag(withVar) {
                    return `<div class="badge float-right border">${withVar}</div>`;
                }

                // Abilities
                if (abilities > 0) {
                    document.querySelector('.entity-menu a[href$="/entity_abilities"]').insertAdjacentHTML("beforeend", badgeTag(abilities));
                }
                // Attributes
                if (attributes > 0) {
                    document.querySelector('.entity-menu a[href$="/attributes"]').insertAdjacentHTML("beforeend", badgeTag(attributes));
                }
                // Events/reminders
                if (events > 0) {
                    document.querySelector('.entity-menu a[href$="/entity_events"]').insertAdjacentHTML("beforeend", badgeTag(events));
                }
                // Inventory
                if (inventory > 0) {
                    document.querySelector('.entity-menu a[href$="/inventory"]').insertAdjacentHTML("beforeend", badgeTag(inventory));
                }
                // Quest elements (Kanka only shows elements that are entities, not "loose" ones)
                if (elements > 0) {
                    // If there’s already a count, update it instead of creating a new badge
                    if (document.querySelector('.entity-menu a[href$="/quest_elements"] .badge')) {
                        document.querySelector('.entity-menu a[href$="/quest_elements"] .badge').innerHTML = elements;
                    }
                    else {
                        document.querySelector('.entity-menu a[href$="/quest_elements"]').insertAdjacentHTML("beforeend", badgeTag(elements));
                    }
                }
                // Assets are already handled by Kanka like child entities
                // Relations not provided (only pinned relations, which we can already see)

            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

GM_addStyle(`
	/* More sensible font size for "badges" in the sidebar */
	.entity-submenu .badge {
		font-size: .750rem;
	}
`);