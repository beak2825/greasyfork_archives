// ==UserScript==
// @name         swag(R站)vip视频随意观看&19J.TV韩国女主播vip视频任意看 永久vip sp.caibox.xyz
// @name:zh-TW   swag(R站)vip視頻隨意觀看&19J.TV韓國女主播vip視頻任意看 永久vip sp.caibox.xyz
// @namespace    https://sp.caibox.xyz/
// @version      1.0.3
// @description  用于观看swag(R站)vip视频&19J.TV韩国女主播vip视频
// @description:zh-TW  用于观看swag(R站)vip視頻&19J.TV韓國女主播vip視頻
// @author       FFFFFFeng
// @match        https://*/*
// @match        http://*/*
// @icon         https://sp.caibox.xyz/favicon.ico
// @grant        none
// @antifeature payment
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472313/swag%28R%E7%AB%99%29vip%E8%A7%86%E9%A2%91%E9%9A%8F%E6%84%8F%E8%A7%82%E7%9C%8B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%ADvip%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E7%9C%8B%20%E6%B0%B8%E4%B9%85vip%20spcaiboxxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/472313/swag%28R%E7%AB%99%29vip%E8%A7%86%E9%A2%91%E9%9A%8F%E6%84%8F%E8%A7%82%E7%9C%8B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%ADvip%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E7%9C%8B%20%E6%B0%B8%E4%B9%85vip%20spcaiboxxyz.meta.js
// ==/UserScript==
(function () {
     let VipPageData = {
        tabIndex: 0
    }

     let version = "1.0.3";
     let edition = "正在获取...";
     let msg = "正在获取...";
     let update = "#";
	 
     fetch("https://sp.caibox.xyz/validate.php?type=version").then(async function(result) {
            let res = await result.json()
            if(res.code == 300){
                msg = "请求异常，请联系开发者。"
                return
            }
            var g1 = document.getElementById("edition")
            var g2 = document.getElementById("msg")
            var g3 = document.getElementById("update")
            edition = res.edition
            update = res.update
            msg = res.msg
            g1.innerHTML = edition
            g2.innerHTML = msg
            if(version != edition){
                g3.innerHTML = "<a href='"+update+"'>🌈🌈版本已更新，点击更新🌈🌈</a>";
            }

     }).catch(function(e) {
            console.log(e)
            msg = "请求异常，请联系开发者。"
     })

    if (document.title.includes('韩国主播国产主播原创网') || document.title.includes('SWAG资源合集下载')) {
        vipPanelInit()
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
            background-color: #00809d;
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
            color: #00809d;
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
        .panelBody_2 {
            display: none;
        }
        .panelBody_2 p {
            padding: 0 10px;
            font-size: 14px;
            text-indent: 1em;
        }
        div{text-align:center}
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
                    <div>获取卡密</div>
                    <div>问题反馈</div>
                    <!--<div>最新版本</div>-->
                </div>
                <div class="panelBody panelBody_0">
                    <div class="searchInput">
                        <input id="txm" type="text" placeholder="" value="" >
                        <div class="userSearchI getVipBtn"><i class="fa fa-search"></i></div>
                    </div>
                    <div class="tipContentBox">
                        <div style="width:50px;">提示: </div>
                        <div id="tipContent">未获取权限，请输入您的卡密以获取vip权限</div>
                    </div>
                    <div class="getVipBtn getVipA navy_">
                        <span>G</span>
                        <span>O</span>
                        <span>!</span>
                    </div>
                    <div class="resolvePro">
                        填写完卡密后点*GO*-即可<br/>
                        使用方面的问题右上角进群反馈
                    </div>
                    <div style="width:300px; text-align:center;">
						<div style="width:auto; *width:100px; margin:0 auto; display:inline-block;">
							当前版本：<b id="version">`+version+`</b><br/>
							最新版本：<b id="edition">`+edition+`</b><br/>
							脚本公告<br/><b id="msg">`+msg+`</b><br/>
                            <b id="update"></b>
						</div>
					</div>
                </div>
                <div class="panelBody panelBody_1" >
                    <b style="color:red;">
                    <br/>
                    <br/>
                    <br/>
    		        <h3>0.网页版仅支持一个视频站</h3>
                    <h3>1.脚本版则两站通用</h3>
    		        <h3>2.下方为卡密购买站点。</h3>
    		        <h3>3.有任何问题联系我的邮箱。</h3>
    		</b>
                   <h2> 🌈🌈<a href="http://www.jbox.shop" target="_blank">点我获取卡密</a>🌈🌈</h2>
                </div>
                <div class="panelBody panelBody_2">
                    <img src="https://sp.caibox.xyz/img/qun.png"></img>
                </div>
            </div>
        `
        document.body.appendChild(panel)
        let nodes = document.querySelectorAll(".f-red")
          for (let i = 0; i<nodes.length; i++) {
              break;
            if (nodes[i].innerHTML.includes("联合登录")) {
              if (nodes[i].nextElementSibling) {
                let href = nodes[i].nextElementSibling.href
                nodes[i].nextElementSibling.href = href.replace("jijiji", "19j20")
              }
            }
         }
         let tabs = document.querySelectorAll(".panelHead>div")
         for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function() {
                if (tabs[i].innerHTML == "最新版本") {
                    toNewVersionF()
                    return
                }
                /*if (tabs[i].innerHTML == "问题反馈") {
                    //useMethodF()
                    return
                }*/
                for (let ii = 0; ii < tabs.length; ii++) {
                    tabs[ii].className = ""
                }
                tabs[i].className = "headDivActive"
                VipPageData.tabIndex = i
                changeTabF()
            })
        }
        document.querySelector(".hiddenBtn").addEventListener("click", function() {
            hiddenBtnF()
        })
        document.querySelector(".showBtn").addEventListener("click", function() {
            showBtnF()
        })
        let gets = document.querySelectorAll(".getVipBtn")
        for (let i = 0; i < gets.length; i++) {
            gets[i].addEventListener("click", function() {

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
    }

	function getVersion(url){
		var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        httpRequest.open('GET', url, true);//第二步：打开连接
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                console.log(json);
				return json;
            }
        };
	}

    function getTxm() {
var name = document.getElementsByClassName("user-wide");
        name.innerHTML = "sssssssssssssssssssssssssssssssss"
        if (!document.getElementById("txm").value) {
            if (getTip().includes("输入您购买的卡密 ")) {
                setTip(getTip()+"!!! ")
            } else {
                setTip("输入您购买的卡密 ")
            }
            if(getTip().includes("!!! !!! !!! !!!")) {
                setTip("输入您购买的卡密 ")
            }
            return false
        } else {
            return document.getElementById("txm").value
        }
    }
    function changeTabF() {
        let mains = document.querySelectorAll(".panelBody")
        for (let i = 0; i < mains.length; i ++) {
            mains[i].style.display = "none"
        }
        mains[VipPageData.tabIndex].style.display = "block"
    }
    function setTip(str) {
        document.querySelector("#tipContent").innerHTML = str
    }
    function toNewVersionF() {
        window.open("https://greasyfork.org/zh-CN/scripts/472309-swag-r%E7%AB%99-vip%E8%A7%86%E9%A2%91%E9%9A%8F%E6%84%8F%E8%A7%82%E7%9C%8B-19j-tv%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%ADvip%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E7%9C%8B-%E6%B0%B8%E4%B9%85vip")
    }
    function useMethodF() {
        window.open("")
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    function getPermissionF(t) {
        setTip("获取权限中...")
        window.localStorage.setItem("txm", t)
        let url = ""
        let href = location.href
        if (href.includes("https")) {
            if (href.includes("19j")) {
                url = "https://sp.caibox.xyz/validate.php?code="+t+"&type=token"

            } else {
                url = "https://sp.caibox.xyz/validate.php?code="+t+"&type=cookie"

            }
        } else {
            if (href.includes("19j")) {
                url = "https://sp.caibox.xyz/validate.php?code="+t+"&type=token"

            } else {
                url = "https://sp.caibox.xyz/validate.php?code="+t+"&type=cookie"

            }
        }

        fetch(url).then(async function(result) {
            let res = await result.json()
            if (res.code == 300) {
                setTip(res.msg)
                return
            }
            let href = window.location.href
            if (href.includes("19j")) {
                let token = res.data
                let url = `${location.protocol}//${location.hostname}/user/login?ruser=fengfeng&rtoken=${token}`

                location.href=url
                //setTip("请先至姐妹站：ri102.xyz (即swag站)，获取权限后点击右上角会员中心，里面有个登录联合会员的链接，点一下即可。")
            } else {
                let cookieArr = res.data.cookieHeader
                cookieArr.forEach((item) => {
                    let temp = item.split(";")[0]
                    let tempArr = temp.split("=")
                    if (tempArr[0] == 'user') {
                        setCookie('user', tempArr[1], 1)
                    } else {
                        setCookie(tempArr[0], tempArr[1])
                    }
                })
                location.reload()
            }
        }).catch(function(e) {
            console.log(e)
            setTip("请求异常，请联系开发者。")
        })
    }
    function hasGetPermissionF() {

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
    function isSuccess() {
        let dom = document.getElementById("vip1")
            let dom_ = document.querySelector("a.tx-flex-hc")
            let b = false
            if (dom_) {
                b = dom_.innerHTML.includes("会员中心")
            }
            if (dom||b) {
                return true
            } else {
                return false
            }
        return
        console.log(getCookie('PHPSESSID'))
        if(location.href.includes('ri')) {
            return getCookie('PHPSESSID')
        } else {

        }
    }
    function getTip() {
        return document.querySelector("#tipContent").innerHTML
    }
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
    }
})();