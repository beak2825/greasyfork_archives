// ==UserScript==
// @name         MyAnonamouse Bonus Points per Day (B/day) Display
// @version      1.6
// @description  Adds B/day display to dropdown and/or top User Stats area.
// @author       Gorgonian
// @namespace    https://www.myanonamouse.net/u/253587
// @match        https://www.myanonamouse.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537165/MyAnonamouse%20Bonus%20Points%20per%20Day%20%28Bday%29%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/537165/MyAnonamouse%20Bonus%20Points%20per%20Day%20%28Bday%29%20Display.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const PREF_KEY_DROPDOWN = 'showBPerDayDropdown';
    const PREF_KEY_TOPAREA = 'showBPerDayTopArea';
    const PREF_KEY_ORDER = 'bPerDayOrder';

    function shouldShowDropdown() {
        const value = localStorage.getItem(PREF_KEY_DROPDOWN);
        return value === null || value === 'true';
    }

    function shouldShowTopArea() {
        const value = localStorage.getItem(PREF_KEY_TOPAREA);
        return value === null || value === 'true';
    }

    function addBPerDayToDropdown() {
        if (!shouldShowDropdown()) return;

        const menuItems = document.querySelectorAll('li[role="presentation"] > a[href="/store.php"]');

        for (let i = 0; i < menuItems.length; i++) {
            const text = menuItems[i].textContent.trim();
            if (text.startsWith("B/hr:")) {
                const bh = parseFloat(text.replace("B/hr:", "").trim());
                if (!isNaN(bh)) {
                    const bd = (bh * 24).toFixed(3);

                    const li = document.createElement("li");
                    li.setAttribute("role", "presentation");

                    const a = document.createElement("a");
                    a.setAttribute("role", "menuitem");
                    a.setAttribute("tabindex", "0");
                    a.setAttribute("href", "/store.php");
                    a.textContent = `B/day: ${bd}`;

                    li.appendChild(a);
                    menuItems[i].parentNode.insertBefore(li, menuItems[i].nextSibling);
                }
                break;
            }
        }
    }

    function addBPerDayToTopArea() {
        if (!shouldShowTopArea()) return;

        const topArea = document.querySelector("#userStat");
        const bonusPerHourSpan = document.querySelector("#tmPH");
        const bonusLink = document.querySelector("#tmBP");

        if (!topArea || (!bonusPerHourSpan && !bonusLink)) return;
        if (document.querySelector("#bdayTopStat")) return;

        if (bonusPerHourSpan) {
            const currentText = bonusPerHourSpan.textContent.trim();
            const match = currentText.match(/^(\d+(\.\d+)?)/);
            if (match) {
                const bh = match[1];
                bonusPerHourSpan.textContent = `B/hour: ${bh}`;
            }
        }

        function waitForBhrAndInsert() {
            const dropdownItem = Array.from(document.querySelectorAll('li[role="presentation"] > a[href="/store.php"]'))
            .find(a => a.textContent.trim().startsWith("B/hr:"));

            if (!dropdownItem) {
                return setTimeout(waitForBhrAndInsert, 300);
            }

            const bh = parseFloat(dropdownItem.textContent.replace("B/hr:", "").trim());
            if (!isNaN(bh)) {
                const bd = (bh * 24).toFixed(3);

                const bdaySpan = document.createElement('span');
                bdaySpan.id = "bdayTopStat";
                bdaySpan.style.marginLeft = "10px";
                bdaySpan.textContent = `B/day: ${bd}`;

                const bdayOrder = parseInt(localStorage.getItem(PREF_KEY_ORDER) || "13", 10);
                const children = Array.from(topArea.children).filter(el =>
                                                                     el.tagName === "A" || el.tagName === "SPAN"
                                                                    );

                if (bdayOrder >= children.length) {
                    topArea.appendChild(bdaySpan);
                } else {
                    topArea.insertBefore(bdaySpan, children[bdayOrder]);
                }
            }
        }

        waitForBhrAndInsert();
    }

    function addPreferenceOption() {
        if (!location.pathname.includes("/preferences/index.php")) return;

        const topMenuTables = Array.from(document.querySelectorAll("td.row1 > table")).filter(table =>
                                                                                              table.querySelector("th")?.textContent?.includes("Item")
                                                                                             );
        const topMenuTable = topMenuTables[0]?.querySelector("tbody");
        if (topMenuTable) {
            const newRow = document.createElement("tr");

            const tdCheckbox = document.createElement("td");
            const topAreaCheckbox = document.createElement("input");
            topAreaCheckbox.type = "checkbox";
            topAreaCheckbox.checked = (localStorage.getItem(PREF_KEY_TOPAREA) ?? "true") === "true";
            topAreaCheckbox.id = PREF_KEY_TOPAREA;
            topAreaCheckbox.addEventListener("change", () => {
                localStorage.setItem(PREF_KEY_TOPAREA, topAreaCheckbox.checked.toString());
            });

            const topAreaLabel = document.createElement("label");
            topAreaLabel.setAttribute("for", PREF_KEY_TOPAREA);
            topAreaLabel.appendChild(topAreaCheckbox);
            topAreaLabel.append(" Points earned per day");

            tdCheckbox.appendChild(topAreaLabel);

            const tdOrder = document.createElement("td");
            const orderInput = document.createElement("input");
            orderInput.type = "number";
            orderInput.name = "topMenuOrder[bdayCustom]";
            orderInput.value = localStorage.getItem(PREF_KEY_ORDER) ?? "13";
            orderInput.addEventListener("change", () => {
                localStorage.setItem(PREF_KEY_ORDER, orderInput.value);
            });

            tdOrder.appendChild(orderInput);
            newRow.appendChild(tdCheckbox);
            newRow.appendChild(tdOrder);

            const allRows = topMenuTable.querySelectorAll("tr");
            for (let i = 0; i < allRows.length; i++) {
                if (allRows[i].textContent.includes("Points earned per hour")) {
                    topMenuTable.insertBefore(newRow, allRows[i].nextSibling);
                    break;
                }
            }
        }

        const userMenuSection = Array.from(document.querySelectorAll("td.row2"))
        .find(td => td.textContent.trim() === "User Menu Items");

        if (userMenuSection) {
            const userMenuTd = userMenuSection.nextElementSibling;
            const allLabels = userMenuTd.querySelectorAll("label");
            let insertAfter = null;

            for (let label of allLabels) {
                if (label.textContent.includes("Points earned per hour")) {
                    insertAfter = label;
                    break;
                }
            }

            if (insertAfter) {
                const dropdownCheckbox = document.createElement("input");
                dropdownCheckbox.type = "checkbox";
                dropdownCheckbox.checked = (localStorage.getItem(PREF_KEY_DROPDOWN) ?? "true") === "true";
                dropdownCheckbox.id = PREF_KEY_DROPDOWN;
                dropdownCheckbox.name = "userMenu[bday]";
                dropdownCheckbox.value = "true";
                dropdownCheckbox.addEventListener("change", () => {
                    localStorage.setItem(PREF_KEY_DROPDOWN, dropdownCheckbox.checked.toString());
                });

                const dropdownLabel = document.createElement("label");
                dropdownLabel.appendChild(dropdownCheckbox);
                dropdownLabel.append(" Bonus Points per day");

                insertAfter.parentNode.insertBefore(document.createElement("br"), insertAfter.nextSibling);
                insertAfter.parentNode.insertBefore(dropdownLabel, insertAfter.nextSibling.nextSibling);
            }
        }
    }

    setTimeout(() => {
        addBPerDayToDropdown();
        addBPerDayToTopArea();
        addPreferenceOption();
    }, 1000);
})();