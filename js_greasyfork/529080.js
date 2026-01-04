// ==UserScript==
// @name         井冈山大学附属医院清除打印标志
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  清除打印标志
// @author       朱义奇
// @match        http://172.100.53.24/*
// @match        https://172.100.53.24/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/529080/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E5%8C%BB%E9%99%A2%E6%B8%85%E9%99%A4%E6%89%93%E5%8D%B0%E6%A0%87%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/529080/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E9%99%84%E5%B1%9E%E5%8C%BB%E9%99%A2%E6%B8%85%E9%99%A4%E6%89%93%E5%8D%B0%E6%A0%87%E5%BF%97.meta.js
// ==/UserScript==

// 创建按钮并添加到页面
const executeButton = document.createElement("button");
executeButton.innerText = "清除打印标志";
executeButton.style.position = "fixed";
executeButton.style.top = "40px";
executeButton.style.right = "10px";
executeButton.style.zIndex = "9999";
executeButton.style.padding = "10px 15px";
executeButton.style.backgroundColor = "#4CAF50";
executeButton.style.color = "white";
executeButton.style.border = "none";
executeButton.style.cursor = "pointer";
executeButton.style.borderRadius = "5px";
executeButton.addEventListener("click", executeFunctions);
document.body.appendChild(executeButton);

// 定义功能函数
function clickMenuItem(selector, text, timeout) {
    setTimeout(() => {
        const items = document.querySelectorAll(selector);
        for (let item of items) {
            if (item.innerText.includes(text)) {
                item.click();
                console.log(`点击菜单项: ${text}`);
                break;
            }
        }
    }, timeout);
}

function clickTableRow(selector, targetText, timeout) {
    setTimeout(() => {
        const rows = document.querySelectorAll(selector);
        if (rows.length === 0) {
            console.log("未找到表格中的行！");
            return;
        }
        console.log("找到了表格中的行！");
        
        for (let row of rows) {
            const cell = row.querySelector("td > div.vxe-cell");
            if (cell && cell.innerText.includes(targetText)) {
                console.log(`找到目标行: ${targetText}，执行双击...`);
                let dblClickEvent = new MouseEvent("dblclick", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                cell.dispatchEvent(dblClickEvent);
                break;
            }
        }
    }, timeout);
}

function updateInputValue(index, value, delay = 0) {
    setTimeout(() => {
        const inputs = document.querySelectorAll("input.el-input__inner");
        if (inputs[index]) {
            console.log(`找到 ${inputs.length} 个文本框`);
            inputs[index].value = value;
            ["input", "change"].forEach(event => 
                inputs[index].dispatchEvent(new Event(event, { bubbles: true }))
            );
            inputs[index].dispatchEvent(new KeyboardEvent("keydown", { 
                key: "Enter", 
                keyCode: 13, 
                bubbles: true 
            }));
        } else {
            console.warn(`未找到索引为 ${index} 的输入框`);
        }
    }, delay);
}

function selectAndRefresh(delay = 300) {
    setTimeout(() => {
        const checkbox = document.querySelector("span.el-checkbox__inner");
        if (checkbox) {
            checkbox.click();
        }

        setTimeout(() => {
            const refreshButton = Array.from(document.querySelectorAll("button"))
                .find(btn => btn.innerText.includes("刷新(R)"));
            refreshButton?.click();
        }, delay);
    }, delay);
}

function triggerContextMenuOnText(text) {
    const spans = document.querySelectorAll("span");
    for (let span of spans) {
        if (span.innerText.includes(text)) {
            const contextMenuEvent = new Event("contextmenu", {
                bubbles: true,
                cancelable: true
            });
            span.dispatchEvent(contextMenuEvent);
            break;
        }
    }
}

function triggerHoverAndClick(menuSelector, submenuSelector, targetText) {
    const menuItems = document.querySelectorAll(menuSelector);
    for (let menuItem of menuItems) {
        if (menuItem.innerText.includes("更多...")) {
            ["mouseenter", "mousemove", "mouseover"].forEach(eventType => {
                menuItem.dispatchEvent(new MouseEvent(eventType, { bubbles: true, cancelable: true }));
            });

            setTimeout(() => {
                const submenuItems = document.querySelectorAll(submenuSelector);
                for (let submenuItem of submenuItems) {
                    if (submenuItem.innerText.includes(targetText)) {
                        submenuItem.click();
                        console.log(`点击了：${targetText}`);
                    }
                }
            }, 500);
            break;
        }
    }
}

// 绑定按钮点击事件
function executeFunctions() {
    console.log("开始执行操作...");
    
    // 点击菜单项
    clickMenuItem("ul.popul > li.text.item", "报告处理-通用", 1500);

    // 更新输入栏日期
    setTimeout(() => { updateInputValue(1, "2025-03-01", 0); }, 3000); 

    // 点击锁定勾选框并点击刷新按钮
    setTimeout(() => { selectAndRefresh(0); }, 5000); 

    // 点击目标行
    clickMenuItem("tr.vxe-body--row > td", "刘惠", 5500);

    // 右键点击目标
    setTimeout(() => { triggerContextMenuOnText("[BD-spxb] 上皮细胞"); }, 6000); 

    // 触发更多菜单并点击清除打印标志
    setTimeout(() => { triggerHoverAndClick(".Contextmenu_menu_item_158Fq", "span.Submenu_menu_item_label_35Dgp", "清除打印标志"); }, 6500); 
}
