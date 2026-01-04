// ==UserScript==
// @name         Del Confirm
// @version      2.0
// @license      MIT
// @description  删除仓库自动填写库名，支持 github、gitee
// @author       Morning Start
// @match        https://gitee.com/*
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.com
// @namespace https://greasyfork.org/users/803002
// @downloadURL https://update.greasyfork.org/scripts/473128/Del%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/473128/Del%20Confirm.meta.js
// ==/UserScript==

(function () {
    ("use strict");
    const currentURL = window.location.href;

    if (currentURL.includes("gitee.com")) {
        giteeConfirm();
    } else if (currentURL.includes("github.com")) {
        githubConfirm();
    }
})();

function githubConfirm() {
    let del_btn = document.querySelector("#dialog-show-repo-delete-menu-dialog");

    del_btn.addEventListener("click", function () {
        const intervalId = setInterval(() => {
            const targetButton = document.getElementById('repo-delete-proceed-button');
            if (targetButton) {
                // 若元素存在，点击该按钮
                targetButton.click();
                const button3 = document.getElementById('repo-delete-proceed-button');
                const intervalCheck = setInterval(() => {
                    if (button3.querySelector('.Button-label').textContent ==="Delete this repository") {
                        // 清除定时器，停止检查
                        clearInterval(intervalId);
                        clearInterval(intervalCheck);
                        // 若按钮已禁用，解除禁用
                        button3.disabled = false;
                        // 填写库名
                        let warp= document.querySelector('#repo-delete-proceed-button-container')
                        let text=warp.querySelector('.FormControl-label')
                        let input = warp.querySelector('#verification_field')
                        const regex = /"([^"]*)"/;
                        const match = text.textContent.match(regex);
                        input.value=match[1]
                    }
                }, 200);
            }
        }, 500);
        // console.log("button1");


    });
}

function giteeConfirm() {
    let del_btn = document.querySelector(".del-pro-btn");
    del_btn.addEventListener("click", function () {
        let wrap = document.querySelector(".del-or-clear-target-wrap");
        wrap.querySelector(".ok").className = "ui button orange ok";
        let text = wrap.querySelector(".highlight-black");
        let input = wrap.querySelector("#path_with_namespace");
        input.value = text.textContent;
    });
}
