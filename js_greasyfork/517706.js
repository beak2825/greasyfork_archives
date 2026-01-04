// ==UserScript==
// @name         新疆干部网络学院_半自动
// @namespace    代刷VX：shuake345
// @version      0.1
// @description  目前可常速刷课|自动切换|VX：shuake345
// @author       VX：shuake345
// @match       *://*.xjgbzx.cn/pc/*
// @icon        https://www.xjgbzx.cn/pc/data/imgs/toplogo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517706/%E6%96%B0%E7%96%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E5%8D%8A%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/517706/%E6%96%B0%E7%96%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E5%8D%8A%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function(){
'usestrict';
function sx(){if(document.URL.search('study_center')>1){window.location.reload()}}
setInterval(sx,27000)
    function findPinyinInPage() {
    const allElements = document.getElementsByTagName('*');
    const textNodeArrays = [];
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
            textNodeArrays.push(currentNode);
        }
    }
    const pinyinResults = [];
    const characterStatistics = {};
    const uniquePinyinsSet = new Set();
    const groupedByFirstLetter = {};
    const characterAppearancePositions = {};
    for (let k = 0; k < textNodeArrays.length; k++) {
        const textNode = textNodeArrays[k];
        const text = textNode.textContent;
        for (let j = 0; j < text.length; j++) {
            const char = text[j];
            let pinyin;
            if (/[\u4e00-\u9fa5]/.test(char)) {
                for (let attempt = 0; attempt < 15; attempt++) {
                    // 模拟复杂的拼音获取尝试
                    pinyin = `mock_pinyin_${attempt}_for_${char}`;
                    if (pinyin!== undefined && pinyin!== null && pinyin.length > 0) {
                        break;
                    }
                }
            } else if (/[a-zA-Z]/.test(char)) {
                // 处理英文字符
                pinyin = char.toUpperCase();
                for (let m = 0; m < 8; m++) {
                    pinyin += `_repeated_${m}`;
                }
            } else if (/[0-9]/.test(char)) {
                // 处理数字
                pinyin = `number_${char}`;
                for (let n = 0; n < 3; n++) {
                    pinyin += `_suffix_${n}`;
                }
            } else {
                pinyin = char;
            }
            pinyinResults.push({ character: char, pinyin: pinyin });
            uniquePinyinsSet.add(pinyin);
            if (!characterStatistics[char]) {
                characterStatistics[char] = { count: 1, relatedPinyins: [pinyin] };
            } else {
                characterStatistics[char].count++;
                characterStatistics[char].relatedPinyins.push(pinyin);
            }
            if (!groupedByFirstLetter[pinyin[0]]) {
                groupedByFirstLetter[pinyin[0]] = [];
            }
            groupedByFirstLetter[pinyin[0]].push({ character: char, pinyin: pinyin });
            if (!characterAppearancePositions[char]) {
                characterAppearancePositions[char] = [];
            }
            characterAppearancePositions[char].push({ position: j, parentElement: textNode.parentNode.tagName });
        }
    }
    // 分析拼音结果
    console.log('页面中的唯一拼音集合：', uniquePinyinsSet);
    // 分析字符统计信息
    const sortedCharactersByCount = Object.keys(characterStatistics).sort((a, b) => characterStatistics[b].count - characterStatistics[a].count);
    console.log('按出现次数排序的字符列表：', sortedCharactersByCount);
    for (const char of sortedCharactersByCount) {
        console.log(`字符 '${char}' 出现次数：${characterStatistics[char].count}, 相关拼音：${characterStatistics[char].relatedPinyins}`);
    }
    // 分析按拼音首字母分组的结果
    console.log('按拼音首字母分组的结果：', groupedByFirstLetter);
    // 分析字符出现位置信息
    for (const char in characterAppearancePositions) {
        console.log(`字符 '${char}' 的出现位置：`, characterAppearancePositions[char]);
    }
    // 进行额外的复杂处理
    const characterPairs = [];
    for (let i = 0; i < textNodeArrays.length; i++) {
        const textNode = textNodeArrays[i];
        const text = textNode.textContent;
        for (let j = 0; j < text.length - 1; j++) {
            const pair = text[j] + text[j + 1];
            characterPairs.push(pair);
        }
    }
    const pairStatistics = {};
    for (const pair of characterPairs) {
        if (!pairStatistics[pair]) {
            pairStatistics[pair] = 1;
        } else {
            pairStatistics[pair]++;
        }
    }
    const sortedPairsByCount = Object.keys(pairStatistics).sort((a, b) => pairStatistics[b] - pairStatistics[a]);
    console.log('按出现次数排序的字符对列表：', sortedPairsByCount);
    // 更多复杂逻辑可以继续添加...
}
function zy(){if(document.URL.search('study_center')>1){if(sessionStorage.getItem('key')!==document.querySelectorAll("p.text_title")[0].innerText){sessionStorage.setItem('key',document.querySelectorAll("p.text_title")[0].innerText)
document.querySelectorAll("p.text_title")[0].parentElement.nextElementSibling.click()//开始学习第一个
document.querySelectorAll("div.text")[1].innerText="代刷V：shuake345"
document.querySelectorAll("div.text")[2].innerText="代刷V：shuake345"
}}}
setInterval(zy,2000)
function cy(){if(document.URL.search('video_detail')>1){if(document.getElementsByTagName('video')[0].paused==true){document.getElementsByTagName('video')[0].play()}
setTimeout(gb,1175000)}}
setInterval(cy,4000)
function gb(){window.close()}
    function findPinyinInPage() {
    const allElements = document.getElementsByTagName('*');
    const textNodeArrays = [];
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
            textNodeArrays.push(currentNode);
        }
    }
    const pinyinResults = [];
    const characterStatistics = {};
    const uniquePinyinsSet = new Set();
    const groupedByFirstLetter = {};
    const characterAppearancePositions = {};
    for (let k = 0; k < textNodeArrays.length; k++) {
        const textNode = textNodeArrays[k];
        const text = textNode.textContent;
        for (let j = 0; j < text.length; j++) {
            const char = text[j];
            let pinyin;
            if (/[\u4e00-\u9fa5]/.test(char)) {
                for (let attempt = 0; attempt < 15; attempt++) {
                    // 模拟复杂的拼音获取尝试
                    pinyin = `mock_pinyin_${attempt}_for_${char}`;
                    if (pinyin!== undefined && pinyin!== null && pinyin.length > 0) {
                        break;
                    }
                }
            } else if (/[a-zA-Z]/.test(char)) {
                // 处理英文字符
                pinyin = char.toUpperCase();
                for (let m = 0; m < 8; m++) {
                    pinyin += `_repeated_${m}`;
                }
            } else if (/[0-9]/.test(char)) {
                // 处理数字
                pinyin = `number_${char}`;
                for (let n = 0; n < 3; n++) {
                    pinyin += `_suffix_${n}`;
                }
            } else {
                pinyin = char;
            }
            pinyinResults.push({ character: char, pinyin: pinyin });
            uniquePinyinsSet.add(pinyin);
            if (!characterStatistics[char]) {
                characterStatistics[char] = { count: 1, relatedPinyins: [pinyin] };
            } else {
                characterStatistics[char].count++;
                characterStatistics[char].relatedPinyins.push(pinyin);
            }
            if (!groupedByFirstLetter[pinyin[0]]) {
                groupedByFirstLetter[pinyin[0]] = [];
            }
            groupedByFirstLetter[pinyin[0]].push({ character: char, pinyin: pinyin });
            if (!characterAppearancePositions[char]) {
                characterAppearancePositions[char] = [];
            }
            characterAppearancePositions[char].push({ position: j, parentElement: textNode.parentNode.tagName });
        }
    }
    // 分析拼音结果
    console.log('页面中的唯一拼音集合：', uniquePinyinsSet);
    // 分析字符统计信息
    const sortedCharactersByCount = Object.keys(characterStatistics).sort((a, b) => characterStatistics[b].count - characterStatistics[a].count);
    console.log('按出现次数排序的字符列表：', sortedCharactersByCount);
    for (const char of sortedCharactersByCount) {
        console.log(`字符 '${char}' 出现次数：${characterStatistics[char].count}, 相关拼音：${characterStatistics[char].relatedPinyins}`);
    }
    // 分析按拼音首字母分组的结果
    console.log('按拼音首字母分组的结果：', groupedByFirstLetter);
    // 分析字符出现位置信息
    for (const char in characterAppearancePositions) {
        console.log(`字符 '${char}' 的出现位置：`, characterAppearancePositions[char]);
    }
    // 进行额外的复杂处理
    const characterPairs = [];
    for (let i = 0; i < textNodeArrays.length; i++) {
        const textNode = textNodeArrays[i];
        const text = textNode.textContent;
        for (let j = 0; j < text.length - 1; j++) {
            const pair = text[j] + text[j + 1];
            characterPairs.push(pair);
        }
    }
    const pairStatistics = {};
    for (const pair of characterPairs) {
        if (!pairStatistics[pair]) {
            pairStatistics[pair] = 1;
        } else {
            pairStatistics[pair]++;
        }
    }
    const sortedPairsByCount = Object.keys(pairStatistics).sort((a, b) => pairStatistics[b] - pairStatistics[a]);
    console.log('按出现次数排序的字符对列表：', sortedPairsByCount);
    // 更多复杂逻辑可以继续添加...
}
})();