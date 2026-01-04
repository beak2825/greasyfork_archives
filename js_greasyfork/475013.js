// ==UserScript==
// @name         Jablehk Onlyfans等平台资源下载
// @name:zh-TW   Jablehk Onlyfans等平台资源下载
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Jablehk，Onlyfans等平台资源下载。x1、s7、s6、s5。
// @description:zh-TW  Jablehk，Onlyfans等平台资源下载。x1、s7、s6、s5。
// @author       FFFFFFeng
// @match        https://jablehk.com/*
// @grant        none
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/475013/Jablehk%20Onlyfans%E7%AD%89%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/475013/Jablehk%20Onlyfans%E7%AD%89%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function () {
    let VipPageData = {
        tabIndex: 0
    }
     function vipPanelInit() {
         let vipPanel_ = document.getElementById("vipPanel")
        if (vipPanel_) {
            vipPanel_.remove()
        }
        let style = document.createElement("style")
        style.innerHTML = `

        #vipPanel {
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
        }
        .panelHead {
            display: flex;
            border-bottom: 1px solid #ececec;
        }
        .panelHead>div {
            color: #444;
            font-size: 14px;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            user-select: none;
            text-align: center;
            width: 76px;
        }
        .panelHead>div:not(.headDivActive):hover {
            border-bottom: 3px solid #ccc;
            cursor: pointer;
        }
        .headDivActive {
            border-bottom: 3px solid #00809d;
            color: #444;
            font-weight: bold;
        }
        .searchInput {
            width: 80%;
            border-radius: 24px;
            box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
            height: 40px;
            border-left: 1px solid transparent;
            border-right: none;
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            margin: 0 auto;
            overflow: hidden;
            margin-top: 40px;
            display: flex;
            padding-right: 10px;
            align-items: center;
        }
        .searchInput:hover {
            border-top-left-radius: 24px;
            box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 2px 4px 1px rgb(0 0 0 / 18%);
            border-left: 1px solid transparent;
            border-right: none;
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
        }
        .searchInput input {
            flex: 1;
            height: 100%;
            border: 0;
            outline: 0;
            font-size: 16px;
            padding-left: 10px;
        }
        .searchInput .userSearchI {

            width: 30px;
            height: 30px;
            text-align: center;
            box-sizing: border-box;
            line-height: 26px;

        }
        .tipContentBox {
            display:flex;
            color: #71777d;
            font-size: 14px;
            margin: 0 auto;
            margin-top: 20px;
            width: 280px;
        }
        #tipContent {
            width: 0;
            flex: 1;
        }
        .getVipA {
            color: #FFFFFF;
            font-weight: bold;
            background-color: black;
            height: 100px;
            width: 100px;
            border-radius: 50px;
            text-align: center;
            line-height: 100px;
            margin: 20px auto;
            box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
            user-select: none;
        }
        .getVipA:hover {
            cursor: pointer;
            box-shadow: 0 0 0 0 rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 18%);
            -webkit-box-shadow: 0 0 0 0 rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 18%);
            -moz-box-shadow: 0 0 0 0 rgba(0,0,0,.05),0 2px 4px 1px rgba(0,0,0,.18);
        }

		@keyframes float {
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

		.navy_ {
			position: relative;
		}

		.navy_ span {
			position: relative;
			display: inline-block;
			color: white;
			font-size: 2em;
			animation: float 10s ease-in-out infinite;
			animation-delay: 5s;
		}
        .resolvePro {
            color: #71777d;
            font-size: 14px;
            position: absolute;
            bottom: 10px;
            left: 10px;
        }
        .hiddenPanel {
            left: -310px !important;
        }
        .hiddenBtn,.showBtn {
            position: absolute;
            left: 320px;
            bottom: 20px;
            width: 60px;
            height: 40px;
            line-height: 40px;
            color: black;
            user-select: none;
            background-color: #FFFFFF;
            position: absolute;
            left: 243px;
            bottom: 20px;
        }
        .showBtn {
            left: 320px;
            display: none;
        }
        .hiddenBtn:hover,.showBtn:hover {
            cursor: pointer;
        }
        .panelBody_1 {
            display: none;
        }
        .panelBody_1 p {
            padding: 0 10px;
            font-size: 14px;
            text-indent: 1em;
        }
        .lplogin {
            color: white;
            width: 100px;
            height: 30px;
            display:flex;
            align-items:center;
            justify-content: center;
            cursor: pointer;
            background-color: #00809d;
            margin: 20px auto;
            border-radius: 30px;
        }
        .newVersionLink {
             text-decoration: underline;
        }
        .sourceList {
            font-size: 14px;
        }
        `
        document.getElementsByTagName("head")[0].appendChild(style)
        let panel = document.createElement("div")
        panel.setAttribute("id", "vipPanel")
        panel.innerHTML = `
            <div class="hiddenBtn">&lt;&lt;隐藏</div>
            <div class="showBtn">&gt;&gt;显示</div>
            <div class="panelMain">
                <div class="panelHead">
                    <div class="headDivActive">获取权限</div>
                    <div>支付</div>
                    <div>使用指南</div>
                </div>
                <div class="panelBody panelBody_0">
                    <div class="searchInput">
                        <input id="txm" type="text" placeholder="">
                        <div class="userSearchI getVipBtn"><i class="fa fa-search"></i></div>
                    </div>
                    <div class="tipContentBox">
                        <div style="width:50px;">提示: </div>
                        <div id="tipContent">请输入您的卡密以获取资源下载链接</div>
                    </div>
                    <div class="getVipBtn getVipA navy_">
                        <span>G</span>
                        <span>O</span>
                        <span>!</span>
                    </div>
                    <div class="sourceList">
                    <div style="margin-left: 30px;">当前可获取资源:</div>
                        <ul>
                            <li>VIP Package (X1)</li>
                            <li>VIP Package (S7)</li>
                            <li>VIP Package (S6)</li>
                            <li>VIP Package (S5)</li>
                        </ul>
                    </div>
                    <div class="resolvePro">
                    <a class="newVersionLink" target="_blank" href="https://sleazyfork.org/zh-CN/scripts/475013-jablehk-onlyfans%E7%AD%89%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E6%88%96%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B">点我去最新版本</a><br/>
                        有问题请骚扰邮箱: <br/>
                        JamJamToday@protonmail.com
                    </div>
                </div>
                <div class="panelBody panelBody_1">
                    <div class="searchInput">
                        <input id="lp" type="text" placeholder="请输入令牌">
                        <div class="userSearchI"><i class="el-icon-search"></i></div>
                    </div>
                    <div style="margin-top:20px;text-align:center;" id="swag19"><a class="newVersionLink"  target="_blank"  style="color:#71777E;">点此获取令牌</a></div>
                    <div class="lplogin">登录</div>
                </div>
            </div>
        `
        document.body.appendChild(panel)

         let tabs = document.querySelectorAll(".panelHead>div")
         for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function() {
                if (tabs[i].innerHTML == "最新版本") {
                    toNewVersionF()
                    return
                }
                if (tabs[i].innerHTML == "使用指南") {
                    useMethodF()
                    return
                }
                if (tabs[i].innerHTML == "支付") {
                    toPayPage()
                    return
                }
                for (let ii = 0; ii < tabs.length; ii++) {
                    tabs[ii].className = ""
                }
                tabs[i].className = "headDivActive"
                VipPageData.tabIndex = i
                changeTabF()
            })
        }
        
        document.querySelector(".hiddenBtn").addEventListener("click", function() {
            hiddenBtnF();
            window.localStorage.setItem("is_hidden", "true")
        })
        
        document.querySelector(".showBtn").addEventListener("click", function() {
            showBtnF()
            window.localStorage.setItem("is_hidden", "false")
        })
         if (localStorage.getItem("is_hidden")==="true") {
             hiddenBtnF();
         }
        let gets = document.querySelectorAll(".getVipBtn")
        for (let i = 0; i < gets.length; i++) {
            gets[i].addEventListener("click", function() {
                console.log("11")
                if (getTip() == "获取权限中..." || getTip() == "请先登录....") {
                    return
                }
                if (getTxm()) {
                    getPermissionF(getTxm())
                }
            })
        }

        // 读取本地是否有通行码
        if (window.localStorage.getItem("txm") != null && window.localStorage.getItem("txm") != "") {
            document.getElementById("txm").value = window.localStorage.getItem("txm")
        }

        if (isSuccess()) {
            setTip("已可观看VIP视频，请尝试观看")
            document.querySelector(".hiddenBtn").click()
        }
        document.querySelector(".logoload")
        let interval = setInterval(() => {
            if (document.querySelector(".logoload")) {
                document.querySelector(".logoload").style.display="none"
                clearInterval(interval)
            }
        }, 1000)
    }
    function hiddenBtnF() {
        document.querySelector(".hiddenBtn").style.display = "none"
        document.querySelector("#vipPanel").className = "hiddenPanel"
        document.querySelector(".showBtn").style.display = "block"
    }
    function showBtnF() {
        document.querySelector(".hiddenBtn").style.display = "block"
        document.querySelector("#vipPanel").className = ""
        document.querySelector(".showBtn").style.display = "none"
    }
    function isSuccess(){
        return false
    }
    function getTip() {
        return document.querySelector("#tipContent").innerHTML
    }
    function getTxm() {
        console.log("222")
        if (!document.getElementById("txm").value) {
            if (getTip().includes("输入您的卡密 ")) {
                setTip(getTip()+"!!! ")
            } else {
                setTip("输入您的卡密 ")
            }
            if(getTip().includes("!!! !!! !!! !!!")) {
                setTip("输入您的卡密 ")
            }
            return false
        } else {
            return document.getElementById("txm").value
        }
    }
    function setTip(str) {
        document.querySelector("#tipContent").innerHTML = str
    }
    function changeTabF() {
        let mains = document.querySelectorAll(".panelBody")
        for (let i = 0; i < mains.length; i ++) {
            mains[i].style.display = "none"
        }
        mains[VipPageData.tabIndex].style.display = "block"
    }
    function getPermissionF(txm) {
        localStorage.setItem("txm", txm)
        setTip("已跳转至资源列表")
        window.open(`https://www.kittymao.xyz/list.html?km=${txm}`)
    }
    function toPayPage() {

        window.open(`https://www.kittymao.xyz`);
    }
    function useMethodF() {
        window.open("https://www.kittymao.xyz/posts/jablehk.html")
    }
    function toNewVersionF() {
        window.open("https://sleazyfork.org/zh-CN/scripts/475013-jablehk-onlyfans%E7%AD%89%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E6%88%96%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B")
    }
     vipPanelInit()
})();