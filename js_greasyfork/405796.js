// ==UserScript==
// @name         Bilibili直播间助手
// @namespace    http://tampermonkey.net/
// @version      1.0.9.3
// @description  提供同传弹幕过滤,快速切换牌子,自动切换直播清晰度等功能
// @author       QingMu_
// @match        *://live.bilibili.com/*
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @require      https://cdn.jsdelivr.net/npm/alpinejs@3.12.2/dist/cdn.min.js
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/405796/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405796/Bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';
    function main() {
        initCss();
        waitDoucment(MedalComponent);
        waitDoucment(FilterSettingComponent);
        waitDoucment(FilterBoxComponent)

        // 防休眠
        setInterval(() => {
            setTimeout(() => {
                document.body.dispatchEvent(
                    new Event("mousemove", { bubbles: true })
                );
            }, Math.random() * 2000);
        }, 10000);
    }
    const toast = {
        line: 0,
        withConsole: false,
        init(msg) {
            let box = document.createElement("div");
            box.innerText = msg;
            box.style.setProperty("position", "fixed");
            box.style.setProperty("padding", "12px 24px");
            box.style.setProperty("font-size", "14px");
            box.style.setProperty("border-radius", "10px");
            box.style.setProperty("color", "#fff");
            box.style.setProperty("z-index", "999999");
            box.style.setProperty("max-width", "70%");
            box.style.setProperty("word-wrap", "break-word");
            setTimeout(function () {
                let num = document.querySelectorAll(".animate-toast").length;
                if (num <= 1) {
                    toast.line = 0;
                }
                document.body.removeChild(box);
            }, 3000);
            document.body.appendChild(box);
            return box;
        },
        success(msg, x, y) {
            let box = this.init(msg);
            let px = x ? x + "px" : (document.body.clientWidth - box.clientWidth - 10) + "px";
            let py = y ? y + "px" : this.line + 10 + "px";
            this.line += box.clientHeight + 5;
            box.className = "animate-toast";
            box.style.setProperty("background-color", "#47D279");
            box.style.setProperty(
                "box-shadow",
                "0.1em 0.1em .1em rgba(71, 210, 121, .2)"
            );
            box.style.setProperty("left", px);
            box.style.setProperty("top", py);
            if (toast.withConsole) console.log(msg);
        },
        error(msg, x, y) {
            let box = this.init(msg);
            let px = x ? x + "px" : (document.body.clientWidth - box.clientWidth - 10) + "px";
            let py = y ? y + "px" : this.line + 10 + "px";
            this.line += box.clientHeight + 5;
            box.className = "animate-toast";
            box.style.setProperty("background-color", "#F04742");
            box.style.setProperty(
                "box-shadow",
                "0.1em 0.1em .1em rgba(240, 71, 66, .2)"
            );
            box.style.setProperty("left", px);
            box.style.setProperty("top", py);
            if (toast.withConsole) console.error(msg);
        },
        warning(msg, x, y) {
            let box = this.init(msg);
            let px = x ? x + "px" : (document.body.clientWidth - box.clientWidth - 10) + "px";
            let py = y ? y + "px" : this.line + 10 + "px";
            this.line += box.clientHeight + 5;
            box.className = "animate-toast";
            box.style.setProperty("background-color", "#EFA957");
            box.style.setProperty(
                "box-shadow",
                "0.1em 0.1em .1em rgba(239, 169, 87, .2)"
            );
            box.style.setProperty("left", px);
            box.style.setProperty("top", py);
            if (toast.withConsole) console.warn(msg);
        },
        info(msg, x, y) {
            let box = this.init(msg);
            let px = x ? x + "px" : (document.body.clientWidth - box.clientWidth - 10) + "px";
            let py = y ? y + "px" : this.line + 10 + "px";
            this.line += box.clientHeight + 5;
            box.className = "animate-toast";
            box.style.setProperty("background-color", "#48bbf8");
            box.style.setProperty(
                "box-shadow",
                "0.1em 0.1em .1em rgba(72, 187, 248, .2)"
            );
            box.style.setProperty("left", px);
            box.style.setProperty("top", py);
            if (toast.withConsole) console.log(msg);
        },
    };

    function waitDoucment(domOperate, timeout = 1 * 1000) {
        function wait() {
            try {
                domOperate();
            } catch (e) {
                setTimeout(wait, timeout);
            }
        }
        wait();
    }

    function initCss() {
        let css = `
    /* 屏蔽原来的按钮与弹窗 */
    .medal-section {
      display: none !important;
    }
    .dialog-ctnr.medal {
      display: none !important;
    }
    #shop-popover-vm {
      display: none !important;
    }

    /* toast 动画 */
    .animate-toast {
      animation: dropIn 0.5s, hidden 3.1s;
    }
    @keyframes dropIn {
      from {
        transform: translateY(20px);
      }
      to {
        transform: translateY(0px);
      }
    }
    @keyframes hidden {
      0%,
      75% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes scale-in-ease {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes scale-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }

    /* 按钮样式 */
    .bilitools-button {
      position: relative;
      box-sizing: border-box;
      line-height: 1;
      margin: 0;
      padding: 6px 12px;
      border: 0;
      background-color: transparent;
      cursor: pointer;
      outline: 0;
      overflow: hidden;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #23ade5;
      color: #fff;
      border-radius: 4px;
    }
    .bilitools-button.bleak {
      background-color: #909399;
    }
    .bilitools-button.disable {
      cursor: not-allowed;
      background-color: #e9eaec;
      color: #b4b4b4;
    }
    .bilitools-medal-button:hover {
      background-color: #39b5e7;
    }
    .bilitools-medal-button:active {
      background-color: #21a4d9;
    }

    /* 复选框样式 */
    .bilitools-switch {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      text-align: center;
      position: relative;
      width: 26px;
      height: 14px;
      border: 1px solid #dfdfdf;
      outline: 0;
      border-radius: 16px;
      box-sizing: border-box;
      background: #cccccc;
      cursor: pointer;
      margin: 0 5px;
    }

    .bilitools-switch:active,
    .bilitools-switch:visited {
      outline: none;
    }

    .bilitools-switch:before {
      content: attr(data-off);
      position: absolute;
      top: 0;
      left: 0;
      padding-left: 24px;
      border-radius: 15px;
      background-color: #cccccc;
      color: #fff;
    }

    .bilitools-switch:after {
      content: " ";
      position: absolute;
      top: -3px;
      left: -3px;
      width: 17px;
      height: 17px;
      border-radius: 15px;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s;
    }

    .bilitools-switch:checked {
      border-color: #23ade5;
      background-color: #23ade5;
    }

    .bilitools-switch:checked:before {
      content: attr(data-on);
      padding-left: 0px;
      background-color: #23ade5;
      color: #fff;
      width: 31px;
    }

    .bilitools-switch:checked::after {
      transform: translateX(12px);
    }

    /* 模态框 */
    .bilitools-medal-modal-bg {
      width: 100%;
      height: 100%;
      position: fixed;
      overflow: hidden;
      z-index: 9999999;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.06);
    }
    .bilitools-medal-modal-box {
      width: 45%;
      height: 60%;
      min-width: 700px;
      padding: 1rem;
      background-color: #fff;
      color: rgb(75, 85, 99);
      border-radius: 0.25rem;
      box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 0.22);
    }
    .bilitools-medal-modal-box-header {
      display: flex;
      justify-content: space-between;
    }
    .bilitools-medal-modal-box-header span {
      font-size: 18px;
      line-height: 24px;
    }
    .bilitools-close {
      color: #cfcfcf;
      font-size: 18px;
      line-height: 24px;
      cursor: pointer;
      outline: none;
      border: none;
      background-color: #fff;
    }
    .bilitools-close:hover {
      color: #23ade5;
    }
    .bilitools-medal-modal-box-body {
      display: block;
      height: calc(100% - 24px);
    }

    /* 牌子相关 布局 */
    .bilitools-medal-setting {
      display: flex;
      flex-wrap: wrap;
      text-align: left;
      font-size: 12px;
    }
    .setting-full {
      width: 100%;
      margin: 2px 0;
    }
    .setting-half {
      margin: 2px 0;
      width: 50%;
    }
    #bilitools-havent {
      background-color: #fff;
      border: 2px solid #e9ebef;
      color: #77787c;
      border-radius: 4px;
      padding: 4px;
      font-size: 14px;
    }
    #bilitools-search {
      border: 2px solid #e9ebef;
      color: #77787c;
      border-radius: 4px;
      padding: 5px;
      font-size: 14px;
      outline: none;
      width: 70%;
    }
    #bilitools-havent option {
      color: #000;
      font-size: 12px;
    }
    #bilitools-havent:hover,
    #bilitools-search:hover {
      border: 2px solid #c7cbd2;
    }
    #bilitools-havent:focus,
    #bilitools-search:focus {
      border: 2px solid #87c2ff;
    }

    /* 展示区域 */
    .bilitools-medal-table {
      margin-top: 10px;
      font-size: 14px;
    }
    .bilitools-medal-table table {
      border-collapse: separate;
      border-spacing: 0px 5px;
      width: 100%;
      height: 100%;
    }
    .bilitools-medal-table-body {
      display: block;
      overflow: hidden auto;
      height: 100px;
    }
    .bilitools-medal-table-row,
    .bilitools-medal-table-header {
      display: table;
      table-layout: fixed;
      width: 100%;
    }

    .bilitools-medal-table-row:hover {
      background-color: #f5f7fa;
    }
    .bilitools-liver-name a {
      color: #409eff;
      text-decoration: none;
    }
    .bilitools-liver-name,
    .bilitools-medal-name,
    .bilitools-medal-level,
    .bilitools-medal-exp,
    .bilitools-medal-exp-limit,
    .bilitools-medal-operate {
      text-align: left;
      padding: 10px;
      user-select: none;
    }
    .bilitools-liver-name.sort::after,
    .bilitools-medal-name.sort::after,
    .bilitools-medal-level.sort::after,
    .bilitools-medal-exp.sort::after,
    .bilitools-medal-exp-limit.sort::after {
      content: ">";
      display: inline-block;
      color: inherit;
      margin-left: 5px;
      font-weight: 900;
      transform: rotate(90deg);
    }

    .active.positive::after,
    .active.positive::after,
    .active.positive::after,
    .active.positive::after,
    .active.positive::after {
      content: ">";
      display: inline-block;
      color: #409eff;
      margin-left: 5px;
      font-weight: 900;
      transform: rotate(90deg);
    }
    .active.reverse::after,
    .active.reverse::after,
    .active.reverse::after,
    .active.reverse::after,
    .active.limit.reverse::after {
      content: ">";
      display: inline-block;
      color: #409eff;
      margin-left: 5px;
      font-weight: 900;
      transform: rotate(-90deg);
    }

    .bilitools-medal-operate::after {
      content: none !important;
    }
    .bilitools-medal-status {
      display: inline-block;
      border: 1px solid;
      border-radius: 4px;
      padding: 4px;
      color: #fff;
    }

    /* 弹幕过滤相关 */
    .bilitools-icons {
      display: inline-block;
      position: relative;
      vertical-align: top;
      fill: #c8c8c8;
      margin: 0 5px;
      font-size: 0;
      color: #c8c8c8;
    }
    .bilitools-icons svg {
      width: 22px;
      height: 22px;
    }
    .bilitools-icons:hover {
      color: #23ade5;
      fill: #23ade5;
    }
    .bilitools-icons.active {
      color: #23ade5;
      fill: #23ade5;
    }
    .bilitools-arrow::after {
      content: "";
      position: absolute;
      display: inline-block;
      z-index: 9999;
      width: 0;
      height: 0;
      top: 100%;
      left: 20%;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 8px solid #fff;
    }
    .bilitools-dialog {
      position: absolute;
      z-index: 699;
      padding: 16px;
      font-size: 14px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #e9eaec;
      border-radius: 8px;
      box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 0.22);
      color: rgb(75, 85, 99);
      word-break: keep-all;
      left: -210%;
    }
    .animate-scale-in-ease {
      animation: scale-in-ease cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
    }
    .animate-scale-out {
      animation: scale-out cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
    }
    .bilitools-dialog-title {
      font-weight: 400;
      font-size: 18px;
      color: #23ade5;
    }
    .bilitools-dialog input[type="text"] {
      border: 2px solid #e9ebef;
      color: #77787c;
      border-radius: 4px;
      padding: 3px;
      font-size: 14px;
      outline: none;
      width: 100px;
      margin: 0 5px;
    }
    .bilitools-dialog input[type="text"]:hover {
      border: 2px solid #c7cbd2;
    }
    .bilitools-dialog input[type="text"]:focus {
      border: 2px solid #87c2ff;
    }
    .bilitools-dialog-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      position: relative;
      flex-wrap: wrap;
    }
    .bliltools-scroll {
      width: 100%;
      height: 100px;
      overflow: hidden auto;
    }
    .bilitools-dragable {
      position: absolute;
      user-select: none;
      cursor: move;
      z-index:9999;
      pointer-events: all;
    }
    .bilitools-filterBox {
      height: 2rem;
      max-width: 60rem;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 4px;
      padding: 10px;
      overflow: hidden scroll;
      line-height: 2rem;
      color: #fff;
      scrollbar-width: none;
      word-break: keep-all;
    }
    .bilitools-filterBox::-webkit-scrollbar {
      display: none;
    }
    .bilitools-filterBox p {
      margin: 0 5px;
      font-size: 18px;
    }
    .bilitools-filterBox.multiline {
      height: 6rem;
      text-align: left;
    }
    /* 修复模态框层级问题 */
    #aside-area-vm{
      z-index:999;
    }
    `;
        let styleElement = document.createElement("style");
        styleElement.innerText = css;
        document.head.appendChild(styleElement);
    }

    function MedalComponent() {
        window.loadMedalConfig = function () {
            return {
                medalConfig: {
                    wore: "",
                    searchText: "",
                    searchList: [],
                    autoWear: {
                        enable: false,
                        remember: 0
                    },
                    sortType: {
                        sorted: 0,
                        uname: true,
                        medalName: true,
                        level: true,
                        exp: true,
                        limit: true
                    },
                    list: [],
                    modalAnimate: false
                },
                medalBox: false,
                openMedalBox() {
                    this.getWore().then(res => {
                        this.medalConfig.wore = res.length == 0 ? "" : res.medal_name;
                    })
                    this.updateMedalList();
                    this.modalAnimate = true;
                    this.medalBox = true;
                },
                closeMedalBox() {
                    this.modalAnimate = false;
                    setTimeout(() => {
                        this.medalConfig.sortType.sorted = 0;
                        this.medalConfig.searchText = "";
                        this.medalConfig.searchList = [];
                        this.medalConfig.list = [];
                        this.medalBox = false;
                    }, 400)
                },
                initComponent() {
                    this.readSetting().then((config)=>{
                        if (config.enable){
                            document.querySelector(".chat-input-ctnr textarea").addEventListener("click",(e)=>{
                                this.autoWear()
                            })
                        }
                    });

                    // 初始化检查牌子
                    this.getWore().then(res => {
                        this.medalConfig.wore = res.length == 0 ? "" : res.medal_name;
                    })

                },
                // 太菜了 css解决不了表格溢出 先这么用着
                computedHeight() {
                    let bodyBox = this.$refs.bodyBox;
                    let setting = this.$refs.setting;
                    let tableHeader = this.$refs.tableHeader;
                    return bodyBox.offsetHeight - setting.offsetHeight - tableHeader.offsetHeight;
                },
                search() {
                    this.medalConfig.searchList = [];
                    for (let item of this.medalConfig.list) {
                        if (
                            item.uname
                            .toLocaleLowerCase()
                            .indexOf(this.medalConfig.searchText.trim().toLocaleLowerCase()) !==
                            -1 ||
                            item.medal_name
                            .toLocaleLowerCase()
                            .indexOf(this.medalConfig.searchText.trim().toLocaleLowerCase()) !== -1
                        ) {
                            this.medalConfig.searchList.push(item);
                        }
                    }
                },
                sort(col) {
                    this.medalConfig.sortType.sorted = col;
                    switch (col) {
                        case 1: {
                            if (this.medalConfig.sortType.uname) {
                                this.medalConfig.list.sort(function (a, b) {
                                    return a.uname.localeCompare(b.uname, "zh");
                                });
                            } else {
                                this.medalConfig.list.reverse();
                            }
                            this.medalConfig.sortType.medalName = true;
                            this.medalConfig.sortType.level = true;
                            this.medalConfig.sortType.exp = true;
                            this.medalConfig.sortType.limit = true;
                            this.medalConfig.sortType.uname = !this.medalConfig.sortType.uname;

                            break;
                        }
                        case 2: {
                            if (this.medalConfig.sortType.medalName) {
                                this.medalConfig.list.sort(function (a, b) {
                                    return a.medalName.localeCompare(b.medalName, "zh");
                                });
                            } else {
                                this.medalConfig.list.reverse();
                            }
                            this.medalConfig.sortType.uname = true;
                            this.medalConfig.sortType.level = true;
                            this.medalConfig.sortType.exp = true;
                            this.medalConfig.sortType.limit = true;
                            this.medalConfig.sortType.medalName = !this.medalConfig.sortType.medalName;
                            break;
                        }
                        case 3: {
                            if (this.medalConfig.sortType.level) {
                                this.medalConfig.list.sort(function (a, b) {
                                    return a.level - b.level;
                                });
                            } else {
                                this.medalConfig.list.reverse();
                            }
                            this.medalConfig.sortType.uname = true;
                            this.medalConfig.sortType.medalName = true;
                            this.medalConfig.sortType.exp = true;
                            this.medalConfig.sortType.limit = true;
                            this.medalConfig.sortType.level = !this.medalConfig.sortType.level;
                            break;
                        }
                        case 4: {
                            if (this.medalConfig.sortType.exp) {
                                this.medalConfig.list.sort(function (a, b) {
                                    return a.intimacy - b.intimacy;
                                });
                            } else {
                                this.medalConfig.list.reverse();
                            }
                            this.medalConfig.sortType.uname = true;
                            this.medalConfig.sortType.medalName = true;
                            this.medalConfig.sortType.level = true;
                            this.medalConfig.sortType.limit = true;
                            this.medalConfig.sortType.exp = !this.medalConfig.sortType.exp;
                            break;
                        }
                        case 5: {
                            if (this.medalConfig.sortType.limit) {
                                this.medalConfig.list.sort(function (a, b) {
                                    return a.today_intimacy - b.today_intimacy;
                                });
                            } else {
                                this.medalConfig.list.reverse();
                            }
                            this.medalConfig.sortType.uname = true;
                            this.medalConfig.sortType.medalName = true;
                            this.medalConfig.sortType.level = true;
                            this.medalConfig.sortType.exp = true;
                            this.medalConfig.sortType.limit = !this.medalConfig.sortType.limit;
                            break;
                        }
                    }
                },
                topping(arrays) {
                    let wore = [];
                    let room_medal = [];
                    let medals = [];
                    for (let item of arrays) {
                        if (item.medal_name == this.medalConfig.wore) {
                            wore.push(item)
                        } else if (item.roomid == window.BilibiliLive.SHORT_ROOMID || item.roomid == window.BilibiliLive.ROOMID) {
                            room_medal.push(item)
                        } else {
                            medals.push(item);
                        }
                    }
                    medals.sort((a, b) => b.level - a.level);
                    medals.sort((a, b) => b.is_lighted - a.is_lighted);
                    return [...wore, ...room_medal, ...medals];
                },
                sortedStyle(col) {
                    let isActive = this.medalConfig.sortType.sorted == col ? 'active ' : ' ';
                    let sortType = "";
                    switch (col) {
                        case 1: {
                            sortType = this.medalConfig.sortType.uname ? 'positive' : 'reverse';
                            break;
                        }
                        case 2: {
                            sortType = this.medalConfig.sortType.medalName ? 'positive' : 'reverse';
                            break;
                        }
                        case 3: {
                            sortType = this.medalConfig.sortType.level ? 'positive' : 'reverse';
                            break;
                        }
                        case 4: {
                            sortType = this.medalConfig.sortType.exp ? 'positive' : 'reverse';
                            break;
                        }
                        case 5: {
                            sortType = this.medalConfig.sortType.limit ? 'positive' : 'reverse';
                            break;
                        }
                    }
                    return (isActive + sortType).trim();
                },
                updateMedalList() {
                    let tasks = [];
                    let tmp_array = [];
                    if (this.medalConfig.list.length == 0) {
                        this.getMedalPage(1).then(res => {
                            tmp_array = res.data.items;
                            console.log(res.data)
                            for (let page = 2; page <= res.data.page_info.total_page; page++) {
                                tasks.push(this.getMedalPage(page))
                            }
                            Promise.all(tasks).then(res => {
                                for (const item of res) {
                                    Array.prototype.push.apply(tmp_array, item.data.items);
                                }
                            }).then(() => {
                                this.medalConfig.list = this.topping(tmp_array);
                            })
                        })
                    }
                },
                saveSetting() {
                    window.localStorage.setItem("bilitools-autowear", JSON.stringify(this.medalConfig.autoWear))
                },
                async readSetting() {
                    let config = await window.localStorage.getItem("bilitools-autowear");
                    if (!(config === "undefined" || config == null)) {
                        this.medalConfig.autoWear = JSON.parse(config);
                    }
                    return this.medalConfig.autoWear;
                },
                getToken() {
                    return document.cookie.match(/bili_jct=(.+?);/)[1];
                },
                autoWear() {
                    this.getWore().then(res => {
                        this.medalConfig.wore = res.length == 0 ? "" : res.medal_name;
                    }).then(() => {
                        if (window.__NEPTUNE_IS_MY_WAIFU__ && this.medalConfig.autoWear.enable) {
                            let medalInfo = window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.anchor_info.medal_info;
                            if (medalInfo && medalInfo.medal_name !== this.medalConfig.wore) {
                                this.wear(medalInfo.medal_id).catch(e => {
                                    setTimeout(() => {
                                        if (this.medalConfig.autoWear.remember !== 0) {
                                            this.wear(this.medalConfig.autoWear.remember).catch(e => { });
                                        } else {
                                            this.takeOff();
                                        }
                                    }, 1500);
                                });
                            }else if (this.checkContained(medalInfo.medal_name)) {
                                if (this.medalConfig.autoWear.remember !== 0) {
                                    this.wear(this.medalConfig.autoWear.remember).catch(e => { });
                                } else {
                                    this.takeOff();
                                }
                            }
                        }
                    })
                },
                checkContained(name){
                    for(let item of this.medalConfig.list){
                        if(item.medal_name === name) return true;
                    }
                    return false;
                },
                refreshMedalCache() {
                    let originalMedalButton = document.querySelector('.dp-i-block.medal-item-margin')
                    if (originalMedalButton === null) {
                        return
                    }
                    originalMedalButton.click()
                    setTimeout(() => originalMedalButton.click(), 0)
                },
                async getMedalPage(page) {
                    const res = await fetch("https://api.live.bilibili.com/xlive/app-ucenter/v1/user/GetMyMedals?page_size=10&page=" + page, {
                        method: "GET",
                        credentials: "include"
                    });
                    const res_1 = await res.json();
                    if (res_1.code !== 0) {
                        toast.error(`获取第 ${page} 页粉丝牌失败 ${res_1.message}`);
                        return [];
                    } else {
                        return res_1;
                    }
                },
                async getWore() {
                    const res = await fetch("https://api.live.bilibili.com/live_user/v1/UserInfo/get_weared_medal", {
                        method: "GET",
                        credentials: "include"
                    });
                    const res_1 = await res.json();
                    if (res_1.code !== 0) {
                        toast.error(`获取当前粉丝牌失败 ${res_1.message}`);
                        return "";
                    } else {
                        return res_1.data;
                    }
                },
                async takeOff() {
                    let token = this.getToken();
                    let formdate = new FormData();
                    formdate.append("csrf_token", token);
                    formdate.append("csrf", token);
                    const res = await fetch("https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/take_off", {
                        method: "POST",
                        credentials: "include",
                        body: formdate
                    });
                    const res_1 = await res.json();
                    if (res_1.code !== 0) {
                        toast.error(`取消佩戴失败 ${res_1.message}`);
                    } else {
                        toast.success(`取消佩戴成功`);
                        this.medalConfig.wore = "";
                    }
                },
                async wear(medal_id) {
                    let token = this.getToken();
                    let formdate = new FormData();
                    formdate.append("csrf_token", token);
                    formdate.append("csrf", token);
                    formdate.append("medal_id", medal_id);
                    const res = await fetch("https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear", {
                        method: "POST",
                        credentials: "include",
                        body: formdate
                    });
                    const res_1 = await res.json();
                    if (res_1.code !== 0) {
                        throw res_1.message;
                    } else {
                        this.getWore().then(res => {
                            this.medalConfig.wore = res.medal_name;
                            toast.success(`你现在是 ${res.medal_name}`)
                        }).then(() => {
                            this.refreshMedalCache()
                        })
                    }
                }
            }
        }
        let myMedal = document.createElement("div");
        myMedal.setAttribute("x-data", "loadMedalConfig()");
        myMedal.setAttribute("x-init", "initComponent()");
        myMedal.innerHTML = `
    <button
      class="bilitools-button"
      x-text="medalConfig.wore == ''?'未佩戴':medalConfig.wore"
      @click="openMedalBox"
    ></button>
    <template x-if="medalBox" x-transport="body">
      <div class="bilitools-medal-modal-bg" @click.self="closeMedalBox">
        <div class="bilitools-medal-modal-box" :class="modalAnimate?'animate-scale-in-ease':'animate-scale-out'">
          <div class="bilitools-medal-modal-box-header">
            <span>我持有的粉丝牌</span>
            <button class="bilitools-close" @click="closeMedalBox">×</button>
          </div>
          <div class="bilitools-medal-modal-box-body" x-ref="bodyBox">
            <div class="bilitools-medal-setting" x-ref="setting">
              <div class="setting-full">
                <label for="bilitools-autoMeadl">
                  发言时自动佩戴对应粉丝牌（刷新后生效）
                  <input
                    type="checkbox"
                    class="bilitools-switch"
                    id="bilitools-autoMeadl"
                    name="autoMeadl"
                    @change="saveSetting"
                    x-model="medalConfig.autoWear.enable"
                  />
                </label>
              </div>
              <div class="setting-half">
                <label>
                  未持有牌子的直播间佩戴
                  <select id="bilitools-havent" @change="saveSetting" x-model = "medalConfig.autoWear.remember">
                    <option value="0">不佩戴</option>
                    <template
                      x-for="(item,index) in medalConfig.list"
                      :key="index"
                    >
                      <option
                        x-text="item.target_name + '/' + item.medal_name"
                        :value="item.medal_id"
                        :selected="item.medal_id == medalConfig.autoWear.remember ? true : false"
                      ></option>
                    </template>
                  </select>
                </label>
              </div>
              <div class="setting-half">
                <input
                  type="text"
                  id="bilitools-search"
                  placeholder="搜索"
                  x-model="medalConfig.searchText"
                  @input.debounce="search"
                />
              </div>
            </div>
            <div class="bilitools-medal-table">
              <table>
                <thead
                  class="bilitools-medal-table-header"
                  x-ref="tableHeader"
                >
                  <th
                    class="bilitools-liver-name sort"
                    style="cursor: pointer"
                    :class="sortedStyle(1)"
                    @click="sort(1)"
                  >
                    主播
                  </th>
                  <th
                    class="bilitools-medal-name sort"
                    style="cursor: pointer"
                    :class="sortedStyle(2)"
                    @click="sort(2)"
                  >
                    粉丝牌
                  </th>
                  <th
                    class="bilitools-medal-level sort"
                    style="cursor: pointer"
                    :class="sortedStyle(3)"
                    @click="sort(3)"
                  >
                    等级
                  </th>
                  <th
                    class="bilitools-medal-exp sort"
                    style="cursor: pointer"
                    :class="sortedStyle(4)"
                    @click="sort(4)"
                  >
                    粉丝牌经验
                  </th>
                  <th
                    class="bilitools-medal-exp-limit sort"
                    style="cursor: pointer"
                    :class="sortedStyle(5)"
                    @click="sort(5)"
                  >
                    今日经验
                  </th>
                  <th class="bilitools-medal-operate">操作</th>
                </thead>
                <tbody
                  class="bilitools-medal-table-body"
                  :style="'height: ' + (computedHeight() - 16)+ 'px;'"
                >
                  <template
                    x-for="(item,index) in (medalConfig.searchText == ''?medalConfig.list:medalConfig.searchList)"
                    :key="item.medal_id"
                  >
                    <tr class="bilitools-medal-table-row">
                      <td class="bilitools-liver-name">
                        <a
                          :href="'https://live.bilibili.com/'+item.roomid"
                          target="_blank"
                          x-text="item.target_name"
                        ></a>
                      </td>
                      <td class="bilitools-medal-name">
                        <span
                          class="bilitools-medal-status"
                          x-text="item.medal_name"
                          :style="'border-color: #' + item.medal_color_border.toString(16) + ';background-image: linear-gradient(45deg,#' + item.medal_color_start.toString(16) + ',#'+ item.medal_color_end.toString(16)+')'"
                        >
                        </span>
                      </td>
                  <td
                        class="bilitools-medal-level"
                        x-text="item.level"
                      ></td>
                      <td
                        class="bilitools-medal-exp"
                        x-text="item.intimacy + '/' + item.next_intimacy"
                      ></td>
                      <td
                        class="bilitools-medal-exp-limit"
                        x-text="item.today_feed + '/' + item.day_limit"
                      ></td>
                      <td class="bilitools-medal-operate">
                        <button
                          class="bilitools-button"
                          x-text="item.medal_name == medalConfig.wore? '取消佩戴': '佩戴'"
                          :class="item.medal_name == medalConfig.wore?'bleak':''"
                          @click="item.medal_name == medalConfig.wore?takeOff():wear(item.medal_id)"
                        ></button>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
    `;
        document.querySelector("#control-panel-ctnr-box").appendChild(myMedal);
    }

    function FilterSettingComponent() {
        window.loadDanmuConfig = function () {
            return {
                danmuConfig: {
                    regexp:
                    "(?<who>[^〈｛『〖［〔「【]*)[〈｛『〖［〔「【](?<text>[^〉｝『〗］〕」】]*)[$〉｝『〗］〕」】]?",
                    liveRoomSwitch: [],
                    translatorList: [],
                    autoHigh: true,
                    filteBoxStyle: false,
                },
                filterEnable: false,
                settingBox: false,
                translatorText: "",
                dialogAnimate: false,
                roomid: 0,
                dialog: {
                    ["@click.stop"]() {
                        this.openSettingBox();
                    },
                    ["@click.document"]() {
                        this.closeSettingBox();
                    },
                    [":class"]() {
                        return this.dialogAnimate ? "active" : "";
                    },
                },
                initComponent() {
                    this.readSetting();
                    if (this.danmuConfig.autoHigh) {
                        this.autoHigh();
                    }
                },
                saveSetting() {
                    window.localStorage.setItem(
                        "bilitools-danmuFilter",
                        JSON.stringify(this.danmuConfig)
                    );
                },
                readSetting() {
                    let config = window.localStorage.getItem("bilitools-danmuFilter");
                    let room = window.BilibiliLive;
                    if (!(config === "undefined" || config == null)) {
                        this.danmuConfig = JSON.parse(config);
                    }
                    if (typeof room === "object") {
                        this.roomid = room.SHORT_ROOMID || room.ROOMID;
                        this.filterEnable = this.danmuConfig.liveRoomSwitch.includes(
                            this.roomid
                        );
                    }
                },
                openSettingBox() {
                    this.dialogAnimate = true;
                    this.settingBox = true;
                },
                closeSettingBox() {
                    this.dialogAnimate = false;
                    setTimeout(() => {
                        this.settingBox = false;
                    }, 400);
                },
                computedDialogHeight() {
                    let height = 0;
                    height += this.$refs.dialog.offsetHeight;
                    return -height - 8 + "px";
                },
                saveRegexp($dispatch) {
                    this.danmuConfig.regexp = this.danmuConfig.regexp.trim();
                    this.saveSetting();
                    $dispatch("regexp-update",{regexp:this.danmuConfig.regexp})
                    toast.success("保存成功");
                },
                saveTranselator($dispatch) {
                    this.danmuConfig.translatorList.push(this.translatorText.trim());
                    this.saveSetting();
                    $dispatch("translator-update",{regexp:this.danmuConfig.translatorList})
                    toast.success("保存成功");
                },
                removeTranselator(index,$dispatch) {
                    this.danmuConfig.translatorList.splice(index, 1);
                    this.saveSetting();
                    $dispatch("translator-update",{list:this.danmuConfig.translatorList})
                },
                changeFilterStatus($dispatch) {
                    this.filterEnable = !this.filterEnable;
                    if (this.filterEnable) {
                        this.danmuConfig.liveRoomSwitch.push(this.roomid);
                    } else {
                        let index = this.danmuConfig.liveRoomSwitch.indexOf(this.roomid);
                        if (index >= 0) {
                            this.danmuConfig.liveRoomSwitch.splice(index, 1);
                        }
                    }
                    $dispatch("filter-update",{ mode: this.filterEnable })
                    this.saveSetting();
                },
                changeFilteBoxStyle($dispatch) {
                    this.danmuConfig.filteBoxStyle = !this.danmuConfig.filteBoxStyle;
                    $dispatch("style-update", { mode: this.danmuConfig.filteBoxStyle });
                    this.saveSetting();
                },
                saveAutoHigh() {
                    this.danmuConfig.autoHigh = !this.danmuConfig.autoHigh;
                    this.saveSetting();
                },
                autoHigh() {
                    let time1 = setInterval(function() {
                        try {
                            let videoDom = document.querySelector("#live-player");
                            videoDom.dispatchEvent(new Event("mousemove"));
                            let quality = document.querySelector(".quality-wrap");
                            quality.dispatchEvent(new Event("mouseenter"));
                            if (document.querySelector(".list-it.selected").innerText != "原画") {
                                let list = document.querySelectorAll(".list-it");
                                for(let item of list){
                                   if(item.innerText == "原画") {
                                        console.log(item)
                                        item.click()
                                        // item.dispatchEvent(new Event("click"));
                                        break;
                                    }
                                }
                                quality.dispatchEvent(new Event("mouseleave"));
                            }
                            clearInterval(time1)
                        } catch {}
                    }, 1000);
                },
            };
        };
        let myFilterSetting = document.createElement("span");
        myFilterSetting.setAttribute("x-data", "loadDanmuConfig()");
        myFilterSetting.setAttribute("x-init", "initComponent()");
        myFilterSetting.setAttribute("x-bind", "dialog");
        myFilterSetting.className = "bilitools-icons live-skin-main-text"
        myFilterSetting.innerHTML = `
    <svg
    id="图层_1"
    data-name="图层 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
  >
    <title>过滤设置</title>
    <path
      id="Combined-Shape"
      d="M6.73,35.66a6.74,6.74,0,0,1-6.5-7V11.32a6.76,6.76,0,0,1,6.5-7h22.8a6.74,6.74,0,0,1,6.5,7v.85a2,2,0,0,1-4,0h0v-.54A3.22,3.22,0,0,0,29,8.26H7.3a3.24,3.24,0,0,0-3.09,3.37V28.37A3.23,3.23,0,0,0,7.3,31.74h8.84a2,2,0,1,1,0,3.92H6.73Z"
    ></path>
    <path
      id="形状结合"
      d="M15.16,24.86a1.87,1.87,0,0,1,0,3.73h-4a1.87,1.87,0,0,1,0-3.73Zm-1.57-6.72a1.86,1.86,0,1,1,0,3.72h-4a1.86,1.86,0,0,1,0-3.72Zm6.09-6.73a1.87,1.87,0,0,1,0,3.73H13.44a1.87,1.87,0,0,1,0-3.73Z"
      style="fill-rule: evenodd"
    ></path>
    <path
      id="图标1"
      d="m29.026,22.86956c-1.36082,0 -2.46349,1.19207 -2.46349,2.66323c0,1.47048 1.10267,2.66323 2.46349,2.66323c0.3118,0 0.60719,-0.0696 0.88176,-0.18424l0.52767,0.87683l0.85777,-0.60388l-0.52451,-0.87069c0.44498,-0.48174 0.72081,-1.14704 0.72081,-1.88125c0,-1.47116 -1.10267,-2.66323 -2.46349,-2.66323zm-0.00947,-7.2084c-5.06647,0 -9.17355,4.44009 -9.17355,9.91735c0,5.47727 4.10708,9.91735 9.17355,9.91735c5.06647,0 9.17355,-4.44009 9.17355,-9.91735c0,-5.47727 -4.10708,-9.91735 -9.17355,-9.91735zm6.42161,13.1988c-0.15211,0.34391 -0.32379,0.67553 -0.52135,0.98942l-1.99326,-0.46332c-0.3036,0.35892 -0.64948,0.67826 -1.03135,0.94506l0.07511,2.1849c-0.32001,0.15694 -0.64885,0.28727 -0.99032,0.38894l-1.23395,-1.71544c-0.2348,0.0348 -0.47338,0.05868 -0.71702,0.05868c-0.2247,0 -0.44561,-0.01979 -0.66337,-0.05049l-1.22764,1.70589c-0.34147,-0.10304 -0.67221,-0.23337 -0.99095,-0.38826l0.07385,-2.14669c-0.40017,-0.27158 -0.76246,-0.60047 -1.08058,-0.97372l-1.94024,0.44899c-0.19756,-0.31115 -0.36798,-0.64414 -0.52135,-0.98805l1.3179,-1.57556c-0.14265,-0.4797 -0.22344,-0.9901 -0.243,-1.51688l-1.7471,-0.99897c0.03471,-0.38417 0.10414,-0.75537 0.18998,-1.12111l1.94656,-0.29137c0.18304,-0.47901 0.42605,-0.92254 0.71639,-1.32513l-0.74605,-1.97951c0.25184,-0.26544 0.52388,-0.50767 0.8098,-0.73012l1.68083,1.1409c0.41027,-0.22995 0.85146,-0.40464 1.31601,-0.51177l0.61098,-2.04775c0.17547,-0.01433 0.3503,-0.02866 0.5283,-0.02866c0.17799,0 0.35346,0.01501 0.5283,0.02866l0.61603,2.06617c0.45445,0.11122 0.88428,0.28386 1.28508,0.51177l1.70671,-1.15796c0.28719,0.22245 0.55986,0.46468 0.81106,0.73012l-0.76751,2.03751c0.27014,0.38485 0.50052,0.80586 0.6741,1.25895l2.0103,0.30092c0.08521,0.36506 0.1559,0.73763 0.19062,1.12111l-1.80959,1.03445c-0.02146,0.49539 -0.09468,0.97577 -0.22407,1.43295l1.36082,1.62537z"
      style="fill-rule: evenodd"
    />
  </svg>
  <template x-if="settingBox">
    <div
      class="bilitools-dialog bilitools-arrow"
      :class="dialogAnimate?'animate-scale-in-ease':'animate-scale-out'"
      x-ref="dialog"
      :style="'top: ' + computedDialogHeight()"
      @mouseleave="closeSettingBox"
    >
      <div class="bilitools-dialog-title">当前房间设置</div>
      <div class="bilitools-dialog-body">
        <div class="bilitools-dialog-row" style="justify-content: left">
          <label for="bilitools-filter-switch"> 过滤开关 </label>
          <input
            type="checkbox"
            class="bilitools-switch"
            name="filterSwitch"
            id="bilitools-filter-switch"
            x-model="filterEnable"
            @click="changeFilterStatus($dispatch)"
          />
        </div>
        <div class="bilitools-dialog-row" style="justify-content: left">
          <label for="bilitools-filter-switch"> 过滤框 单行/多行 </label>
          <input
            type="checkbox"
            class="bilitools-switch"
            name="filterSwitch"
            id="bilitools-filter-switch"
            x-model="danmuConfig.filteBoxStyle"
            @click="changeFilteBoxStyle($dispatch)"
          />
        </div>
        <div class="bilitools-dialog-row" style="justify-content: left">
          <label for="bilitools-video-switch"> 自动选择最高画质 </label>
          <input
            type="checkbox"
            class="bilitools-switch"
            name="videoSwitch"
            id="bilitools-video-switch"
            x-model="danmuConfig.autoHigh"
            @click="saveAutoHigh"
          />
        </div>
        <div class="bilitools-dialog-row" style="flex-wrap: nowrap">
          <label for="bilitools-filter-regexp"> 过滤正则 </label>
          <input
            type="text"
            name="filterRegexp"
            id="bilitools-filter-regexp"
            x-model="danmuConfig.regexp"
          />
          <button
            class="bilitools-button"
            :disabled="danmuConfig.regexp == '' ? true : false"
            :class="danmuConfig.regexp == '' ? 'disable' : ''"
            @click="saveRegexp($dispatch)"
          >
            确定
          </button>
        </div>
        <div class="bilitools-dialog-row" style="flex-wrap: nowrap">
          <label for="bilitools-filter-translator"> 添加译者 </label>
          <input
            type="text"
            name="translator"
            id="bilitools-filter-translator"
            x-model="translatorText"
          />
          <button
            class="bilitools-button"
            :disabled="translatorText == '' ? true : false"
            :class="translatorText == '' ? 'disable' : ''"
            @click="saveTranselator($dispatch)"
          >
            确定
          </button>
        </div>
        <div class="bilitools-dialog-row">
          <span
            style="
              display: block;
              width: 100%;
              flex-shrink: 0;
              font-weight: 600;
            "
            >译者列表</span
          >
          <div class="bliltools-scroll">
            <template
              x-for="(item,index) in danmuConfig.translatorList"
              :key="index"
            >
              <div class="bilitools-dialog-row" style="margin: 0 4px">
                <span x-text="item"></span>
                <button
                  class="bilitools-close"
                  @click="removeTranselator(index,$dispatch)"
                >
                  ×
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
`;
        document.querySelector(".icon-left-part").appendChild(myFilterSetting);
    }

    function FilterBoxComponent() {
        window.loadFilterBoxSetting = function () {
            return {
                filter: {
                    regexp: null,
                    translatorList: [],
                },
                filteBoxStatus:false,
                filteBoxStyle: false,
                filtedList: [],
                dragData: {
                    moveX: 0,
                    moveY: 0,
                    maxX:0,
                    maxY:0
                },
                status:{
                    ["@filter-update.document"]($dispatch){
                        this.updateStatus($dispatch)
                    },
                    ["@regexp-update.document"]($dispatch){
                        this.updateRegexp($dispatch)
                    },
                    ["@translator-update.document"]($dispatch){
                        this.updateTranslator($dispatch)
                    }
                },
                initComponent() {
                    this.readSetting();
                    this.dragData.moveX = this.$el.offsetWidth * 0.45
                    this.dragData.moveY = this.$el.offsetHeight * 0.8
                    this.websocketHook();
                },
                readSetting() {
                    let config = window.localStorage.getItem("bilitools-danmuFilter");
                    if (config === "undefined" || config == null) {
                        this.filter.regexp = new RegExp(
                            "(?<who>[^〈｛『〖［〔「【]*)[〈｛『〖［〔「【](?<text>[^〉｝『〗］〕」】]*)[$〉｝『〗］〕」】]?"
                        );
                    } else {
                        let setting = JSON.parse(config);
                        this.filter.regexp = new RegExp(setting.regexp);
                        this.filter.translatorList = setting.translatorList;
                        this.filteBoxStyle = setting.filteBoxStyle;
                        try{
                            this.filteBoxStatus = setting.liveRoomSwitch.includes(window.BilibiliLive.SHORT_ROOMID) || setting.liveRoomSwitch.includes(window.BilibiliLive.ROOMID);
                        }catch {}
                    }
                },
                updateStyle(e) {
                    this.filteBoxStyle = e.detail.mode;
                },
                updateStatus(e) {
                    this.filteBoxStatus = e.detail.mode;
                },
                updateRegexp(e) {
                    this.filter.regexp = new RegExp(e.detail.regexp);
                },
                updateTranslator(e) {
                    this.filter.translatorList = e.detail.list;
                },
                updateSetting(setting) {
                    if (typeof setting === "object") {
                        this.filter.regexp = new RegExp(setting.regexp);
                        this.filter.translatorList = setting.translatorList;
                    }
                },
                websocketHook() {
                    bliveproxy.addCommandHandler("DANMU_MSG", (cmd)=>{
                        if(this.filteBoxStatus){
                            if (this.filter.regexp.test(cmd.info[1]) || this.filter.translatorList.includes(cmd.info[2][1])){
                                this.filtedList.unshift(cmd.info[1])
                            }
                        }
                    });
                },
                drag(el) {
                    this.dragData.maxX = el.offsetWidth;
                    this.dragData.maxY = el.offsetHeight;
                    document.onmousemove = (e) => {
                        let x = this.dragData.moveX + e.movementX;
                        let y = this.dragData.moveY + e.movementY;
                        this.dragData.moveX = (x > 0 && x + this.$refs.dragable.offsetWidth < this.dragData.maxX)?x:this.dragData.moveX;
                        this.dragData.moveY = (y > 0 && y + this.$refs.dragable.offsetHeight < this.dragData.maxY)?y:this.dragData.moveY;
                    };
                    document.onmouseup = (e) => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                },
            };
        }
        let myFilterBox = document.createElement("div");
        myFilterBox.setAttribute("x-data", "loadFilterBoxSetting()");
        myFilterBox.setAttribute("x-init", "initComponent()");
        myFilterBox.setAttribute("x-spread","status");
        myFilterBox.style="height: 100%;width: 100%;position: absolute;z-index: 100;top: 0;left: 0;pointer-events: none;";
        myFilterBox.innerHTML = `
    <template x-if="filteBoxStatus && filtedList.length > 0">
    <div
      class="bilitools-filterBox bilitools-dragable"
      @style-update.window="updateStyle"
@mousedown="drag($el)"
      :style="'top: ' + dragData.moveY + 'px;left: ' + dragData.moveX + 'px'"
      :class="filteBoxStyle?'multiline':''"
x-ref="dragable"
>
    <template x-if="filteBoxStyle" x-for="(item,index) in filtedList">
        <p x-text="item"></p>
</template>
<template x-if="!filteBoxStyle">
    <p style="font-weight: 600" x-text="filtedList[0]"></p>
</template>
</div>
</template>
`
    document.querySelector("#live-player").append(myFilterBox);
    }
    main();
})();