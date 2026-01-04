// ==UserScript==
// @name         湖南公需科目版-湘潭技师学院-自动播放|代刷vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.1
// @description  自动点击确定|开始播放|监听到播放|代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        https://*.zgzjzj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519705/%E6%B9%96%E5%8D%97%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E7%89%88-%E6%B9%98%E6%BD%AD%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/519705/%E6%B9%96%E5%8D%97%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E7%89%88-%E6%B9%98%E6%BD%AD%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%7C%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".vjs-big-play-button").click();
    setInterval(function(){
        if($(".vjs-play-progress").attr("style")){
           var a  = $(".vjs-play-progress").attr("style");
           var b = a.substring(7);
        }
        $("video.vjs-tech").prop("muted",true);
        //console.log(b)
        if($(".vjs-play-control").attr("title") == "Play"){
           $(".vjs-play-control").click();
           }
    }, 3000);
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

    }

    function bf(){
        if(document.querySelectorAll('div.endAd>img').length>0){
        if(document.querySelectorAll('div.endAd>img')[1].src.search('371b3f7')>0){
        document.querySelectorAll('div.endAd>img')[1].click()}}
        let kc=document.getElementsByClassName('progresstext')
        if(document.querySelectorAll('div.text span')[1].innerText=="100%"){
            setTimeout(function(){//点击第一个课程小节
            document.querySelector(" li> span.classname").click()
            },6992)
            //window.location.reload()
            for (var i = 0;i < kc.length;i++){
            if(kc[i].innerText !=='100%'){
            kc[i].click();
            break;
            }
            }
            }console.log('播放着')

       };
setInterval(bf,5000)
    function sx(){window.location.reload()}
    setInterval(sx,1200000)
})();