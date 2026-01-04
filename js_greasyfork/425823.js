// ==UserScript==
// @name         自动抢批
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to autorun the world!
// @author       You
// @match        https://festival-task.codemao.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425823/%E8%87%AA%E5%8A%A8%E6%8A%A2%E6%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/425823/%E8%87%AA%E5%8A%A8%E6%8A%A2%E6%89%B9.meta.js
// ==/UserScript==

(async function() {
    'use strict'
    // 定义全局变量
    var runSwitch = true

    // 防止刷新频率过高
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    function createButton(eleName, text, attrs, isLoading) {
        let ele = document.createElement(eleName)
        const btnStyle = '-webkit-text-size-adjust: 100%;\
    -webkit-font-smoothing: antialiased;\
    font-family: sans-serif;\
    overflow: visible;\
    text-transform: none;\
    -webkit-user-select: none;\
    display: inline-block;\
    line-height: 1;\
    white-space: nowrap;\
    cursor: pointer;\
    background: #fff;\
    border: 1px solid #dcdfe6;\
    color: #e515d2;\
    text-align: center;\
    box-sizing: border-box;\
    outline: 0;\
    margin-left: 30px;\
    transition: .1s;\
    font-weight: 500;\
    font-size: 14px;\
    -webkit-appearance: button;\
    border-radius: 20px;\
    padding: 12px 23px;'
        for(let i in attrs) {
            ele.setAttribute(i, attrs[i])

        }
        ele.setAttribute('style', btnStyle)

        if(isLoading) {
            const l = document.createElement("i")
            l.setAttribute('class', 'el-icon-loading')
            ele.append(l)
            const s = document.createElement("span")
            s.innerText = text
            ele.append(s)
        } else {
            const s = document.createElement("span")
            s.innerText = text
            ele.append(s)
        }
        return ele
    }


    // 页面刷新循环
    async function main(){
        let btn = await makeBtnAlwaysOnline(runSwitch, "ziqp", "自动点击中...","开始监控", btnSwitch)
        //let sxBtn = await makeBtnAlwaysOnline(isAutoRefresh, "zisx", "自动刷新中...","开始刷新", refreshBtnSwitch)
        while(true) {
            if(runSwitch) {
                await waitLoading()
                await clickPZ()
            } else {

            }
            await sleep(1000)
        }
    }

    async function makeBtnAlwaysOnline(status, id, activeText, inactiveText, clickFunc) {
        let btn = document.querySelector("#"+id)
        if (!btn) {
            const container = await findBtnContainer()
            if(status) {
                btn = createButton("button", activeText,{"id":id}, true)
            } else {
                btn = createButton("button", inactiveText, {"id":id}, false)
            }
            btn.addEventListener("click", clickFunc)
            container.append(btn)
        }
        return btn
    }

    async function findBtnContainer() {
        while(true) {
            const btnContainer = document.querySelector("#app > div > div.main-container > section > div > div.row-bg.el-row.is-justify-center.el-row--flex")
            if(btnContainer) {
                return btnContainer
            }
            await sleep(1000)
        }
    }

    async function btnSwitch() {
        runSwitch = !runSwitch
        const btn = await makeBtnAlwaysOnline(runSwitch, "ziqp", "自动点击中...","开始监控", btnSwitch)
        btn.innerText = ""
        if(runSwitch) {
            const l = document.createElement("i")
            l.setAttribute('class', 'el-icon-loading')
            btn.append(l)
            const s = document.createElement("span")
            s.innerText = "自动点击中..."
            btn.append(s)
        } else {
            const s = document.createElement("span")
            s.innerText = "开始点击"
            btn.append(s)
        }
    }

    async function clickPZ() {
        const kspz = document.querySelector("#app > div > div.main-container > section > div > div.row-bg.el-row.is-justify-center.el-row--flex > button")
        if (kspz && kspz.getAttribute("class").indexOf("is-disabled") == -1) {
            kspz.click()
            await musicNotify()
            console.log("完成点击")
        } else {
            console.log("无法点击")
            window.location.reload();
        }
    }

    async function waitLoading() {
        while(true) {
            const isLoaded = document.querySelector("#app > div > div.main-container > section > div > div.el-table.el-table--fit.el-table--striped.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-loading-mask")
            if (isLoaded) {
                return
            } else {
                console.log("等待加载")
                await sleep(1000)
            }
        }
    }

    async function musicNotify() {
        const audio = document.createElement("audio")
        audio.setAttribute("autoplay", "autoplay")
        audio.setAttribute("src", "https://s.aigei.com/pvaud_mp3/aud/mp3/47/47b7e360ed9d491a95825c62f81c5cd5.mp3?download/msn%E6%8F%90%E7%A4%BA%E9%9F%B3-%E5%9C%A8%E7%BA%BF_online_-msn%E6%8F%90%E7%A4%BA%E9%9F%B3%28onlin_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.mp3&e=1616295360&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:bZTnoavenU63SAPpyYC2Hnx5_j4=")
        audio.click()
        await sleep(1000)
    }

    //开启主事件循环
    main()
})();