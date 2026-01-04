// ==UserScript==
// @name         Trello Epic Swimlane
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates swim lanes for Epics in Trello (the power-up 'Epic Cards by Screenful' is required).
// @author       goSolve
// @match        https://trello.com/b/*
// @match        http://trello.com/b/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441301/Trello%20Epic%20Swimlane.user.js
// @updateURL https://update.greasyfork.org/scripts/441301/Trello%20Epic%20Swimlane.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Executing tampermonkey script for Trello');
    const CARD_CLASS = 'list-card';
    const CARD_CONTAINER_CLASS = 'list-cards';
    const CARD_LABEL_CLASS = 'card-label';
    const CARD_TITLE_CLASS = 'js-card-name';
    const LIST_CONTAINER_CLASS = 'js-list';
    const BOARD_ID = 'board';
    const EPIC_PADDING_Y = 40;
    const SWIMLANE_SPACING_CLASS = 'swimlane-spacing';

    const getBoard = () => document.getElementById(BOARD_ID);
    const getAbsoluteHeight = (el) => {
        const styles = window.getComputedStyle(el);
        const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

        return Math.ceil(el.offsetHeight + margin);
    };
    const observeDOM = (() => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return (obj, callback) => {
            if (!obj || obj.nodeType !== 1) return;

            if (MutationObserver) {
                // define a new observer
                const mutationObserver = new MutationObserver(callback)

                // have the observer observe foo for changes in children
                mutationObserver.observe(obj, { childList:true, subtree:true });
                return mutationObserver;
            } else if (window.addEventListener) { // browser support fallback
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    const execScript = () => {
        let primaryMouseButtonDown = false;
        let placeholderHeight = 0;

        const setPrimaryButtonState = (e) => {
            const flags = e.buttons !== undefined ? e.buttons : e.which;
            primaryMouseButtonDown = (flags & 1) === 1;
        }

        document.addEventListener("mousedown", setPrimaryButtonState);
        document.addEventListener("mousemove", setPrimaryButtonState);
        document.addEventListener("mouseup", setPrimaryButtonState);

        const board = getBoard();
        const boardContainer = board.parentNode;
        board.style.overflowY = 'unset';
        boardContainer.style.height = 'fit-content';
        [...document.getElementsByClassName(LIST_CONTAINER_CLASS)].forEach(el => { el.style.height = 'unset'; });
        [...document.getElementsByClassName(CARD_CONTAINER_CLASS)].forEach(el => {
            el.style.display = 'flex';
            el.style.flexDirection = 'column';
        });
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            .placeholder {  display: none; }
            .${CARD_CONTAINER_CLASS} { overflow-x: visible !important; overflow-y: visible !important; }
            #board>div:nth-last-child(2) { overflow: hidden !important;  }
            .${SWIMLANE_SPACING_CLASS} { position: relative; margin-bottom: 8px; }
            .${SWIMLANE_SPACING_CLASS}::after {
                border-bottom: 2px solid black;
                width: 100%;
                bottom: 0;
                position: absolute;
                content: " ";
                padding: 0 12px;
                left: -8px;
            }
        `;
        document.head.appendChild(styleSheet);

        const drawBoard = (maxTries, tryIndex = 0) => {
            // RESET
            [...document.getElementsByClassName(CARD_CONTAINER_CLASS)].forEach(el => {
                [...el.children].forEach(el => { el.style.order = 9999999; });
            });
            [...document.getElementsByClassName(SWIMLANE_SPACING_CLASS)].forEach(el => el.remove());

            // START DRAW
            const lists = [...document.getElementsByClassName(LIST_CONTAINER_CLASS)];
            const epicLists = lists.filter(list => { // List where every card has the epic label
                const cards = [...list.querySelectorAll(`.${CARD_CLASS}`)];
                return cards.length > 0 && cards.every(card => {
                    const badge = card.querySelector('.js-plugin-badges .badge-text');
                    return badge && /[0-9]+\s*tasks?/i.test(badge.innerText);
                });
            });
            if (epicLists.length !== 1) {
                if (tryIndex === maxTries) throw new Error('Could not find list with epics, aborting TamperMonkey Trello script.');
                console.warn('Could not find list with epics, trying again in 1 second.');
                setTimeout(() => drawBoard(maxTries, ++tryIndex), 1000);
                return;
            }
            console.log('DRAWING BOARD');
            const epicList = epicLists[0];
            let epics = [...epicList.querySelectorAll(`.${CARD_CLASS}`)].map(el => ({ el, height: 0, title: el.querySelector(`.${CARD_TITLE_CLASS}`).innerText }));
            epics.forEach(epic => {
                // Set epic swimlane height
                epic.height = lists.reduce((prev, list) => {
                    const listHeight = [...list.querySelectorAll(`.${CARD_CLASS}`)]
                        .filter(card => [...card.querySelectorAll('.js-plugin-badges .badge-text')].some(el => el.innerText === epic.title))
                        .reduce((prev, cur) => prev + getAbsoluteHeight(cur), 0);
                    return Math.max(prev, listHeight);
                }, epic.height);
                epic.lists = lists.map(list => {
                    let listObj;
                    if (list !== epicList) {
                        listObj = {
                            el: list,
                            cards: [...list.querySelectorAll(`.${CARD_CLASS}`)]
                            .filter(card => [...card.querySelectorAll('.js-plugin-badges .badge-text')].some(el => el.innerText === epic.title))
                        };
                        listObj.cards = listObj.cards.sort((a, b) =>
                            a.querySelector(`.${CARD_TITLE_CLASS}`).innerText.trim().toLowerCase()
                            .localeCompare(b.querySelector(`.${CARD_TITLE_CLASS}`).innerText.trim().toLowerCase()));
                        listObj.height = listObj.cards.reduce((prev, cur) => prev + getAbsoluteHeight(cur), 0);
                    } else {
                        listObj = {
                            el: list,
                            cards: [epic.el],
                            height: getAbsoluteHeight(epic.el)
                        };
                    }
                    return listObj;
                });
                epic.height = Math.max(...epic.lists.map(el => el.height)) + EPIC_PADDING_Y;
            });

            // ORDERING (alphabetically)
            epics = epics.sort((a, b) => a.title.trim().toLowerCase().localeCompare(b.title.trim().toLowerCase()));

            // ADDING & REORDERING DOM ELEMENTS
            let listObjects = lists.map(list => ({ el: list, cardIndex: 0 }));
            window.listObjects = listObjects;
            window.epics = epics;
            epics.forEach(epic => {
                epic.lists.forEach(list => {
                    const listObj = listObjects.find(obj => obj.el === list.el);
                    list.cards.forEach(card => {
                        card.style.order = listObj.cardIndex++;
                    });
                    const dividerDiv = document.createElement('div');
                    dividerDiv.style.order = listObj.cardIndex++;
                    dividerDiv.style.height = `${epic.height - list.height}px`;
                    dividerDiv.classList.add(SWIMLANE_SPACING_CLASS);
                    list.el.querySelector(`.${CARD_CONTAINER_CLASS}`).appendChild(dividerDiv);
                });
            });

            let changeObserved = false;
            let observer;
            observer = observeDOM(board, (records) => {
                if (changeObserved/* || primaryMouseButtonDown*/) return;
                const isNotPlaceholder = el => {
                    if (el instanceof HTMLElement && el.classList.contains('placeholder')) {
                        placeholderHeight = Math.min(placeholderHeight, getAbsoluteHeight(el));
                    }
                    return !(el instanceof HTMLElement) || !el.classList.contains('placeholderrr'); // TODO:
                }
                if (![...records].some(record => [...record.addedNodes].some(isNotPlaceholder) || [...record.removedNodes].some(isNotPlaceholder))) return;
                changeObserved = true;
                setTimeout(() => {
                    console.log('CHANGE OBSERVED');
                    observer.disconnect();
                    drawBoard();
                    changeObserved = false;
                }, 50);
            });
        };
        drawBoard(10);
    };

    let loadCounter = 0;
    const loadCounterMax = 2;
    window.addEventListener('load', () => {
        ++loadCounter;
        if (loadCounter === loadCounterMax) setTimeout(execScript, 100);
    });
    const checkPageLoadInterval = setInterval(() => {
        if (getBoard()) {
            clearInterval(checkPageLoadInterval);
            ++loadCounter;
            if (loadCounter === loadCounterMax) setTimeout(execScript, 100);
        }
    }, 50);
})();