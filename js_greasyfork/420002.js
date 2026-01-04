// ==UserScript==
// @name         TapdQuickIteration
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  tapd 在迭代模块中快速筛选和创建bug辅助工具
// @author       mocobk
// @match        *tapd.woa.com/*/iteration/card*
// @match        *tapd.woa.com/*/iterations/card_view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420002/TapdQuickIteration.user.js
// @updateURL https://update.greasyfork.org/scripts/420002/TapdQuickIteration.meta.js
// ==/UserScript==


function getElementByXpath(xpath, parentNode = null) {
    console.log("getElementByXpath", xpath, parentNode);
    return document.evaluate(
        xpath,
        parentNode || document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

function getElementBySelector(selector, parentNode = null) {
    console.log("getElementBySelector", selector, parentNode);
    return (parentNode || document).querySelector(selector);
}

function findElement(callback, timeout = 10000, interval = 500) {
    const startTime = Date.now();
    return new Promise(function (resolve, reject) {
        const intervalHandler = setInterval(function () {
            const el = callback();
            if (el) {
                resolve(el);
                clearInterval(intervalHandler);
            }
            if (Date.now() - startTime >= timeout) {
                resolve(null);
                clearInterval(intervalHandler);
            }
        }, interval);
    });
}

async function findElementBySelector(selector, parentNode = null, timeout = 10000, interval = 500) {
    console.log("findElementBySelector", selector);
    const result = await findElement(() => getElementBySelector(selector, parentNode), timeout, interval);
    if (result) {
        return result;
    } else {
        console.error("Error: findElementBySelector failed", selector);
        return null;
    }
}

async function findElementByXpath(xpath, parentNode = null, timeout = 10000, interval = 500) {
    console.log("findElementByXpath", xpath);
    const result = await findElement(() => getElementByXpath(xpath, parentNode), timeout, interval);
    if (result) {
        return result;
    } else {
        console.error("Error: findElementBySelector failed", xpath);
        return null;
    }
}

async function setShowType(type) {
    const types = type.split(";");
    const settingIcon = await findElementByXpath(
        '//*/span[text()=" 类别: "]'
    );
    settingIcon.click();
    const typeSelectPopover = await findElementBySelector(".el-tree");
    if (!typeSelectPopover.checkVisibility()) {
        settingIcon.click();
    }
    const checkedLabels = document.querySelectorAll(".el-tree > .el-tree-node > .el-tree-node__content .el-checkbox.is-checked");
    for (let i = 0; i < checkedLabels.length; i++) {
        checkedLabels[i].click();
    }
    const checkLabels = document.querySelectorAll(".el-tree > .el-tree-node > .el-tree-node__content");
    for (let i = 0; i < checkLabels.length; i++) {
        const label = checkLabels[i];
        if (types.includes(label.textContent)) {
            const checkBtn = label.querySelector(".el-checkbox");
            checkBtn.click();
        }
    }
    settingIcon.click();
}

async function createFilterRadio() {
    const operateHtml = `
<label style="display: inline-flex;align-items: center; margin-left: 10px"><input type="radio" name="filterList" value="需求" />仅需求</label>
<label style="display: inline-flex;align-items: center; margin-left: 10px"><input type="radio" name="filterList" value="任务"  />仅任务</label>
<label style="display: inline-flex;align-items: center; margin-left: 10px"><input type="radio" name="filterList" value="缺陷"  />仅缺陷</label>
<label style="display: inline-flex;align-items: center; margin-left: 10px"><input type="radio" name="filterList" value="需求;任务"  />需求和任务</label>
<label style="display: inline-flex;align-items: center; margin-left: 10px"><input type="radio" name="filterList" value="需求;任务;缺陷"  />全部</label>
`;
    const tabList = await findElementByXpath('//div[@role="tablist"]');
    const liElement = document.createElement("li");
    liElement.style.fontSize = "12px";
    liElement.style.lineHeight = "40px";
    liElement.style.float = "right";
    liElement.style.marginRight = "45px";
    liElement.innerHTML = operateHtml;
    tabList.after(liElement);
    const radioButtons = document.querySelectorAll('input[type=radio][name=filterList]');
    // 为每个 radio 按钮添加 change 事件监听器
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            setShowType(this.value);
        });
    });
}

async function createDialogHandle() {
    const dialog = await findElementBySelector(
        ".create-workitem-dialog > .el-dialog"
    );
    const typeSelectBtn = await dialog.querySelector(".select-hover .tapd-select-tag");
    if (typeSelectBtn.textContent.indexOf("缺陷") === -1) {
        typeSelectBtn.click();
        const selectPopover = await findElementBySelector(
            ".tapd-select-drapmenu.tapd-agi-select[x-placement]"
        );
        const bugItem = await findElementByXpath(
            './/*/span[text()="缺陷"]',
            selectPopover
        );
        bugItem.click();
    }
    const showMoreBtn = await findElementByXpath(
        './/*/span[text()=" 展示更多 "]',
        dialog,
        500
    );
    if (showMoreBtn) {
        showMoreBtn.click();
    }
    const titleInput = await findElementBySelector(
        "input[placeholder='请输入缺陷标题']"
    );
    titleInput.removeAttribute("autocomplete");
    const iterationTitle = document.querySelector(
        ".iteration-detail__name[title]"
    );
    // 设置 title
    titleInput.value = `【${iterationTitle.innerText}——填写模块名】`;
    const inputValueLength = titleInput.value.length;
    titleInput.setSelectionRange(inputValueLength - 6, inputValueLength - 1);
    setTimeout(() => {
        titleInput.setRangeText("");
        titleInput.focus();
    }, 500);
}

async function setCreateButton() {
    const quickCreateBtn = await findElementBySelector(".iteration-progress-info > button");
    quickCreateBtn.style.color = "#f85e5d";
    quickCreateBtn.querySelector("i").style.color = "#f85e5d";
    quickCreateBtn.addEventListener("click", await createDialogHandle);
}

async function onSwitchIteration() {
    const iterationsCards = document.querySelectorAll("#iteration-list-boxs > div >div");
    // 为每个 iterationsCard 添加 click 事件监听器
    iterationsCards.forEach(card => {
        card.addEventListener('click', setCreateButton);
    });
}

(async function() {
    "use strict";
    await createFilterRadio();
    await setCreateButton();
    await onSwitchIteration();
})();