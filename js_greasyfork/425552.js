// ==UserScript==
// @name         PassThePopcorn thread hider
// @namespace    mzxtsrweuiujkgxq
// @version      1.0
// @description  Adds thread hiding to PTP forums
// @match        https://passthepopcorn.me/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425552/PassThePopcorn%20thread%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/425552/PassThePopcorn%20thread%20hider.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    const ACTION_HIDE = "[Hide this Thread]";
    const ACTION_UNHIDE = "[Unhide this Thread]";
    const HIDDEN_THREAD_REPLACER = "[hidden thread]";

    const params = new URLSearchParams(location.search);
    let currentThread = null;

    const threadLink = location.protocol + "//" + location.host + "/forums.php?action=viewthread&threadid=";

    const view = params.get("action");

    // censor: Replace thread title and unlink
    // hide:   Remove the entire containing table row
    let mode = "censor";

    if (view === "viewthread") {
        // Are we viewing a thread?
        currentThread = params.get("threadid").replaceAll(/[^0-9]/g, "");
    } else if (view === "search" || view === "viewforum" || location.pathname === "/" || location.pathname === "/index.php") {
        // Search results, subforum listing or home page
        mode = "hide";
    }


    async function getHiddenThreads() {
        const hiddenThreads = await GM.getValue("hiddenThreads");

        if (hiddenThreads) {
            return new Set(hiddenThreads.split(","));
        } else {
            return new Set();
        }
    }


    async function setThreadHidden(id, state) {
        const hiddenThreads = await getHiddenThreads();
        const titleKey = `threadTitle${id}`;

        if (state) {
            hiddenThreads.add(id);

            // Save post title if hiding currently viewed thread
            if (id === currentThread) {
                let [title] = document.getElementsByClassName("page__title");
                if (title) {
                    // Forums > Sandbox > [Userscript Request] Hide forum threads
                    // Strip the "Forums >" part and collapse whitespace
                    title = title.textContent.replace(/.*?>/, "").replaceAll(/\s+/g, " ").trim();
                    GM.setValue(titleKey, title);
                }
            }
        } else {
            hiddenThreads.delete(id);
            GM.deleteValue(titleKey);
        }

        GM.setValue("hiddenThreads", Array.from(hiddenThreads).join(","));
    }


    // Responds to click handlers on hiding links,
    // expecting data-threadid and data-action to be set
    function hideClickHandler(event) {
        const { dataset } = event.target;
        if (!("threadid" in dataset)) {
            return;
        }

        // Prevent the fake link from activating
        event.preventDefault();

        // Set hiding state
        setThreadHidden(dataset.threadid, (dataset.action === "hide"));
    }


    const hiddenThreads = await getHiddenThreads();

    // Add hide/unhide controls
    if (currentThread) {
        window.addEventListener("DOMContentLoaded", () => {
            const [linkbox] = document.getElementsByClassName("linkbox");

            if (linkbox) {
                const frag = document.createDocumentFragment();
                const newLink = document.createElement("a");
                newLink.href = "#"
                newLink.className = "linkbox__link";
                newLink.dataset.threadid = currentThread;

                if (hiddenThreads.has(currentThread)) {
                    newLink.textContent = ACTION_UNHIDE;
                    newLink.dataset.action = "unhide";
                } else {
                    newLink.textContent = ACTION_HIDE;
                    newLink.dataset.action = "hide";
                }

                newLink.addEventListener("click", hideClickHandler);

                // Toggle text and link action
                newLink.addEventListener("click", function () {
                    if (this.dataset.action === "hide") {
                        this.dataset.action = "unhide";
                        this.textContent = ACTION_UNHIDE;
                    } else {
                        this.dataset.action = "hide";
                        this.textContent = ACTION_HIDE;
                    }
                });

                frag.append(" ", newLink);
                linkbox.append(frag);
            }
        });
    } else if (hiddenThreads.size > 0) {
        // Actually hide links
        window.addEventListener("DOMContentLoaded", () => {
            const threads = document.querySelectorAll("a[href*='action=viewthread']");

            for (const thread of threads) {
                let id;
                try {
                    id = new URLSearchParams(thread.search).get("threadid");
                } catch (ignore) {
                    break;
                }

                if (hiddenThreads.has(id)) {
                    if (mode === "hide") {
                        // Hide table row
                        const element = thread.closest("tr");
                        if (element) {
                            element.style.display = "none";
                            // Remove thread ID, already handled
                            hiddenThreads.delete(id);

                            console.log(`Hiding hidden thread ${id} - ${threadLink}${id}`);
                        }
                    } else {
                        if (thread.classList.contains("forum-topic__go-to-last-read")) {
                            // Hide arrow
                            thread.style.display = "none";
                        } else {
                            // Replace link with censored message
                            thread.replaceWith(HIDDEN_THREAD_REPLACER);
                            console.log(`Censoring hidden thread ${id} - ${threadLink}${id}`);
                        }
                    }
                }
            }
        });
    }

    // Unhide threads menu
    window.addEventListener("DOMContentLoaded", () => {
        let dialog, tableBody;

        function initializeDialogBox() {
            dialog = document.createElement("div");
            dialog.className = "panel";
            dialog.style.cssText = "position: fixed; z-index: 99; width: 666px; left: 50%; padding: 10px; top: 3vh; transform: translateX(-50%); overflow: auto;";
            dialog.innerHTML = "<h2>Hidden threads</h2>";

            const table = document.createElement("table");
            table.className = "table table--panel-like table--bordered table--striped";
            table.innerHTML = '<colgroup><col><col style="width:1px;white-space:nowrap"></colgroup><thead><tr><th>Thread link</th><th>Unhide</th></tr></thead>';

            tableBody = table.createTBody();

            // Close button
            const close = document.createElement("button");
            close.type = "button";
            close.style.float = "right";
            close.textContent = "Close";
            close.addEventListener("click", () => {
                dialog.remove();
                tableBody.textContent = "";
            });

            dialog.append(table, close);

            // Click handler for table body (catches unhide link clicks)
            tableBody.addEventListener("click", hideClickHandler);
            tableBody.addEventListener("click", (event) => {
                const { target } = event;

                // Only care about unhide link clicks
                if ("threadid" in target.dataset) {
                    // Remove table row
                    target.closest("tr")?.remove();
                }
            });
        }

        GM.registerMenuCommand("View list of hidden threads", async () => {
            if (!dialog) {
                // Create modal when needed
                initializeDialogBox();
            }

            // Reset table
            tableBody.textContent = "";

            for (const id of await getHiddenThreads()) {
                const row = tableBody.insertRow();
                const linkCell = row.insertCell();
                const removeCell = row.insertCell();

                const link = document.createElement("a");
                link.target = "_blank";
                link.rel = "noopener";
                link.referrerPolicy = "no-referrer";
                link.href = threadLink + id;
                link.textContent = await GM.getValue(`threadTitle${id}`, "[thread title not found]");
                linkCell.append(link);

                removeCell.innerHTML = `<a href="#" data-action="unhide" data-threadid="${id}">[Unhide]</a>`;
            }

            document.body.append(dialog);
        }, null);
    });
})();

