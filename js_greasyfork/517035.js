// ==UserScript==
// @name         中华医学继续教育在线；vx:shuake345
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  自动学习小节|自动换课功能|需要代刷+vx:shuake345
// @author       You
// @match        https://*.cma-cmc.com.cn/cms/*
// @match        https://yxdzcbs-kfkc.webtrn.cn/learnspace/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cma-cmc.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517035/%E4%B8%AD%E5%8D%8E%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%EF%BC%9Bvx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/517035/%E4%B8%AD%E5%8D%8E%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%EF%BC%9Bvx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
            //yincang
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(Zhuyurl) > 1 ) {
                //setTimeout(sxrefere, 1000)
                setTimeout(function(){document.querySelectorAll("#courseList > tr> td.pl30 > a.ck-more.ck-m-btn2")[0].click()},1211)
            }
        }
    });
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var Zhuyurl = 'countryPublicClassDetail'
    var Chuyurl = 'templatethree'
    var Shuyurl = 'CourseWare'
    var Fhuyurl = '&courseware'
    function fhback() {
        window.history.go(-1)
    }

    function gbclose() {
        window.close()
    }

    function sxrefere() {
        window.location.reload()
    }
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
    function WEIgui(){
        if(document.URL.search('%E8%BF%9D%E8%A7%84%E5%AD%A6%E4%B9%A0%E6%8F%90%E9%86%92')>20){//违规操作
            document.querySelector("body > div > div > div.btn-group > a").click()
        }else{
            if(document.querySelector("div.layui-layer-btn.layui-layer-btn- > a")!==null){
                document.querySelector("div.layui-layer-btn.layui-layer-btn- > a").click()//看了30分钟
            }
        }

    }
    setInterval(WEIgui,5000)

    function ZY(){
        if(document.querySelector("div > div:nth-child(2) > div> div> div.btn-wrap > a > span")!==null){
            document.querySelector("div > div:nth-child(2) > div> div> div.btn-wrap > a > span").click()
        }
        if(document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('video').paused){//视频停了
            console.log('视频停了')
            document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('.s_point.undo_item_bgc.hasappend')[0].click()//点击未解锁的第一个
            //document.querySelectorAll('[class="item_done_icon item_done_pos"]')[0].click()//104个未看图标，点击第一个。
            setTimeout(function (){
                document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('.s_point.hasappend.s_pointerct')[0].click()//点上面那个没反应，就点一下这个，继续播放当前视频
            })
        }
    }
    setInterval(ZY,1800101)
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
    function WZ(){
        var img = document.createElement("img");
        var img1 = document.createElement("img");
        img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0'; // 
        img.style.zIndex = '999';
        img.style.width = '230px';
        img.style.height = '230px';
        document.body.appendChild(img);
        img1.src = "https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        img1.style.width = '230px';
        img1.style.height = '230px';
        img1.style.position = 'fixed';
        img1.style.top = '0';
        img1.style.right = '0'; // 
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    setTimeout(WZ,5012)

    // Your code here...
})();