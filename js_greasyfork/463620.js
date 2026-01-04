// ==UserScript==
// @name         Hide topics
// @namespace    http://tampermonkey.net/
// @version      1.01
// @license      MIT
// @description  Hide topics from the topic list
// @author       Milan
// @match        *://*.websight.blue/thread/*
// @match        *://*.websight.blue/threads/*
// @match        *://*.websight.blue/
// @match        *://*.websight.blue/multi/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/463620/Hide%20topics.user.js
// @updateURL https://update.greasyfork.org/scripts/463620/Hide%20topics.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addToggleButton = (infobar, threadRef) => {
        const button = document.createElement("a");
        const buttonText = document.createTextNode(isInList(threadRef) ? "Undo hide" : "Hide");
        const seperator = document.createTextNode(" | ");
        button.href="#";
        button.id = "GM-hide-toggle-button";
        button.onclick = e => {
            e.preventDefault();
            button.text = isInList(threadRef) ? "Hide" : "Undo hide";
            button.title = "Toggle hidden status of topic";
            isInList(threadRef) ? removeHide(threadRef) : addHide(threadRef);
        }
        infobar.appendChild(seperator);
        infobar.appendChild(button);
        button.appendChild(buttonText);
    }
    const addHide = threadRef => {
        const hideList = GM_getValue("hidden-topics-list", []);
        GM_setValue("hidden-topics-list", [...hideList, threadRef]);
    }
    const removeHide = threadRef => {
        const hideList = GM_getValue("hidden-topics-list", []);
        GM_setValue("hidden-topics-list", hideList.filter(hiddenThreadRef => { return hiddenThreadRef !== threadRef }));
    }
    const isInList = threadRef => {
        const hideList = GM_getValue("hidden-topics-list", []);
        return hideList.includes(threadRef);
    }
    const hide = topic => { topic.style.display = "none"; };

    const addUnhideButton = menu => {
        const button = document.createElement("a");
        button.href = "#";
        button.id = "GM-unhide-button";
        button.title = "Reveal hidden topics";
        button.innerText = "Reveal";
        button.addEventListener('click', () => {
            button.innerText = "Revealed";
            document.querySelectorAll("#thread-list>tbody>tr").forEach( row => {
                row.style.display = "table-row";
            });
        });
        menu.append(" | ");
        menu.append(button);
    }

    const addKeyboardShortcut = (threadList) => {
        document.addEventListener('keydown', (e) => {
            if (e.key == "h") {
                threadList.forEach(row => {
                    row.onclick = (e) => {
                        e.preventDefault();
                        if(e.ctrlKey) rowClickHandler(row, threadList);
                    }
                });
            }
        });
    }

    const rowClickHandler = (row, threadList) => {
        addHide(row.dataset.threadRef);
        row.style.display = "none";
    }

    const removeAllListeners = (threadList) => {
        threadList.forEach(thread => {
            thread.removeEventListener("click", rowClickHandler);
        });
    }

    // if on message list
    if(document.getElementById("messages")) {
        const zone = document.querySelector(".message-container.post").dataset.zone;
        const id = document.querySelector(".message-container.post").dataset.thread;
        const threadRef = `${zone} ${id}`;
        const infobar = document.querySelector(".infobar");
        addToggleButton(infobar, threadRef);
    }

    // if on topic list
    if(document.getElementById("thread-list")) {
        const threadList = document.querySelectorAll("#thread-list tr");
        const menu = document.querySelector(".userbar");
        Array.prototype.filter.call(threadList, topic => { return isInList(topic.dataset?.threadRef) }).forEach( topic => { hide(topic); });
        addUnhideButton(menu);
        addKeyboardShortcut(threadList);
    }
})();