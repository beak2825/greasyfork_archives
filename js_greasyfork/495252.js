// ==UserScript==
// @name         Bilibili哔哩哔哩快捷复制视频链接
// @namespace    http://tampermonkey.net/
// @description  快速复制bilibili 用户空间的视频列表视频链接, 配合JJDown 友好使用
// @author       You
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @version 1.0.6
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495252/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/495252/Bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function () {
    "use strict";
    let count = 0;
    const observer = new MutationObserver(function () {
        // do you work here
        console.log("page changed detect!")
        run()
    });
    function disconnect() {
        observer.disconnect()
    }
    function observe() {
        observer.observe(document.body, { subtree: true, childList: true });
    }

    function checkLoaded() {
        // 超过30次检测还没有就不要检测了
        if (count >= 30) {
            console.error(
                "Bilibili哔哩哔哩快捷复制视频链接\n 未检测到目标元素！已停止检测"
            );
            return;
        }

        const titles = document.querySelectorAll("a.title");
        count++;
        if (titles.length === 0) {
            setTimeout(() => {
                checkLoaded();
                console.log(
                    `Bilibili哔哩哔哩快捷复制视频链接\n:check if dom mounted...${count}times`
                );
            }, 400);
        } else {
            observe();
        }
    }

    function run() {
        disconnect()
        const titles = document.querySelectorAll("a.title");
        const copyInitText = "(👉ﾟヮﾟ)👉 Click To Copy ~";
        const successText = "Copy Success 🥦⭕";
        const failText = "Copy Fail 🍓❌";
        titles.forEach((title) => {
            if (!title.parentNode.querySelector("span.cp-btn")) {
                title.parentNode.insertBefore(
                    (() => {
                        const span = document.createElement("span");
                        span.className = 'cp-btn'
                        span.style = `
      font-size: 10px;
      padding: 0 6px;
      margin: 2px 0;
      border-radius: 6px;
      display: inline-block;
      background-color: #000;
      color: rgb(251, 114, 153);
      cursor: pointer;
      position:absolute;
  `;
                        title.style.marginTop = "20px";
                        span.title = title.href;
                        span.textContent = copyInitText;
                        span.addEventListener("click", () => {
                            copyTextToClipboard(span.title).then((success) => {
                                disconnect()
                                if (success) {
                                    span.textContent = successText;
                                    span.style.color = "#00d2a5";
                                } else {
                                    span.textContent = failText;
                                    span.style.color = "#ff0049";
                                }
                                const timer = setTimeout(() => {
                                    span.textContent = copyInitText;
                                    span.style.color = "#fb7299";
                                    clearTimeout(timer);
                                    observe()
                                }, 1000);
                            });
                        });
                        return span;
                    })(),
                    title
                );
            }

        });

        async function copyTextToClipboard(text) {
            return new Promise((resolve, reject) => {
                if (!navigator.clipboard) {
                    console.log("Clipboard API not available");
                    resolve(false);
                }
                navigator.clipboard
                    .writeText(text)
                    .then(function () {
                        console.log("Text copied to clipboard");
                        resolve(true);
                    })
                    .catch(function (err) {
                        resolve(false);
                        console.error("Could not copy text: ", err);
                    });
            });
        }

        observe()

    }

    checkLoaded();
    /*
    navigation.addEventListener("navigate", () => {
      console.log("page changed");
      count=0
  
      setTimeout(checkLoaded,1500)
    });
    */
})();