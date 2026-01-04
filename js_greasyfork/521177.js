// ==UserScript==
// @name         Observing the Style of Players for MajSoulStats
// @name:zh-CN   雀魂牌谱屋看牌手风格
// @namespace    http://tampermonkey.net/
// @version      2024-12-18
// @description  Added a button on the player page of MajSoulStats to link to Majang style type.
// @description:zh-cn    在牌谱屋的player页加了个按钮，跳转到Majang风格类型。
// @author       lsyanling
// @match        https://amae-koromo.sapk.ch/player/*
// @match        https://yurakuurame.github.io/4ma-majang-type-check/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/521177/Observing%20the%20Style%20of%20Players%20for%20MajSoulStats.user.js
// @updateURL https://update.greasyfork.org/scripts/521177/Observing%20the%20Style%20of%20Players%20for%20MajSoulStats.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const currentURL = window.location.href;
    // 网站A功能
    if (currentURL.includes('amae-koromo.sapk.ch')) {
        // 风格判断
        const linkToURL = `https://yurakuurame.github.io/4ma-majang-type-check/`;

        // 插入按钮
        function insertButton() {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = '查看风格';
            setButtonStyle(button);

            // 点击事件
            button.addEventListener('click', handleButtonClick);

            // 获取插入位置
            const rankDistributionChart = document.getElementsByClassName('recharts-responsive-container')[1];
            if (rankDistributionChart) {
                let muiGridItem = rankDistributionChart.parentElement;
                if (muiGridItem) {
                    muiGridItem = muiGridItem.parentElement;
                    muiGridItem.appendChild(button);
                }
                else {
                    setTimeout(() => insertButton(), 100);
                }
            }
            else {
                setTimeout(() => insertButton(), 100);
            }
        }

        // 设置按钮样式
        function setButtonStyle(button) {
            button.style.display = 'flex';
            button.style.justifycontent = 'center';
            button.style.zIndex = '1000';
            button.style.padding = '10px';
            button.style.border = 'none';
            button.style.color = 'white';
            button.style.backgroundColor = '#7B64E8';
            button.style.cursor = 'pointer';
        }

        // 处理按钮点击事件
        function handleButtonClick() {
            const data = getStatsData();

            GM_setValue('dataForMajangType', data);
            const listValues = GM_listValues();
            console.log(listValues);

            // 跳转到 URL
            const newTab = GM_openInTab(linkToURL, { active: true });
        }

        // 获取牌谱屋的数据
        function getStatsData() {
            // 获取 Link 元素
            const muiStack = document.getElementsByClassName('MuiStack-root')[0];

            // 获取 Basic 页数据
            const linkBasic = muiStack.children[0];
            const basicData = getData(linkBasic);

            // 获取 Riichi 页数据
            const linkRiichi = muiStack.children[1];
            const riichiData = getData(linkRiichi);

            // 填入数据
            const result = {};
            const lang = document.documentElement.lang;
            if (lang === 'zh-hans') {
                result["horyuRate"] = basicData["和牌率"];      // 和率
                result["houjuRate"] = basicData["放铳率"];      // 铳率
                result["furoRate"] = basicData["副露率"];       // 副露率
                result["riichiRate"] = basicData["立直率"];     // 立直率
                result["damaRate"] = basicData["默胡率"];       // 默听率
                result["averageScore"] = basicData["平均打点"];     // 平均打点
                result["avgHoryuTurn"] = basicData["和了巡数"];     // 平均和了巡数
                result["avgHoujuScore"] = basicData["平均铳点"];    // 平均铳点
                result["ryukyokuRate"] = basicData["流听率"];       // 流听率
                result["riichiTurn"] = riichiData["立直巡目"];      // 立直巡目
                result["riichiFirstRate"] = riichiData["先制率"];   // 先制立直率
                result["riichiChaseRate"] = riichiData["追立率"];   // 追立率
            } else if (lang === 'en') {
                result["horyuRate"] = basicData["Win rate"];        // 和率
                result["houjuRate"] = basicData["Deal-in rate"];    // 铳率
                result["furoRate"] = basicData["Call rate"];        // 副露率
                result["riichiRate"] = basicData["Riichi rate"];    // 立直率
                result["damaRate"] = basicData["Dama rate"];        // 默听率
                result["averageScore"] = basicData["Average win score"];    // 平均打点
                result["avgHoryuTurn"] = basicData["Avg turns to win"];     // 平均和了巡数
                result["avgHoujuScore"] = basicData["Average deal-in score"];   // 平均铳点
                result["ryukyokuRate"] = basicData["Draw tenpai rate"];     // 流听率
                result["riichiTurn"] = riichiData["Avg riichi turns"];      // 立直巡目
                result["riichiFirstRate"] = riichiData["First riichi"];     // 先制立直率
                result["riichiChaseRate"] = riichiData["Chased rate"];      // 追立率
            }

            // 去掉末尾百分号
            Object.entries(result).forEach(([key, value]) => {
                result[key] = value = value.endsWith('%') ? value.slice(0, -1) : value;
            });

            return result;
        }

        function getData(link) {
            // 切换数据页
            link.click();

            // 获取数据标题元素
            const dataTitleElements = document.querySelectorAll('h6');
            const dataTitles = Array.from(dataTitleElements).map(element => element.textContent);

            // 获取数据元素，即数据标题元素的下一个元素
            const dataValues = Array.from(dataTitleElements).map(element => {
                const next = element.nextElementSibling;
                return next ? next.textContent : null;
            });

            const result = {};
            dataTitles.forEach((title, i) => {
                result[title] = dataValues[i];
            });

            return result;
        }

        // 等待页面加载完成后插入按钮
        window.addEventListener('load', insertButton);
    }

    if (currentURL.includes('yurakuurame.github.io')) {

        // 填入数据
        function inputData() {
            const data = GM_getValue('dataForMajangType', null);
            console.log(data);

            if (data) {
                Object.entries(data).forEach(([key, value]) => {
                    const inputLabel = document.getElementById(key);
                    inputLabel.value = value;
                });
                // 按下按钮
                const analyseButton = document.querySelector('button');
                analyseButton.click();
            }
            else {
                console.log("No Data");
            }
        }

        window.addEventListener('load', inputData);
    }
})();