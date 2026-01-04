// ==UserScript==
// @name         Viewer list bot remover
// @namespace    https://greasyfork.org/scripts?set=586259
// @version      deprecated (1.3.0)
// @description  Places bots in their own category in the viewer list.
// @author       Sonyo
// @match        http*://www.twitch.tv/*
// @grant        none
// @license      MIT
// @icon         https://cdn-icons-png.flaticon.com/512/9092/9092067.png
// @downloadURL https://update.greasyfork.org/scripts/463006/Viewer%20list%20bot%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/463006/Viewer%20list%20bot%20remover.meta.js
// ==/UserScript==

/*
 * OPTIONS
 * Modify the following variable for the behavior concerning moderator bots:
*/
const modBotsBehavior = 2;
/*
 * 0: Keep them in the Moderators panel
 * 1: Place them with the other bots
 * 2: Place them in their own panel
*/



/*
 * SCRIPT
*/
const botsPanelTitle = "Bots";
const botImageSource = "https://cdn-icons-png.flaticon.com/512/9092/9092067.png";
const modBotsPanelTitle = "Moderator bots";
const modBotImageSource = "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2";

let botList = [];

let observer;
let scrollableTrigger = null;

let moderatorImageSource = "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/2";

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function getElement(selector) {
    let element = document.querySelector(selector);
    let count = 0;
    while (element === null) {
        await delay(1000);
        element = document.querySelector(selector);
        count++;
        if (count > 15) {
            return null;
        }
    }
    return element;
}

async function getBotList() {
    botList = [];
    await fetch('https://api.twitchinsights.net/v1/bots/all')
        .then(response => response.json())
        .then(json => {
            for (let bot of json.bots) {
                botList.push(bot[0]);
            }
            botList.sort();
        });
}

function binarySearch(name) {
    let start = 0;
    let end = botList.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);
        if (botList[mid] === name) return true;
        if (botList[mid] < name) start = mid + 1;
        else end = mid - 1;
    }

    return false;
}

void async function () {
    'use strict';

    await getBotList();

    let prevUrl = undefined;
    setInterval(async () => {
        const currUrl = window.location.href;
        if (currUrl != prevUrl) {
            prevUrl = currUrl;
            await setup();
        }
    }, 1000);
}();

async function setup() {
    observer?.disconnect();
    const chatContent = await getElement(location.pathname.includes('moderator') ? '#community-drawer' : '.chat-room__content');

    const callback = mutationList => {
        for (const mutation of mutationList) {
            for (const added of mutation.addedNodes) {
                if (added.classList?.contains('scrollable-area')) {
                    removeBots(added.firstElementChild);
                }
            }
        }
    };

    observer = new MutationObserver(callback);
    observer.observe(chatContent, { childList: true, subtree: true });
}

function removeBots(container) {
    const panelCount = container.childElementCount;
    let toAddToBots;
    for (let i = 1; i < panelCount; i++) {
        const panel = container.children[i];
        const src = panel.firstElementChild.firstElementChild.firstElementChild.firstElementChild.src;
        if (src === moderatorImageSource)
            toAddToBots = handleModeratorPanel(panel);
        else if (src === undefined)
            handleViewerPanel(panel, toAddToBots);
    }

    if (scrollableTrigger) {
        container.lastElementChild.children[1].appendChild(scrollableTrigger);
        scrollableTrigger = null;
    }
}

function removeBotsFromPanel(panel) {
    const bots = [];
    let shouldRemovePanel = true;
    for (let i = 0; i < panel.children[1].childElementCount; i++) {
        const viewer = panel.children[1].children[i];
        if (viewer.classList.contains('scrollable-trigger__wrapper')) {
            scrollableTrigger = viewer.cloneNode(true);
            continue;
        }

        if (binarySearch(viewer.innerText)) {
            bots.push(viewer);
            viewer.remove();
            i--;
        }
        else
            shouldRemovePanel = false;
    }
    if (shouldRemovePanel)
        panel.style.display = 'none';

    return bots;
}

function handleModeratorPanel(panel) {
    if (modBotsBehavior !== 0 && modBotsBehavior !== 1 && modBotsBehavior !== 2) {
        alert("[Viewer list bot remover]: modBotsBehavior incorrectly set. Must be 0, 1 or 2");
        return;
    }

    if (modBotsBehavior === 0) {
        return;
    }

    const bots = removeBotsFromPanel(panel);

    if (bots.length === 0)
        return;

    if (modBotsBehavior === 1)
        return bots;

    const newPanel = createEmptyPanel(panel, modBotImageSource, modBotsPanelTitle);
    panel.parentElement.appendChild(newPanel);
    newPanel.firstChild.firstChild.firstChild.firstChild.style.filter = 'hue-rotate(95deg)';

    for (const bot of bots) {
        newPanel.children[1].appendChild(bot);
    }
}

function handleViewerPanel(panel, toAddToBots = []) {
    const bots = removeBotsFromPanel(panel);

    if (bots.length === 0)
        return;

    const newPanel = createEmptyPanel(panel, botImageSource, botsPanelTitle);
    panel.parentElement.appendChild(newPanel);

    for (const bot of toAddToBots) {
        newPanel.children[1].appendChild(bot);
    }
    for (const bot of bots) {
        newPanel.children[1].appendChild(bot);
    }
}

function createEmptyPanel(original, image, name) {
    const newPanel = original.cloneNode(true);
    const botImg = document.createElement("img");
    botImg.setAttribute("class", "InjectLayout-sc-1i43xsx-0 lwTRC tw-image");
    botImg.setAttribute("alt", "Bot badge");
    botImg.setAttribute("src", image);

    newPanel.firstChild.firstChild.firstChild.children[0].remove();
    newPanel.firstChild.firstChild.firstChild.insertBefore(botImg, newPanel.firstChild.firstChild.firstChild.firstChild);
    newPanel.firstChild.firstChild.firstChild.children[1].firstChild.innerText = name;

    newPanel.style.display = '';

    let viewers = newPanel.children[1];
    while (viewers.firstChild) {
        viewers.removeChild(viewers.firstChild);
    }

    return newPanel;
}
