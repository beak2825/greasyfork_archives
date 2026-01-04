// ==UserScript==
// @name         一网畅学自动看视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动看视频
// @author       趣味生煎
// @match        https://1906.usst.edu.cn/course/*
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/452845/%E4%B8%80%E7%BD%91%E7%95%85%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/452845/%E4%B8%80%E7%BD%91%E7%95%85%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

let auto_this=false

function addStyleSheet() {
    //以下是脚本本身所需的css样式，统一以c-开头，防止与原生样式产生冲突
    let style = `<style>
    .c-tobefinish-box{
        position: fixed;
        top: 5px;
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        z-index: 100;
    }
    .c-boxcenter{
        background-color: rgb(228, 228, 228);
        margin-top: 20px;
        width: 200px;
        height: 200px;
        overflow:auto;
        border: 1px solid black;
        border-radius: 5px;
        z-index: 101;
    }
    </style>`
    $($("link")[0]).before(style)
    //以下是引用的外部toastify-js所需的css
    let toastify = `<link rel="stylesheet"
    type="text/css"
    href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">`
    $($("link")[0]).before(toastify)
}

function addAutoButton() {//添加看视频按钮
    if (location.href.indexOf("full") != -1)
        return
    let button = `<li class="shared-resource autocollapse-item" id="i-auto-shua"><a class="header-item">看视频</a></li>`
    $($("div.layout-row")[0]).append(button)
    $("#i-auto-shua").click(function () {
        unfinishedNodes()
        addToFinishList()
    })
}

function addToFinishList() {
    let box = `<div class="c-tobefinish-box">
    <div class="c-boxcenter" id="c-boxcenter"></div>
    </div>`
    $($("div.header")[0]).after(box)
    let allUnfinished = loadUnfin()
    for (let i = 0; i < allUnfinished.length; i++) {
        let now = allUnfinished[i]
        $("#c-boxcenter").append(`<input class="c-box-checkbox" type="checkbox" value="${now}">${now}<br>`)
    }
    let originUnfined = $(".c-box-checkbox")
    for (let i = 0; i < originUnfined.length; i++) {
        let now = originUnfined[i]
        $(now).attr("checked", true)
    }
    $("#c-boxcenter").append(`<button id="c-start">确认</button>`)
    $("#c-start").click(function () {
        let originUnfined = $(".c-box-checkbox")
        let checkedUnfined = []
        for (let i = 0; i < originUnfined.length; i++) {
            let now = originUnfined[i]
            if ($(now).prop("checked") == true)
                checkedUnfined.push(now.value)
        }
        localStorage.unfin = JSON.stringify(checkedUnfined)
        $($(".c-tobefinish-box")[0]).remove()
        Toastify({
            text: "点击任意视频开始自动看视频",
            position: "left",
            duration: 5000
        }).showToast();
    })

}

function unfinishedNodes() {
    let nodes = $('div[ng-switch-when="online_video"]')
    let unfin = []
    for (let i = 0; i < nodes.length; i++) {
        if ($('div.activity-operations-container>div', nodes[i])[0].getAttribute('class').indexOf('full') == -1) {
            unfin.push($('div.activity-header>div>a', nodes[i])[0].innerText)
        }
    }
    console.log("@automate" + unfin)
    localStorage.unfin = JSON.stringify(unfin)
}

function loadUnfin() {
    return JSON.parse(localStorage.unfin)
}

function forChapters() {
    let set = new Set()
    let chapters = $('div.module-block>div.full-screen>ul>li');
    for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].querySelector('div').getAttribute('class').indexOf('is-expanded') == -1) {
            $('div>div.truncate-text', chapters[i]).click()
        }
        let nodes = $('ul.activity-list>li>div>div>i[original-title="音视频教材"]+a', chapters[i]) //视频链接dom列表
        for (let i = 0; i < nodes.length; i++) {
            if (window.coursetask.unfin.indexOf(nodes[i].innerText) != -1 && !set.has(nodes[i].innerText.strip())) {
                window.coursetask.tasks.push({
                    url: nodes[i],
                    title: nodes[i].innerText.strip()
                })
                set.add(nodes[i].innerText.strip())
            }
        }
    }
}


function execute(task) {
    task.url.click()
    let play = setInterval(() => {
        console.log("@automate" + "尝试开始播放")
        if ($('button.vjs-play-control')[0].getAttribute('title') == "Play")
            $('button.vjs-play-control')[0].click()
        if ($('div.online-video')[0].innerText == task.title && $('button.vjs-play-control')[0].getAttribute('title') != "Play") {
            clearInterval(play)
            console.log("@automate" + "开始播放")

            let duration = setInterval(() => {
                let durationTime = $('div.vjs-duration-display')[0].innerText.split('\n')[1]
                let currentTime = $('div.vjs-current-time')[0].innerText.split('\n')[1]
                console.log("@automate" + " " + currentTime + "/" + durationTime)
                if (currentTime == durationTime) {
                    clearInterval(duration)
                    console.log("@automate" + "完成：" + task.title)
                    window.coursetask.tasks = window.coursetask.tasks.slice(1)
                    window.coursetask.lock = false

                }
            }, 5000)
        }
    }, 5000)
}
window.onunload = (function () {
    if (auto_this)
        localStorage.setItem("正在看视频", false)
})
window.onload = (function () {
    'use strict';
    addStyleSheet()
    if (location.href.indexOf('learning-activity') == -1) {
        console.log("@automate" + "trying")
        addAutoButton()
    } else {
        console.log("status:"+localStorage.getItem("正在看视频"))
        if (localStorage.getItem("正在看视频")=="true")
            return
        else {
            localStorage.setItem("正在看视频", true)
            auto_this=true
            Toastify({
                text: "当前页面正在自动看视频",
                position: "right",
                duration: -1
            }).showToast();
            window.coursetask = {
                lock: false,
                tasks: [],
                unfin: null,
            }
            window.coursetask.unfin = loadUnfin()
            setInterval(() => {
                if (window.coursetask.lock == false && window.coursetask.tasks.length != 0) {
                    execute(window.coursetask.tasks[0])
                    window.coursetask.lock = true
                    console.log("@automate" + "执行:" + window.coursetask.tasks[0].title)
                }
            }, 3000)
            let check = setInterval(() => {
                forChapters()
                if (window.coursetask.tasks.length != 0) {
                    clearInterval(check);
                }
            }, 5000)
        }
    }
    // Your code here...
})();