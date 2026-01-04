
// ==UserScript==
// @name         妖火按钮替换
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  其他人用户操作的管理按钮替换成感谢，对资源帖发送感谢分享
// @author       yh翼城
// @match       *://yaohuo.me/bbs-*
// @match       *://www.yaohuo.me/bbs-*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502484/%E5%A6%96%E7%81%AB%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/502484/%E5%A6%96%E7%81%AB%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==


(function() {
    window.reply = function (txt) {
        //复用复读机函数,调用后直接填写内容
        let domTextarea = document.querySelector("textarea");
        domTextarea.value = txt;
        //点击回复按钮
        let domInput = document.querySelectorAll("input");
        for (let iii = domInput.length - 1; iii > 0; iii--) {
            if (domInput[iii].value == "快速回复") {
                domInput[iii].click();
            }
            if (domInput[iii].value == "发表回复") {
                domInput[iii].click();
            }
        }
    }
    // 替换文本并设置点击事件
    function replaceTextAndSend() {
        const thankYouMessages = ["感谢分享.", "谢谢分享.", "感谢分享", "谢谢分享", "感谢分享!", "谢谢分享!"];

        const louzhuxinxiDiv = document.querySelector('.louzhuxinxi.subtitle');
        if (louzhuxinxiDiv) {
            const managementButtons = louzhuxinxiDiv.querySelectorAll('a[href*="Book_View_admin"]');
            managementButtons.forEach(button => {
                button.href = "javascript:;";
                button.textContent = "感谢"; // 修改按钮文本
                button.onclick = function(event) {
                    event.preventDefault(); // 阻止默认行为
                    // 随机选个
                    const randomIndex = Math.floor(Math.random() * thankYouMessages.length);
                    const message = thankYouMessages[randomIndex];
                    window.reply(message);
                };
            });
        }
    }

    // 初始化
    function init() {
        // 获取隐藏字段的值
        const touserid = document.querySelector('input[name="touserid"]').value;
        const myuserid = document.querySelector('input[name="myuserid"]').value;

        // 只有当 touserid 和 myuserid 不同时才执行初始化
        if (touserid !== myuserid) {
            replaceTextAndSend();
        }
    }

    // 执行初始化
    init();
})();