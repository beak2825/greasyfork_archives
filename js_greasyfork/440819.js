// ==UserScript==
// @name         草榴社区永久vip vip视频无限制观看
// @name:zh-TW   草榴社區永久vip vip視頻無限制觀看
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  草榴社区永久vip vip视频随意观看
// @description:zh-TW  草榴社區永久vip vip視頻隨意觀看
// @author       FFFFFFeng
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?domain=swag555.xyz
// @grant        none
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/440819/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%B0%B8%E4%B9%85vip%20vip%E8%A7%86%E9%A2%91%E6%97%A0%E9%99%90%E5%88%B6%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440819/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%E6%B0%B8%E4%B9%85vip%20vip%E8%A7%86%E9%A2%91%E6%97%A0%E9%99%90%E5%88%B6%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==
(function () {
    let kitty_emojiList = ["😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","🫠","😉","😊","😇","😕","🫤","😟","🙁","☹","😯","😲","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","😤","😡","😠"]
    let kitty_emojiIndex = 0
    let kitty_StatusColor = {
        success: "#67C23A",
        warning: "#E6A23C",
        info: "#909399",
        danger: "#F56C6C",
        '200': "#67C23A",
        '300': "#E6A23C",
        '400': "#909399",
        '500': '#F56C6C'
    }
    let kitty_config = {
        name: "草榴社区脚本",
        id: "cl",
        version: "2.3.0",
        homePageName: "kitty猫",
        homePageUrl: "www.kittymao.xyz",

        update: 3,
        logListMaxLength: 5,
        logItemLength: 20,

        useMethodUrlList: ["docs.kittymao.xyz"],
        payUrlList: ["shop.kittymao.xyz"],

        updateUrl: "https://sleazyfork.org/zh-CN/scripts/440819-cao",
        requestHostList: ["https://baixiaodu.uk/api","https://www.kittymao.xyz/api","https://kittymao.xyz/api"],
    }
    let kitty_isrun = {
        getNewVersion: false
    }
    let kitty_tabIndex = 0
    let kitty_logList = []
    let kitty_successHost = ""
    function kitty_setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function kitty_setScriptName(name) {

    }
    function kitty_insertStyle() {
        let style = document.createElement("style")
        style.innerHTML = `
            /* 整体-start */
            #kitty_vipPanel {
                width: 310px;
                height: 500px;
                box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
                border-left: 1px solid transparent;
                border-right: none;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                background-color: #FFFFFF;
                position: fixed;
                left: 6px;
                bottom: 6px;
                z-index: 99999;
                font-size: 1rem;
                --script-panel-main-color: #004c7d;
            }
            #kitty_vipPanel a {
                text-decoration: underline;
            }
            .kitty_panelMain {
                font-size: 0.85em;
            }
            .hitty_hiddenPanel {
                left: -310px !important;
            }
            /* 整体-end */
            /* panelHead-start */
            .kitty_panelHead {
                display: flex;
                border-bottom: 1px solid #ececec;
            }
            .kitty_panelHead>div {
                color: #444;
                padding: 0 10px;
                height: 40px;
                line-height: 40px;
                box-sizing: border-box;
                user-select: none;
                text-align: center;
                width: 76px;
                font-size: 1em;
            }
            .kitty_panelHead>div:not(.kitty_headDivActive):hover {
                border-bottom: 3px solid #ccc;
                cursor: pointer;
            }
            .kitty_headDivActive {
                border-bottom: 3px solid var(--script-panel-main-color);
                color: #444;
                font-weight: bold;
            }
            /* panelHead-end */
            /* 界面显示按钮 */
            .kitty_showPanelBtn {
                position: absolute;
                left: 320px;
                bottom: 20px;
                width: 60px;
                height: 40px;
                line-height: 40px;
                color: var(--script-panel-main-color);
                user-select: none;
                background-color: #FFFFFF;
                position: absolute;
                left: 320;
                bottom: 20px;
                display: none;
                cursor: pointer;
                border-radius: 5px;
            }
            /* 身体 */
            .kitty_panelBody  {
                padding: 0 10px;
            }
            /* 输入框-start */
            .kitty_searchInput {
                width: 98%;
                border-radius: 24px;
                box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
                height: 40px;
                border-left: 1px solid transparent;
                border-right: none;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                overflow: hidden;
                margin: 0 auto;
                margin-top: 40px;
                margin-bottom: 50px;
                display: flex;
            }
            .kitty_searchInput:hover {
                border-top-left-radius: 24px;
                box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 2px 4px 1px rgb(0 0 0 / 18%);
                border-left: 1px solid transparent;
                border-right: none;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
            }
            .kitty_searchInput input {
                height: 100%;
                border: 0;
                outline: 0;
                padding: 0 10px;
                color: black;
                width: 100%;
            }
            /* 输入框-end */
            /* go按钮-start */
            .kitty_goToVipBtn {
                color: #FFFFFF;
                font-weight: bold;
                background-color: var(--script-panel-main-color);
                height: 100px;
                width: 100px;
                border-radius: 50px;
                text-align: center;
                line-height: 100px;
                margin: 20px auto;
                box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
                user-select: none;
            }
            .kitty_goToVipBtn:hover {
                cursor: pointer;
                box-shadow: 0 0 0 0 rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 18%);
                -webkit-box-shadow: 0 0 0 0 rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 18%);
                -moz-box-shadow: 0 0 0 0 rgba(0,0,0,.05),0 2px 4px 1px rgba(0,0,0,.18);
            }
            /* 动画 */
            @keyframes kitty_float {
                0% {
                    transform: translateY(0px);
                }
                5% {
                    transform: translateY(-10px);
                }
                10%,100% {
                    transform: translateY(0px);
                }
            }

            .kitty_navy {
                position: relative;
            }

            .kitty_navy span {
                position: relative;
                display: inline-block;
                color: white;
                animation: kitty_float 9s ease-in-out infinite;
                animation-delay: 2s;
                font-size: 1.5em;
            }
            /* go按钮-end */
            .kitty_logOutput {
                color: #71777d;
                font-size: 0.9em;
                margin-top: 50px;
            }
            .kitty_logOutput div {
                margin: 0;
                padding: 0;
                line-height: 1.5;
            }
        `
        document.querySelector("head").appendChild(style);
    }
    function kitty_createPanel() {
        let panel = document.createElement("div")
        panel.setAttribute("id", "kitty_vipPanel")
        panel.innerHTML = `
            <div class="kitty_showPanelBtn">&gt;&gt;显示</div>
            <div class="kitty_panelMain">
                <div class="kitty_panelHead">
                    <div class="kitty_headDivActive">获取权限</div>
                    <div>令牌登录</div>
                    <div>使用指南</div>
                    <div>支付</div>
                </div>
                <div class="kitty_panelBody kitty_panelBody_0">
                    <div class="kitty_searchInput">
                        <input id="kitty_txm" type="text" placeholder="">
                    </div>
                    <div class="kitty_goToVipBtn kitty_navy">
                        <span>G</span>
                        <span>O</span>
                        <span>!</span>
                    </div>
                    <div class="kitty_logOutput">
                        <div>脚本--><span class="kitty_scriptName"></span>-<span class="kitty_version"></span>-<span class="kitty_update"></span></div>
                        <div>主页--><a class="kitty_homepage" target="_blank" href="">主页地址</a></div>
                        <div>邮箱-->JamJamToday@protonmail.com</div>
                        <div>操作--><span style="color: red;cursor:pointer;" class="kitty_hiddenPanelBtn">点此隐藏此脚本操作界面&lt;&lt;</span></div>
                        <div class="kitty_logList">
                        </div>
                    </div>
                </div>
                <div class="kitty_panelBody kitty_panelBody_1" style="display:none;">
                    <p>暂未开放</p>
                </div>
                <div class="kitty_panelBody kitty_panelBody_2" style="display:none;">
                    <p>+ 使用方法线路1: <a target="_blank" href="https://docs.kittymao.xyz">docs.kittymao.xyz</a></p>
                </div>
                <div class="kitty_panelBody kitty_panelBody_3" style="display:none;">
                    <p>+ 支付线路1: <a target="_blank" href="https://shop.kittymao.xyz">shop.kittymao.xyz</a></p>
                </div>
            </div>
        `
        document.body.appendChild(panel)
    }

    function kitty_eventBind() {
        let tabs = document.querySelectorAll(".kitty_panelHead>div")
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function() {
                for (let ii = 0; ii < tabs.length; ii++) {
                    tabs[ii].className = ""
                }
                tabs[i].className = "kitty_headDivActive"
                kitty_changeTab(i)
            })
        }
        document.querySelector(".kitty_hiddenPanelBtn").addEventListener("click", function() {
            kitty_hiddenPanel()
        })
        document.querySelector(".kitty_showPanelBtn").addEventListener("click", function() {
            kitty_showPanel()
        })
        let gets = document.querySelectorAll(".kitty_goToVipBtn")
        gets[0].addEventListener("click", function() {
            kitty_getPermissionStart()
        })
    }
    function kitty_changeTab(index) {
        kitty_tabIndex = index
        let panelBodys = document.querySelectorAll(".kitty_panelBody")
        if(!panelBodys[kitty_tabIndex]) {
            return
        }
        for (let i = 0; i < panelBodys.length; i ++) {
            panelBodys[i].style.display = "none"
        }
        panelBodys[kitty_tabIndex].style.display = "block"
    }
    
    
    function kitty_hiddenPanel() {
        document.querySelector("#kitty_vipPanel").className = "hitty_hiddenPanel"
        document.querySelector(".kitty_showPanelBtn").style.display = "block"
    }
    function kitty_showPanel() {
        document.querySelector("#kitty_vipPanel").className = ""
        document.querySelector(".kitty_showPanelBtn").style.display = "none"
    }
    
    function kitty_bodyChange() {
        let bodys = document.querySelectorAll(".kitty_panelBody")
        bodys.forEach(item => {
            item.style.display = "none"
        })
    }
    function kitty_getPermissionStart() {
        let emoLength = kitty_emojiList.length
        let txm = document.querySelector("#kitty_txm").value
        if (!txm) {
            kitty_logListPush(`请输入口令,然后点击GO按钮${kitty_emojiList[kitty_emojiIndex]}`, "info")
            kitty_emojiIndex++
            if (kitty_emojiIndex>=emoLength) {
                kitty_emojiIndex = 0;
            }
            return
        }
        localStorage.setItem("kitty_txm", txm)
        kitty_getSuccessHost();
        kitty_getPermission(0, txm, false);
    }
    function kitty_getSuccessHost() {
        let successHost = localStorage.getItem("kitty_requestSuccessHost")
        if(successHost) {
            let findIndex = kitty_config.requestHostList.indexOf(successHost);
            if (findIndex!=-1) {
                kitty_config.requestHostList.splice(findIndex, 1);
                kitty_config.requestHostList.unshift(successHost);
            }
        }
    }
    function kitty_getHost(index) {
        return kitty_config.requestHostList[index]
    }
    

    function kitty_getStatusTypeText(type) {
        let typeText = "提示";
        switch(type){
            case "success": 
                typeText = "成功"
                break
            case "warning": 
                typeText = "警告"
                break
            case "info": 
                typeText = "信息"
                break
            case "danger": 
                typeText = "失败"
                break
            case '200': 
                typeText = "成功"
                break
            case '300': 
                typeText = "警告"
                break
            case '400': 
                typeText = "信息"
                break
            case '500': 
                typeText = "失败"
                break
        }
        return typeText;
    }
    function kitty_logListPush(item, type) {
        if (kitty_logList.length >= kitty_config.logListMaxLength) {
            kitty_logListShift()
        }
        let stringLength = item.length
        let start = 0;
        let end = kitty_config.logItemLength-1
        let headLine = true
        while(stringLength>=0) {
            let typeText = `${kitty_getStatusTypeText(type)}-->`;
            let styleColor = ""
            if (type) {
                styleColor = type?`color: ${kitty_StatusColor[type]}`:"";
            }
            kitty_logList.push(`<span style="${styleColor}">${headLine?typeText:'<span style="opacity: 0;">续行--</span>&gt;'}${item.substring(start, end)}</span>`)
            start = end
            end += end
            stringLength = stringLength-kitty_config.logItemLength
            headLine = false
        }
        kitty_showLogList()
    }
    function kitty_logListShift() {
        kitty_logList.shift();
        kitty_showLogList();
    }
    function kitty_showLogList() {
        let innerhtml = "";
        let kitty_logListDiv = document.getElementsByClassName("kitty_logList")[0]
        kitty_logList.forEach(item => {
            innerhtml+=`<div>${item}</div>`
        })
        kitty_logListDiv.innerHTML = innerhtml;
    }
    function kitty_setConfig() {
        document.getElementsByClassName("kitty_scriptName")[0].innerHTML = kitty_config.name;
        document.getElementsByClassName("kitty_version")[0].innerHTML = `v${kitty_config.version}`;
        let homepage = document.getElementsByClassName("kitty_homepage")[0];
        homepage.innerHTML = kitty_config.homePageName+`(${kitty_config.homePageUrl})`
        homepage.href = "https://"+kitty_config.homePageUrl
        if (kitty_config.update===1) {
            let versionSpan = document.getElementsByClassName("kitty_update")[0];
            versionSpan.innerHTML = `已最新`;
            versionSpan.style = `color: ${kitty_StatusColor.success};`;
        } else if (kitty_config.update===2) {
            let versionSpan = document.getElementsByClassName("kitty_update")[0];
            versionSpan.innerHTML = `<span class="kitty_toNewVersion" style="user-select: none;cursor: pointer;">点此更新</span>`;
            versionSpan.style = `color: ${kitty_StatusColor.warning};`;
            document.querySelector(".kitty_toNewVersion").addEventListener("click", function() {
                window.open(kitty_config.updateUrl)
            })
        } else {
            let versionSpan = document.getElementsByClassName("kitty_update")[0];
            versionSpan.innerHTML = `<span class="kitty_checkVersion" style="user-select: none;cursor: pointer;">检查更新</span>`;
            versionSpan.style = `color: ${kitty_StatusColor.warning};`;
            document.querySelector(".kitty_checkVersion").addEventListener("click", function() {
                kitty_getNewVersion(0, false)
            })
        }
    }
    
    function kitty_getCardNumber() {
        let txm = localStorage.getItem("txm")
        if (txm) {
            localStorage.setItem("kitty_txm", txm)
            localStorage.removeItem("txm")
            kitty_logListPush("shanchutsm", "warning")
        }
        let kitty_txm = localStorage.getItem("kitty_txm")
        if (kitty_txm) {
            document.querySelector("#kitty_txm").value = kitty_txm
            kitty_logListPush("在使用前请安装好modheader并配置,详情请查看使用指南", "warning")
            if (kitty_isSuccess()) {
                kitty_logListPush("请求成功请尝试观看", "success")
            } else {
                kitty_logListPush("已获取到上次使用的口令,请另外保存口令", "info")
                kitty_logListPush("已准备就绪,请点击GO按钮", "info")
            }
        } else {
            if (kitty_isSuccess()) {
                kitty_logListPush("请求成功请尝试观看", "success")
            } else {
                kitty_logListPush("已准备就绪,请点击GO按钮", "info")
                kitty_logListPush(`请输入口令,然后点击GO按钮${kitty_emojiList[kitty_emojiIndex]}`, "info")
            }
            kitty_emojiIndex++
        }
    }
    function kitty_getPermission(index, txm, change) {
        if (kitty_isrun.getPermission&&!change) {
            return
        }
        let host = kitty_getHost(index)
        if(!change) {
            kitty_logListPush("发送请求中请耐心等待...", "info")
        }
        kitty_isrun.getPermission = true
        let url = `${host}/cl/getPermission`
        fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "version": kitty_config.version,
                "cardContent": txm.trim(),
                "nickname": "cl"
            })
        }).then(res => res.json()).then(res => {
            localStorage.setItem("kitty_requestSuccessHost", host)
            try {
                if (res.success) {
                    dealGetPermissionRes(res.data)
                } else {
                    kitty_logListPush(res.message, "warning")
                }
            } catch(e) {
                kitty_logListPush("失败,返回值处理有问题", "danger")
                console.log(e)
            }
            kitty_isrun.getPermission = false
        }).catch((e) => {
            if (e.toString().includes("JSON")) {
                kitty_logListPush("JSON解析失败,请联系作者", "danger")
                kitty_isrun.getPermission = false
            } else {
                console.log(e)
                index++
                let getHost = kitty_getHost(index)
                if (getHost) {
                    kitty_logListPush("请求失败,切换线路中请耐心等待...", "warning")
                    kitty_getPermission(index, txm, true)
                } else {
                    kitty_logListPush("请求失败,请联系作者", "danger")
                    kitty_isrun.getPermission = false
                }
            }
        })
    }
    function dealGetPermissionRes(resData) {
        let cookieArr = resData.token
        cookieArr.forEach((item) => {
            let temp = item.split(";")[0]
            let tempArr = temp.split("=")
            kitty_setCookie(tempArr[0], tempArr[1], 359)
        })
        kitty_logListPush("请求成功, 刷新页面中请稍候...", "success");
        setTimeout(() => {
            location.reload()
        }, 1000)
    }
    function kitty_checkIsSuccess() {
        if (kitty_isSuccess()) {
            kitty_hiddenPanel();
        }
    }
    function kitty_isSuccess() {
        let account = document.querySelectorAll("[style='font-weight:bold']")
        if (account.length == 0) {
            return false
        }
        for (let i = 0; i < account.length; i++) {
            if (account[i].innerHTML == "cl20220227") {
                return true;
            }
        }
    }
    function kitty_getNewVersion(index, change) {
        if (kitty_isrun.getNewVersion&&!change) {
            return
        }
        let host = kitty_getHost(index)
        if(!change) {
            kitty_logListPush("检查版本号中请耐心等待...", "info")
        }
        kitty_isrun.getNewVersion = true
        let url = `${host}/getVersion`
        fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "nickname": "cl"
            })
        }).then(res => res.json()).then(res => {
            localStorage.setItem("kitty_requestSuccessHost", host)
            try {
                let data = res.data
                if (data.version === kitty_config.version) {
                    kitty_config.update = 1
                    kitty_logListPush("已是最新版", "success")
                } else {
                    kitty_config.update = 2
                    kitty_config.updateUrl = data.updateUrl
                    kitty_logListPush("不是最新版,可能无法使用", "warning")
                }
                kitty_setConfig()
            } catch(e) {
                kitty_logListPush("失败,返回值处理有问题", "danger")
                console.log(e)
            }
            kitty_isrun.getNewVersion = false
        }).catch((e) => {
            if (e.toString().includes("JSON")) {
                kitty_logListPush("JSON解析失败,请联系作者", "danger")
                kitty_isrun.getNewVersion = false
            } else {
                console.log(e)
                index++
                let getHost = kitty_getHost(index)
                if (getHost) {
                    kitty_logListPush("请求失败,切换线路中请耐心等待...", "warning")
                    kitty_getNewVersion(index, true)
                } else {
                    kitty_logListPush("请求失败,请联系作者", "danger")
                    kitty_isrun.getPermission = false
                }
            }
        })
    }
    function kitty_vipPanelInit() {
        kitty_insertStyle();
        kitty_createPanel();
        kitty_getSuccessHost();
        kitty_showLogList();
        kitty_eventBind();
        kitty_getCardNumber();
        kitty_setConfig();
        kitty_checkIsSuccess()
    }
    function kitty_isRun() {
        let site = false
        let run = false
        if(document.title.includes("草榴社區")||document.title.includes("欢迎您")) {
            site = true
        }
        if (document.querySelector("#kitty_vipPanel")||document.querySelector("#vipPanel")) {
            run = true
        }
        if (site&&!run) {
            kitty_vipPanelInit();
        }
    }
    kitty_isRun()
})();
