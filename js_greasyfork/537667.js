// ==UserScript==
// @name         Assetbots: Sidebar Categories & Cleanup
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Adds category links under Kiosks, hides Kiosks/Reservations, and removes shortcut badges
// @author       Patrick Neitzel
// @license      MIT
// @match        https://app.assetbots.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537667/Assetbots%3A%20Sidebar%20Categories%20%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/537667/Assetbots%3A%20Sidebar%20Categories%20%20Cleanup.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const categories = [
        { name: "Video Components", fid: "ft_cm7xw8mvv08lv19478gwl1bzm" },
        { name: "Testing", fid: "ft_cm5ocd0ii02p1j12sis0cp1aw" },
        { name: "PDE", fid: "ft_cm758lq5405wrhl4728xc5ccc" },
        { name: "Miscellaneous", fid: "ft_cm7xvzusr08ek194724cw6yqz" },
        { name: "Microscope Parts", fid: "ft_cm6shf0di03qpih47t86up8sa" },
        { name: "MKT supplies", fid: "ft_cm7jm8oja1z641a2w7q9o75q3" },
        { name: "EMI", fid: "ft_cm70zyo79052ahj47d1yubnf9" },
        { name: "Briefcase Kits", fid: "ft_cm7ks07ts0djx1947d5kcep0r" },
        { name: "Anastomosis Kits", fid: "ft_cm7krzefi0djh19479oqmdh4t" }
    ];

    function getDbId() {
        const link = document.querySelector("a[href^='/db_']");
        if (!link) return null;
        const match = link.getAttribute("href").match(/\/(db_[a-z0-9]+)/i);
        return match ? match[1] : null;
    }

    function hideSidebarItems() {
        const sidebarItems = document.querySelectorAll(".sidebar-secondary li");
        sidebarItems.forEach(li => {
            const text = li.textContent.trim().toLowerCase();
            if (text.includes("kiosks") || text.includes("reservations")) {
                li.style.display = "none";
            }
        });
    }

    function removeShortcutBadges() {
        const shortcutSpans = document.querySelectorAll(
            ".sidebar-secondary span.font-mono.font-semibold.inline-flex"
        );
        shortcutSpans.forEach(el => el.remove());
    }

    function insertCategoryLinks() {
        if (!window.location.pathname.match(/\/assets$/)) return;

        const dbId = getDbId();
        if (!dbId) return;

        const sidebar = document.querySelector(".sidebar-secondary ul");
        if (!sidebar) return;

        const kiosksItem = Array.from(sidebar.querySelectorAll("li")).find(li =>
            li.textContent.trim().toLowerCase().includes("kiosks")
        );

        if (!kiosksItem || kiosksItem.dataset.linksAdded === "true") return;

        categories.forEach(cat => {
            const li = document.createElement("li");
            li.className = "my-1";
            li.innerHTML = `
                <a class="block font-medium group focus:outline-none relative ripple-group rounded-md w-full p-2 text-base ripple-secondary-700 dark:ripple-secondary-400 text-gray-600 dark:text-gray-300 hover:text-secondary-700 dark:hover:text-secondary-400 ripple-on-light dark:ripple-on-dark mdc-ripple-upgraded mdc-ripple-surface"
                   href="/${dbId}/assets?fid=${cat.fid}">
                    <span class="flex items-center relative pl-7">
                        <span class="flex flex-1 items-center">
                            <span class="mr-2">${cat.name}</span>
                        </span>
                    </span>
                </a>
            `;
            kiosksItem.insertAdjacentElement("afterend", li);
        });

        kiosksItem.dataset.linksAdded = "true";
        hideSidebarItems();
        removeShortcutBadges();
    }

    const observer = new MutationObserver(() => {
        insertCategoryLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(insertCategoryLinks, 1500);
})();
