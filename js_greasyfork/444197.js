// ==UserScript==
// @name         Meguca Extended
// @namespace    meguca.shamichan.ext
// @version      1.1.2
// @description  Adds new functionality to Meguca/shamichan imageboards
// @author       SaddestPanda
// @license      UNLICENSE
// @match        https://2chen.moe/*
// @match        https://sturdychan.help/*
// @match        https://shamik.ooo/*
// @match        https://shamiko.org/*
// @match        https://meta.4chan.gay/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/444197/Meguca%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/444197/Meguca%20Extended.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    // Default settings
    const defaultSettings = {
        scrollToUnread: true,
        showScrollbarMarkers: true,
        firstRun: true,
    };

    const settings = {
        scrollToUnread: await GM.getValue("scrollToUnread", defaultSettings.scrollToUnread),
        showScrollbarMarkers: await GM.getValue("showScrollbarMarkers", defaultSettings.showScrollbarMarkers),
        firstRun: await GM.getValue("firstRun", defaultSettings.firstRun),
    };

    console.log("%cMeguca Extended: Started with settings:", "color:rgb(0, 140, 255)", settings);

    addMyStyle("meguca-extended-css", `
    .lastRead {
        border-top: 8px solid #1cb9d2;
    }

    .marker-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 10px;
        height: 100vh;
        z-index: 1000;
        pointer-events: none;
    }

    .marker {
        position: absolute;
        width: 100%;
        height: 6px;
        background: #0092ff;
        cursor: pointer;
        pointer-events: auto;
        border-radius: 40% 0 0 40%;
        z-index: 5;
    }

    .marker.alt {
        background: #a8d8f8;
        z-index: 2;
    }

    #megucaExtendedMenu {
        position: fixed;
        top: 15px;
        right: 100px;
        padding: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        background: #353535;
        border: 1px solid #737373;
        color: #ddd;
        border-radius: 4px;
    }

    .postMine {
        border-left: 3px dashed;
        border-left-color: #36a9ffed !important;
        padding-left: 7px;
        box-sizing: border-box;
    }

    .postReply:not(.postMine) {
        border-left: 2px solid;
        border-left-color: #a8d8f8b0 !important;
        padding-left: 8px;
        box-sizing: border-box;
    }
    `);

    // Register menu command
    GM.registerMenuCommand("Show Options Menu", openMenu);
    try {
        createSettingsButton();
    } catch (error) {
        console.log("Error while creating settings button:", error);
    }

    //Open the settings menu on the first run
    if (settings.firstRun) {
        settings.firstRun = false;
        await GM.setValue("firstRun", settings.firstRun);
        openMenu();
    }

    let threadID = document.querySelector("#thread-container")?.dataset.id || null;
    if (!threadID) {
        console.log("Meguca Extended: Thread ID is empty. Is this even a thread? Exiting.");
        return;
    }
    let threadPosts = document.querySelectorAll("#threads #thread-container article");

    // if (threadPosts?.length < 10) {
    //     //disable if there are less than 10 posts
    //     return;
    // }

    const yourPosts = [];
    const yourReplies = [];
    let db;
    let retries = 0;
    dbStart();

    function openMenu() {
        const oldMenu = document.getElementById("megucaExtendedMenu");
        if (oldMenu) {
            oldMenu.remove();
            return;
        }
        // Create options menu
        const menu = document.createElement("div");
        menu.id = "megucaExtendedMenu";
        menu.innerHTML = `
            <h3 style="text-align: center; color:#6bc9ff;">Meguca Extended Options</h3><br><br>
            <label>
                <input type="checkbox" id="scrollToUnread" ${settings.scrollToUnread ? "checked" : ""}>
                Scroll to first unread post after page load
            </label><br>
            <label>
                <input type="checkbox" id="showScrollbarMarkers" ${settings.showScrollbarMarkers ? "checked" : ""}>
                Show your posts and replies on the scrollbar
            </label><br><br>
            <button id="saveSettings">Save</button>
            <button id="closeMenu">Close</button>
        `;
        document.body.appendChild(menu);

        // Save button functionality
        document.getElementById("saveSettings").addEventListener("click", async () => {
            settings.scrollToUnread = document.getElementById("scrollToUnread").checked;
            settings.showScrollbarMarkers = document.getElementById("showScrollbarMarkers").checked;

            await GM.setValue("scrollToUnread", settings.scrollToUnread);
            await GM.setValue("showScrollbarMarkers", settings.showScrollbarMarkers);

            alert("Settings saved!\nRefresh the page for the changes to take effect.");
            menu.remove();
        });

        // Close button functionality
        document.getElementById("closeMenu").addEventListener("click", () => {
            menu.remove();
        });
    }

    function createSettingsButton() {
        document.querySelector(".overlay-container #banner-watcher").parentElement.insertAdjacentHTML("beforeend", `
        <a id="banner-megucaextended" class="banner-float svg-link noscript-hide" title="Meguca Extended Settings"
            style="color: #2eb1ff;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7L336 192c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 408a24 24 0 1 1 0 48 24 24 0 1 1 0-48z">
                </path>
            </svg>
        </a>
        `);
        document.querySelector("#banner-megucaextended").addEventListener("click", openMenu);
    }

    function dbStart() {
        let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        let DBOpenRequest = indexedDB.open("meguca");
        DBOpenRequest.onsuccess = (event) => {
            db = event.target.result;
            dbContinue();
        };
        DBOpenRequest.onerror = (event) => {
            //retry db access
            if (retries < 5) {
                retries++;
                setTimeout(() => {
                    dbStart();
                }, 150);
            }
        };
    }

    async function dbContinue() {
        //Always mark unread, the setting is just for the scrolling part.
        let transaction = db.transaction("seenPost", "readonly");
        let objectStore = transaction.objectStore("seenPost");
        let getAll = objectStore.getAll();
        getAll.onsuccess = (event) => {
            let allData = event.target.result;

            //Find "first unread post"
            let postIDs = new Map();
            threadPosts.forEach((element) => {
                let id = parseInt(element.id.split("p")[1]);
                postIDs.set(id, true);
            });

            allData.forEach((obj) => {
                if (obj.op == threadID) {
                    postIDs.delete(obj.id);
                }
            });

            if (postIDs.size == 0) {
                //No unread posts. Scroll to bottom.
                document.querySelector("html").scrollIntoView(false);
            } else {
                //Scroll to first unread post
                const iterator = postIDs.keys();
                let firstUnreadID = iterator.next().value;
                let firstUnreadElem = document.querySelector(`article[id="p${firstUnreadID}"]`);
                if (firstUnreadElem) {
                    //Mark as read (add styling)
                    firstUnreadElem.classList.add("lastRead");
                    //Do scroll (top of next elem)
                    if (settings.scrollToUnread) {
                        let firstUnreadPos = findPos(firstUnreadElem?.nextElementSibling || firstUnreadElem);
                        window.scroll(0, firstUnreadPos.top - window.innerHeight);
                    }
                }
            }

            /*
            //Find "last read post"
            //This method doesn't work as hovered backlinks are set to read as well

            let filteredData = allData.filter(obj => obj.op == threadID);
            let lastObj = filteredData[filteredData.length - 1];
            let lastReadElem = document.querySelector(`article[id="p${lastObj.id}"]`);
            //Mark as read (add styling)
            lastReadElem.classList.add("lastRead");
            //Scroll one screen height above last read (don't show last read)
            let lastReadPos = findPos(lastReadElem);
            window.scroll(0, lastReadPos.top - window.innerHeight + 150); //+N is to show last read post and part of the next post 
            */
        };
        getAll.onerror = (event) => {
            console.error("Meguca Extended: Error accessing 'seenPost' object store:", event);
            db.close();
        };

        //Always mark posts, the setting is just for the scrollbar marks
        let mineTransaction = db.transaction("mine", "readonly");
        let mineObjectStore = mineTransaction.objectStore("mine");
        let getAllMine = mineObjectStore.getAll();
        getAllMine.onsuccess = (mineEvent) => {
            //Close db early
            db.close();

            let mineData = mineEvent.target.result;

            // Create marker container
            const markerContainer = document.createElement("div");
            if (settings.showScrollbarMarkers) {
                markerContainer.classList.add("marker-container");
                document.body.appendChild(markerContainer);
            }
            // Filter and log matching "op" values
            mineData.forEach((obj) => {
                if (obj.op == threadID) {
                    let postMine = document.querySelector(`article[id="p${obj.id}"]`);
                    if (postMine) {
                        postMine.classList.add("postMine");
                        yourPosts.push(obj.id);
                        let postReplyLinks = postMine.querySelectorAll(".backlinks a[data-id]");
                        postReplyLinks.forEach((link) => {
                            let postReply = document.querySelector(`article[id="p${link.dataset.id}"]`);
                            if (postReply) {
                                yourReplies.push(link.dataset.id);
                                postReply.classList.add("postReply");
                            }
                        });
                    }
                }
            });

            if (settings.showScrollbarMarkers) {
                recreateScrollMarkers();
            }
        };
        getAllMine.onerror = (mineEvent) => {
            console.error("Meguca Extended: Error accessing 'mine' object store:", mineEvent);
        };
    }

    function addMyStyle(newID, newStyle) {
        let myStyle = document.createElement("style");
        //myStyle.type = 'text/css';
        myStyle.id = newID;
        myStyle.textContent = newStyle;
        document.querySelector("head").appendChild(myStyle);
    }

    function findPos(obj) {
        const rect = obj.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY,
        };
    }

    function createMarker(element, container, isReply) {
        const pageHeight = document.body.scrollHeight;
        const offsetTop = element.offsetTop;
        const percent = offsetTop / pageHeight;

        const marker = document.createElement("div");
        marker.classList.add("marker");
        if (isReply) {
            marker.classList.add("alt");
        }
        marker.style.top = `${percent * 100}vh`;

        marker.addEventListener("click", () => {
            let elem = element?.previousElementSibling || element;
            elem.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        container.appendChild(marker);
    }

    function recreateScrollMarkers() {
        let oldContainer = document.querySelector(".marker-container");
        if (oldContainer) {
            oldContainer.remove();
        }
        // Create marker container
        const markerContainer = document.createElement("div");
        if (settings.showScrollbarMarkers) {
            markerContainer.classList.add("marker-container");
            document.body.appendChild(markerContainer);
        }
        yourPosts.forEach((id) => {
            const elem = document.querySelector(`article[id="p${id}"]`);
            if (elem) {
                createMarker(elem, markerContainer, false);
            }
        });
        yourReplies.forEach((id) => {
            const elem = document.querySelector(`article[id="p${id}"]`);
            if (elem) {
                createMarker(elem, markerContainer, true);
            }
        });
    }

    //Observe changes to #hover-overlay to add the styles (hovered posts)
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === "ARTICLE") {
                        const postID = node.id.slice(1);
                        if (yourPosts.some((id) => id === postID)) {
                            node.classList.add("postMine");
                        } else if (yourReplies.some((id) => id === postID)) {
                            node.classList.add("postReply");
                        }
                    }
                });
            }
        }
    });
    const hoverDiv = document.querySelector("#hover-overlay");
    observer.observe(hoverDiv, { childList: true, subtree: true });

    // Add a second observer for #thread-container (new posts)
    const threadObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === "ARTICLE") {
                        checkPost(node);
                        //Recreat markers because the page grew taller. Is this heavy? probably not.
                        if (settings.showScrollbarMarkers) {
                            recreateScrollMarkers();
                        }
                    }
                });
            }
        }
    });

    function checkPost(node) {
        const youIndicator = node.querySelector("header i");
        if (youIndicator && youIndicator.textContent.match(/\(you\)/i)) {
            node.classList.add("postMine");
            const postID = node.id.slice(1);
            yourPosts.push(postID);
        }
        const postLink = node.querySelector(".post-container a.post-link");
        if (postLink && postLink.textContent.match(/\(you\)/i)) { //Can also match the ids from yourPosts
            node.classList.add("postReply");
            const postID = node.id.slice(1);
            yourReplies.push(postID);
        }
        if (node.classList.contains("editing")) {
            //Recheck until each post finishes editing (slowly)
            const editpost = node; //this is necessary
            let checkInterval = setInterval(() => {
                if (!editpost.classList.contains("editing")) {
                    clearInterval(checkInterval);
                    //wait for the post to settle down (waiting for the links to be created)
                    setTimeout(() => {
                        checkPost(editpost);
                        if (settings.showScrollbarMarkers) {
                            recreateScrollMarkers();
                        }
                    }, 1200);
                }
            }, 100);
        }
    }
    const threadContainer = document.querySelector("#thread-container");
    if (threadContainer) {
        threadObserver.observe(threadContainer, { childList: true });
    }
})();
