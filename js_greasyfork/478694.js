// ==UserScript==
// @name         Pojie52_TimeDown
// @namespace    Pojie52_TimeDown
// @version      1.3
// @description  吾爱破解回帖倒计时
// @author       Pwnint32
// @match        https://www.52pojie.cn/thread*
// @include      https://www.52pojie.cn/forum.php?mod=viewthread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/478694/Pojie52_TimeDown.user.js
// @updateURL https://update.greasyfork.org/scripts/478694/Pojie52_TimeDown.meta.js
// ==/UserScript==

var PostLimitTime = 40;
var PostLimitEndTime = 0;

// 对回帖下方的头像处插入提示节点
function addTimeLabel() {
    var replyAvatar = document.querySelector('.avatar.avtm');

    if (replyAvatar) {
        GM_addElement(
            replyAvatar,
            "div", {
                class: "avatar avtm",
                id: "timeDown",
                style: "text-align:center;font-size:16px;color:red",
                textContent: "允许回帖"
            }
        );
    }
}

function injectReplySubmit() {
    var fastSubmit = document.querySelector("#fastpostsubmit");
    var postSubmit = document.querySelector("#postsubmit");
    var timeDown = document.querySelector("#timeDown");

    if (fastSubmit) {
        fastSubmit.onclick = function () {

            if (timeDown && timeDown.textContent == "允许回帖") {
                PostLimitTime = 40;
                // 设置倒计时
                var interval_fast_click = setInterval(function () {
                    if (PostLimitTime > 0) {
                        timeDown.textContent = "剩余：" + PostLimitTime + "秒";
                        PostLimitTime--;
                    } else {
                        clearInterval(interval_fast_click); // 停止倒计时
                        timeDown.textContent = "允许回帖";
                    }
                }, 1000); // 每秒更新一次
            }

        };

        if (event.ctrlKey && event.keyCode == 13) {

            if (timeDown && timeDown.textContent == "允许回帖") {
                PostLimitTime = 40;
                // 设置倒计时
                var interval_fast_event = setInterval(function () {
                    if (PostLimitTime > 0) {
                        timeDown.textContent = "剩余：" + PostLimitTime + "秒";
                        PostLimitTime--;
                    } else {
                        clearInterval(interval_fast_event); // 停止倒计时
                        timeDown.textContent = "允许回帖";
                    }
                }, 1000); // 每秒更新一次
            }
        }
    }

    if (postSubmit) {
        postSubmit.onclick = function () {
            if (timeDown && timeDown.textContent == "允许回帖") {
                PostLimitTime = 40;
                // 设置倒计时
                var interval_post_click = setInterval(function () {
                    if (PostLimitTime > 0) {
                        timeDown.textContent = "剩余：" + PostLimitTime + "秒";
                        PostLimitTime--;
                    } else {
                        clearInterval(interval_post_click); // 停止倒计时
                        timeDown.textContent = "允许回帖";
                    }
                }, 1000); // 每秒更新一次
            }
        };
        if (event.ctrlKey && event.keyCode == 13) {

            if (timeDown && timeDown.textContent == "允许回帖") {
                PostLimitTime = 40;
                // 设置倒计时
                var interval_post_event = setInterval(function () {
                    if (PostLimitTime > 0) {
                        timeDown.textContent = "剩余：" + PostLimitTime + "秒";
                        PostLimitTime--;
                    } else {
                        clearInterval(interval_post_event); // 停止倒计时
                        timeDown.textContent = "允许回帖";
                    }
                }, 1000); // 每秒更新一次
            }
        }
    }
}

addTimeLabel();

setInterval(injectReplySubmit, 1000)