// ==UserScript==
// @name         MZ-Copy SPU Text
// @namespace    http://tampermonkey.net/
// @version      13.1
// @description  Copy text from specified elements without brackets and spaces, separated by commas. Click to copy, unhighlight, detect content change, and clear clipboard. Adds debugging messages to the console.
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487728/MZ-Copy%20SPU%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/487728/MZ-Copy%20SPU%20Text.meta.js
// ==/UserScript==
(function() {
    // 用于存储已复制的元素，避免重复复制
    const copiedElements = new Set();

    // 定义多个XPath选择器，用于匹配多个题目ID
    const xpathSelectors = [
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[1]/SECTION[1]/DIV[1]/P[2]',//通用
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[1]/SECTION[1]/DIV[1]/P[2]',//子项目

        // Add more XPath selectors for additional IDs here
    ];

    // 创建一个对象，用于存储每个题目ID的上一次内容
    const previousContents = {};

    // 定义一个函数，用于处理点击事件
    function handleElementClick() {
        // 获取元素文本内容并去除空格
        const textToCopy = this.textContent.trim();

        // 使用正则表达式替换方括号及其中的内容为空字符串，并将逗号替换为顿号
        const cleanedText = textToCopy.replace(/\[[^\]]*\]/g, "").replace(/,/g, "、");

        if (copiedElements.has(this)) {
            // 如果已复制，则从复制队列中删除
            copiedElements.delete(this);
            // 恢复元素样式
            this.style.fontWeight = "normal";
            this.style.color = "initial";
        } else {
            // 将点击的元素添加到已复制元素集合中
            copiedElements.add(this);
            // 将被点击的元素标记为已复制
            this.style.fontWeight = "bold";
            this.style.color = "black";
        }

        // 生成复制文本
        const copiedTextArray = [...copiedElements].map(element => {
            const elementText = element.textContent.trim();
            // 移除双引号
            return elementText.replace(/\[[^\]]*\]/g, "").replace(/,/g, "、").replace(/"/g, "");
        });

        // 创建一个隐藏的<textarea>元素
        const textArea = document.createElement("textarea");
        // 插入话术并去除最后的逗号
        textArea.value = copiedTextArray.join("、 ");
        document.body.appendChild(textArea);

        // 选中文本并执行复制操作
        textArea.select();
        document.execCommand("copy");

        // 移除<textarea>元素
        document.body.removeChild(textArea);

        console.log("文本已复制到剪贴板:", copiedTextArray.join("、 "));
    }

    // 使用setInterval定时刷新页面
    const refreshInterval = 1000; // 设置刷新间隔（单位：毫秒）

    function refreshPage() {
        // 循环处理前30个元素
        for (let i = 1; i <= 30; i++) {
            // 匹配第一类元素
            const xpath1 = `/html/body/div[1]/div/div[2]/section/div/div/div[1]/div/div[2]/article[1]/section[2]/div/div[2]/div[6]/div[3]/table/tbody/tr[${i}]/td[1]/div`;
            const targetElement1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 添加点击事件监听器
            if (targetElement1) {
                targetElement1.removeEventListener("click", handleElementClick); // 移除旧的事件处理程序
                targetElement1.addEventListener("click", handleElementClick); // 添加新的事件处理程序
            }

            // 匹配第二类元素
            const xpath2 = `/html/body/div[1]/div/div/section/div/div/div[1]/div/div[2]/article[1]/section[2]/div/div[2]/div[6]/div[3]/table/tbody/tr[${i}]/td[22]/div`;
            //尾部2改成22使其失效
            const targetElement2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 添加点击事件监听器
            if (targetElement2) {
                targetElement2.removeEventListener("click", handleElementClick); // 移除旧的事件处理程序
                targetElement2.addEventListener("click", handleElementClick); // 添加新的事件处理程序
            }
        }
    }

    // 初始刷新
    refreshPage();

    // 设置定时刷新
    setInterval(refreshPage, refreshInterval);

    // 检查多个题目ID内容变化的函数
    function checkContentChange() {
        xpathSelectors.forEach(xpathSelector => {
            const result = document.evaluate(xpathSelector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const targetElement = result.singleNodeValue;

            if (targetElement) {
                const currentContent = targetElement.textContent;
                if (currentContent !== previousContents[xpathSelector]) {
                    console.log(`题目ID内容(${xpathSelector})已经发生变化！`);
                    // 清空存储的元素和变量
                    copiedElements.clear();
                    previousContents[xpathSelector] = currentContent;

                    // 清空剪贴板
                    clearClipboard();
                }
            } else {
                console.error(`找不到目标元素(${xpathSelector})，请检查XPath选择器是否正确。`);
            }
        });
    }

    // 定义一个函数，用于清空剪贴板
    function clearClipboard() {
        // 创建一个隐藏的<textarea>元素并将其内容设置为空
        const textArea = document.createElement("textarea");
        textArea.value = " ";
        document.body.appendChild(textArea);

        // 选中文本并执行复制操作
        textArea.select();
        document.execCommand("copy");

        // 移除<textarea>元素
        document.body.removeChild(textArea);

        console.log("剪贴板已清空");
    }

    // 设置定时检查内容变化
    setInterval(checkContentChange, 1000); // 每秒检查一次内容变化
})();
