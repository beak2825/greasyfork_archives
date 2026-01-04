// ==UserScript==
// @name         学习通一键讨论
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  学习通一键复制最近的一条评论进行回复，需要当前页保持在讨论页，在屏幕右方会出现按钮
// @author       Circle
// @match        https://mooc1-2.chaoxing.com/bbscircle/grouptopic*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456210/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456210/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%80%E9%94%AE%E8%AE%A8%E8%AE%BA.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const body = document.querySelector("body")
    const btn = document.createElement("button")
    btn.onclick = allComment
    btn.style.padding = "10px"
    btn.style.backgroundColor = "skyblue"
    btn.style.position = "fixed"
    btn.style.right = "100px"
    btn.style.top = "400px"
    btn.textContent = "一键回复"
    body.appendChild(btn)
    async function allComment() {
        console.log("1111")
        const name = document.querySelector(".zt_u_name").textContent
        const commentDoms = document.querySelectorAll("#showTopics .content1118 .oneDiv")
        for (let i = 0; i < commentDoms.length; i++) {
            if (commentDoms[i].innerHTML.indexOf(name) === -1) {
                const comment = commentDoms[i].querySelector(".hf_pct").textContent
                const replyBtn = commentDoms[i].querySelector(".clearfix .tl1")
                replyBtn.click()
                let textarea = commentDoms[i].querySelector(".plDiv textarea")
                while (!textarea) {
                    textarea = commentDoms[i].querySelector(".plDiv textarea")
                }
                textarea.value = comment
                const uploadBtn = commentDoms[i].querySelector(".plDiv grenBtn")
                uploadBtn.click()
                await new Promise((re) => {
                    setTimeout(() => { re() }, 200)
                })
                console.log(comment, replyBtn)
            }
        }
    }
})();