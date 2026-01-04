// ==UserScript==
// @name         Wokeden
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  修改高登網頁嘅台名及背景顏色
// @author       居理夫人
// @match        *://*.hkgolden.com/*
// @grant        none
// @license GNU General Public License v3.0.
// @downloadURL https://update.greasyfork.org/scripts/513539/Wokeden.user.js
// @updateURL https://update.greasyfork.org/scripts/513539/Wokeden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改台名嘅list
    const nameChanges = {
        "吹水台": "中立台",
        "高登熱": "Trending",
        "最　新": "多元新政",
        "時事台": "社會正義",
        "娛樂台": "多元性格",
        "體育台": "環保運動",
        "財經台": "社會主義",
        "學術台": "性別認同",
        "講故台": "白人暴力",
        "創意台": "多樣創意",
        "超自然台": "JSO運動",
        "優惠台": "零元購物",
        "遊戲台": "政確遊戲",
        "飲食台": "素食文化",
        "旅遊台": "FREE GAZA"
    };

    // 修改台icon嘅list
    const svgMapping = {
        "channel-BW": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-BW.svg",
        "channel-CA": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-CA.svg",
        "channel-CP": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-CP.svg",
        "channel-ED": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-ED.svg",
        "channel-EP": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-EP.svg",
        "channel-ET": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-ET.svg",
        "channel-FN": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-FN.svg",
        "channel-GM": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-GM.svg",
        "channel-SN": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-SN.svg",
        "channel-SP": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-SP.svg",
        "channel-ST": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-ST.svg",
        "channel-SY": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-SY.svg",
        "channel-TR": "https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/bef98d610730792b2de8d5989b73e2e393c30a1c/channel-TR.svg"
    };


    // �去改顏色同埋台名
    function changeBackgroundColors() {
        // 修改台名
        const spans = document.querySelectorAll('span.MuiTypography-root.MuiListItemText-primary');
        spans.forEach(span => {
            const newText = nameChanges[span.textContent.trim()];
            if (newText) {
                span.textContent = newText; // 修改台名
            }

        });
        	// 修改喺文章header位置嘅台名
        const currentchannel = document.evaluate('/html/body/div[1]/div/div[1]/main/div[3]/div[1]/header/div/div/div[1]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (currentchannel) {
		const newText = nameChanges[currentchannel.textContent.trim()];
		if (newText) {
			currentchannel.textContent = newText; // 修改台名
		}
	}


        // 修改背景顏色
        document.body.style.background = 'linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)';

        const header = document.evaluate('/html/body/div[1]/div/header', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (header) {
            header.style.background = 'linear-gradient(to right, red, orange, yellow, green, aqua, blue, violet)'; // 修改持續header背景
        }

        // 修改轉台欄位多個div嘅背景
        const navDivs = [
            '/html/body/div[1]/div/div/nav/div/div/div/div[1]',
            '/html/body/div[1]/div/div/nav/div/div/div/div[2]/div',
            '/html/body/div[1]/div/div/nav/div/div/div/div[3]/div',
            '/html/body/div[1]/div/div/nav/div/div/div/div[4]/div',
            '/html/body/div[1]/div/div/nav/div/div/div/div[5]/div',
            '/html/body/div[1]/div/div/nav/div/div/div/div[6]/div'
        ];
        navDivs.forEach(xpath => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                element.style.background = 'linear-gradient(rgb(251 22 22) 0%, rgb(215 126 85) 80%, rgba(255, 0, 0, 0) 100%)';
            }
        });

        const mainHeader = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[1]/header', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (mainHeader) {
            mainHeader.style.background = 'linear-gradient(to right, #ff8d00, #ffc300, #fffc00, #8dc600, #008204, #00c68d, #00fdfa, #005fff)'; // 修改主header背景
        }

        const navBackground = document.evaluate('/html/body/div[1]/div/div/nav/div/div/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (navBackground) {
            navBackground.style.background = 'none'; // 修改轉台欄嘅背景
        }

                const headerDiv = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[1]/header/div/div/div[1]/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (headerDiv) {
            headerDiv.style.background = '#b320a3'; // 修改ForumMenu背景
        }

        const ForumMenu = document.evaluate('//*[@id="mui-component-select-切換"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (ForumMenu) {
            ForumMenu.style.background = '#b320a3'; // 修改ForumMenu背景
        }

        const searchtype = document.evaluate('//*[@id="mui-component-select-搜尋"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const searchbar = document.evaluate('/html/body/div[1]/div/header/div/div/div[2]/div/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const searchbutton = document.evaluate('/html/body/div[1]/div/header/div/div/div[2]/div/div/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 修改searchbar

        if (searchtype) {
            searchtype.style.background = '#b320a3';
        }
        if (searchbar) {
            searchbar.style.backgroundColor = "#b320a3";
        }
        if (searchbutton) {
            searchbutton.style.backgroundColor = '#b320a3';
        }

        const sideAD1 = document.evaluate('/html/body/div[1]/div/div/main/div[2]/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const sideAD2 = document.evaluate('/html/body/div[1]/div/div/main/div[2]/div[2]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (sideAD1) {
            sideAD1.style.background = "#b320a3";
        }
        if (sideAD2) {
            sideAD2.style.background = '#b320a3';
        }

        const bam1 = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[2]/div/div[1]/div/div/header', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const bam2 = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[2]/div/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const bamBG1 = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const bamBG2 = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[2]/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (bam1) {
            bam1.style.background = "red";
        }
        if (bam2) {
            bam2.style.background = '#ac0707';
        }
        if (bamBG1 && bamBG2) {
            bamBG1.style.background = 'none';
            bamBG2.style.background = 'none';
        }
        const HKGLOGO = document.evaluate('/html/body/div[1]/div/header/div/div/div[1]/div/a/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (HKGLOGO) {
            HKGLOGO.style.backgroundImage = 'url(https://raw.githubusercontent.com/Ramen-LadyHKG/wokeden/refs/heads/main/wokeden_logo.png)';
        }

        const AppsAD = document.evaluate('/html/body/div[1]/div/div/main/div[3]/div[2]/div/div[2]/div/div[2]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (AppsAD) {
            AppsAD.style.display = 'none';
        }

        const profileMenu = document.evaluate('/html/body/div[4]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (profileMenu) {
            profileMenu.style.background = 'linear-gradient(to bottom, red, orange, yellow, green, cyan, blue, violet)';
            profileMenu.style.color = 'black';

        }

        // 修改文章 div 嘅背景顏色
        let index = 1;
        while (true) {
            const BlockDiv = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const NormalDiv = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const AdDiv = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div[2]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const BlockAd1Div = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div[1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const BlockAd3Div = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div[3]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const BlockAdNextDiv = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div[2]/div`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const NextDiv = document.evaluate(`/html/body/div[1]/div/div/main/div[3]/div[1]/div/div[${index}]/div[1]/div`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // 檢查正常情況（文章）
            if (NormalDiv && !BlockDiv.textContent.includes("Blocked User")) {
                if (AdDiv) {
                    AdDiv.style.background = 'rgb(134, 5, 5)'; // 廣告背景
                    NextDiv.style.background = 'rgb(194, 54, 54)'; // 廣告後嘅正常文章
                } else {
                    NormalDiv.style.background = 'rgb(194, 54, 54)'; // 正常文章背景
                }
                index++;
            }
            // 檢查特殊情況（封鎖用戶）
            else if (BlockDiv && BlockDiv.textContent.includes("Blocked User") && !BlockAd3Div) {
                BlockDiv.style.background = 'rgb(132, 23, 23)'; // 封鎖用戶背景
                index++;
            }
            // 檢查特殊情況（同時出現封鎖用戶同埋廣告）
            else if (BlockAd3Div && !BlockAd1Div) {
                BlockAd1Div.style.background = 'rgb(132, 23, 23)'; // 封鎖用戶背景
                BlockAd3Div.style.background = 'rgb(134, 5, 5)'; // 廣告背景
                BlockAdNextDiv.style.background = 'rgb(194, 54, 54)'; // 廣告後的正常文章
                index++;
            } else {
                break; // 如果搵唔到更多div就停止
            }
        }
    }

   // 改轉台icon
    function replaceSVGWithImg() {
        const svgElements = document.querySelectorAll('svg[aria-hidden="true"]');

        svgElements.forEach(svg => {
            const useElement = svg.querySelector('use');
            if (useElement) {
                const href = useElement.getAttribute('xlink:href');
                const svgId = href ? href.replace('#', '') : null;
                const imgSrc = svgMapping[svgId];

                if (imgSrc) {
                    const imgElement = document.createElement('img');
                    imgElement.src = imgSrc;
                    imgElement.width = 16;
                    imgElement.height = 16;
                    imgElement.alt = svgId;

                    // 取消 SVG　改用ｉｍ g
                    svg.parentNode.replaceChild(imgElement, svg);
                }
            }
        });
    }

    // 當頁面載入完成就執行一次
    window.addEventListener('load', () => {
        changeBackgroundColors();
        replaceSVGWithImg();
    });

    // 用MutationObserver 去監控 DOM 嘅變化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                changeBackgroundColors();
                replaceSVGWithImg();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

