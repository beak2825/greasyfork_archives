// ==UserScript==
// @name        财富管理微专业|秒刷vx:shuake345
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  自动学习小节|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        https://pyqcf.pystandard.cn/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518811/%E8%B4%A2%E5%AF%8C%E7%AE%A1%E7%90%86%E5%BE%AE%E4%B8%93%E4%B8%9A%7C%E7%A7%92%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/518811/%E8%B4%A2%E5%AF%8C%E7%AE%A1%E7%90%86%E5%BE%AE%E4%B8%93%E4%B8%9A%7C%E7%A7%92%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';


	function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}

	function Zhuy() {
		var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText == '[未完成]') {
				window.open(KC[i].href)
				break;
			}
		}
	}

	function Chuy() {
		if(parseInt(localStorage.getItem('key'))==NaN){
            localStorage.setItem('key',0)
        }
        var Lookdpage = parseInt(localStorage.getItem('key'))
		var zKC = document.querySelectorAll('tbody>tr>td>a')
        var zKCnum=zKC.length-1//2num kc
        if(Lookdpage<zKCnum){
            localStorage.setItem('key',Lookdpage+1)
            zKC[Lookdpage].click()
           }else{
           localStorage.setItem('key',0)
           }
	}

	function Shuy() {
			var zzKC = document.querySelectorAll('tbody>tr>td>span')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
			for (var i = 0; i < zzKC.length; i++) {
				if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
					localStorage.setItem('Surl', window.location.href)
					window.location.replace(zzKCurl[i].href)
					break;
				} else if (i == zzKC.length - 1) {
					setTimeout(gbclose, 1104)
				}
			}
	}
	setInterval(Shuy, 3124)

	function Fhuy() {
		if (document.querySelector("button.ant-btn.ant-btn-primary")!==null) {//next
			document.querySelector("button.ant-btn.ant-btn-primary").click()

		}else if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0			
		}
	}
    setInterval(Fhuy,6000)
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

	function QT(){
        var d1=document.getElementsByClassName('main main-note-scroll')[0];
        var img=document.createElement("img");
        var img1=document.createElement("img");
        img.style="width:230px; height:230px;"
        img1.style="width:230px; height:230px;"
        img1.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
        d1.appendChild(img1);
    }
     setTimeout(QT,5000)


})();