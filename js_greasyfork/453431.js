// ==UserScript==
// @name         i-am-healthy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Go finish your contests
// @author       EthanLuu
// @match        http://jy.anquanjy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anquanjy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453431/i-am-healthy.user.js
// @updateURL https://update.greasyfork.org/scripts/453431/i-am-healthy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const getResMap = async () => {
        const response = await fetch(
            "https://cdn.ethanloo.cn/2022-nju-health-contest-answers.json"
        );
        const data = await response.json();
        const map = new Map();
        for (let item of data) {
            map.set(item.timu_title, item.timu_daan);
        }
        return map;
    };

    const getQuestion = (id) => {
        const titleElement = document.querySelectorAll(".title")[id - 1];
        const content = titleElement.textContent;
        return content.slice(content.indexOf("、") + 1);
    };

    const findAndClick = (id, res) => {
        const buttonList = document
                .querySelector(".swiper-wrapper")
                .children[id - 1].querySelector("ul");
        if (["对", "错"].includes(res)) {
            // 判断题
            const rightButton = buttonList.children[res === "对" ? 0 : 1].querySelector("input");
            rightButton.click();
        } else if (res.length > 1){
            // 多选题
            for (let j = 0; j < res.length; j++) {
                const rightButton =
                    buttonList.children[res[j].charCodeAt() - "A".charCodeAt()].querySelector("input");
                rightButton.click();
            }
        } else {
            // 单选题
            const rightButton =
                buttonList.children[res.charCodeAt() - "A".charCodeAt()].querySelector("input");
            rightButton.click();
        }
    };

    const goToNext = () => {
        const button = document.querySelector("[aria-label='Next slide']");
        button.click();
    };

    const alertUnknowns = (ids) => {
        const elem = document.createElement("div");
        elem.innerText = "没有找到答案的问题：" + JSON.stringify(ids);
        elem.style =
            "font-size: 18px; z-index: 999; position: fixed; padding: 3px 6px; border: 1px solid #aaa; left: 24px; top: 64px; background: #fff; color: #000; display: flex; justify-content: center; align-items: center;";
        document.body.appendChild(elem);
        alert("存在题库中未找到答案的题目，请自行确认！")
    };

    const start = async () => {
        const resMap = await getResMap();
        const unknwonIds = [];
        for (let i = 1; i <= 90; i++) {
            const question = getQuestion(i);
            // Find the answer
            const res = resMap.get(question);
            if (!res) {
                console.log(question, res, resMap.get(question));
                unknwonIds.push(i);
                goToNext();
                continue;
            }
            // Click the answer button
            findAndClick(i, res);
            // Sleep 1 second
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
            // Go to next question
            goToNext();
        }
        alertUnknowns(unknwonIds);
    };

    const insertStartBuutton = () => {
        const button = document.createElement("button");
        button.innerText = "在进入比赛后点我";
        button.style =
            "font-size: 18px; z-index: 999; position: fixed; padding: 6px 12px; left: 24px; bottom: 64px; background: #fff; color: #000; display: flex; justify-content: center; align-items: center;";
        button.onclick = () => start();
        document.body.appendChild(button);
    };

    insertStartBuutton();
})();
