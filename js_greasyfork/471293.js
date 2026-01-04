// ==UserScript==
// @name         Territory Script V2
// @namespace    http://tampermonkey.net/
// @version      0.67
// @description  More advanced version where you can with ctrl and shift and § plan for actions.
// @author       olesien
// @match        https://www.torn.com/city.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/471293/Territory%20Script%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/471293/Territory%20Script%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const keybindsEnabled = true; //Change to false if you want to disable keybinds, you can customize them at the bottom.
    const queueButtonsEnabled = true; //Change to false if you prefer to use above.
    //Styles
    GM_addStyle ( `
        #war-queue {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            margin: 10px;
        }
        #war-queue ol {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            margin: 10px;
        }
        #war-queue .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0,0,0,0.1);
            padding: 10px;
            border-radius: 5px;
        }

        #war-queue .action-item > * {
            flex: 2;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #war-queue .action-item .tert-order-id {
           flex: 1;
        }
        #war-queue .tert-sep {
           display:flex;
           justify-content: space-between;
           align-items: center;
        }
        #war-queue #action-button-territory {
           width: 120px;
        }
     `);
    let currId = 0;
    let loading = false;
    let maxCount = 0;
    //{territoryName: "AAA", territoryId: "123132", action: "assault", id: 0}
    let actionList = [];
    const doAction = async () => {
        if (actionList.length > 0) {
            const action = actionList[0];
            console.log(action);
            if (!loading) {
                const buttonEl = document.querySelector("#action-button-territory");
                const diag = document.querySelector("#tert-action-result");
                if (action.action === "assault" ||action.action === "claim" || action.action === "unclaim" || action.action === "move") {
                    console.log(action.action + " " + action.territoryId);
                    let actionType = action.action === "assault" ? "take" : action.action === "unclaim" ? "abandon" : action.action;
                    console.log("Running: " + actionType);
                    loading = true;
                    buttonEl.innerText = "Trying...";
                    const resp = await fetch("https://www.torn.com/city.php?rfcv=undefined", {
                        "credentials": "include",
                        "headers": {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        "referrer": "https://www.torn.com/city.php",
                        "body": `type=${actionType}&id=${action.territoryId}&exist=&exist_data=&is_old_collection=0&step=action`,
                        "method": "POST",
                        "mode": "cors"
                    });

                    const body = await resp.json()

                    if (body.success) {
                        loading = false;
                        buttonEl.innerText = "Do Next Action";
                        buttonEl.disabled = true;
                        diag.innerText = body.message;
                        diag.style.color = "green";
                        //Rerennder
                        const index = actionList.findIndex(listAction => Number(listAction.id) === Number(action.id));
                        if (Number(index) >= 0) {
                            actionList.splice(index, 1);
                            console.log("Removing", index);
                            render();
                        }

                    } else {
                        loading = false;
                        buttonEl.innerText = "Retry action";
                        buttonEl.disabled = false;
                        diag.innerText = body.error;
                        diag.style.color = "red";
                    }
                }

            }


        }
    }
    const render = () => {
        if (maxCount < actionList.length) maxCount = actionList.length;

        const root = document.querySelector("#tab-menu");

        const list = document.createElement("div");
        list.style.minHeight = `${150 + maxCount * 50}px`
        list.id = "war-queue";
        const listEls = actionList.map((action, index) => {
            return `<li class="action-item"><p class="tert-order-id">${index + 1}.</p><p>${action.territoryName}</p><p>Type: ${action.action}</p><div><button class="torn-btn danger" data-id="${action.id}">Remove</button></div></li>`
        }).join("");
        list.innerHTML = `<div><div class="tert-sep"><button class="torn-btn" id="action-button-territory">Do Top Action</button><p id="tert-action-result">Use Shift/Ctrl/§ for actions</p></div></div><ol>${listEls}</ol>`;

        const items = list.querySelectorAll(".action-item");
        items.forEach((item) => {
            const removeButton = item.querySelector(".danger");
            removeButton.addEventListener("click", (button) => {
                const id = removeButton.dataset.id;

                if (Number(id) >= 0) {
                    const index = actionList.findIndex(action => Number(action.id) === Number(id));
                    if (Number(index) >= 0) {
                        actionList.splice(index, 1);
                        console.log("Removing", index);
                        render();
                    }

                }
            });
        });

        const warQueueEl = document.querySelector("#war-queue");
        if (warQueueEl) {
            warQueueEl.remove();
        }
        root.appendChild(list);

        const actionButtonTerritory = root.querySelector("#action-button-territory");

        actionButtonTerritory.addEventListener("click", () => doAction());

    }



    document.addEventListener("keyup", (e) => {
        const map = document.querySelector(".territories");
        const selected = map?.querySelector(".selected");
        const db_id = selected?.getAttribute("db_id");

        if (db_id) {
            const innerPanel = document.querySelector(".territory-info-wrap");
            const li = innerPanel?.children[0];
            const territoryName = li?.innerText;
            console.log(territoryName);
            if (territoryName) {
                if (keybindsEnabled) {
                    //Assault
                    if (e.code === "ControlLeft") {
                        currId++;
                        actionList.push({territoryName, territoryId: db_id, action: "assault", id: currId})
                        render();
                    }

                    //Claim
                    if (e.code === "ShiftLeft") {
                        currId++;
                        actionList.push({territoryName, territoryId: db_id, action: "claim", id: currId})
                        render();
                    }

                    //Unclaim
                    if (e.code === "Backquote") {
                        currId++;
                        actionList.push({territoryName, territoryId: db_id, action: "unclaim", id: currId})
                        render();
                    }

                    //Move
                    if (e.code === "ShiftRight") {
                        currId++;
                        actionList.push({territoryName, territoryId: db_id, action: "move", id: currId})
                        render();
                    }
                }

            }

        }



    });

    const addToQueue = (type) => {
        const map = document.querySelector(".territories");
        const selected = map?.querySelector(".selected");
        const db_id = selected?.getAttribute("db_id");

        if (db_id) {
            const innerPanel = document.querySelector(".territory-info-wrap");
            const li = innerPanel?.children[0];
            const territoryName = li?.innerText;
            console.log(territoryName);
            actionList.push({territoryName, territoryId: db_id, action: type, id: currId})
            render();
        }

    }

    //Used by below if there are buttons
    const addButtons = (root) => {
        console.log("trying to add buttons");
        const div = document.createElement("div");
        div.style.display = "inline";
        div.style.paddingLeft = "10px";
        const button1 = document.createElement("button");
        button1.innerText = "Queue Attack";
        button1.className = "torn-btn";
        button1.style.margin = "5px";
        button1.addEventListener("click", () => addToQueue("assault"));
        div.appendChild(button1);

        const button2 = document.createElement("button");
        button2.innerText = "Queue Claim";
        button2.className = "torn-btn";
        button2.style.margin = "5px";
        button2.addEventListener("click", () => addToQueue("claim"));
        div.appendChild(button2);

        const button3 = document.createElement("button");
        button3.innerText = "Queue Abandon";
        button3.className = "torn-btn";
        button3.style.margin = "5px";
        button3.addEventListener("click", () => addToQueue("unclaim"));
        div.appendChild(button3);

        const button4 = document.createElement("button");
        button4.innerText = "Queue Move";
        button4.className = "torn-btn";
        button4.style.margin = "5px";
        button4.addEventListener("click", () => addToQueue("move"));
        div.appendChild(button4);
        root.appendChild(div);
    }

    if (queueButtonsEnabled) {
        //The normal buttons
        const observer = new MutationObserver((_, observer) => {
            const root = document.querySelector('#tab-menu');
            console.log("root", root);
            if (root) {
                observer.disconnect();
                addButtons(root);
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    }


})();