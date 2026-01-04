// ==UserScript==
// @name           twitter-add-to-list-button
// @name:ja        twitter-add-to-list-button
// @namespace      NegUtl
// @version        0.2.2
// @description    adds "add to list" buttons (edit the variable "listNames"!)
// @description:ja リストにワンクリックで追加するボタンを表示します（変数"listNames"を必ず編集してください）
// @author         NegUtl
// @match          https://twitter.com/*
// @match          https://mobile.twitter.com/*
// @match          https://x.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/485053/twitter-add-to-list-button.user.js
// @updateURL https://update.greasyfork.org/scripts/485053/twitter-add-to-list-button.meta.js
// ==/UserScript==

(function() {
'use strict';


// be sure to change to the name of your lists (not IDs)
const listNames = ['list1', 'list2', 'list3'];

const addButtonsInterval = 512; // ms
const tryClickInterval = 32; // ms


function onClick(userProfileURL, listName) {

    const newTab = open(userProfileURL);

    const steps = [
        () => { // open meatballs menu
            const target = newTab.document.querySelector('[data-testid="userActions"]');
            if (target === null) return false;
            target.click();
            return true;
        },
        () => { // click "Add/remove @xxxx from Lists"
            const target = newTab.document.querySelector('[href="/i/lists/add_member"]');
            if (target === null) return false;
            target.click();
            return true;
        },
        () => { // click the list
            const listCells = newTab.document.querySelectorAll('div[data-testid="listCell"]');
            if (listCells.length == 0) return false;
            for (const listCell of listCells) {
                const labelSpan = listCell.querySelector('span');
                if (labelSpan.textContent !== listName) continue;
                if (listCell.ariaChecked === 'true') {
                    newTab.alert(`The user is already in "${listName}"`);
                    newTab.close();
                    return true;
                }
                listCell.click();
                return true;
            }
            newTab.alert(`"${listName}" was not found`);
            newTab.close();
            return true;
        },
        () => { // click "Save" button
            if (newTab.closed === true) return true;
            let modal = newTab.document.querySelector('div[aria-modal="true"]');
            if (modal === null) modal = newTab.document.querySelector('main');
            const target = modal.querySelectorAll('button')[1];
            target.click();
            return true;
        },
        () => { // close the tab
            if (newTab.closed !== true) newTab.close();
            return true;
        }
    ];

    let current_step = 0;

    const intervalID = setInterval(() => {
        if (steps[current_step]()) ++current_step;
        if (current_step === steps.length) clearInterval(intervalID);
    }, tryClickInterval);
}


function ListButton(userProfile, listName) {
    const button = document.createElement('button');
    const styles = {
        fontSize: '82%',
        margin: '0 0.25em',
    };
    for (const prop in styles) {
        button.style[prop] = styles[prop];
    }
    button.textContent = listName;
    button.addEventListener('click', onClick.bind(null, userProfile, listName));
    return button;
}


function ListButtons(userProfile) {
    const buttons = document.createElement('div');
    const styles = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
    };
    for (const prop in styles) {
        buttons.style[prop] = styles[prop];
    }
    for (const listName of listNames) {
        buttons.appendChild(ListButton(userProfile, listName));
    }
    buttons.classList.add('listButtons');
    return buttons;
}


function isMyAccount(node) { // check if the node is one of the "Change Account" item
    const parent = node.parentNode;
    if (parent.nodeName === 'DIV' && parent.dataset.testid === 'HoverCard') return true;
    if (parent.nodeName === 'BODY') return false;
    return isMyAccount(parent);
}


function getUserProfileURL(node) {
    for (const child of node.children) {
        if (child.nodeName === 'A') return child.href;
        const result = getUserProfileURL(child);
        if (result) return result;
    }
    return false;
}


function addButtons() {
    const selector = '[data-testid="UserCell"]:not(:has(.listButtons))';
    const nodes = document.querySelectorAll(selector);
    for (const node of nodes) {
        if (isMyAccount(node)) continue;
        const userProfileURL = getUserProfileURL(node);
        node.appendChild(ListButtons(userProfileURL));
    }
}


setInterval(addButtons, addButtonsInterval)


})();