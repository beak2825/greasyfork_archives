// ==UserScript==
// @name         网页文本词频分析 (使用 innerText)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用 innerText 分析网页文本词频，显示在可拖拽悬浮窗口
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523646/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%AF%8D%E9%A2%91%E5%88%86%E6%9E%90%20%28%E4%BD%BF%E7%94%A8%20innerText%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523646/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%AF%8D%E9%A2%91%E5%88%86%E6%9E%90%20%28%E4%BD%BF%E7%94%A8%20innerText%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function countMostFrequentTwoWords(text) {
        if (typeof text !== 'string' || text.length < 2) {
            return "输入文本不合法或长度不足"; // 处理无效输入
        }

        // 1. 清理文本：移除标点符号和多余空格
        text = text.replace(/[，、；：。？！“”‘’《》【】{}（）…—·！￥…&……%@*]/g, ''); // 移除中文标点
        text = text.replace(/\s+/g, ' '); // 将多个空格替换为一个空格
        text = text.trim(); // 去除首尾空格

        // 2. 分割成单字数组
        let characters = text.split('');

        // 3. 创建双字词并计数
        let twoWordCounts = {};
        for (let i = 0; i < characters.length - 1; i++) {
            let twoWord = characters[i] + characters[i + 1];
            twoWordCounts[twoWord] = (twoWordCounts[twoWord] || 0) + 1;
        }

        // 4. 找到出现次数最多的两个双字词
        let sortedTwoWords = Object.entries(twoWordCounts).sort(([, countA], [, countB]) => countB - countA);

        //处理没有双字词的情况
        if (sortedTwoWords.length === 0) {
            return "文本中没有双字词";
        }

        // 返回出现次数最多的两个双字词
        let topTwo = sortedTwoWords.slice(0, 2);
        let result = "";
        for(let i = 0; i < topTwo.length; i++){
            result += `第${i+1}名: "${topTwo[i][0]}" 出现了 ${topTwo[i][1]} 次\n`;
        }
        return result;
    }



    function wordFrequency(text) {
        if (typeof text !== 'string' || text.length === 0) {
            return {};
        }

        // 预处理：去除标点符号和空格，转换为小写
        text = text.replace(/[\p{P}\s]+/gu, '').toLowerCase();

        const frequency = {};
        const n = text.length;

        for (let i = 0; i < n; i++) {
            for (let j = 1; j <= 4 && i + j <= n; j++) { // 限制词组最多四个字
            const word = text.substring(i, i + j);
            frequency[word] = (frequency[word] || 0) + 1;
            }
        }

        // 将词频对象转换为数组并按词频降序排序 (可选)
        const sortedFrequency = Object.entries(frequency).sort(([, a], [, b]) => b - a);

            // 如果需要返回对象而不是数组，可以省略上面的排序代码，直接返回 frequency 对象

        return sortedFrequency; // 或者 return frequency;
    }

    function topWordFrequency(text, topN = 20) {
        if (typeof text !== 'string' || text.length === 0) {
            return []; // 或者返回空对象 {}，取决于你的需求
        }

        // 预处理：去除标点符号和空格，转换为小写
        text = text.replace(/[\p{P}\s]+/gu, '').toLowerCase();

        const frequency = {};
        const n = text.length;

        for (let i = 0; i < n; i++) {
            for (let j = 1; j <= 4 && i + j <= n; j++) {
                const word = text.substring(i, i + j);
                frequency[word] = (frequency[word] || 0) + 1;
            }
        }

        // 将词频对象转换为数组并按词频降序排序
        const sortedFrequency = Object.entries(frequency).sort(([, a], [, b]) => b - a);

        // 返回前 topN 个词组
        return sortedFrequency.slice(0, topN);
    }

    function analyzeText() {
        // 使用 innerText 获取所有文本
        let allText = document.body.innerText;
        let output=topWordFrequency(allText)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 清理文本
        //allText = allText.replace(/[，。？?.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase();
        // 定义需要切割的标点符号，注意转义特殊字符
        //let punctuation = /[，、；：。？！“”‘’《》【】{}（）]/g;

        //let words = allText.split(punctuation);

        // 过滤掉空字符串
        //words = words.filter(word => word.trim() !== "");

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         let words= countMostFrequentTwoWords(allText)
//         // 统计词频
//         let wordFrequency = {};
//         for (let word of words) {
//             if (word !== "") {
//                 wordFrequency[word] = (wordFrequency[word] || 0) + 1;
//             }
//         }

//         // 排序词频
//         let sortedWords = Object.entries(wordFrequency).sort(([, a], [, b]) => b - a);

        // 创建显示结果的 div
        let resultDiv = document.createElement("div");
        resultDiv.id = "wordFrequencyResult"; // 添加 id 方便后续操作
        resultDiv.style.position = "fixed";
        resultDiv.style.top = "10px";
        resultDiv.style.left = "10px";
        resultDiv.style.backgroundColor = "white";
        resultDiv.style.border = "1px solid black";
        resultDiv.style.padding = "10px";
        resultDiv.style.zIndex = "9999";
        resultDiv.style.maxHeight = "500px";
        resultDiv.style.overflowY = "scroll";
        resultDiv.style.resize = "both"; // 允许调整大小
        resultDiv.style.overflow = "auto";
        resultDiv.style.minWidth = "200px"; // 设置最小宽度，防止拖拽成一条线

        // let output = "词频分析结果：\n";
        // for (let [word, frequency] of sortedWords) {
        //     output += word + ": " + frequency + "\n";
        // }
        resultDiv.textContent = output;

        document.body.appendChild(resultDiv);

        // 使 div 可拖拽
        dragElement(resultDiv);
    }

    //拖拽功能
    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (elmnt.querySelector(".drag-header")) {
            /* 如果存在 header，则 header 是拖拽的“手柄” */
            elmnt.querySelector(".drag-header").onmousedown = dragMouseDown;
        } else {
            /* 否则，整个元素都是拖拽的“手柄” */
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标在光标位置的初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* 停止移动 */
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    // 创建分析按钮
    let analyzeButton = document.createElement("button");
    analyzeButton.textContent = "分析词频";
    analyzeButton.style.position = "fixed";
    analyzeButton.style.top = "10px";
    analyzeButton.style.right = "10px";
    analyzeButton.style.zIndex = "9999";
    analyzeButton.onclick = analyzeText;
    document.body.appendChild(analyzeButton);
})();