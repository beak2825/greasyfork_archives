// ==UserScript==
// @name         金庸群侠•大乱斗额外按钮
// @namespace    http://tampermonkey.net/
// @version      0.6.161
// @description  金庸群侠•大乱斗便利性按钮插件：1.战斗中修改主角目标选择策略按钮；2.残卷使用数量+30按钮。
// @author       Ymmzy
// @match        https://zhouxiaobo1990.gitee.io/jyf/0.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.io
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473351/%E9%87%91%E5%BA%B8%E7%BE%A4%E4%BE%A0%E2%80%A2%E5%A4%A7%E4%B9%B1%E6%96%97%E9%A2%9D%E5%A4%96%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/473351/%E9%87%91%E5%BA%B8%E7%BE%A4%E4%BE%A0%E2%80%A2%E5%A4%A7%E4%B9%B1%E6%96%97%E9%A2%9D%E5%A4%96%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
const ELEMENT = {
    navigator: {
        selector: "#navigator"
    },
    dialogTitle: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > h2"
    },
    dialogConfirm: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__actions > button.acceptButton",
        condition: ele => !document.querySelector("#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__actions").classList.contains("hidden")
    },
    battleButtonContainer: {
        selector: "#battleUiPage > div.pixiContainer > div.bottomLeftBar"
    },
    battleSetting: {
        selector: "#battleUiPage > div.pixiContainer > div.topRightBar > button.settingsButton"
    },
    battleSettingTarget: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__content > div > div > button",
        text: "目标选择策略"
    },
    battleSettingBack: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__content > div > div > button",
        text: "返回"
    },
    battleTargetItem: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__content > div > div:nth-child(1) > div > div > div.mdc-select__menu > ul > li"
    },
    itemTitle: {
        selector: "#inspectItemsPage > main > div > div.jyfPageTemplate.mainContent > div.description > div.name"
    },
    itemNumberLabel: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__content > div > div > div > label"
    },
    itemNumberInput: {
        selector: "#actionDialog > div > div.mdc-dialog__container > div.mdc-dialog__surface > div.mdc-dialog__content > div > div > div > label > input"
    }
};

function getEle({selector, text, condition}) {
    const eles = document.querySelectorAll(selector);
    for (const ele of eles) {
        if (ele && ele.style.display !== 'none' && (!text || ele.textContent.includes(text)) && (!condition || condition(ele))) return ele;
    }
    return null;
}

async function waitEle({selector, text, condition}) {
    let ele = null;
    let time = 100;
    await new Promise(resolve => {
        const timer = setInterval(() => {
            if ((ele = getEle({selector, text, condition}))) {
                clearInterval(timer);
                resolve();
            }
            if (!time--) {
                console.warn("Timeout:", {selector, text, condition});
                resolve();
            }
        }, 10);
    });
    return ele;
}

async function clickEle({selector, text, condition}) {
    let ele = await waitEle({selector, text, condition});
    ele && ele.click();
}

function createEle(parent, type, classes, text) {
    const ele = document.createElement(type);
    if (classes && classes.length > 0) ele.classList.add(...classes);
    if (text) ele.innerText = text;
    if (parent) parent.appendChild(ele);
    return ele;
}

//残卷+30按钮
function initAddThirtyButton() {
    const dialogTitle = getEle(ELEMENT.dialogTitle);

    const config = {
        childList: true,
        subtree: true
    };

    const mutationObserver = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target === dialogTitle && mutation.addedNodes.length > 0) {
                const addedNode = mutation.addedNodes[0];
                if (addedNode.nodeType === Node.TEXT_NODE && addedNode.textContent.match(/使用.+残卷/)) {
                    observer.disconnect();

                    const label = await waitEle(ELEMENT.itemNumberLabel);
                    const btn = createEle(label, "button", ["maxValueButton", "mdc-icon-button"], "+30");
                    btn.style.alignSelf = "center";
                    btn.style.display = "flex";
                    btn.style.justifyContent = "center";
                    btn.style.alignItems = "center";
                    btn.style.fontSize = "18px";
                    btn.onclick = () => {
                        //获取持有数量
                        const item = getEle(ELEMENT.itemTitle);
                        const match = item.innerText.match(/剩余：([\d]+)/);
                        if (match) {
                            const max = Number(match[1]);
                            const input = getEle(ELEMENT.itemNumberInput);
                            input.value = Math.min(max, (Math.floor(input.value / 30) + 1) * 30);
                        }
                    };

                    observer.observe(dialogTitle, config);
                }
            }
        }
    });

    mutationObserver.observe(dialogTitle, config);
}

//战斗目标策略按钮
function initBattleControlButton() {
    const battleButtonContainer = getEle(ELEMENT.battleButtonContainer);
    let lock = false;
    const createBattleControlButton = (text, act, x, y) => {
        const btn = createEle(battleButtonContainer, "button", ["mdc-icon-button", "battle-control-button"], text);
        btn.onclick = async () => {
            if (lock) return;
            lock = true;

            await clickEle(ELEMENT.battleSetting);
            const battleTarget = await waitEle(ELEMENT.battleSettingTarget);
            //目标策略按钮是否可见
            if (!battleTarget.parentElement.classList.contains("hidden")) {
                battleTarget.click();
                await clickEle({...ELEMENT.battleTargetItem, text: act});
                await clickEle(ELEMENT.dialogConfirm);
            } else await clickEle(ELEMENT.battleSettingBack);

            lock = false;
        };
        const biasX = 52 * x;
        const biasY = 52 * y;
        btn.style.left = biasX + "px";
        btn.style.bottom = biasY + "px";
        btn.style.position = "absolute";
        btn.style.fontSize = "18px";
    };

    createBattleControlButton("北", "向北移动", 1, 2);
    createBattleControlButton("南", "向南移动", 1, 0);
    createBattleControlButton("西", "向西移动", 0, 1);
    createBattleControlButton("东", "向东移动", 2, 1);
    createBattleControlButton("近", "最近的敌人", 1, 1);
}

(async function () {
    'use strict';
    await waitEle(ELEMENT.navigator);

    initAddThirtyButton();
    initBattleControlButton();

    console.log("===== extra buttons =====");
})();