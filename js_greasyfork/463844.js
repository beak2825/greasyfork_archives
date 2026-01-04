// ==UserScript==
// @name         Grundos Cafe Quest Cost Calculator
// @namespace    https://www.grundos.cafe
// @version      2.0
// @description  Calculates the cost of the Grundos Cafe Quest items as the user searches for them on the Shop Wiz. Displays the info in a table above the Quest Items when the Wiz Searches finished loading in the other tabs.
// @author       Dark_Kyuubi
// @match        https://www.grundos.cafe/market/wizard*
// @match        https://www.grundos.cafe/winter/snowfaerie*
// @match        https://www.grundos.cafe/halloween/witchtower*
// @match        https://www.grundos.cafe/halloween/esophagor*
// @match        https://www.grundos.cafe/island/kitchen*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463844/Grundos%20Cafe%20Quest%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/463844/Grundos%20Cafe%20Quest%20Cost%20Calculator.meta.js
// ==/UserScript==

class QuestItems {
    constructor(questGiver, items, deadline) {
        this.questGiver = questGiver;
        this.items = items;
        this.deadline = deadline;
    }
}

class Item {
    constructor(name, cost) {
        this.name = name;
        this.cost = cost;
    }
}

//Map serialization and proper Map checking is pain
let quests = [];
let questsGrid = document.createElement('div');

const styles = `
    .quest-item-qcc,.quest-giver,.final-cost {
        width: 100%;
        height: 100%;
        border: 1px solid black;
`
let styleSheet = document.createElement("style");

(async function () {
    'use strict';

    await initializeQuests();

    if (!window.location.href.includes("wizard")) {
        let questGiver = determineQuestGiver();
        if (window.location.href.includes("complete")) {
            if (!document.querySelector("strong.red")) {
                quests = quests.filter(q => q.questGiver !== questGiver);
                if (quests.length === 0) {
                    await GM.deleteValue('quests');
                } else {
                    await updateStoredQuests();
                }
            }
        } else {
            pushStyle();
            GM.addValueChangeListener('quests', async (name, oldValue, newValue, remote) => {
                if (remote && oldValue !== newValue) {
                    quests = newValue ? JSON.parse(newValue) : [];
                    showCalculatedQuestsSum(questGiver);
                }
            });
            updateGrid(questGiver);
        }
    } else {
        let shopWizResult = document.querySelector('.sw_results');
        let swItem = document.querySelector('p.mt-1>strong')?.innerHTML.substring(18, undefined).trim();
        if (quests.length > 0 && shopWizResult && isQuestItem(swItem)) {
            await collectShopWizPrice(swItem);
        }
    }

    async function updateGrid(questGiver) {
        await getNewQuestItems(questGiver);
        showCalculatedQuestsSum(questGiver);
    }

    function isQuestItem(swItem) {
        return quests.some(q => q.items.some(i => i.name === swItem));
    }

    function showCalculatedQuestsSum(questGiver) {
        questsGrid.setAttribute('style', getGridStyle());
        questsGrid.className = 'quest-grid';
        questsGrid.innerHTML = '';
        createQuestGiverHeaders();
        createQuestItemRows();
        createQuestSumRow();
        const insertLocation = getInsertLocationByQuestGiver(questGiver);
        if (insertLocation) {
            if (!questsGrid.parentNode) {
                insertLocation.before(questsGrid);
            }
        }
    }

    function getInsertLocationByQuestGiver(questGiver) {
        switch (questGiver) {
            case 'snowfaerie':
                return document.getElementById('taelia_grid') === null ? document.querySelector('.itemList') : document.getElementById('taelia_grid');
            case 'edna':
                return document.querySelector('.itemList');
            case 'esophagor':
                return document.querySelector('.itemList');
            case 'kitchen':
                return document.querySelector('.itemList');
        }
    }

    function getGridStyle() {
        let gridStyle = 'display: grid; border: 1px solid black;text-align: center;';
        gridStyle += 'grid-template-columns: repeat(' + quests.length + ', 1fr);';
        return gridStyle;
    }

    function createQuestItemRows() {
        for (let i = 0; i < 4; i++) {
            for (const quest of quests) {
                let itemName = quest.items[i]?.name;
                if (!itemName) {
                    itemName = "-";
                }
                questsGrid.innerHTML += '<div class="quest-item-qcc">' + itemName + '</div>';
            };
        }
    }

    function createQuestGiverHeaders() {
        for (const quest of quests) {
            questsGrid.innerHTML += '<div class="quest-giver">' + quest.questGiver + '</div>';
        };
    }

    function createQuestSumRow() {
        for (const quest of quests) {
            let items = quest.items;
            let sum = 0;
            for (const item of items) {
                sum += item.cost || 0;
            }
            questsGrid.innerHTML += '<div class="final-cost">' + sum + '</div>';
        }
    }

    async function collectShopWizPrice(swItem) {
        let swPrice = parseInt(document.querySelector('.sw_results>.data>strong')?.innerHTML.match(/\d+/g).join(''));
        if (swItem && swPrice) {
            await updatePriceForQuestItems(swItem, swPrice);
            await updateStoredQuests();
        }
    }

    async function getNewQuestItems(questGiver) {
        let questItemsElements = document.querySelectorAll('.centered-item').length > 0 ? document.querySelectorAll('.centered-item') : document.querySelectorAll('.quest-item');
        if (questItemsElements.length > 0) {
            let questItems = getQuestItems(questItemsElements);
            let deadline = getDeadline();
            let existingQuestIndex = quests.findIndex(q => q.questGiver === questGiver);
            if (existingQuestIndex !== -1) {
                let needsToBeUpdated = itemsOutdated(questItems, existingQuestIndex);
                if (needsToBeUpdated) {
                    quests[existingQuestIndex] = new QuestItems(questGiver, questItems, deadline);
                    await updateStoredQuests();
                }
            } else {
                quests.push(new QuestItems(questGiver, questItems, deadline));
                await updateStoredQuests();
            }
        }
    }

    function itemsOutdated(questItems, existingQuestIndex) {
        let itemNames = quests[existingQuestIndex].items.map(i => i.name);
        return questItems.some(i => !itemNames.includes(i.name));
    }

    function getDeadline() {
        var xpath = "//span[contains(text(),'minutes')]";
        const questCountDownAfterAccepting = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var matchingElement = questCountDownAfterAccepting ? questCountDownAfterAccepting : document.querySelector('.taelia_countdown');
        if (matchingElement) {
            const matchingElementText = matchingElement.innerText;
            let hours = parseInt(matchingElementText.match(/(\d+)\s*hrs/)?.[1] || 0);
            let minutes = parseInt(matchingElementText.match(/(\d+)\s*minutes/)?.[1] || 0);
            let seconds = parseInt(matchingElementText.match(/(\d+)\s*seconds/)?.[1] || 0);
            let deadline = new Date(Date.now() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000)).getTime();
            return deadline;
        }
        return null;
    }

    function pushStyle() {
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
})();

async function initializeQuests() {
    const storedQuestsRaw = await GM.getValue('quests');
    const storedQuests = storedQuestsRaw ? JSON.parse(storedQuestsRaw) : [];
    if (storedQuests && !(storedQuests instanceof Array)) {
        const parsedStoredQuests = JSON.parse(storedQuests)?.reduce((m, [key, val]) => m.set(key, val), new Map());
        if (parsedStoredQuests instanceof Map) {
            await GM.deleteValue('quests');
        }
    } else if (storedQuests) {
        quests = storedQuests.filter(questIem => questIem.deadline > Date.now());
    }
}

async function updateStoredQuests() {
    await GM.setValue('quests', JSON.stringify(quests));
}

async function updatePriceForQuestItems(swItem, swPrice) {
    const storedQuestsRaw = await GM.getValue('quests');
    const latestQuests = storedQuestsRaw ? JSON.parse(storedQuestsRaw) : [];
    latestQuests.forEach(quest => {
        quest.items.forEach(item => {
            if (item.name === swItem) {
                item.cost = swPrice;
            }
        })
    });
    quests = latestQuests;
}

function getQuestItems(questItemsElements) {
    let questItems = [];
    for (let i = 0; i < questItemsElements?.length; i++) {
        let questItemName = questItemsElements[i].querySelector('strong').innerHTML;
        let item = new Item(questItemName, null);
        questItems[i] = item;
    }
    return questItems;
}

function determineQuestGiver() {
    if (window.location.href.includes('snowfaerie')) {
        return 'snowfaerie';
    } else if (window.location.href.includes('witchtower')) {
        return 'edna';
    } else if (window.location.href.includes('esophagor')) {
        return 'esophagor';
    } else if (window.location.href.includes('kitchen')) {
        return 'kitchen';
    }
    return null;
}