// ==UserScript==
// @name         Deskry
// @namespace    meimeng
// @version      0.1
// @description  自动匹配发送信息
// @author       美梦
// @match        http://v2.ai1v1.com/*
// @icon         https://www.google.com/s2/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486354/Deskry.user.js
// @updateURL https://update.greasyfork.org/scripts/486354/Deskry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const autoReply = '你好'; // 这里填写匹配成功后，你要自动填充的句子

    function leave() {
        // 点击匹配按钮
        document.querySelector("#ButtonRandom").click();
        var breakButton = document.querySelector("#btn_random_break");
        var returnButton = document.querySelector("#btn_random_return");

        // 点击返回按钮
        if (returnButton.style.display !== "none") {
            returnButton.click();

            // 点击匹配按钮
            document.querySelector("#ButtonRandom").click();
        }

        // 点击离开按钮
        else if (breakButton.style.display !== "none") {
            breakButton.click();

            // 点击确定按钮
            document.querySelector("a.layui-layer-btn0").click();
        }
    }

    function sendMsg() {
        try {
            // 自动发信息
            var msgInput = document.querySelector("#inp_say");
            msgInput.value = autoReply;
            msgInput.innerHTML = autoReply;
            console.log(msgInput);
            msgInput.focus();
            // 创建一个新的 KeyboardEvent 对象
            document.querySelector("#btn_say").click();
        } catch (e) {}

        setTimeout((ev) => {
            var msgInput = document.querySelector("#msgInput");
            msgInput.value = autoReply;
            msgInput.innerHTML = autoReply;
        }, 1000);
    }

    let firstAuto = true;

    function init() {
        var UserList = Array.from(document.querySelectorAll('.nickname')).map(nickname => nickname.textContent.trim()); // 存储匹配到的女生的 tabText 的数组
        let matchedNicknames = []; // 存储匹配到的女性用户昵称
        if (matchedNicknames.length === 0) {
            // 如果匹配数组为空，将其赋值为 UserList 数组
            matchedNicknames = UserList;
        }
        setInterval(() => {
            const text = document.querySelector("#randomSelInfo").textContent;

            const nickname = text.substring(text.indexOf("对方昵称：") + 5, text.indexOf("对方性别：")).trim();
            const gender = text.substring(text.indexOf("对方性别：") + 5, text.indexOf("对方年龄：")).trim();

            if (gender === "女") {
                if (!matchedNicknames.includes(nickname)) {
                    // 如果当前昵称没有匹配过，将其加入匹配数组
                    matchedNicknames.push(nickname);
                } else {
                    // 如果当前昵称已经匹配过，触发 leave 事件
                    leave();
                }

                if (firstAuto) {
                    firstAuto = false;
                    sendMsg();
                }
            } else {
                firstAuto = true;
                // 男生或保密
                leave();
            }
        }, 1000);
    }

    setTimeout(init, 5000);
})();
