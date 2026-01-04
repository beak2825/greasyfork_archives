// ==UserScript==
// @name         swag+19J.TV韩国女主播-kittymao.xyz
// @name:zh-TW   swag+19J.TV韓國女主播-kittymao.xyz
// @namespace    http://tampermonkey.net/
// @version      2.4.2
// @description  用于观看swag(R站)vip视频+19J.TV韩国女主播vip视频
// @description:zh-TW  用于观看swag(R站)vip視頻+19J.TV韓國女主播vip視頻
// @author       kittymao
// @match        https://*/*
// @match        http://*/*
// @icon         https://ri306.xyz/blog/19tv/img/logo.png
// @grant        none
// @antifeature payment
// @downloadURL https://update.greasyfork.org/scripts/539971/swag%2B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%AD-kittymaoxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/539971/swag%2B19JTV%E9%9F%A9%E5%9B%BD%E5%A5%B3%E4%B8%BB%E6%92%AD-kittymaoxyz.meta.js
// ==/UserScript==
(function () {
  const KittyData = {
    checkPasscodeLoading: false,
    checkVersionLoading: false,
    hostIndex: 0,
    kittyPanel: null,
    localStorageName: "fjweo",
  };
  const KittyConfig = {
    name: "swag-19j脚本",
    id: "sw",
    version: "2.4.2",
    homePageName: "kitty猫",
    homePageUrl: "https://www.kittymao.xyz",
    requestHostList: ["https://www.kittymao.xyz/api"],
    checkPasscodePath: "/swag/getPermission",
    checkVersionPath: "/getVersion",
    mainColor: "#ff5595",
    buttonBackground: "#ff5595",
    statusColor: {
      success: "#67C23A",
      warning: "#E6A23C",
      info: "#909399",
      danger: "#F56C6C",
    },
    checkPasscode: async (txm) => {
      if (location.href.includes("19j")) {
            KittyConfig.checkPasscodePath = `/19j/getPermission`
        } else {
            KittyConfig.checkPasscodePath = `/swag/getPermission`
        }
      return fetch(`${KittyConfig.getHost()}${KittyConfig.checkPasscodePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: KittyConfig.version,
          cardContent: txm.trim(),
          nickname: KittyConfig.id,
        }),
      });
    },
    checkVersion: () => {
      return fetch(`${KittyConfig.getHost()}${KittyConfig.checkVersionPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: KittyConfig.id,
        }),
      });
    },
    checkPasscodeSuccess: (resData) => {
      let href = window.location.href
      if (href.includes("19j")) {
        let token = resData.token
        let url = `${location.protocol}//${location.hostname}/user/login?ruser=fengfeng&rtoken=${token}`
        KittyData.kittyPanel.log("请求成功, 刷新页面中请稍候...", "success");
        setTimeout(() => {
          location.href = url
        }, 1000)
      } else {
        let cookieArr = resData.token
        cookieArr.forEach((item) => {
          let temp = item.split(";")[0]
          let tempArr = temp.split("=")
          if (tempArr[0] == 'user') {
            setCookie('user', tempArr[1], 1)
          } else {
            setCookie(tempArr[0], tempArr[1])
          }
        })
        KittyData.kittyPanel.log("请求成功, 刷新页面中请稍候...", "success");
        setTimeout(() => {
          location.reload()
        }, 1000)
      }
    },
    checkVersionSuccess: (data) => {
      if (data.version === KittyConfig.version) {
        KittyData.kittyPanel.log("已是最新版", "success");
      } else {
        KittyData.kittyPanel.log("不是最新版,可能无法使用", "warning");
        KittyData.kittyPanel.log("最好先删除本脚本，然后重新安装", "warning");
        KittyData.kittyPanel.log(
          `<a href="${data.updateUrl.split(";")[0]
          }" target="_blank">点此更新</a>`,
          "success"
        );
      }
    },
    isChecked: () => {
      let dom = document.getElementById("vip1")
      let dom_ = document.querySelector("a.tx-flex-hc")
      let b = false
      if (dom_) {
        b = dom_.innerHTML.includes("会员中心")
      }
      if (dom || b) {
        return true
      } else {
        return false
      }
    },
    run: () => {
      UTILS.xhrIntercept();
      let site = false
      let run = false
      if (document.title.includes('韩国主播国产主播原创网') || document.title.includes('SWAG资源合集下载')) {
        site = true
      }
      if (document.querySelector("#kitty_vipPanel") || document.querySelector("#vipPanel")) {
        run = true
      }
      if (site && !run) {
        KittyData.kittyPanel = new KittyPanel();
        document.querySelector("#kitty_txm").value = localStorage.getItem(
          "kitty_txm"
        )
          ? localStorage.getItem("kitty_txm")
          : "";
        if (KittyConfig.isChecked()) {
          setTimeout(() => {
            KittyData.kittyPanel.hiddenPanel();
          }, 0);
          KittyData.kittyPanel.log("口令校验成功，请观看vip内容", "success");
          KittyData.kittyPanel.changeTab(1);
        } else {
          KittyData.kittyPanel.logAndMessage("请点击GO按钮校验口令", "warning");
        }
        console.log("启动脚本");
      }
    },
    getHost: () => {
      const successIndex = localStorage.getItem(
        "kitty_requestSuccessHostIndex"
      );
      if (successIndex) {
        KittyData.hostIndex = successIndex;
      }
      return KittyConfig.requestHostList[KittyData.hostIndex];
    },
    onRequest(this_, url) {

    },
    onResponse: (this_, url) => {
      if (KittyConfig.isChecked()) {
        if (location.href.includes("/category") && url.includes(".m3u8")) {
          const m3u8Url = `${url}`;
          const videoTitle = document.title;
          KittyData.kittyPanel.log(
            `<span>捕获到视频链接 ${videoTitle} <a style="cursor:pointer;color:${KittyConfig.statusColor.success};" onClick="window.kitty_copyTextToClipboard('${videoTitle}')">复制标题</a></span>`,
            "info"
          );
          KittyData.kittyPanel.log(
            `<a style="cursor:pointer;" target="_blank" href="https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=${m3u8Url}">点此在线下载（可能无法下载），跳转后请点击第二个绿色按钮开始下载</a>`,
            "warning"
          );
          KittyData.kittyPanel.log(
            `<a style="cursor:pointer;" target="_blank" href="https://www.kittymao.xyz/videoDownload">可选择软件下载，点此查看下载教程</a>`,
            "warning"
          );
          KittyData.kittyPanel.log(
            `<a style="cursor:pointer;" onClick="window.kitty_copyTextToClipboard('${m3u8Url}')">点此复制视频链接</a>`,
            "success"
          );
        }
      }
    },
  };
const UTILS = {
    isIosDevice: () => {
        return /iPhone|iPod|iPad/.test(navigator.platform);
    },
    isMobileDevice: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    },
    xhrIntercept: () => {
        const xhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async) {
            const onreadystatechange_ = this.onreadystatechange;
            const this_ = this;
            this.onreadystatechange = function () {
                if (this_.readyState === 1) {
                    // 请求刚开始
                    KittyConfig.onRequest(this_, url);
                }
                if (this_.readyState == 4 && this_.status == 200) {
                    // 请求成功
                    KittyConfig.onResponse(this_, url);
                }
                if (onreadystatechange_) {
                    onreadystatechange_();
                }
            };
            return xhrOpen.call(this, method, url, async);
        };

        const originalFetch = window.fetch;
        window.fetch = new Proxy(originalFetch, {
            apply: async function (target, thisArg, argumentsList) {
                // 发起原始的fetch请求
                const response = await target.apply(thisArg, argumentsList);
                const url = argumentsList[0]
                if (KittyConfig.onResponse_fetch) {
                    return await KittyConfig.onResponse_fetch(url, response)
                }
                return response;
            },
        });
        console.log("run");
    },
    copyTextToClipboard: (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        console.log("文本已复制到剪贴板");
        KittyData.kittyPanel.log("已复制到剪贴板");
    },
};
class KittyPanel {
    tabIndex = 0;
    messageTimeout = null;
    async multiLineRequest(request, args = []) {
        this.logAndMessage("发送请求中，请稍候", "info");
        let checkRes = null;
        let lineCount = -1;
        while (!checkRes) {
            try {
                checkRes = await request(...args);
            } catch (e) {
                console.log(e);
                this.logAndMessage("网络或服务器错误", "danger");
                if (lineCount < KittyConfig.requestHostList.length - 1) {
                    this.logAndMessage("切换线路中，请稍候...", "warning");
                    localStorage.removeItem("kitty_requestSuccessHostIndex");
                    lineCount++;
                    KittyData.hostIndex = lineCount;
                } else {
                    this.logAndMessage("请求失败，请联系开发者", "danger");
                    break;
                }
            }
        }
        return checkRes;
    }
    async handleFetchRes(res, success) {
        if (!res) {
            return;
        }
        let resultData = null;
        try {
            resultData = await res.json();
        } catch (e) {
            this.logAndMessage("JSON 解析出错", "danger");
            this.log(await res.text(), "info");
        }
        if (resultData.success) {
            success(resultData.data);
        } else {
            this.logAndMessage(resultData.message, "warning");
        }
        localStorage.setItem(
            "kitty_requestSuccessHostIndex",
            KittyData.hostIndex
        );
    }
    getStatusTypeText(type) {
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
        }
        return typeText;
    }
    log(str, type) {
        const div = document.createElement("div");
        div.innerHTML = `${this.getStatusTypeText(type)}：${str}`;
        div.style.color = KittyConfig["statusColor"][type];
        const kitty_logList = document.querySelector(".kitty_logList");
        kitty_logList.appendChild(div);
        kitty_logList.scrollTop = kitty_logList.scrollHeight;
    }
    message(str) {
        clearTimeout(this.messageTimeout);
        const alertMessage = document.getElementById("kitty_alert_message");
        alertMessage.style.opacity = "1";
        alertMessage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><span style="margin-left: 5px;">${str}</span>`;
        this.messageTimeout = setTimeout(() => {
            alertMessage.style.opacity = "0";
        }, 2000);
    }
    hiddenPanel() {
        document.querySelector("#kitty_vipPanel").className = "hiddenPanel";
        document.querySelector(".kitty_showPanelBtn").style.display = "block";
    }
    showPanel() {
        document.querySelector("#kitty_vipPanel").className = "";
        document.querySelector(".kitty_showPanelBtn").style.display = "none";
    }
    changeTab(index) {
        this.tabIndex = index;
        let panelBodys = document.querySelectorAll(".kitty_panelBody");
        if (!panelBodys[this.tabIndex]) {
            return;
        }
        for (let i = 0; i < panelBodys.length; i++) {
            panelBodys[i].style.display = "none";
        }
        panelBodys[this.tabIndex].style.display = "block";

        let tabs = document.querySelectorAll(".kitty_panelHead>div");
        for (let ii = 0; ii < tabs.length; ii++) {
            tabs[ii].className = "";
        }
        tabs[index].className = "kitty_headDivActive";
    }
    eventBind() {
        let tabs = document.querySelectorAll(".kitty_panelHead>div");
        const this_ = this;
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function () {
                this_.changeTab(i);
            });
        }
        document
            .querySelector(".kitty_hiddenPanelBtn")
            .addEventListener("click", function () {
                this_.hiddenPanel();
            });
        document
            .querySelector(".kitty_showPanelBtn")
            .addEventListener("click", function () {
                this_.showPanel();
            });
        let gets = document.querySelectorAll(".kitty_goToVipBtn");
        gets[0].addEventListener("click", function () {
            this_.panelCheckPasscode();
        });
        document
            .querySelector(".kitty_checkVersion")
            .addEventListener("click", async function () {
                if (KittyData.checkVersionLoading) {
                    return;
                }
                KittyData.checkVersionLoading = true;
                let checkRes = await this_.multiLineRequest(KittyConfig.checkVersion);
                await this_.handleFetchRes(checkRes, KittyConfig.checkVersionSuccess);
                KittyData.checkVersionLoading = false;
            });
    }
    logAndMessage(message, type) {
        this.log(message, type);
        this.message(message);
    }
    async panelCheckPasscode() {
        if (KittyData.checkPasscodeLoading) {
            return this.logAndMessage("正在请求...", "info");
        }
        KittyData.checkPasscodeLoading = true;
        let txm = document.querySelector("#kitty_txm").value;
        if (!txm) {
            this.logAndMessage("请输入口令", "info");
            return;
        }
        localStorage.setItem("kitty_txm", txm);
        let checkRes = await this.multiLineRequest(KittyConfig.checkPasscode, [
            txm,
        ]);
        await this.handleFetchRes(checkRes, KittyConfig.checkPasscodeSuccess);
        KittyData.checkPasscodeLoading = false;
    }
    insertStyle() {
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
                          --script-panel-main-color: ${KittyConfig.mainColor};
                          transition: all 0.5s;
                      }
                      #kitty_vipPanel a {
                          text-decoration: underline;
                      }
                      .kitty_panelMain {
                          font-size: 0.85em;
                      }
                      .hiddenPanel {
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
                          bottom: 20px;
                          cursor: pointer;
                          right: -35px;
                          display: none;
                      }
                      .kitty_hiddenPanelBtn {
                          position: absolute;
                          bottom: 20px;
                          cursor: pointer;
                          right: 20px;
                          color: #000;
                      }
                      /* 身体 */
                      .kitty_panelBody  {
                          padding: 0 10px;
                      }
                      .kitty_panelBody p {
                          margin: 10px 0;
                          color: black;
                      }
                      .kitty_panelBody div {
                        color: #71777d;
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
                          color: black !important;
                          width: 100%;
                          background-color: white;
                      }
                      /* 输入框-end */
                      /* log-start */
                      .kitty_logList {
                          height: 350px;
                          overflow-y: scroll;
                          /* 隐藏滚动条（适用于 Chrome、Safari 和 Opera） */
                          -webkit-scrollbar {
                              display: none;
                          }
                          /* 隐藏滚动条（适用于 IE、Edge 和 Firefox） */
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                          word-break: break-all;
                      }
                      /* GO按钮-start */
                      .kitty_goToVipBtn {
                          color: #FFFFFF;
                          font-weight: bold;
                          background:${KittyConfig.buttonBackground};
                          height: 100px;
                          width: 100px;
                          border-radius: 50px;
                          text-align: center;
                          line-height: 100px;
                          margin: 80px auto 0px;
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
                      /* GO按钮-end */
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
  
                      /* dialog */
                      #kitty_modal {
                          position: fixed;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          outline: none;
                          width: 300px;
                          padding: 10px;
                          border-radius: 5px;
                      }
                      .kitty_modal_header {
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-bottom: 1px solid #DCDCDC;
                          padding-bottom: 10px;
                      }
                      .kitty_modal_header {
                          cursor: pointer;
                      }
                      .kitty_modal_content {
                          padding: 10px 0;
                      }
                      #kitty_modal::backdrop {
                          background: rgba(0, 0, 0, 0.4);
                      }
                      .kitty_custom_alert {
                          width: 200px;
                          font-size: ${UTILS.isMobileDevice() ? '0.3rem' : '0.8rem'};
                          position: absolute;
                          bottom: 20px;
                          left: 50%;
                          transform: translateX(-50%);
                          background-color: #000;
                          color: white;
                          padding: 8px;
                          border-radius: 5px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                          opacity: 0;
                          transition: opacity 0.3s ease-in-out;
                          display: flex;
                          align-items:center;
                          justify-content: center;
                      }
                  `;
        document.querySelector("head").appendChild(style);
    }
    createPanel() {
        let panel = document.createElement("div");
        panel.setAttribute("id", "kitty_vipPanel");
        panel.innerHTML = `
                      <div class="kitty_showPanelBtn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg></div>
                      <div class="kitty_hiddenPanelBtn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></div>
                      <div class="kitty_panelMain">
                          <div class="kitty_panelHead">
                              <div class="kitty_headDivActive">口令验证</div>
                              <div>脚本信息</div>
                              <div>其他资源</div>
                              <div>注意事项</div>
                          </div>
                          <div class="kitty_panelBody kitty_panelBody_0">
                              <div class="kitty_searchInput">
                                  <input id="kitty_txm" type="text" placeholder="请输入口令">
                              </div>
                              <div class="kitty_goToVipBtn kitty_navy">
                                  <span>G</span>
                                  <span>O</span>
                                  <span>!</span>
                              </div>
                          </div>
                          <div class="kitty_panelBody kitty_panelBody_1" style="display:none;">
                              <div class="kitty_logOutput">
                                  <div>脚本：<span class="kitty_scriptName">${KittyConfig.name}</span>-<span class="kitty_version">${KittyConfig.version}</span>-<span class="kitty_checkVersion" style="user-select: none;cursor: pointer;color:${KittyConfig.statusColor["warning"]}">检查更新</span></div>
                                  <div>主页：<a class="kitty_homepage" target="_blank" href="${KittyConfig.homePageUrl}">${KittyConfig.homePageName}主页</a></div>
                                  <div>邮箱：JamJamToday@protonmail.com</div>
                                  <div class="kitty_logList">
                                  </div>
                              </div>
                          </div>
                          <div class="kitty_panelBody kitty_panelBody_2" style="display:none;">
                          <div>暂无</div>
                          </div>
                          <div class="kitty_panelBody kitty_panelBody_3" style="display:none;">
                          <div>暂无</div>
                          </div>
                      </div>
                      <dialog id="kitty_modal">
                          <div class="kitty_modal_body">
                              <div class="kitty_modal_header">
                                  <div class="kitty_modal_title">消息</div>
                                  <div class="kitty_modal_close" onclick="kitty_modal.close()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>
                              </div>
                              <div class="kitty_modal_content">
                                  这是内容，这是内容。
                              </div>
                          </div>
                      </dialog>
                      <div id="kitty_alert_message" class="kitty_custom_alert">这是一个自定义提示框！</div>
                  `;
        document.body.appendChild(panel);
    }
    constructor() {
        this.insertStyle();
        this.createPanel();
        this.eventBind();
        window.kitty_copyTextToClipboard = UTILS.copyTextToClipboard;
        // document.querySelector("#kitty_modal").showModal()
    }
}

  // build insert position
  KittyConfig.run();
})();
