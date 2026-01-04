// ==UserScript==
// @name         mcbbs 自动领取任务
// @version      0.9.3
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description  自动领取任务。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/396500/mcbbs%20%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/396500/mcbbs%20%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(async () => {
    const times = localStorage.getItem("autoapply")
    if (Math.round(new Date().getTime() / 1000) - times >= 60) {
        localStorage.setItem("autoapply", Math.round(new Date().getTime() / 1000))
    } else {
        return
    }
    const url = document.querySelector(`#user_info_menu a[href^="member.php?mod=logging"]`).href
    const key = new URL(url).searchParams.get("formhash")

    const taskList = ["39", "22", "40", "24", "55"]

    sign()
    async function sign() {
        taskList.forEach(task => run(key, task, "draw"))
        await new Promise(rs => setTimeout(rs, 1500))
        taskList.forEach(task => run(key, task, "apply"))
    }

    function run(key, task, type) {
        return fetch("home.php?mod=task&do=" + type + "&id=" + task + "&hash=" + key, { credentials: "same-origin" })
    }
}
)();

