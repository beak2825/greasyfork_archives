// ==UserScript==
// @name         PKU_bbs_hidden_user_info
// @namespace    PKU_bbs_hidden_user_info
// @version      0.1
// @license      MIT
// @description  hide/show user-info icon in PKU_bbs, when hit the button.
// @author       BBSer
// @match        https://bbs.pku.edu.cn/v2/*
// @icon         https://bbs.pku.edu.cn/v2/images/logo.jpg
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/473335/PKU_bbs_hidden_user_info.user.js
// @updateURL https://update.greasyfork.org/scripts/473335/PKU_bbs_hidden_user_info.meta.js
// ==/UserScript==

//添加一个按钮到nav标签中，点击按钮隐藏id="user_info"的div标签，再次点击重新显示
(function () {
    // 查询上次的隐藏状态，避免刷新网页后需要重新点击隐藏按钮的问题
    var hidden_user_info_state = GM_getValue("hidden_user_info_state", false)

    var nav = document.querySelector("#left-nav")
    var user_info = document.querySelector("#user-info")

    // 创建一个button，用div节点包裹，设置button的onclick事件
    var btn_div = document.createElement("div")
    btn_div.setAttribute("align", "center") // 居中显示
    var btn = document.createElement("button")

    // 设置显示样式
    btn.style.cssText += "margin-top: 10px; margin-bottom: 10px; border-radius: 10px; padding: 5px 10px;" // 把btn放在btn_div的中间，上下留一点空隙
    btn_div.style.cssText += "background-color: #3D474B;border-top-style: solid;border-top-width: 1px;"
    btn.innerHTML = hidden_user_info_state ? "显示用户信息" : "隐藏用户信息";
    user_info.style.display = hidden_user_info_state ? "none" : ""

    // 添加按钮事件
    btn.onclick = function () {
        hidden_user_info_state = !hidden_user_info_state
        GM_setValue("hidden_user_info_state", hidden_user_info_state)

        user_info.style.display = hidden_user_info_state ? "none" : ""
        btn.innerHTML = hidden_user_info_state ? "显示用户信息" : "隐藏用户信息";
    }

    // 将button节点添加到user_info的后面
    btn_div.appendChild(btn)
    nav.insertBefore(btn_div, user_info.nextElementSibling)
})()
