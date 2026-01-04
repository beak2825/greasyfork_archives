// ==UserScript==
// @name         编程猫黑名单系统
// @namespace    https://shequ.codemao.cn/user/3348695
// @version      0.1
// @description  bcm各种恶心的傻逼用户的屏蔽器
// @author       鱼丶
// @match        *://shequ.codemao.cn/*
// @icon         https://static.codemao.cn/coco/player/unstable/B1F3qc2Hj.image/svg+xml?hash=FlHXde3J3HLj1PtOWGgeN9fhcba3
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470427/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%BB%91%E5%90%8D%E5%8D%95%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/470427/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%BB%91%E5%90%8D%E5%8D%95%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

// bcm用户黑名单系统，妈妈再也不用担心我看到恶心的用户对我造成困扰啦
// 功能：1.不接受用户对自己发送的消息的提醒
// 2.屏蔽拉黑用户主页
setTimeout(() => {
    // 黑名单基础操作
    class blacklistBehavior {
        "use strict";
        constructor(userid, blacklist) {
            this.userid = userid
            this.blacklist = blacklist
        }
        add() {
            if (this.userid == 3348695) {
                alert("想屏蔽插件作者？你在想什么？")
            } else {
                this.blacklist.push(this.userid)
                this.blacklist.push(this.userid + "/")
                this.blacklist.push(this.userid + "/project")
                this.blacklist.push(this.userid + "/collect")
            }
        }
        delete() {
            if (localStorage.getItem("ydBcmBlackList")) {
                alert("你未加入任何人进入黑名单")
            } else {
                let tempList = JSON.parse(localStorage.getItem("ydBcmBlacklist"))
                let index = tempList.indexOf(this.userid)
                if (index == -1) { alert("黑名单中没有此用户") } else {
                    this.blacklist.splice(index, 1)
                    this.blacklist.splice(tempList.indexOf(this.userid + "/"), 1)
                    this.blacklist.splice(tempList.indexOf(this.userid + "/project"), 1)
                    this.blacklist.splice(tempList.indexOf(this.userid + "/collect"), 1)
                }
            }
        }
        clear() { this.blacklist = [] }
        getStC() {
            if (!(localStorage.getItem("ydBcmBlacklist") == "undefined") || (localStorage.getItem("ydBcmBlacklist") == "")) {
                if (JSON.parse(localStorage.getItem("ydBcmBlacklist")).indexOf(this.userid) == -1) {
                    return false
                } return true
            }
        }
        save() {
            const arrayString = JSON.stringify(this.blacklist)
            localStorage.setItem("ydBcmBlacklist", arrayString)
        }
    }

    // 当前页面用户id获取
    function userid() {
        if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
            return window.location.href.slice(30, window.location.href.length)
        }
    }

    // 初始化
    if ((localStorage.getItem("ydBcmBlacklist") == "undefined") || (localStorage.getItem("ydBcmBlacklist") == "")) {
        var blacklist = []
        localStorage.setItem("ydBcmBlacklist", "")
    } else { var blacklist = JSON.parse(localStorage.getItem("ydBcmBlacklist")) }
    if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
        const bhv = new blacklistBehavior(userid(), blacklist)
        bhv.save()
    }

    // 判断是否为自己主页
    if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
        const tell = document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button > span.r-user-c-banner--core")
        if (!(tell.innerHTML == "编辑")) {
            const element = document.createElement("div")
            element.id = "yd-b-btn"
            element.classList.add("r-user-c-banner--btn", "r-user-c-banner--unattention")
            element.style.marginLeft = "20px"
            document.querySelector(".r-user-c-banner--right-box").style.display = "flex"
            document.querySelector(".r-user-c-banner--right-box").style.flexDirection = "row"
            document.querySelector(".r-user-c-banner--right-box").appendChild(element)
            const span = document.createElement("span")
            span.innerHTML = "黑名单"
            span.style.display = "inline-block"
            document.querySelector("#yd-b-btn").appendChild(span)
        } else {
            const element = document.createElement("div")
            element.id = "yd-b-btn-m"
            element.classList.add("r-user-c-banner--btn", "r-user-c-banner--unattention")
            element.style.marginLeft = "20px"
            document.querySelector(".r-user-c-banner--right-box").style.display = "flex"
            document.querySelector(".r-user-c-banner--right-box").style.flexDirection = "row"
            document.querySelector(".r-user-c-banner--right-box").appendChild(element)
            const span = document.createElement("span")
            span.innerHTML = "管理黑名单"
            span.style.display = "inline-block"
            document.querySelector("#yd-b-btn-m").appendChild(span)
            const board = document.createElement("div")
            board.style.cssText = "display: flex; width: 400px; height: 600px;"
        }
    }

    // 按钮点击后黑名单操作
    if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
        const bhv = new blacklistBehavior(userid(), blacklist)
        if (!(document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button > span.r-user-c-banner--core").innerHTML == "编辑")) {
            document.querySelector("#yd-b-btn").addEventListener("click", () => {
                if (bhv.getStC()) { bhv.delete() } else { bhv.add() }
                bhv.save()
            })
        } else {
            document.querySelector("#yd-b-btn-m").addEventListener("click", () => {
                if (confirm("确定清空你的黑名单？你将失去一切黑名单中的信息")) {
                    if (confirm("真的确定吗？这是你最后一次反悔的机会！")) {
                        bhv.clear()
                        bhv.save()
                        alert("清空完毕！一切怨恨在此刻了结啦~")
                    }
                }
            })
        }
    }

    // 显示文字判定
    setInterval(() => {
        if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
            const bhv = new blacklistBehavior(userid(), blacklist)
            if (!(document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button > span.r-user-c-banner--core").innerHTML == "编辑")) {
                const getLable = document.querySelector("#yd-b-btn")
                if (bhv.getStC()) {
                    getLable.innerHTML = "移除黑名单"
                } else {
                    getLable.innerHTML = "加入黑名单"
                }
            }
        }
    }, 100)

    // 主页黑名单管理


    // 黑名单中用户主页屏蔽适配
    if (window.location.href.slice(0, 30) == "https://shequ.codemao.cn/user/") {
        const bhv = new blacklistBehavior(userid(), blacklist)
        if (bhv.getStC()) {
            if ((window.location.href.slice(30, window.location.href.length).split("/").length == 1) || (window.location.href.slice(30, window.location.href.length).split("/").indexOf("") == 1)) {
                // 右
                // projectCollectCard
                const pCC = document.querySelectorAll(".r-user-r-main--card-list")
                pCC.forEach((item) => {
                    if (!(item == null)) {
                        item.style.display = "none"
                    }
                })
                // emptyCollect, emptyProject
                const empC = document.querySelector(".r-user-c-empty--collect")
                const empP = document.querySelector(".r-user-c-empty--project")
                if (!(empC == null)) {
                    empC.style.display = "none"
                }
                if (!(empP == null)) {
                    empP.style.display = "none"
                }
                // attention, fans
                const att = document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user--user-contarner > div > div.r-user-c-body--body > div > div > div:nth-child(3) > div.r-user-r-main--person-list")
                const fan = document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user--user-contarner > div > div.r-user-c-body--body > div > div > div:nth-child(4) > div.r-user-r-main--person-list")
                if (!(att == null)) {
                    att.style.display = "none"
                }
                if (!(fan == null)) {
                    fan.style.display = "none"
                }
                const empAtt = document.querySelector(".r-user-c-empty--attention")
                const empFan = document.querySelector(".r-user-c-empty--fans")
                if (!(empAtt == null)) {
                    empAtt.style.display = "none"
                }
                if (!(empFan == null)) {
                    empFan.style.display = "none"
                }
                document.querySelectorAll(".r-user-c-nav-bar--bar").forEach((item) => {
                    item.style.display = "none"
                });
                // 左
                document.querySelector(".r-user-c-slide-panel--top").style.display = "none"
                document.querySelector(".r-user-c-slide-panel--middle").style.display = "none"
                document.querySelector(".r-user-c-button-panel--bottom").style.display = "none"
                // 上
                document.querySelector(".r-user-c-banner--nav-box").style.display = "none"
                // 头
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").setAttribute("src", "")
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").style.zIndex = "999999"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center").style.backgroundImage = 'url("https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png")'
                document.querySelector(".r-user-c-banner--name").innerHTML = "已拉黑用户"
                document.querySelector(".r-user-c-banner--des").innerHTML = " "
                document.querySelector(".r-user-c-tooltips--tooltip").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--info.r-user-c-banner--flex-box.r-user-c-banner--col-box > div > div > i").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button").style.display = "none"
            } else if (window.location.href.slice(30, window.location.href.length).split("/").indexOf("project") == 1) {
                // 右
                document.querySelector(".r-user--user-contarner").style.display = "none"
                // 上
                document.querySelector(".r-user-c-banner--nav-box").style.display = "none"
                // 头
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").setAttribute("src", "")
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").style.zIndex = "999999"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center").style.backgroundImage = 'url("https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png")'
                document.querySelector(".r-user-c-banner--name").innerHTML = "已拉黑用户"
                document.querySelector(".r-user-c-banner--des").innerHTML = " "
                document.querySelector(".r-user-c-tooltips--tooltip").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--info.r-user-c-banner--flex-box.r-user-c-banner--col-box > div > div > i").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button").style.display = "none"
            } else if (window.location.href.slice(30, window.location.href.length).split("/").indexOf("collect") == 1) {
                // 右
                document.querySelector(".r-user--user-contarner").style.display = "none"
                // 上
                document.querySelector(".r-user-c-banner--nav-box").style.display = "none"
                // 头
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").setAttribute("src", "")
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--photo.r-user-c-banner--flex-box.r-user-c-banner--row-center.r-user-c-banner--col-center > img").style.zIndex = "999999"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center").style.backgroundImage = 'url("https://cdn-community.codemao.cn/community_frontend/asset/banner_65b4a.png")'
                document.querySelector(".r-user-c-banner--name").innerHTML = "已拉黑用户"
                document.querySelector(".r-user-c-banner--des").innerHTML = " "
                document.querySelector(".r-user-c-tooltips--tooltip").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--left-box > div.r-user-c-banner--info.r-user-c-banner--flex-box.r-user-c-banner--col-box > div > div > i").style.display = "none"
                document.querySelector("#root > div > div.r-index--main_cont > div > div.r-user-c-banner--banner > div.r-user-c-banner--background.r-user-c-banner--flex-box.r-user-c-banner--row-center > div > div.r-user-c-banner--right-box > button").style.display = "none"
            } else {
                console.log("------------------------------------------------------------------------------------------------------------------------------竟然被你翻到了------------------------------------------------------------------------------------------------------------------------------")
                console.log("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------就作为一个彩蛋送给作为鱼的粉的你吧~鱼真名缩写dxr（小声------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            }
        }
    }
}, 2200)