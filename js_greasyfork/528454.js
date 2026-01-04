// ==UserScript==
// @name         B站个人主页快捷举报按钮
// @namespace    http://tampermonkey.net/
// @version      2025-11-30-2
// @description  小工具罢了，个人页面无需点进视频即可举报
// @author       w0r1dtr33
// @match        *://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528454/B%E7%AB%99%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E4%B8%BE%E6%8A%A5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/528454/B%E7%AB%99%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%BF%AB%E6%8D%B7%E4%B8%BE%E6%8A%A5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("脚本正常启动");

    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;
    const MAX_AID = 1n << 51n;
    const BASE = 58n;
    const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const baseurl = "https://www.bilibili.com/appeal/?avid=";

    const buttonHTML = `
    <a data-v-b44de5b8="" class="nav-tab__item appeal">
        <svg data-v-34aec60a="" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="video-complaint-icon video-toolbar-item-icon">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.40194 3.75C10.5566 1.74999 13.4434 1.75001 14.5981 3.75L21.7428 16.125C22.8975 18.125 21.4541 20.625 19.1447 20.625H4.8553C2.5459 20.625 1.10253 18.125 2.25723 16.125L9.40194 3.75ZM12.866 4.75C12.4811 4.08333 11.5189 4.08333 11.134 4.75L3.98928 17.125C3.60438 17.7917 4.08551 18.625 4.8553 18.625H19.1447C19.9145 18.625 20.3957 17.7917 20.0108 17.125L12.866 4.75Z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C12.4142 8 12.75 8.33579 12.75 8.75V13.75C12.75 14.1642 12.4142 14.5 12 14.5C11.5858 14.5 11.25 14.1642 11.25 13.75V8.75C11.25 8.33579 11.5858 8 12 8Z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.5C12.4142 15.5 12.75 15.8358 12.75 16.25V16.75C12.75 17.1642 12.4142 17.5 12 17.5C11.5858 17.5 11.25 17.1642 11.25 16.75V16.25C11.25 15.8358 11.5858 15.5 12 15.5Z"></path>
        </svg>
        <span data-v-b44de5b8="" class="nav-tab__item-text">快捷举报</span>
    </a>`;

    const buttonElement = document.createElement("div");
    buttonElement.innerHTML = buttonHTML;
    const buttonNode = buttonElement.firstElementChild

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            const observer = new MutationObserver(function () {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    waitForElement(".nav-tab").then((targetElement) => {
        targetElement.appendChild(buttonNode);
        const button = document.querySelector('appeal');
        buttonNode.style.display = "inline-flex";
        buttonNode.style.alignItems = "center";
        buttonNode.style.gap = "4px";
        buttonNode.style.padding = "0 16px";   // 左右留距
        buttonNode.style.background = "transparent";
        buttonNode.style.userSelect = "none";
        buttonNode.style.cursor = "pointer";
        buttonNode.onclick = function () {
            const existingElement = document.querySelector('.appeal_button');
            if (!existingElement) {
                appendButtons();
            } else {
                console.log("相同内容已存在，不再重复生成");
            }
        };
    });

    function appendButtons() {
        const el = document.getElementsByClassName("bili-video-card__wrap");
        if (el.length > 0) {
            console.log("元素已加载，长度为:", el.length);
        }
        const button = document.createElement("button");
        button.className = "appeal_button";
        button.textContent = "举报";
        button.style.height = "25px";
        button.style.backgroundColor = "#00AEEC";
        button.style.cursor = "pointer";

        for (let i = 0; i < el.length; i++) {
            const clonedButton = button.cloneNode(true);
            el[i].appendChild(clonedButton);
            clonedButton.onclick = function () {
                execute(clonedButton);
            };
        }
    }

    function bv2av(bvid) {
        if (!bvid) {
            console.error("无效的 BVID");
            return null;
        }

        const bvidArr = Array.from(bvid);
        [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
        [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
        bvidArr.splice(0, 3);

        const tmp = bvidArr.reduce((pre, bvidChar) => {
            const index = data.indexOf(bvidChar);
            if (index === -1) {
                console.error("BVID 包含无效字符:", bvidChar);
                return pre;
            }
            return pre * BASE + BigInt(index);
        }, 0n);

        return Number((tmp & MASK_CODE) ^ XOR_CODE);
    }

    function execute(event) {

        const biliCoverCard = event.parentNode.querySelector(".bili-cover-card");
        const href = biliCoverCard ? biliCoverCard.href : null;

        if (!href) {
            console.log("无法获取视频链接！");
            return;
        }

        const avid = bv2av(href.split("/")[4]);
        if (!avid) {
            console.error("无法解析 AVID");
            return;
        }

        const appealurl = baseurl + avid;
        appeal(appealurl);
    }

    function appeal(appealurl) {
        openPopup(appealurl);
    }

    function openPopup(url) {
        const width = 800;
        const height = 600;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);

        const options = `
            width=${width},
            height=${height},
            left=${left},
            top=${top},
            resizable=yes,
            scrollbars=yes,
            status=yes
        `;

        const popup = window.open(url, "PopupWindow", options);
        if (!popup) {
            console.log("Pop-up blocked. Please allow pop-ups for this site.");
        }
    }
})();