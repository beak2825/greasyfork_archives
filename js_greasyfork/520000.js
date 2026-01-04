// ==UserScript==
// @name         山西恒安-自动看课，秒刷代刷vx:shuake345
// @namespace    vx:shuake345
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        https://nazx.yunkeonline.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunkeonline.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520000/%E5%B1%B1%E8%A5%BF%E6%81%92%E5%AE%89-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%EF%BC%8C%E7%A7%92%E5%88%B7%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/520000/%E5%B1%B1%E8%A5%BF%E6%81%92%E5%AE%89-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%EF%BC%8C%E7%A7%92%E5%88%B7%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'https://nazx.yunkeonline.cn/'
	var Chuyurl = 'daily'
	var Shuyurl = 'train'
	var Fhuyurl = 'train/class'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 ) {
				setTimeout(sxrefere, 1000)
			}
		}
	});

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
		document.querySelector("body > div:nth-child(1) > header > div > div.inner-center.container > div.nav_width > nav > ul > li:nth-child(4) > a").click()
	}

	function Chuy() {
        document.querySelector("#app > div > div.body > div.menu > div > nav > ul > li:nth-child(5) > a > span").click()
        setTimeout(function(){
        document.querySelector("#app > div > div.body > div.router > div > div:nth-child(2) > div.body > div > div > div > div.block_right > div").click()},3100)
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
		if (document.URL.search(Shuyurl) > 2) {
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
	}
	setInterval(Shuy, 3124)

	function Fhuy() {
        var KcId=document.querySelectorAll("div > div.name")
        for (var i = 0; i < KcId.length; i++) {
				if (KcId[i].childElementCount == 1) {
					KcId[i].click()
				break
			}
        }}
    function BOFANG(){
        if(document.URL.search('lesson') > 2) {
            document.querySelector("body > div:nth-child(1) > div.page-container > article > div.courseDetail-container--main.clearFix > div > div > div.course-info > p.course-info--button > div").click()

        }else if(document.URL.search('leancenter') > 2){
            document.querySelector("#app > div > div:nth-child(2) > div > div > div.lesson_body > div.less_list > div:nth-child(2) > div:nth-child(2) > div.clickbutton").click()
        }
        document.querySelector("#app > div > div.body > div.router > div > div:nth-child(2) > div > div.class_right > div > div.learn_body > div.btn").click()

		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}
    setTimeout(BOFANG,2121)
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
	function QT(){
        var img = document.createElement("img");
        var img1 = document.createElement("img");
        img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0'; // 设置为左上角，修改这一行
        img.style.zIndex = '999';
        img.style.width = '230px';
        img.style.height = '230px';
        document.body.appendChild(img);
        img1.src = "https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        img1.style.width = '230px';
        img1.style.height = '230px';
        img1.style.position = 'fixed';
        img1.style.top = '0';
        img1.style.right = '0'; // 设置为右上角，无需修改
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    setTimeout(QT,3251)
	function Pd() {
		if (document.URL.search(Shuyurl) > 2) {
		} else if (document.URL.search(Chuyurl) > 2) {
			setTimeout(Chuy, 2210)
		} else if (document.URL==Zhuyurl) {
			setTimeout(Zhuy, 24)
		}else if (document.URL==Fhuyurl) {
			setInterval(Fhuy, 3000)
		}
	}
	setTimeout(Pd, 1254)

})();