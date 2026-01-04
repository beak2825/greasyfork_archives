// ==UserScript==
// @name         MH: Halloween Brew Helper
// @namespace    https://greasyfork.org/en/users/831030-plasmoidia
// @version      0.5
// @description  Convenient buttons to help you instantly brew Evil Extract.
// @author       plasmoidia
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434880/MH%3A%20Halloween%20Brew%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/434880/MH%3A%20Halloween%20Brew%20Helper.meta.js
// ==/UserScript==

function getHudElement(className, cauldronNum, dataOther) {
    let element = undefined;
    const search = document.getElementsByClassName(className);
    for (let i = 0; i < search.length; ++i) {
        if (search[i].getAttribute('data-cauldron-index') == cauldronNum) {
            if (dataOther !== undefined) {
                if (search[i].getAttribute('data-item-type') == dataOther) {
                    element = search[i];
                    break;
                }
                if (search[i].getAttribute('data-queue-slot') == dataOther) {
                    element = search[i];
                    break;
                }
            }
            else {
                element = search[i];
                break;
            }
        }
    }

    return element;
}

function getElementCauldron(cauldronNum, type) {
    return getHudElement('halloweenBoilingCauldronHUD-bait-cauldronButton', cauldronNum, type);
}

function getElementFinish(cauldronNum) {
    return getHudElement('halloweenBoilingCauldronHUD-cauldron-instantFinishButton', cauldronNum);
}

function createActionButton(state, className, cauldronNum) {
    const btn = document.createElement('button');
    btn.className = className;
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = 'orange';
    btn.style.backgroundSize = 'contain';
    btn.style.backgroundRepeat = 'no-repeat';
    btn.style.fontSize = '9px';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '3px';
    btn.style.padding = '1px 5px';
    btn.style.marginLeft = '-15px';
    btn.style.marginRight = '-15px';
    btn.style.textShadow = 'none';
    btn.style.display = 'block';
    btn.style.width = '30px';
    btn.style.height = '30px';
    btn.setAttribute('data-cauldron-index', cauldronNum);
    setBtnState(btn, state);

    return btn;
}

function setBtnState(btn, state) {
    const eeImg = 'https://www.mousehuntgame.com/images/items/stats/transparent_thumb/720c74a43ad07cbc3afa674a76bf0fc4.png?cv=2';
    const rrImg = 'https://www.mousehuntgame.com/images/items/stats/transparent_thumb/ff427767e5a41f611bfc0350bc98e184.png?cv=2';
    if (state === 'brew') {
        btn.setAttribute('data-cur-state', state);
        btn.style.backgroundImage = `url(${eeImg})`;
        btn.setAttribute('data-item-type', 'halloween_extract_stat_item');
        btn.setAttribute('data-recipe-type', 'halloween_extract_cauldron_recipe');
    }
    else if (state === 'finish') {
        btn.setAttribute('data-cur-state', state);
        btn.style.backgroundImage = `url(${rrImg})`;
        btn.removeAttribute('data-item-type');
        btn.removeAttribute('data-recipe-type');
    }
}

function createButtons(cauldronNum) {
    const spinImg = 'https://www.mousehuntgame.com/images/ui/loaders/small_spinner.gif?asset_cache_version=2';

    const parent = getHudElement('halloweenBoilingCauldronHUD-cauldron', cauldronNum);
    const queue0 = getHudElement('halloweenBoilingCauldronHUD-cauldron-queue', cauldronNum, 0);
    if (parent) {
        const container = document.createElement('div');
        container.className = 'halloweenBoilingCauldronHUD-cauldron-brewHelper plasmoidia-brewHelper';
        container.style.width = '0px';

        const elemBrewEE = getElementCauldron(cauldronNum, 'halloween_extract_stat_item');
        const elemFinish = getElementFinish(cauldronNum);

        const actionSpan = document.createElement('span');
        actionSpan.className = 'plasmoidia-brewHelper plasmoidia-actionBtnSpan';
        actionSpan.style.position = 'relative';
        actionSpan.style.top = '100px';
        actionSpan.style.left = '0px';
        const actionBtn = createActionButton('brew', 'plasmoida-brewHelper plasmoidia-actionBtn', cauldronNum);
        actionSpan.appendChild(actionBtn);

        actionBtn.addEventListener('click', function() {
            const curState = actionBtn.getAttribute('data-cur-state');
            if (curState === 'brew') {
                actionBtn.style.backgroundImage = `url(${spinImg})`;
                hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.brewRecipe(elemBrewEE, function() {
                    setBtnState(actionBtn, 'finish');
                });
            }
            else if (curState === 'finish') {
                actionBtn.style.backgroundImage = `url(${spinImg})`;
                hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.instantFinishBrew(elemFinish);
            }
            else {
                console.log(`BrewHelper: Error: Button state unknown: ${curState}`);
            }
        });

        container.appendChild(actionSpan);
        parent.insertBefore(container, queue0);
        queue0.style.marginTop = '10px';
    }
}

function updateButton(cauldronNum) {
    const actionBtn = getHudElement('plasmoidia-actionBtn', cauldronNum);
    const cauldron = getHudElement('halloweenBoilingCauldronHUD-cauldron', cauldronNum);
    if (actionBtn && cauldron) {
        if (cauldron.classList.contains('active')) {
            setBtnState(actionBtn, 'finish');
        }
        else {
            setBtnState(actionBtn, 'brew');
        }
    }
    else {
        if (actionBtn) {
            console.log('BrewHelper: Error: Could not find cauldron');
        }
        else {
            console.log('BrewHelper: Error: Could not find btn');
        }
    }
}

function createCancelBtn(cauldronNum, queueSlot) {
    const cancelBtn = document.createElement('a');
    cancelBtn.href = '#';
    cancelBtn.className = 'halloweenBoilingCauldronRecipeView-cauldron-queueSlot-cancelButton plasmoida-brewHelper plasmoidia-cancelBtn';
    cancelBtn.onclick = function() { hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.removeFromQueue(this); return false; };
    cancelBtn.setAttribute('data-queue-slot', queueSlot);
    cancelBtn.setAttribute('data-cauldron-index', cauldronNum);
    cancelBtn.style.top = '-20px';
    cancelBtn.style.left = '33%';

    return cancelBtn;
}

function createQueueBtn(cauldronNum, queueSlot) {
    const spinImg = 'https://www.mousehuntgame.com/images/ui/loaders/small_spinner.gif?asset_cache_version=2';

    const queueBtn = createActionButton('brew', 'plasmoida-brewHelper plasmoidia-queueBtn', cauldronNum);
    queueBtn.style.position = 'absolute';
    queueBtn.style.top = '35px';
    queueBtn.style.left = '31px';
    queueBtn.style.marginTop = '-15px';
    queueBtn.setAttribute('data-queue-slot', queueSlot);
    queueBtn.addEventListener('click', function() {
        queueBtn.style.backgroundImage = `url(${spinImg})`;
        hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.brewRecipe(queueBtn);
        return false;
    });

    return queueBtn;
}

function removeBrewHelperElems() {
    document.querySelectorAll('.plasmoidia-cancelBtn').forEach(el => el.remove());
    document.querySelectorAll('.plasmoidia-queueBtn').forEach(el => el.remove());
}

function updateQueueOrCancelButtons(cauldronNum) {
    const cauldron = getHudElement('halloweenBoilingCauldronHUD-cauldron', cauldronNum);
    if (cauldron.classList.contains('active')) {
        const queue0 = getHudElement('halloweenBoilingCauldronHUD-cauldron-queue', cauldronNum, 0);
        let q0Btn = undefined;
        if (queue0.classList.contains('active')) {
            q0Btn = createCancelBtn(cauldronNum, 0);
        }
        else {
            q0Btn = createQueueBtn(cauldronNum, 0);
        }
        queue0.appendChild(q0Btn);
        queue0.style.transform = 'none';

        if (queue0.classList.contains('active')) {
            const queue1 = getHudElement('halloweenBoilingCauldronHUD-cauldron-queue', cauldronNum, 1);
            let q1Btn = undefined;
            if (queue1.classList.contains('active')) {
                q1Btn = createCancelBtn(cauldronNum, 1);
            }
            else {
                q1Btn = createQueueBtn(cauldronNum, 1);
            }
            queue1.appendChild(q1Btn);
            queue1.style.transform = 'none';
        }
    }
}

function renderBrewHelper() {
    'use strict';

    const halloweenHUD = document.getElementsByClassName('halloweenBoilingCauldronHUD');
    if (halloweenHUD.length === 0) {
        return; // must not be Halloween
    }

    const brewHelpers = document.querySelectorAll('.plasmoidia-brewHelper');
    if (brewHelpers.length === 0) {
        createButtons(0);
        createButtons(1);
    }
    updateButton(0);
    updateButton(1);

    removeBrewHelperElems();
    updateQueueOrCancelButtons(0);
    updateQueueOrCancelButtons(1);
}

$(document).ajaxStop(renderBrewHelper)
$(document).ready(renderBrewHelper)
