// ==UserScript==
// @name            BR Working Times
// @description     Adds additional buttons to Zammad like BR Working Times
// @version         20250523
// @author          mykarean
// @match           https://oxid.support/
// @icon            https://icons.duckduckgo.com/ip2/oxid.support.ico
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @run-at          document-start
// @license         GPL3
// @namespace https://greasyfork.org/users/1367334
// @downloadURL https://update.greasyfork.org/scripts/517043/BR%20Working%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/517043/BR%20Working%20Times.meta.js
// ==/UserScript==

"use strict";

const brTicketSearchTitle = "BR Meeting";
const brTicketSearchTitle2 = "BR Arbeit";
let firstName = null;

if (!document.getElementById("custom-css-style")) {
    GM_addStyle(`
        .custom-modal-container {
            background-color: var(--background-primary);;
            padding: 20px;
            border-radius: 10px;
            overflow-y: auto;
        }
        .custom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .custom-modal h2 {
            margin: 0 0 10px;
        }
        .custom-modal p {
            margin: 5px 0;
        }
        .custom-modal button {
            display: block;
            cursor: pointer;
        }
        .custom-modal .close-button {
            margin: 20px auto 0;
        }

        .personal-user-menu {
            padding: 0;
            margin: 0;
            list-style: none;
            position: relative;
            flex-shrink: 0;
            display: flex;
        }
        .personal-search-button {
            padding-top: 4px;
            padding-bottom: 4px;
            padding-left: 2px;
            padding-right: 2px;
            color: #808080;
        }
        .personal-search-button:hover {
            background: white
        }
        .shortlinks .user-menu {
            justify-content: space-evenly;
        }
    `).setAttribute("id", "custom-css-style");
}

// Helper function to format a date as "DD.MM.YYYY"
const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
};

// Function to calculate the date range for the previous month in UTC
function getLastMonthRange() {
    const now = new Date();
    const firstDayLastMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1));
    const lastDayLastMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0));
    return {
        from: firstDayLastMonth.toISOString().split("T")[0],
        to: lastDayLastMonth.toISOString().split("T")[0],
    };
}

// Function to get the query for searching tickets, reusing the same format for both `fetchTickets` and `addCustomButtons`
function getTicketQuery() {
    const dateRange = getLastMonthRange();
    return `created_at:[${dateRange.from} TO ${dateRange.to}] AND owner.firstname:${firstName} AND (title:"${brTicketSearchTitle}" OR title:"${brTicketSearchTitle2}")`;
}

// Fetch tickets based on criteria from Zammad API
async function fetchTickets() {
    const query = getTicketQuery();

    try {
        const response = await fetch(`/api/v1/tickets/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Error fetching tickets:", response.statusText);
            return { tickets: [], assets: {} };
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return { tickets: [], assets: {} };
    }
}

// Display filtered tickets in a modal
async function displayTickets() {
    const ticketsResponse = await fetchTickets();
    // const ticketIds = ticketsResponse.tickets || [];
    // const tickets = ticketsResponse.assets.Ticket || {};
    const tickets = ticketsResponse || {};
    const { from, to } = getLastMonthRange();
    let totalTimeUnit = 0;

    tickets.forEach((ticket) => {
        if (ticket) totalTimeUnit += parseFloat(ticket.time_unit || 0);
    });

    const lastMonthDate = new Date(from);
    const lastMonthName = lastMonthDate.toLocaleString("default", { month: "long" });
    const lastMonthYear = lastMonthDate.getFullYear();

    // Modal content
    // <h2>${lastMonthName} ${lastMonthYear}</h2>
    // <p><strong>Ticketzahl:</strong> ${ticketIds.length}</p>
    const modalContent = `<h2>BR Arbeitszeiten</h2>
<p><strong>Zeitraum:</strong> ${formatDate(from)} - ${formatDate(to)}</p>
<p><strong>Gesamtzeit:</strong> ${totalTimeUnit} Minuten</p>
`;

    // Create and display modal
    const modal = document.createElement("div");
    modal.classList.add("custom-modal");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("custom-modal-container");
    modalContainer.innerHTML = modalContent;

    const closeButton = document.createElement("button");
    closeButton.className = "close-button btn btn--success";
    closeButton.innerText = "Copy & Close";
    closeButton.addEventListener("click", () => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = modalContent;
        GM_setClipboard(tempDiv.innerText);
        modal.remove();
    });
    modalContainer.appendChild(closeButton);

    // close on click outside
    modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.remove();
    });

    modal.appendChild(modalContainer);
    document.body.appendChild(modal);
}

// Creates a button and attaches click event
function createButton(title, query) {
    const listItem = document.createElement("li");
    listItem.className = `settings ${title}`;

    const link = document.createElement("a");
    link.className = "centered personal-search-button";
    link.href = `/#search/${encodeURIComponent(query)}`;
    link.textContent = title;

    listItem.appendChild(link);
    listItem.addEventListener("click", async () => await displayTickets());

    return listItem;
}

// Adds custom buttons to the navigation menu and attaches click events
function addCustomButtons() {
    const userMenuNavbar = document.querySelector("#navigation");

    if (userMenuNavbar) {
        let shortlinksDiv = document.querySelector(".shortlinks");
        let userMenuList = shortlinksDiv?.querySelector(".user-menu");
        let buttonTitles = ["BR"];


        if (!shortlinksDiv) {
            shortlinksDiv = document.createElement("div");
            shortlinksDiv.className = "shortlinks";
            userMenuNavbar.insertBefore(shortlinksDiv, userMenuNavbar.lastElementChild);

            userMenuList = document.createElement("ul");
            userMenuList.className = "user-menu";
            shortlinksDiv.appendChild(userMenuList);

            buttonTitles = ["BR Zeiten letzter Monat"];
        }

        const query = getTicketQuery();

        buttonTitles.forEach((title) => {
            const listItem = document.createElement("li");
            listItem.className = `settings ${title}`;

            const link = document.createElement("a");
            link.className = "centered personal-search-button";
            link.href = `/#search/${encodeURIComponent(query)}`;
            link.textContent = title;

            listItem.appendChild(link);

            // Add a click event listener only for the "BR Zeiten letzter Monat" button
            if (title === "BR" || title === "BR Zeiten letzter Monat") {
                listItem.addEventListener("click", async () => {
                    await displayTickets();
                });
            }

            userMenuList.prepend(listItem);
        });
    }
}


// Initialize the application
async function main() {
    if (!firstName) {
        try {
            const response = await fetch("/api/v1/users/me");
            const data = await response.json();
            firstName = data.firstname;
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    addCustomButtons();
}

// Run main function once DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
} else {
    main();
}
