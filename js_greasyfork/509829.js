// ==UserScript==
// @name         煎蛋吐槽 Plus
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  煎蛋无聊图吐槽增强版
// @author       吐槽普拉斯
// @match        *://jandan.net/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/509829/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/509829/%E7%85%8E%E8%9B%8B%E5%90%90%E6%A7%BD%20Plus.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const key_hideXXOOCount = "key_hideXXOOCount";
    const key_tucaoBlockList = "key_tucaoUserBlockList"
    const option_hideXXOOCount = GM_getValue(key_hideXXOOCount, true);
    let list_tucaoUserBlockList = GM_getValue(key_tucaoBlockList, []);
    let hideXXOOOptionMenuId = undefined;

    function createSwitch(text, isOn, switchOn, switchOff) {
        let container = document.getElementById("tucao-plus-switches");
        if (!container) {
            container = document.createElement("div");
            container.id = "tucao-plus-switches";
        }
        container.appendChild(document.createTextNode(text));
        const switchLeft = document.createElement("span");
        switchLeft.innerText = "ON";
        switchLeft.classList.add("switch");
        const switchRight = document.createElement("span");
        switchRight.innerText = "OFF";
        switchRight.classList.add("switch");

        switchLeft.addEventListener("click", () => {
            if (switchLeft.classList.contains("switch-current")) {
                return;
            }
            switchLeft.classList.add("switch-current");
            switchRight.classList.remove("switch-current");

            if (typeof switchOn === "function") {
                switchOn();
            }
        });

        switchRight.addEventListener("click", () => {
            if (switchRight.classList.contains("switch-current")) {
                return;
            }
            switchLeft.classList.remove("switch-current");
            switchRight.classList.add("switch-current");

            if (typeof switchOff === "function") {
                switchOff();
            }
        });

        if (isOn) {
            switchLeft.classList.add("switch-current");
        } else {
            switchRight.classList.add("switch-current");
        }

        container.appendChild(switchLeft);
        container.appendChild(switchRight);

        const post = document.querySelector(".post");
        post.appendChild(container);
    }

    function blurXXOOCount() {
        const $ = unsafeWindow.$;
        $(".comment-like, .comment-unlike").click(function () {
            $(this).parents(".jandan-vote").addClass("voted");
        });

        function onClickHideXXOOOption(hide) {
            if (hide === undefined) {
                hide = !option_hideXXOOCount;
            }
            GM_setValue(key_hideXXOOCount, hide);
        }

        createSwitch("默认隐藏xxoo数: ", option_hideXXOOCount, () => onClickHideXXOOOption(true), () => onClickHideXXOOOption(false));

        GM_addValueChangeListener(key_hideXXOOCount, function (key, oldValue, newValue, remote) {
            //console.log("The value of the "" + key + "" key has changed from "" + oldValue + "" to "" + newValue + """);
            GM_unregisterMenuCommand(hideXXOOOptionMenuId);
            hideXXOOOptionMenuId = GM_registerMenuCommand(`默认隐藏xxoo数 ${newValue ? "⭕" : "❌"}`, onClickHideXXOOOption);

            GM_notification({ text: "设置已更改，点击刷新网页后生效", timeout: 3500, onclick: function () { location.reload(); } });
            //location.reload();
        });

        hideXXOOOptionMenuId = GM_registerMenuCommand(`默认隐藏xxoo数 ${option_hideXXOOCount ? "⭕" : "❌"}`, onClickHideXXOOOption);

        if (option_hideXXOOCount) {
            GM_addStyle(`
                .tucao-like-container span, .tucao-unlike-container span { filter: blur(3px); }
                .tucao-like-container span:hover, .tucao-unlike-container span:hover { animation: 0.2s ease-in-out 1s hovercomment forwards; }
                .voted .tucao-like-container span, .voted .tucao-unlike-container span {filter: unset;}
                @keyframes hovercomment {
                    from {
                        filter: blur(3px);
                    }
                    to {
                        filter: none;
                    }
                }
            `);
        }
    }

    function hideComments() {
        GM_addStyle(`
            .tucao-blocked div { display: none; }
            .tucao-blocked .unblock-content { display: flex; justify-content: space-between; padding: 0 10px; color: #c8c7cc;}
            .tucao-blocked .unblock-button { display: flex; cursor: pointer;}
        `);

        GM_registerMenuCommand(`清空吐槽屏蔽列表`, () => {
            list_tucaoUserBlockList = [];
            GM_setValue(key_tucaoBlockList, list_tucaoUserBlockList);
            GM_notification({ text: "吐槽屏蔽列表已清空，点击刷新网页后生效", timeout: 3500, onclick: function () { location.reload(); } });
        });

        const commentList = document.querySelector(".commentlist");

        const comments = [...commentList?.children];

        function unblockUser(author) {
            list_tucaoUserBlockList = list_tucaoUserBlockList.filter(elem => {
                return elem !== author;
            });

            GM_setValue(key_tucaoBlockList, list_tucaoUserBlockList);
        }

        function blockUser(author) {
            list_tucaoUserBlockList.push(author);

            GM_setValue(key_tucaoBlockList, list_tucaoUserBlockList);
        }

        function createBlockedContent(parent, author) {
            parent.classList.add("tucao-blocked");
            const blockContent = document.createElement("div");
            blockContent.classList.add("unblock-content");

            const msg = document.createTextNode("[已屏蔽]");

            blockContent.appendChild(msg);

            const unblock = document.createElement("div");
            unblock.classList.add("unblock-button");
            unblock.title = `取消屏蔽 ${author}`;
            unblock.textContent = "[x]";

            unblock.addEventListener("click", () => {
                unblockUser(author);
                parent.removeChild(blockContent);
                parent.classList.remove("tucao-blocked");

                //setTimeout(() => alert(`已取消对用户${author}吐槽的屏蔽，需要刷新来显示该用户的其他被屏蔽吐槽`), 0);
                GM_notification({ text: `已取消对用户${author}吐槽的屏蔽，点击刷新网页后显示该用户的其他被屏蔽吐槽`, timeout: 3500, onclick: function () { location.reload(); } });
            });

            blockContent.appendChild(unblock);

            parent.appendChild(blockContent);
        }

        function createBlockButton(row, author) {
            const voteRow = row.querySelector(".tucao-vote");
            const blockBtn = document.createElement("a");
            blockBtn.classList.add("block-button");
            blockBtn.title = `屏蔽 ${author}`;
            blockBtn.href = "javascript:;"
            blockBtn.textContent = "[x]";

            blockBtn.addEventListener("click", () => {
                blockUser(author);
                createBlockedContent(row, author);
            });

            voteRow.appendChild(blockBtn);
        }

        const onCommentChanged = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    if (mutation.target.classList.contains("jandan-tucao") && mutation.addedNodes.length > 0) {
                        const tucaoList = mutation.addedNodes[0];
                        if (tucaoList.classList.contains("tucao-hot") || tucaoList.classList.contains("tucao-list")) {
                            const tucaoRow = tucaoList.querySelectorAll(".tucao-row");
                            tucaoRow.forEach((row) => {
                                const author = row.querySelector(".tucao-author span").innerText;
                                if (!author) {
                                    return;
                                }
                                createBlockButton(row, author);
                                if (list_tucaoUserBlockList.includes(author)) {
                                    createBlockedContent(row, author);
                                }
                            });
                        }
                    }
                }
            }
        };

        const observer = new MutationObserver(onCommentChanged);
        const config = { attributes: false, childList: true, subtree: true };

        comments.forEach((comment) => {
            observer.observe(comment, config);
        });
    }

    blurXXOOCount();
    hideComments();
})();