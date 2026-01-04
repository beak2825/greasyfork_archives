// ==UserScript==
// @name         海角社区免费版
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  可以免费观看海角社区钻石和金币付费帖子、vip帖子，包括视频、图片、音频。
// @author       JamToday
// @match        https://*.haijiao.com/*
// @include      *://hj*.*/*
// @include      *://*.hj*.*/*
// @include      *://*.hai*.*/*
// @include      *://hai*.*/*
// @include      *://hj*/*
// @include      *://*.hj*/*
// @include      */post/details/*
// @match        *://*/post/details*
// @exclude      *://hjai*/*
// @exclude      *://haijiao.ai/*
// @exclude      *://haijiao.pro/*
// @exclude      *://*.kittymao.xyz/*
// @exclude      https://hjfb.org/*
// @exclude      *://tool.liumingye.cn/*
// @icon         https://www.hjadbf.top/images/common/project/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509766/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E5%85%8D%E8%B4%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/509766/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E5%85%8D%E8%B4%B9%E7%89%88.meta.js
// ==/UserScript==
(function () {
    let kitty_StatusColor = {
      success: "#67C23A",
      warning: "#E6A23C",
      info: "#909399",
      danger: "#F56C6C",
      200: "#67C23A",
      300: "#E6A23C",
      400: "#909399",
      500: "#F56C6C",
    };
    let kitty_config = {
      name: "海角社区免费版",
      id: "hjfree",
      version: "0.1.2",
      homePageName: "kitty猫",
      homePageUrl: "www.kittymao.xyz",
   
      update: 3,
      logListMaxLength: 19,
      logItemLength: 20,
   
      updateUrl: "https://sleazyfork.org/zh-CN/scripts/440819-cao",
      requestHostList: ["https://baixiaodu.uk/api"],
    };
    let kitty_isrun = {
      getNewVersion: false,
    };
    let kitty_tabIndex = 0;
    let kitty_logListTarget = [];
    let kitty_logList = new Proxy(kitty_logListTarget, {
      set: function (target, property, value) {
        if (property === "length") {
          console.log("Cannot change the length of the array.");
          return true;
        } else {
          target[property] = value;
          let appendDiv = document.createElement("div");
          appendDiv.innerHTML = value;
          let kitty_logListDiv =
            document.getElementsByClassName("kitty_logList")[0];
          kitty_logListDiv.appendChild(appendDiv);
          return true;
        }
      },
    });
    function kitty_setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function kitty_insertStyle() {
      let style = document.createElement("style");
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
                    font-size: 16px;
                    --script-panel-main-color: #4178b0;
                }
                #kitty_vipPanel a {
                    text-decoration: underline;
                }
                .kitty_panelMain {
                    font-size: 0.85em;
                }
                .kitty_hiddenPanel {
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
                .kitty_showPanelBtn, .kitty_jiexiBtn {
                    position: absolute;
                    left: 320px;
                    top: 150px;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    color: var(--script-panel-main-color);
                    user-select: none;
                    background-color: #FFFFFF;
                    position: absolute;
                    bottom: 20px;
                    display: none;
                    cursor: pointer;
                    border-radius: 50px;
                    text-align: center;
                    box-shadow:0 0 0 1px rgb(0 0 0 / 5%), 0 2px 4px 1px rgb(0 0 0 / 9%);
                }
                .kitty_jiexiBtn {
                  top: 85px;
                }
                /* 身体 */
                .kitty_panelBody  {
                    padding: 0 10px;
                }
                .kitty_panelBody p {
                    margin: 10px 0;
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
                    margin-top: 10px;
                }
                .kitty_logOutput div {
                    margin: 0;
                    padding: 0;
                    line-height: 1.5;
                }
                .kitty_downloadText {
                    font-size: 20px;
                    font-weight: bold;
                }
                .kitty_downloadText a {
                    cursor:pointer;
                }
            `;
      document.querySelector("head").appendChild(style);
    }
    function kitty_createPanel() {
      let panel = document.createElement("div");
      panel.setAttribute("id", "kitty_vipPanel");
      panel.innerHTML = `
                <div class="kitty_showPanelBtn">显示</div>
                <div class="kitty_jiexiBtn">解析</div>
                <div class="kitty_panelMain">
                    <div class="kitty_panelHead">
                        <div class="kitty_headDivActive">运行日志</div>
                        <div>重要说明</div>
                        <div>使用指南</div>
                    </div>
                    <div class="kitty_panelBody kitty_panelBody_0">
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
                      <p>+ 本脚本完全免费</p>
                      <p>+ 本脚本无恶意代码放心使用</p>
                      <p>+ 更多脚本可看 <a target="_blank" href="https://docs.kittymao.xyz">www.kittymao.xyz</a></p>
                      <p>+ 脚本仅支持正版海角</p>
                      <p>+ 如果脚本在非正版海角网站运行, 请关闭即可</p>
                  </div>
                    <div class="kitty_panelBody kitty_panelBody_2" style="display:none;">
                        <p>+ 使用方法线路1: <a target="_blank" href="https://www.kittymao.xyz">www.kittymao.xyz</a></p>
                    </div>
                </div>
            `;
      document.body.appendChild(panel);
      let ishidden = localStorage.getItem("kitty_isHiddenPanel");
      if (ishidden) {
        ishidden = JSON.parse(ishidden);
        if (ishidden) {
          kitty_hiddenPanel();
        } else {
          kitty_showPanel();
        }
      }
    }
   
    function kitty_eventBind() {
      let tabs = document.querySelectorAll(".kitty_panelHead>div");
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function () {
          for (let ii = 0; ii < tabs.length; ii++) {
            tabs[ii].className = "";
          }
          tabs[i].className = "kitty_headDivActive";
          kitty_changeTab(i);
        });
      }
      document
        .querySelector(".kitty_hiddenPanelBtn")
        .addEventListener("click", function () {
          kitty_hiddenPanel();
        });
      document
        .querySelector(".kitty_showPanelBtn")
        .addEventListener("click", function () {
          kitty_showPanel();
        });
      document
        .querySelector(".kitty_jiexiBtn")
        .addEventListener("click", function () {
          if (location.href.includes("post/details?pid")) {
            if (kitty_isLogin()) {
              document.querySelector(".kitty_jiexiBtn").innerHTML = "稍等";
            } else {
              document.querySelector(".kitty_jiexiBtn").innerHTML = "暂无";
              kitty_checkLogin();
              kitty_showPanel();
            }
          } else {
            document.querySelector(".kitty_jiexiBtn").innerHTML = "暂无";
          }
        });
    }
   
    function kitty_changeTab(index) {
      kitty_tabIndex = index;
      let panelBodys = document.querySelectorAll(".kitty_panelBody");
      if (!panelBodys[kitty_tabIndex]) {
        return;
      }
      for (let i = 0; i < panelBodys.length; i++) {
        panelBodys[i].style.display = "none";
      }
      panelBodys[kitty_tabIndex].style.display = "block";
    }
   
    function kitty_hiddenPanel() {
      document.querySelector("#kitty_vipPanel").className = "kitty_hiddenPanel";
      document.querySelector(".kitty_showPanelBtn").style.display = "block";
      document.querySelector(".kitty_jiexiBtn").style.display = "block";
      localStorage.setItem("kitty_isHiddenPanel", JSON.stringify(true));
    }
    function kitty_showPanel() {
      document.querySelector("#kitty_vipPanel").className = "";
      document.querySelector(".kitty_showPanelBtn").style.display = "none";
      document.querySelector(".kitty_jiexiBtn").style.display = "none";
      localStorage.setItem("kitty_isHiddenPanel", JSON.stringify(false));
    }
    function kitty_getSuccessHost() {
      let successHost = localStorage.getItem("kitty_requestSuccessHost");
      if (successHost) {
        let findIndex = kitty_config.requestHostList.indexOf(successHost);
        if (findIndex != -1) {
          kitty_config.requestHostList.splice(findIndex, 1);
          kitty_config.requestHostList.unshift(successHost);
        }
      }
    }
    function kitty_getHost(index) {
      return kitty_config.requestHostList[index];
    }
   
    function kitty_getStatusTypeText(type) {
      let typeText = "提示";
      switch (type) {
        case "success":
          typeText = "成功";
          break;
        case "warning":
          typeText = "警告";
          break;
        case "info":
          typeText = "信息";
          break;
        case "danger":
          typeText = "失败";
          break;
        case "200":
          typeText = "成功";
          break;
        case "300":
          typeText = "警告";
          break;
        case "400":
          typeText = "信息";
          break;
        case "500":
          typeText = "失败";
          break;
      }
      return typeText;
    }
    function kitty_logListPush(item, type, isDom) {
      if (kitty_logList.length >= kitty_config.logListMaxLength) {
        kitty_logListShift();
      }
      let stringLength = item.length;
      let start = 0;
      let end = kitty_config.logItemLength - 1;
      let headLine = true;
   
      let typeText = `${kitty_getStatusTypeText(type)}-->`;
      let styleColor = "";
      if (type) {
        styleColor = type ? `color: ${kitty_StatusColor[type]}` : "";
      }
      if (isDom) {
        let pushStr = `<span style="${styleColor}">${typeText}${item}</span>`;
        kitty_logList.push(pushStr);
      } else {
        while (stringLength >= 0) {
          let pushStr = `<span style="${styleColor}">${
            headLine ? typeText : '<span style="opacity: 0;">续行--</span>&gt;'
          }${item.substring(start, end)}</span>`;
          kitty_logList.push(pushStr);
          start = end;
          end += end;
          stringLength = stringLength - kitty_config.logItemLength;
          headLine = false;
        }
      }
   
      // kitty_showLogList();
    }
    function kitty_logListShift() {
      kitty_logListTarget.shift();
      let kitty_logListChild0 =
        document.querySelectorAll(".kitty_logList div")[0];
      kitty_logListChild0.remove();
      // kitty_showLogList();
    }
    function kitty_setConfig() {
      document.getElementsByClassName("kitty_scriptName")[0].innerHTML =
        kitty_config.name;
      document.getElementsByClassName(
        "kitty_version"
      )[0].innerHTML = `v${kitty_config.version}`;
      let homepage = document.getElementsByClassName("kitty_homepage")[0];
      homepage.innerHTML =
        kitty_config.homePageName + `(${kitty_config.homePageUrl})`;
      homepage.href = "https://" + kitty_config.homePageUrl;
      if (kitty_config.update === 1) {
        let versionSpan = document.getElementsByClassName("kitty_update")[0];
        versionSpan.innerHTML = `已最新`;
        versionSpan.style = `color: ${kitty_StatusColor.success};`;
      } else if (kitty_config.update === 2) {
        let versionSpan = document.getElementsByClassName("kitty_update")[0];
        versionSpan.innerHTML = `<span class="kitty_toNewVersion" style="user-select: none;cursor: pointer;">点此更新</span>`;
        versionSpan.style = `color: ${kitty_StatusColor.warning};`;
        document
          .querySelector(".kitty_toNewVersion")
          .addEventListener("click", function () {
            window.open(kitty_config.updateUrl);
          });
      } else {
        let versionSpan = document.getElementsByClassName("kitty_update")[0];
        versionSpan.innerHTML = `<span class="kitty_checkVersion" style="user-select: none;cursor: pointer;">检查更新</span>`;
        versionSpan.style = `color: ${kitty_StatusColor.warning};`;
        document
          .querySelector(".kitty_checkVersion")
          .addEventListener("click", function () {
            kitty_getNewVersion(0, false);
          });
      }
    }
   
    function kitty_getNewVersion(index, change) {
      if (kitty_isrun.getNewVersion && !change) {
        return;
      }
      let host = kitty_getHost(index);
      if (!change) {
        kitty_logListPush("检查版本号中请耐心等待...", "info");
      }
      kitty_isrun.getNewVersion = true;
      let url = `${host}/getVersion`;
      fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: "hjfree",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          localStorage.setItem("kitty_requestSuccessHost", host);
          try {
            let data = res.data;
            if (data.version === kitty_config.version) {
              kitty_config.update = 1;
              kitty_logListPush("已是最新版", "success");
            } else {
              kitty_config.update = 2;
              kitty_config.updateUrl = data.updateUrl;
              kitty_logListPush("不是最新版,可能无法使用", "warning");
            }
            kitty_setConfig();
          } catch (e) {
            kitty_logListPush("失败,返回值处理有问题", "danger");
            console.log(e);
          }
          kitty_isrun.getNewVersion = false;
        })
        .catch((e) => {
          if (e.toString().includes("JSON")) {
            kitty_logListPush("JSON解析失败,请联系作者", "danger");
            kitty_isrun.getNewVersion = false;
          } else {
            console.log(e);
            index++;
            let getHost = kitty_getHost(index);
            if (getHost) {
              kitty_logListPush("请求失败,切换线路中请耐心等待...", "warning");
              kitty_getNewVersion(index, true);
            } else {
              kitty_logListPush("请求失败,请联系作者", "danger");
              kitty_isrun.getPermission = false;
            }
          }
        });
    }
    function kitty_vipPanelInit() {
      kitty_insertStyle();
      kitty_createPanel();
      kitty_getSuccessHost();
      kitty_eventBind();
      kitty_setConfig();
    }
   
    
   
    // ------------------------------------------
    // ------------------------------------------
    // ------------------------------------------
   
    let kitty_icons = {
      toTop:
        "data:image/png;base64,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",
      close:
        "data:image/png;base64,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",
    };
    let kitty_utils = {
      getCookie: function (name) {
        const cookies = document.cookie.split(";"); // 将 document.cookie 拆分为多个 Cookie 字符串
        for (const cookie of cookies) {
          const [cookieName, cookieValue] = cookie.split("=");
          const trimmedCookieName = cookieName.trim(); // 去除空格
          if (trimmedCookieName === name) {
            return decodeURIComponent(cookieValue); // 解码 Cookie 值
          }
        }
        return null; // 没有找到匹配的 Cookie
      },
      hjApiDecode: function (data) {
        let res;
        try {
          res = JSON.parse(atob(atob(atob(data))));
        } catch (e) {
          console.log("ab error");
          return "";
        }
        return res;
      },
      hjApiEecode: function (data) {
        return btoa(btoa(btoa(JSON.stringify(data))));
      },
      getElement: function (selector) {
        return new Promise((success, reject) => {
          let ele;
          function querySelectorAll_() {
            ele = document.querySelectorAll(selector);
            if (ele.length != 0) {
              success(ele);
              return true;
            } else {
              return false;
            }
          }
          if (!querySelectorAll_()) {
            let count = 1;
            let interval = setInterval(() => {
              if (count > 75) {
                reject("未获取元素: ", selector);
                clearInterval(interval);
              }
              if (!querySelectorAll_()) {
                count++;
              } else {
                success(ele);
                clearInterval(interval);
              }
            }, 50);
          }
        });
      },
      isMobileDevice: function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      },
    };
    let isMobileDevice = kitty_utils.isMobileDevice();
    function kitty_hjPicEdcoder() {
      var e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890",
        t =
          ((this.encode = function (i) {
            var a,
              n,
              o,
              r,
              s,
              c,
              l = "",
              d = 0;
            for (i = t(i); d < i.length; )
              (o = (a = i.charCodeAt(d++)) >> 2),
                (r = ((3 & a) << 4) | ((a = i.charCodeAt(d++)) >> 4)),
                (s = ((15 & a) << 2) | ((n = i.charCodeAt(d++)) >> 6)),
                (c = 63 & n),
                isNaN(a) ? (s = c = 64) : isNaN(n) && (c = 64),
                (l = l + e.charAt(o) + e.charAt(r) + e.charAt(s) + e.charAt(c));
            return l;
          }),
          (this.decode = function (t) {
            var a,
              n,
              o,
              r,
              s,
              c,
              l = "",
              d = 0;
            for (t = t.replace(/[^A-Za-z0-9\*\#]/g, ""); d < t.length; )
              (o = e.indexOf(t.charAt(d++))),
                (a =
                  ((15 & (r = e.indexOf(t.charAt(d++)))) << 4) |
                  ((s = e.indexOf(t.charAt(d++))) >> 2)),
                (n = ((3 & s) << 6) | (c = e.indexOf(t.charAt(d++)))),
                (l += String.fromCharCode((o << 2) | (r >> 4))),
                64 != s && (l += String.fromCharCode(a)),
                64 != c && (l += String.fromCharCode(n));
            return i(l);
          }),
          function (e) {
            e = e.replace(/\r\n/g, "\n");
            for (var t = "", i = 0; i < e.length; i++) {
              var a = e.charCodeAt(i);
              a < 128
                ? (t += String.fromCharCode(a))
                : (t =
                    127 < a && a < 2048
                      ? (t += String.fromCharCode((a >> 6) | 192)) +
                        String.fromCharCode((63 & a) | 128)
                      : (t =
                          (t += String.fromCharCode((a >> 12) | 224)) +
                          String.fromCharCode(((a >> 6) & 63) | 128)) +
                        String.fromCharCode((63 & a) | 128));
            }
            return t;
          }),
        i = function (e) {
          for (var t, i, a = "", n = 0, o = 0; n < e.length; )
            (t = e.charCodeAt(n)) < 128
              ? ((a += String.fromCharCode(t)), n++)
              : 191 < t && t < 224
              ? ((o = e.charCodeAt(n + 1)),
                (a += String.fromCharCode(((31 & t) << 6) | (63 & o))),
                (n += 2))
              : ((o = e.charCodeAt(n + 1)),
                (i = e.charCodeAt(n + 2)),
                (a += String.fromCharCode(
                  ((15 & t) << 12) | ((63 & o) << 6) | (63 & i)
                )),
                (n += 3));
          return a;
        };
    }
    
    let kitty_topicData = null
   
    function kitty_coverAddContent(innerhtml) {
      kitty_utils.getElement(".kitty_coverInnerBox").then((ele) => {
        let element = ele[0];
        let p = document.createElement("p");
        p.innerHTML = innerhtml;
        element.append(p);
      });
    }
    // 请求拦截
    function kitty_xhrIntercept() {
      let xhrOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (method, url, async) {
        
        if (location.href.includes("post/details?pid")) {
          if (url.includes("hjstore/images")) {
            kitty_cacheImgs(method, url, this);
          }
          const locationParams = new URLSearchParams(location.search);
          const pid = locationParams.get("pid");
          if (url.includes("api/topic/" + pid)) {
            let kitty_topicDataTarget = {
              hasVideo: false,
              hasAudio: false,
              hasPic: false,
              saleType: 0, // 0:不出售 1:金币 2:钻石
              vipLimit: 0, // 0:不需要vip 1:需要vip1级 2:需要vip2级 3:...
              picsList: [],
              audsList: [],
              videoData: null,
              isFree: false,
              topicId: 0,
              imageInserted: [],
              catchedImgs: null,
              wholeM3u8Url: null,
              wholeM3u8UrlType: "",
              picDomList: [],
              topicDataSetOver: false,
              createTime: "",
              isH5: isMobileDevice,
              runHref: "",
              codeList: null,
            };
            kitty_topicData = new Proxy(kitty_topicDataTarget, {
              get: (target, key, proxy) => {
                return target[key];
              },
              set: (target, key, value, proxy) => {
                if (target[key] !== value) {
                  target[key] = value;
                  if (key == "topicDataSetOver") {
                    kitty_topicDataSetOver();
                  }
                  if (key == "wholeM3u8Url") {
                    kitty_insertVideoDom();
                  }
                }
                return true;
              },
            });
          }
          let onreadystatechange_ = this.onreadystatechange;
          this.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              kitty_xhrResponseProcess(method, url, this);
            }
            if (onreadystatechange_) {
              onreadystatechange_();
            }
          };
          if (isMobileDevice) {
            // 手机端
            let onload_ = this.onload;
            this.onload = function () {
              kitty_xhrResponseProcess(method, url, this);
              if (onload_) {
                onload_();
              }
            };
          }
        }
        return xhrOpen.call(this, method, url, async);
      };
    }
    // 请求前处理
    function kitty_cacheImgs(method, url, xhr) {
      if (url.includes("hjstore/images")) {
        if (kitty_topicData.hasPic) {
          if (!kitty_topicData.catchedImgs) {
            kitty_topicData.catchedImgs = [];
          }
          let find = kitty_topicData.catchedImgs.find((item) => {
            return item.url == url;
          });
          if (!find) {
            kitty_topicData.catchedImgs.push({
              url: url,
              data: null,
            });
          }
        }
      }
    }
    // 请求后返回值处理
    function kitty_xhrResponseProcess(method, url, xhr) {
      const locationParams = new URLSearchParams(location.search);
      const pid = locationParams.get("pid");
      if (url.includes("api/topic/" + pid)) {
        let responseText = JSON.parse(xhr.responseText);
        let decodeData = kitty_utils.hjApiDecode(responseText.data);
        let newData = kitty_utils.hjApiEecode(kitty_setTopicData(decodeData));
        responseText.data = newData;
        let jsonRes = JSON.stringify(responseText);
        Object.defineProperty(xhr, "responseText", {
          get: () => {
            return jsonRes;
          },
        });
        Object.defineProperty(xhr, "response", {
          get: () => {
            return jsonRes;
          },
        });
      }
      if (url.includes("hjstore/images")) {
        let findCatchedImg = kitty_topicData.catchedImgs.find((item) => {
          return item.url == url;
        });
        if (findCatchedImg) {
          if (!findCatchedImg.data) {
            findCatchedImg.data = new kitty_hjPicEdcoder().decode(
              xhr.responseText
            );
            let findImgDom = kitty_topicData.picDomList.find((item) => {
              return item.dataset.imgUrl == url;
            });
            if (findImgDom) {
              findImgDom.src = findCatchedImg.data;
            }
          }
        }
      }
    }
    // /api/topic/id 接口返回值处理
    function kitty_setTopicData(data) {
      const locationParams = new URLSearchParams(location.search);
      const pid = locationParams.get("pid");
      kitty_topicData.topicId = pid;
      if (data.sale) {
        // 付费类型
        kitty_topicData.saleType = data.sale.money_type;
      }
   
      let hasAudio = false;
      let hasVideo = false;
      let hasPic = false;
      // 附件处理
      data.attachments.forEach((item) => {
        if (item.category == "images") {
          hasPic = true;
          kitty_topicData.picsList.push(item.remoteUrl);
        } else if (item.category == "video") {
          hasVideo = true;
          kitty_topicData.videoData = item;
        } else if (item.category == "audio") {
          hasAudio = true;
          kitty_topicData.audsList.push(item.remoteUrl);
        }
      });
      if (hasPic) {
        kitty_topicData.hasPic = true;
      }
      if (hasVideo) {
        kitty_topicData.hasVideo = true;
      }
      if (hasAudio) {
        kitty_topicData.hasAudio = true;
      }
   
      if (data.node) {
        kitty_topicData.vipLimit = data.node.vipLimit;
        // 去除viplimit弹框
        data.node.vipLimit = 0;
      }
      // 是否是免费
      if (!data.sale && kitty_topicData.vipLimit == 0) {
        kitty_topicData.isFree = true;
      }
      kitty_topicData.createTime = data.createTime;
      kitty_topicData.topicDataSetOver = true;
      //delete data.content
      return data;
    }
    // 如果是vip内容
    function kitty_topicViplimit() {
      if (kitty_topicData.vipLimit > 0) {
        if (kitty_topicData.hasPic) {
          let count = 0;
          let interval = setInterval(() => {
            if (count >= kitty_topicData.picsList.length) {
              return clearInterval(interval);
            }
            let item = kitty_topicData.picsList[count];
            let x = new XMLHttpRequest();
            x.open("get", item);
            x.send();
            count++;
          }, 500);
        }
      }
    }
    // 插入图片
    function kitty_insertPayImgsDom(url) {
      kitty_utils.getElement(".kitty_coverInnerBox").then((ele) => {
        let element = ele[0];
        kitty_topicData.picsList.forEach((url, index) => {
          if (!kitty_topicData.imageInserted.includes(url)) {
            let p = document.createElement("p");
            let img = document.createElement("img");
            img.className = "kitty_topicImg";
            img.src = "/images/common/project/loading.gif";
            img.title = "点击查看大图";
            img.dataset.imgUrl = url;
            img.addEventListener("click", function () {
              img.classList.toggle("imgwidth100");
            });
            p.appendChild(img);
            element.appendChild(p);
            kitty_topicData.imageInserted.push(url);
            kitty_topicData.picDomList.push(img);
          }
        });
      });
    }
    function kitty_getVideoUrl() {
      if (kitty_topicData.isFree) {
        return;
      }
      if (kitty_topicData.hasVideo) {
        kitty_coverAddContent("正在获取视频信息，请稍后...");
        fetch("https://baixiaodu.uk/api/hj/findu8", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pid: parseInt(kitty_topicData.topicId),
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              kitty_topicData.wholeM3u8UrlType = res.data.type;
              kitty_topicData.wholeM3u8Url = res.data.url;
            } else {
              kitty_logListPush(res.message, "warning");
              kitty_coverAddContent(res.message);
              kitty_showPanel();
            }
          });
      }
    }
    // 插入视频
    function kitty_insertVideoDom() {
      if (kitty_topicData.wholeM3u8UrlType == "page") {
        kitty_coverAddContent(
          `视频需至haijiao.ai观看: <a target='_blank' href="${kitty_topicData.wholeM3u8Url}">点此观看</a>`
        );
        return;
      }
   
      kitty_coverAddContent(
        `请点击观看视频: <a target='_blank' href="https://file.kittymao.xyz/file/other/m3u8Player.html?url=${kitty_topicData.wholeM3u8Url}">点此播放</a>`
      );
    }
    // 插入音频
    function kitty_insertAudioDom() {
      kitty_topicData.audsList.forEach((item) => {
        let audio = document.createElement("audio");
        audio.controls = true;
        let source = document.createElement("source");
        source.type = "audio/mpeg";
        source.src = item;
        audio.append(source);
        kitty_utils.getElement(".kitty_coverInnerBox").then((res) => {
          res[0].append(audio);
        });
      });
    }
   
    function KittyCover() {
      this.createCover = function () {
        let topicType = `${kitty_topicData.isFree ? "免费" : ""}${
          kitty_topicData.vipLimit > 0 ? "vip" : ""
        }${kitty_topicData.saleType == 1 ? "金币" : ""}${
          kitty_topicData.saleType == 2 ? "钻石" : ""
        }`;
        let coverDiv = document.querySelector(".kitty_coverBox")
        let cover = coverDiv?coverDiv:document.createElement("div");
        cover.className = "kitty_coverBox kitty_coverBoxHidden";
        cover.innerHTML = `<div class="kitty_coverInnerBox">
            <div class="kitty_operateCover">
                <img class="kitty_closeCover" src="${kitty_icons.close}"></img>
                <img class="kitty_toTop" src="${kitty_icons.toTop}"></img>
                <img class="kitty_toBottom" src="${kitty_icons.toTop}"></img>
            </div>
            <h2>海角社区脚本</h2>
            <p>这个帖是${topicType}帖，脚本已经获取${topicType}内容，包含${
          kitty_topicData.hasAudio ? "音频 " : ""
        }${kitty_topicData.hasPic ? "图片 " : ""}${
          kitty_topicData.hasVideo ? "视频 " : ""
        }</p>
            <p>点击图片可放大, 再次点击可缩小</p>
        </div>`;
        if (!coverDiv) {
          document.body.append(cover);
        }
        kitty_utils.getElement(".kitty_closeCover").then((res) => {
          res[0].addEventListener("click", this.hiddenCover);
        });
        kitty_utils.getElement(".kitty_toTop").then((res) => {
          res[0].addEventListener("click", function () {
            kitty_utils.getElement(".kitty_coverInnerBox").then((box) => {
              box[0].scrollTop = 0;
            });
          });
        });
        kitty_utils.getElement(".kitty_toBottom").then((res) => {
          res[0].addEventListener("click", function () {
            kitty_utils.getElement(".kitty_coverInnerBox").then((box) => {
              box[0].scrollTop = box[0].scrollHeight;
            });
          });
        });
        kitty_utils.getElement("head").then((res) => {
          let style = document.createElement("style");
          style.innerHTML = `
          .kitty_coverInnerBox img.imgwidth100 {
            width: 100%;
          }
              .kitty_coverBoxHidden {
                display:none;
              }.kitty_coverBoxShow {
                display:block;
              }
              .kitty_coverBox {
                width: 100vw;
                height: 100vh;
                position: fixed;
                left: 0;
                top: 0;
                background: rgba(0,0,0, 0.5);
                z-index: 99999;
              }
              .kitty_coverInnerBox {
                position: relative;
                margin: 0 auto;
                width: ${isMobileDevice ? "100%" : "50%"};
                min-width: 300px;
                height: 100vh;
                overflow-y: scroll;
                text-align:center;
                background-color: white;
                padding-bottom: 100px;
              }
              .kitty_coverInnerBox p {
                padding: 10px;
                margin: 10px;
                font-size: 16px;
              }
              .kitty_closeCover {
                margin-bottom: 100px;
              }
              .kitty_operateCover {
                position: sticky;
                left: 100%;
                width: 50px;
                top: 20px;
                height: 30px;
              }
              .kitty_coverInnerBox img {
                cursor: pointer;
                width: 250px;
              }
              .kitty_coverInnerBox .kitty_operateCover img {
                width: 30px;
                display: block;
              }
              .kitty_toBottom {
                transform: rotate(180deg);
                margin-top: 20px;
              }
          `;
          res[0].append(style);
        });
      };
      this.hiddenCover = function () {
        kitty_utils.getElement(".kitty_coverBox").then((kitty_coverBox) => {
          kitty_coverBox[0].classList.add("kitty_coverBoxHidden");
          let audios = kitty_coverBox[0].querySelectorAll("audio");
          audios.forEach((audio) => {
            audio.pause();
          });
          let videos = kitty_coverBox[0].querySelectorAll("video");
          videos.forEach((video) => {
            video.pause();
          });
        });
      };
      this.showCover = function () {
        kitty_utils.getElement(".kitty_coverBox").then((kitty_coverBox) => {
          kitty_coverBox[0].classList.remove("kitty_coverBoxHidden");
        });
      };
    }
    function kitty_topicDataSetOver() {
      let cover = new KittyCover();
      cover.createCover();
      kitty_logListPush(
        `${
          kitty_topicData.isFree
            ? "<span class='kitty_contentGetOver'>这个帖子是免费的</span>"
            : "<span class='kitty_contentGetOver' style='cursor:pointer;'>帖子内容获取完毕, 请点此查看</span>"
        }`,
        "success",
        true
      );
      if (kitty_topicData.isFree) {
        document.querySelector(".kitty_jiexiBtn").innerHTML = "免费";
      } else {
        document.querySelector(".kitty_jiexiBtn").innerHTML = "解析";
      }
      document
        .querySelector(".kitty_jiexiBtn")
        .addEventListener("click", function () {
          if (!location.href.includes("post/details?pid")) {
            document.querySelector(".kitty_jiexiBtn").innerHTML = "暂无";
            return;
          }
          if (kitty_topicData.isFree) {
            document.querySelector(".kitty_jiexiBtn").innerHTML = "免费";
          } else {
            document.querySelector(".kitty_jiexiBtn").innerHTML = "解析";
            cover.showCover();
          }
        });
   
      kitty_utils.getElement(".kitty_contentGetOver").then((ele) => {
        ele[0].addEventListener("click", function () {
          if (!location.href.includes("post/details?pid")) {
            kitty_logListPush("没有帖子...", "warning");
            return;
          }
          cover.showCover();
          kitty_hiddenPanel();
        });
      });
   
      if (kitty_topicData.vipLimit) {
        kitty_topicViplimit();
      }
   
      if (kitty_topicData.hasPic) {
        kitty_insertPayImgsDom();
      }
      if (kitty_topicData.hasAudio) {
        kitty_insertAudioDom();
      }
      if (kitty_topicData.hasVideo) {
        // 发送请求到kittymao
        kitty_getVideoUrl();
      } else {
        kitty_coverAddContent(`<span style='color:red;'>这个帖子没有视频</span>`);
      }
      //cover.showCover();
    }
    function kitty_main() {
      
      kitty_xhrIntercept();
    }
    function kitty_checkLogin() {
      if (!kitty_isLogin()) {
        let interval = setInterval(() => {
          kitty_logListPush("没有登录海角账号,可能无法解析", "warning");
          if (kitty_isLogin()) {
            clearInterval(interval);
            location.reload();
          }
        }, 1000);
        return false;
      } else {
        kitty_logListPush("脚本运行成功，请尝试观看帖子", "success");
        return true;
      }
    }
    function kitty_isLogin() {
      if (kitty_utils.getCookie("uid") && kitty_utils.getCookie("token")) {
        return true;
      } else {
        return false;
      }
    }
    function kitty_copyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      console.log("文本已复制到剪贴板");
    }
    function kitty_isRun() {
      let run = false;
      if (
        document.querySelector("#kitty_vipPanel") ||
        document.querySelector("#vipPanel")
      ) {
        run = true;
      }
      if (!run) {
        console.log("panelInit");
        kitty_vipPanelInit();
        if (kitty_checkLogin()) {
          console.log("login");
          kitty_main();
        } else {
          kitty_showPanel();
        }
      }
    }
    kitty_isRun();
  })();