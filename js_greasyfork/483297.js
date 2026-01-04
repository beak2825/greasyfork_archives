// ==UserScript==
// @name         红单授权
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键给需要的账号授权兑奖
// @author       lc3545
// @match        *://*.tvadmin.veryreal.tv/admin/ticket/ticketprize_user.html
// @match        *://*.hdadmin.hongdanvip.com/admin/ticket/ticketprize_user.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483297/%E7%BA%A2%E5%8D%95%E6%8E%88%E6%9D%83.user.js
// @updateURL https://update.greasyfork.org/scripts/483297/%E7%BA%A2%E5%8D%95%E6%8E%88%E6%9D%83.meta.js
// ==/UserScript==

(function () {
    //严格模式
    "use strict";
    //步骤1，创建按钮：
    //创建一个button按钮并赋值给变量button，并设置样式。
    const button = document.createElement("button");
    button.innerHTML = "授权";
    button.style.float = "right";
    button.style.display = "flex";
    button.classList.add("btn", "btn-primary");
    //把设置好的按钮添加到id为search的div标签内
    document.querySelector("#search").appendChild(button);
    //步骤2，筛选节点：
    // 定义 accounts 数组
    const accounts = [
        "30379",
        "30389",
        "30390",
        "30391",
        "30395",
        "52251",
        "52299",
        "52473",
        "52495",
        "52496",
        "52587",
        "52790",
        "52798",
        "92201",
        "05130",
        "05235103"
    ];
    const aTags = document.querySelectorAll("a.set"); // 选择所有带有 'set' 类的 a 标签
    const selectedElements = [...aTags].filter((aTag) => {
        const username = aTag.getAttribute("username"); // 获取 a 标签的 'username' 属性
        const iscashsmall = aTag.getAttribute("iscashsmall") === "0"; // 检查 'iscashsmall' 属性是否为 "0"
        const tr = aTag.closest("tr.long-td"); // 获取最近的带有 'long-td' 类的 tr 祖先元素
        const prizenum = tr.querySelector('[id^="prizenum_"]').textContent; // 获取 tr 元素中 id 以 'prizenum_' 开头的元素的文本内容
        const returnnum = tr.querySelector('[id^="returnnum_"]').textContent; // 获取 tr 元素中 id 以 'returnnum_' 开头的元素的文本内容
        const isPrizeAndReturnNotZero = !(prizenum === "0" && returnnum === "0"); // 检查 prizenum 和 returnnum 是否同时为 "0"
        return (
            accounts.includes(username) && iscashsmall && isPrizeAndReturnNotZero
        ); // 如果满足所有条件，则返回 true，否则返回 false
    });
    //步骤3：
    // 弹出窗口的点击事件
    function clicks() {
        document
            .querySelector('input[type="radio"][name="iscashsmall"][value="1"]')
            .click();
        document.querySelector(".layui-layer-btn0").click();
    }
    // 授权按钮事件
    function clickListenEvent(selectedElements) {
        if (selectedElements.length === 0) {
            alert("账号已全部授权");
        }
        else if (selectedElements.length === 1) {
            // 点击事件
            selectedElements[0].click();
            clicks()
        }
        else {
            // 保存标志
            localStorage.setItem("runCodeAgain", true);
            // 点击事件
            selectedElements[0].click();
            clicks()
        }
    }
    // 检查是否需要再次执行代码，自动执行
    function checkRunCodeAgain(selectedElements) {
        if (selectedElements.length === 0) {
            if (localStorage.getItem("runCodeAgain")) {
                // 清除标志
                localStorage.removeItem("runCodeAgain");
            }
        }
        else if (selectedElements.length === 1) {
            // 清除标志
            localStorage.removeItem("runCodeAgain");
            selectedElements[0].click();
            clicks()
        }
        else {
            // 点击事件
            selectedElements[0].click();
            clicks()
        }
    }
    // 为 button 元素添加点击事件监听器
    button.addEventListener("click", (event) => {
        // 阻止默认事件
        event.preventDefault();
        clickListenEvent(selectedElements);
    });
    // 检查是否需要再次执行代码
    if (localStorage.getItem("runCodeAgain")) {
        checkRunCodeAgain(selectedElements);
    }
})();