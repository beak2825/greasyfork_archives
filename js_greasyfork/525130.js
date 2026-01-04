// ==UserScript==
// @name         Kemono Party Blacklist with Reasons
// @namespace    https://MeusArtis.ca
// @version      2.4.0
// @description  Blacklists posts by Creator ID with reasons, featuring "Blacklist All Users", "Blacklist", and "Unblacklist" (with reasons and multiple delete)
// @author       Meus Artis
// @icon         https://www.google.com/s2/favicons?domain=kemono.su
// @match        https://kemono.su/*
// @match        https://coomer.su/*
// @license      CC BY-NC-SA 4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525130/Kemono%20Party%20Blacklist%20with%20Reasons.user.js
// @updateURL https://update.greasyfork.org/scripts/525130/Kemono%20Party%20Blacklist%20with%20Reasons.meta.js
// ==/UserScript==

(function () {
    const BlacklistStorage = window.localStorage;

    // Initialize blacklist storage
    if (!BlacklistStorage.getItem("blacklist")) {
        BlacklistStorage.setItem("blacklist", JSON.stringify([]));
    }
    const Blacklisted = JSON.parse(BlacklistStorage.getItem("blacklist"));

    // Helper to save blacklist
    function saveBlacklist() {
        BlacklistStorage.setItem("blacklist", JSON.stringify(Blacklisted));
    }

    // Apply blacklist to hide elements
    function applyBlacklist() {
        Blacklisted.forEach(({ id }) => {
            document.querySelectorAll(`[data-user='${id}']`).forEach((el) => {
                el.closest("article").style.display = "none";
            });
        });
    }

    // Add "Blacklist All Users" button
    function addBlacklistAllButton() {
        if (document.querySelector("#blacklist-all-users")) return;

        const button = document.createElement("button");
        button.id = "blacklist-all-users";
        button.textContent = "Blacklist All Users";
        button.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 1000;
            padding: 10px 15px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        `;

        button.onclick = () => {
            const userIds = new Set();
            document.querySelectorAll("article[data-user]").forEach((card) => {
                const userId = card.getAttribute("data-user");
                if (userId && !Blacklisted.some((entry) => entry.id === userId)) {
                    userIds.add(userId);
                }
            });

            if (userIds.size > 0) {
                const reason = prompt(`Enter a reason for blacklisting these ${userIds.size} users:`);

                if (reason) {
                    userIds.forEach((id) => {
                        Blacklisted.push({ id, reason });
                    });
                    saveBlacklist();
                    alert(`Blacklisted ${userIds.size} users!`);
                    applyBlacklist();
                }
            } else {
                alert("No new users found to blacklist.");
            }
        };

        document.body.appendChild(button);
    }

    // Add "Blacklist" button on creator/user pages
    function addBlacklistButton() {
        if (document.querySelector("#blacklist-button")) return;

        const button = document.createElement("button");
        button.id = "blacklist-button";
        button.textContent = "Blacklist";
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 15px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        `;

        button.onclick = () => {
            const HeadMetaPost = document.querySelector("meta[name='user']");
            const HeadMetaArtistID = document.querySelector("meta[name='id']")?.getAttribute("content");
            const currentUserId = HeadMetaPost?.getAttribute("content") || HeadMetaArtistID;

            if (currentUserId && !Blacklisted.some((entry) => entry.id === currentUserId)) {
                const reason = prompt(`Enter a reason for blacklisting user ID: ${currentUserId}`);
                if (reason) {
                    Blacklisted.push({ id: currentUserId, reason });
                    saveBlacklist();
                    alert("Creator/User Blacklisted!");
                    applyBlacklist();
                }
            } else {
                alert("This creator/user is already blacklisted.");
            }
        };

        document.body.appendChild(button);
    }

    // Add "Unblacklist Users" button
    function addUnblacklistButton() {
        if (document.querySelector("#unblacklist-users")) return;

        const button = document.createElement("button");
        button.id = "unblacklist-users";
        button.textContent = "Unblacklist Users";
        button.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 20px;
            z-index: 1000;
            padding: 10px 15px;
            background: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        `;

        button.onclick = () => {
            const modal = document.createElement("div");
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1001;
                padding: 20px;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                max-height: 80%;
                overflow-y: auto;
                width: 800px;
                text-align: center;
                color: black;
            `;

            modal.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <button id="delete-selected" style="padding: 5px 10px; background: #ff4d4f; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete Selected</button>
                    <button id="close-modal" style="padding: 5px 10px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
                </div>
                <form id="blacklist-form">
                    <label>
                        <input id="select-all" type="checkbox" style="margin-bottom: 10px; cursor: pointer;">
                        Select All
                    </label>
                    <ul style="list-style: none; padding: 0; margin: 0; text-align: left; max-height: 400px; overflow-y: scroll;">
                        ${Blacklisted.length > 0
                            ? Blacklisted.map(({ id, reason }) => `
                                <li>
                                    <label>
                                        <input type="checkbox" value="${id}" style="margin-right: 5px; cursor: pointer;">
                                        <b>${id}</b> - <i>${reason || 'No reason provided'}</i>
                                    </label>
                                </li>
                            `).join("")
                            : "<li>No users are blacklisted.</li>"
                        }
                    </ul>
                </form>
            `;

            modal.querySelector("#select-all").onclick = (e) => {
                const checked = e.target.checked;
                modal.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
                    checkbox.checked = checked;
                });
            };

            modal.querySelector("#delete-selected").onclick = () => {
                const selectedIds = Array.from(modal.querySelectorAll("input[type='checkbox']:checked"))
                    .map((checkbox) => checkbox.value);
                if (selectedIds.length > 0) {
                    // Filter out selected IDs and remove them from the blacklist
                    selectedIds.forEach((id) => {
                        const index = Blacklisted.findIndex((entry) => entry.id === id);
                        if (index > -1) {
                            Blacklisted.splice(index, 1);
                        }
                    });
                    saveBlacklist();
                    modal.remove();
                    applyBlacklist();
                    addUnblacklistButton();
                } else {
                    alert("No users selected.");
                }
            };

            modal.querySelector("#close-modal").onclick = () => modal.remove();

            document.body.appendChild(modal);
        };

        document.body.appendChild(button);
    }

    // Initialize the script
    function initializeScript() {
        applyBlacklist();
        addBlacklistAllButton();
        addBlacklistButton();
        addUnblacklistButton();
    }

    // Observe URL changes and DOM mutations
    function observeDomChanges(callback) {
        const observer = new MutationObserver(callback);
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    }

    // Run script on page load and observe DOM changes
    window.addEventListener("DOMContentLoaded", initializeScript);
    observeDomChanges(() => {
        initializeScript();
    });
})();
