// ==UserScript==
// @name         哔哩哔哩(bilibili | B站) 视频播放速度调整器
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  增强视频播放观感, 提升学习效率
// @author       WindOfCast
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @include      *://www.bilibili.com/video/*
// @include      *//www.bilibili.com/medialist/play/watchlater/*
// @include      *//www.bilibili.com/list/watchlater*
// @include      *//www.bilibili.com/list/*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @homepage     https://gitee.com/windofcast/
// @website      https://space.bilibili.com/367207503
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/450958/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibili%20%7C%20B%E7%AB%99%29%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%B0%83%E6%95%B4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/450958/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibili%20%7C%20B%E7%AB%99%29%20%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%B0%83%E6%95%B4%E5%99%A8.meta.js
// ==/UserScript==
/*
* @since 0.5 添加快捷键控制
*               - 添加快捷键控制框架
*               - 快捷键_removeCurrentVideo
*               - 快捷键_showShortcutKeyMenu
* @since 0.6 添加添加快捷键校验
*               - 添加快捷键校验
*               - 设置快捷键成功与否都有提示通知
* @since 0.7 更新 B站 稍后再看 播放页
*               - 添加新的 B站 url 请求地址  *\//www.bilibili.com/list/watchlater*
*               - 替换之前速度菜单列表点击目标
* @since 0.8 watchlater 中添加播放历史记录 与 添加删除已播放快捷键 与 自动点赞
*               - 添加播放历史记录
*               - 修改快捷键配置格式
*               - 添加删除已播放快捷键 (替换 删除当前视频)
*               - 自动点赞
* @since 0.9 修复 自动点赞 bug  评论全点? 并降低重试频率
* @since 0.10 修复 自动点赞 bug 修改为至多两次
* @since 0.11 修复 自动点赞 bug 匹配 video like
* @since 0.12 修复 自动点赞 bug 修改延时点赞逻辑
* @since 0.13 修复 删除已播放快捷键 bug 多版本多播放页
* @since 0.14 修复 播放历史记录 中获取当前bvid
* @since 0.15 修复 播放历史记录 中加载videoInfo 中历史 preVideoInfo 非空判断
*
* */

(function () {
    'use strict';

    function commonFunc() {
        this.video = () => {
            return document.querySelector("video")
        }
        this.GMGetValue = (name, value = null) => {
            let storageValue = value;
            if (typeof GM_getValue === 'function') {
                storageValue = GM_getValue(name, value)
            } else {
                let o = window.localStorage.getItem(name);
                if (o != null) {
                    storageValue = o;
                }
            }
            return storageValue;
        }
        this.GMSetValue = (name, value) => {
            if (typeof GM_setValue === 'function') {
                GM_setValue(name, value)
            } else {
                window.localStorage.setItem(name, value)
            }
        }
        this.GMAddStyle = (css) => {
            let ms = document.createElement("style");
            ms.textContent = css;
            let doc = document.head || document.documentElement;
            doc.append(ms)
        }
        this.addCommonHtmlCss = () => {
            let commonCss = `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }

        input[type='text'] {
            outline: none;
            border: 1px solid #a9a9a9;
        }`;
            this.GMAddStyle(commonCss);
        }
        this.appendHtml = (htmlText) => {
            let html = $(htmlText);
            $(document.body).append(html);
        }
        this.randomNumber = () => {
            return Math.ceil(Math.random() * 100000000);
        }
        this.createElementDiv = () => {
            return document.createElement('div');
        }
        this.getShortcutKey = (cmd) => {
            let shortcutKeyReg = /^(?<group>[01]{3})(?<key>.+)$/g; // 100F
            let {group, key} = shortcutKeyReg.exec(cmd).groups;
            let mod = parseInt(group, 2);
            return Modifier.toString(mod) + key;
        }
        this.notification = (messageObj) => {
            GM_notification({
                title: messageObj.title, text: messageObj.message, timeout: messageObj.timeout || 3000,
            });
        }
        this.moduleInfo = (title, iptType, ...iptAttrs) => {
            return {title: title, iptType: iptType, iptAttrs: iptAttrs};
        }
        this.moduleInfoAttr = (iptAttrs) => {
            let result = "";
            if (iptAttrs === undefined || iptAttrs.length === 0) {
                return result;
            }
            iptAttrs.forEach((item) => {
                if (item.indexOf(":") > -1) {
                    let kvs = item.split(":");
                    result += ` ${kvs[0]}="${kvs[1]}"`;
                } else {
                    result += " " + item;
                }
            })
            return result;
        }
        this.moduleAutoLike = (isReady = false) => {
            if (!this.autoLikeFlag || isReady) {
                console.log("autoLike")
                this.autoLikeFlag = true;
                setTimeout(() => {
                    let btnVideoLike = $("div[class*=video-like],span[class^=like]");
                    if (!btnVideoLike.hasClass("on")) {
                        btnVideoLike.click();
                    }
                    this.autoLikeFlag = false;
                }, 5000);
            }
        }
        this.loadVideoInfo = () => {
            let currentVideoInfo;
            let isVUE;
            try {
                isVUE = window.parent.unsafeWindow.__VUE__;
            } catch (e) {
                isVUE = false;
            }
            if (isVUE) {
                currentVideoInfo = this.__loadVueVideoInfo();
            } else {
                currentVideoInfo = this.__loadDefaultVideoInfo();
            }
            // todo 更新数据
            let preVideoInfo = currentConfig.historyVideoInfo;
            if (preVideoInfo != null) {
                Object.keys(currentVideoInfo).forEach((cviKey) => {
                    let currentVideoItem = currentVideoInfo[cviKey], preVideoItem = preVideoInfo[cviKey];
                    if (preVideoItem === undefined) {
                        return;
                    }
                    let newObj = {
                        index: currentVideoItem.index, bv_id: cviKey, title: currentVideoItem.title
                    }
                    delete preVideoItem.index;
                    delete preVideoItem.bv_id;

                    let pKeys = Object.keys(preVideoItem);
                    if (pKeys.length > 0) {
                        pKeys.forEach((pk) => {
                            if (currentVideoItem[pk] === undefined) {
                                newObj[pk] = preVideoItem[pk];
                            }
                        })
                    }
                    currentVideoInfo[cviKey] = newObj;
                })
            }

            let videoInfo = $.extend(true, {}, currentVideoInfo);
            currentConfig.historyVideoInfo = videoInfo;
            return videoInfo;
        }

        this.__loadVueVideoInfo = () => {
            let currentVideoInfo = {};
            $(".action-list-item").each((i, e) => {
                let info = e["__vue__"]["info"];
                currentVideoInfo[info.bv_id] = this.__createVideoInfo(i, info.bv_id, info.title);
            })
            return currentVideoInfo;
        }
        this.__loadDefaultVideoInfo = () => {
            let currentVideoInfo = {};
            $(".player-auxiliary-playlist-item").each((i, e) => {
                let bv_id = $(e).attr("data-bvid");
                let title = $(e).find(".player-auxiliary-playlist-item-title").attr("title");
                currentVideoInfo[bv_id] = this.__createVideoInfo(i, bv_id, title);
            })
            return currentVideoInfo;
        }
        this.__createVideoInfo = (index, bv_id, title) => {
            return {index: index, bv_id: bv_id, title: title}
        };
        this.KeyMap = {
            8: "BackSpace",
            27: "Esc",
            32: "Spacebar",
            33: "Page Up",
            34: "Page Down",
            35: "End",
            36: "Home",
            37: "Left Arrow",
            38: "Up Arrow",
            39: "Right Arrow",
            40: "Dw Arrow",
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            186: ";",
            187: "等号",
            188: "逗号",
            189: "减号",
            190: ".>",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "引号",
        }
        this.moduleList = {
            // removeCurrentVideo: this.moduleInfo("移除当前视频/关闭当前视频单页快捷键:", "text", "readonly"),
            showModuleMenu: this.moduleInfo("设置快捷键菜单快捷键:", "text", "readonly"),
            removeHistoryVideo: this.moduleInfo("移除已播放视频快捷键:", "text", "readonly"),
            autoLike: this.moduleInfo("自动点赞", "checkbox"),
        };
        this.commSettings = "";
        this.autoLikeFlag = false;
    }

    const commonFuncObj = new commonFunc();
    commonFuncObj.addCommonHtmlCss();
    // alt ctrl shift
    const defaultBiliBiliConfig = {
        shortcutKeyMap: {
            /**
             * @deprecated
             */
            removeCurrentVideo: "110F", showModuleMenu: "011M", removeHistoryVideo: "110H"
        }, moduleMap: {
            autoLike: false,
        }
    }
    let currentConfig = commonFuncObj.GMGetValue("bilibili_current_config") || defaultBiliBiliConfig;

    class Modifier {

        static isAlt(mod) {
            return (mod & Modifier.ALT) !== 0;
        }

        static isCtrl(mod) {
            return (mod & Modifier.CTRL) !== 0;
        }

        static isShift(mod) {
            return (mod & Modifier.SHIFT) !== 0;
        }

        static toString(mod) {
            let sb = "";
            let len;
            if (Modifier.isAlt(mod)) sb += "Alt + ";
            if (Modifier.isCtrl(mod)) sb += "Ctrl  + ";
            if (Modifier.isShift(mod)) sb += "Shift  + ";

            // if ((len = sb.length) > 0) {
            //     return sb.substring(0, len - 1);
            // }
            // return "";
            return sb;
        }

        static get ALT() {
            return 0x4;
        }

        static get CTRL() {
            return 0x2;
        }

        static get SHIFT() {
            return 0x1;
        }
    }

    /**
     *
     * @href: https://www.cnblogs.com/jianglijs/p/14682059.html
     * @author: 天长地久-无为
     */
    class Enumerable {
        static closeEnum() {
            const enumKeys = []
            const enumValues = []
            // Traverse the enum entries
            for (const [key, value] of Object.entries(this)) {
                enumKeys.push(key)
                value.enumKey = key
                value.enumOrdinal = enumValues.length
                enumValues.push(value)
            }
            // Important: only add more static properties *after* processing the enum entries
            this.enumKeys = enumKeys
            this.enumValues = enumValues
            // TODO: prevent instantiation now. Freeze `this`?
        }

        /** Use case: parsing enum values */
        static enumValueOf(str) {
            const index = this.enumKeys.indexOf(str)
            if (index >= 0) {
                return this.enumValues[index]
            }
            return undefined
        }

        static [Symbol.iterator]() {
            return this.enumValues[Symbol.iterator]()
        }

        toString() {
            return this.constructor.name + '.' + this.enumKey
        }
    }

    const popup = (function () {
        class Popup {
            constructor() {
                this.mask = commonFuncObj.createElementDiv();
                this.content = commonFuncObj.createElementDiv();

                this.setStyle(this.mask, {
                    'width': '100%',
                    'height': '100%',
                    'background-color': 'rgba(0, 0, 0, 0.65)',
                    'position': 'fixed',
                    'left': '0px',
                    'top': '0px',
                    'bottom': '0px',
                    'right': '0px',
                    'z-index': '99999999',
                });
                this.setStyle(this.content, {
                    'max-width': '550px',
                    'width': '100%',
                    'max-height': '550px',
                    'background-color': 'rgb(255, 255, 255)',
                    'box-shadow': 'rgb(153, 153, 153) 0px 0px 2px',
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%, -50%)',
                    'border-radius': '3px',
                });
                this.mask.appendChild(this.content);
            }

            middleBox(param) {
                this.content.innerText = '';    // 预清除原内容
                let titleStr = '标题';
                let obj = {};
                // 参数类型检验
                if (obj.toString.call(param) === '[object String]') {
                    titleStr = param;
                } else if (obj.toString.call(param) === '[object Object]') {
                    titleStr = param.title;
                }
                // 显示遮罩
                document.body.appendChild(this.mask);
                // 创建 title 组件
                this.title = commonFuncObj.createElementDiv();
                this.setStyle(this.title, {
                    "width": '100%',
                    "height": '40px',
                    "line-height": '40px',
                    "box-sizing": 'border-box',
                    "background-color": "rgb(255, 77, 64)",
                    "color": 'rgb(255, 255, 255)',
                    "text-align": 'center',
                    "font-weight": "700",
                    "font-size": "16px",
                });
                this.title.innerText = titleStr;
                this.content.appendChild(this.title);
                // 关闭 button
                this.closeBtn = commonFuncObj.createElementDiv();
                this.closeBtn.innerText = '×';
                this.setStyle(this.closeBtn, {
                    "text-decoration": 'none',
                    "color": 'rgb(255, 255, 255)',
                    "position": 'absolute',
                    "right": '10px',
                    "top": '0px',
                    "font-size": '25px',
                    "display": "inline-block",
                    "cursor": "pointer",
                });
                this.title.appendChild(this.closeBtn);
                $(this.closeBtn).on('click', () => this.close())
            }

            /**
             * 弹出提示框
             * @param 参数
             */
            dialog(param) {
                this.middleBox(param);
                this.dialogContent = commonFuncObj.createElementDiv();
                this.setStyle(this.dialogContent, {
                    'max-height': '550px', 'padding': '12px',
                })
                this.dialogContent.innerHTML = param.content;
                this.content.appendChild(this.dialogContent);
                param.onReady(this);
            }

            close() {
                commonFuncObj.commSettings = "";
                commonFuncObj.GMSetValue("bilibili_current_config", currentConfig);

                document.body.removeChild(this.mask);
            }

            setStyle(element, styleObj) {
                Object.keys(styleObj).forEach((item) => {
                    element.style[item] = styleObj[item];
                })
            }
        }

        let popup = null;
        return (function () {
            if (!popup) {
                popup = new Popup();
            }
            return popup;
        })();
    })();

    function bilibiliHelper() {
        this.controlSpeed = function () {
            function innerClassControlSpeed() {
                this.elementId = commonFuncObj.randomNumber();
                this.ciId = "bilibili_ci_" + this.elementId;
                this.ciSearchId = "#" + this.ciId;
                this.speedMin = 0.5;
                this.speedMax = 4;
                this.speedStep = 0.05;
                this.speedReg = /^([1-4]|0\.[5-9][0-9]*|[1-3]\.[0-9]{0,2}|4\.0+)$/;
                this.video = commonFuncObj.video();

                this.createElementHtml = () => {
                    let value = this.__getCiValue();
                    let cssText = `
        #` + this.ciId + ` {
            position: fixed;
            right: 12px;
            bottom: 349px;
            z-index: 100;
            max-width: 25px;
        }`;
                    let htmlText = `
<div id="bilibili_cs_` + this.elementId + `">
    <label for="` + this.ciId + `"></label><input id="` + this.ciId + `" type="text" value="` + value + `" min="0.5" max="4" step="0.05">
</div>`;
                    commonFuncObj.GMAddStyle(cssText);
                    commonFuncObj.appendHtml(htmlText);
                    this.__controlSpeed(value);
                }
                this.createEventListener = () => {
                    try {
                        const $ciSearch = $(this.ciSearchId);
                        $ciSearch.click();
                        $ciSearch.blur();
                        $ciSearch.on("mouseover", this.__eventMouseover);
                        $ciSearch.on("mouseout", this.__eventMouseout);
                        $ciSearch.on("wheel", this.__eventWheel);
                        $ciSearch.on("change", this.__eventChange);
                        $("video").on("loadedmetadata", this.__eventLoadedMetadata)
                        this.__rebindEventMenuListClick();
                    } catch (e) {
                        console.error("InnerClassControlSpeed.createEventListener " + e)
                    }
                }
                this.__eventMouseover = (e) => {
                    e.target.focus();
                }
                this.__eventMouseout = (e) => {
                    e.target.blur();
                }
                this.__eventWheel = (e) => {
                    const $ci = e.target, direction = e.originalEvent.deltaY;
                    let value = parseFloat($ci.value);

                    if (direction > 0) {
                        value -= this.speedStep;
                        if (value < this.speedMin) {
                            value = this.speedMin;
                        }
                    } else if (direction < 0) {
                        value += this.speedStep;
                        if (value > this.speedMax) {
                            value = this.speedMax;
                        }
                    }
                    value = value.toFixed(2);
                    $ci.value = value;
                    this.__setCiValue(value);
                    this.__controlSpeed(value);
                    e.preventDefault()
                }
                this.__eventChange = (e) => {
                    const $ci = e.target;
                    const defaultValue = $ci.defaultValue, currentValue = $ci.value;
                    if (!this.speedReg.test(currentValue)) {
                        $ci.value = defaultValue;
                        return;
                    }
                    let value = parseFloat(currentValue);
                    if (value > this.speedMax) {
                        value = this.speedMax;
                    }
                    if (value < this.speedMin) {
                        value = this.speedMin;
                    }
                    $ci.value = value;
                    this.__setCiValue(value);
                    this.__controlSpeed(value);
                }
                this.__eventLoadedMetadata = (e) => {
                    this.__controlSpeed(this.__getCiValue());
                    this.__rebindEventMenuListClick()
                }
                this.__eventMenuClick = (e) => {
                    const $ci = $(this.ciSearchId)[0], $target = e.target;
                    let value = $($target).attr("data-value");
                    $ci.value = value;
                    this.__setCiValue(value);
                    this.__controlSpeed(value);
                }
                this.__controlSpeed = (speed) => {
                    this.video.playbackRate = speed;
                }
                this.__setCiValue = (value) => {
                    commonFuncObj.GMSetValue("bilibili_ci_value", value);
                }
                this.__getCiValue = () => {
                    let value = commonFuncObj.GMGetValue("bilibili_ci_value");
                    value = !!value ? value : 1;
                    return value;
                }
                this.__rebindEventMenuListClick = () => {
                    let pathname = window.location.pathname;
                    let speedMenuListClass = ".bpx-player-ctrl-playbackrate-menu-item";
                    // if (pathname.indexOf("watchlater") > 0) {
                    //     speedMenuListClass = ".bpx-player-ctrl-playbackrate-menu-item"; // @since 0.7 bilibili-player-video-btn-speed-menu-list -> bpx-player-ctrl-playbackrate-menu-item
                    // } else if (pathname.indexOf("video") > 0) {
                    //     speedMenuListClass = ".bpx-player-ctrl-playbackrate-menu-item";
                    // }
                    $(speedMenuListClass).on("click", this.__eventMenuClick);
                }
                this.start = function () {
                    this.createElementHtml();
                    this.createEventListener();
                }
            }

            try {
                (new innerClassControlSpeed()).start();
            } catch (e) {
                console.error("innerClassControlSpeed " + e)
            }
        };
        this.controlModule = function () {
            function innerClassControlModule() {
                this.focus = false;

                this.createEventListener = () => {
                    $(document).on("focus", "input:not([readonly]), textarea", () => {
                        this.focus = true;
                    });
                    $(document).on("blur", "input, textarea", () => {
                        this.focus = false;
                    });
                    $(document).on('keydown', this.__eventKeydown)
                };
                this.__eventKeydown = (e) => {
                    if (!e.altKey && !e.shiftKey && !e.ctrlKey && this.focus) {
                        return;
                    }
                    const k = (key) => (key ? 1 : 0);
                    let pressKey = commonFuncObj.KeyMap[e.keyCode] || null;
                    if (pressKey === null) {
                        return;
                    }
                    let command = `${k(e.altKey)}${k(e.ctrlKey)}${k(e.shiftKey)}${pressKey}`;
                    let keyMap = currentConfig.shortcutKeyMap;
                    if (commonFuncObj.commSettings) {
                        let id = commonFuncObj.commSettings;
                        // 新旧键位对比
                        if (command === currentConfig.shortcutKeyMap[id]) {
                            return;
                        }
                        let conflict = null;
                        // 新键位与其他键位是否冲突
                        Object.keys(keyMap).forEach((oid) => {
                            if (oid === id) {
                                return;
                            }
                            if (command === currentConfig.shortcutKeyMap[oid]) {
                                conflict = oid;
                            }
                        })
                        let newShortcutKeyStr = commonFuncObj.getShortcutKey(command);
                        let messageObj;
                        if (conflict) {
                            messageObj = {
                                title: "设置快捷键失败",
                                message: `${newShortcutKeyStr} 已经分配给:\n ${commonFuncObj.moduleList[conflict].title}`,
                            };
                        } else {
                            document.querySelector(`#${id}`).value = newShortcutKeyStr;
                            currentConfig.shortcutKeyMap[id] = command;
                            messageObj = {
                                title: "设置快捷键成功",
                                message: `${commonFuncObj.moduleList[id].title} 设置为\n ${newShortcutKeyStr}`,
                            };
                        }

                        commonFuncObj.notification(messageObj);
                        return;
                    }

                    switch (command) {
                        case keyMap.removeCurrentVideo:
                            return this.__skRemoveCurrentVideo();
                        case keyMap.showModuleMenu:
                            return this.showModuleMenu();
                        case keyMap.removeHistoryVideo:
                            return this.__skRemoveHistoryVideo();
                    }

                }
                this.showModuleMenu = () => {
                    let ML = commonFuncObj.moduleList;
                    let skItem = "";
                    Object.keys(ML).forEach((key) => {
                        let mItemObj = ML[key];
                        let attrs = commonFuncObj.moduleInfoAttr(mItemObj.iptAttrs);
                        skItem += `
<div>${mItemObj.title} <label for="${key}"></label> <input id="${key}" type="${mItemObj.iptType}"${attrs}></div>`;
                    });
                    let content = `
<div id="skm-box" style="font-size: 15px;">
${skItem}
</div>
`;
                    popup.dialog({
                        "title": "设置", "content": content, "onReady": function ($self) {
                            $("#skm-box input[type='text']").on('click mouseover', (e) => {
                                let $text = e.target, id = $text.id;
                                Object.keys(ML).forEach((key) => {
                                    document.querySelector(`#${key}`).style.border = '1px solid #a9a9a9';
                                })
                                $text.style.border = '1px solid #3597ff';

                                commonFuncObj.commSettings = id;
                            }).each((index, ele) => {
                                let id = ele.id;
                                ele.value = commonFuncObj.getShortcutKey(currentConfig.shortcutKeyMap[id]);
                            })
                            $("#skm-box input[type='checkbox']").on("click", (e) => {
                                let $checkbox = e.target, id = $checkbox.id;
                                if (!currentConfig.moduleMap) {
                                    currentConfig.moduleMap = {}
                                }
                                currentConfig.moduleMap[id] = $checkbox.checked;
                            }).each((index, ele) => {
                                let id = ele.id;
                                if (currentConfig.moduleMap[id]) {
                                    $(ele).attr("checked", true);
                                }
                            })
                        }
                    })
                }
                /**
                 * @deprecated
                 */
                this.__skRemoveCurrentVideo = () => {
                    let pathname = window.location.pathname;
                    if (pathname.indexOf("watchlater") > 0) {
                        $('.player-auxiliary-playlist-item-active .player-auxiliary-playlist-item-img-del,.player-auxiliary-playlist-item-showp .player-auxiliary-playlist-item-img-del,.siglep-active .del-btn').click();
                    } else if (pathname.indexOf("video") > 0) {
                        window.close();
                    }
                }
                this.__skRemoveHistoryVideo = () => {
                    let allBtn = $(".player-auxiliary-playlist-list .player-auxiliary-playlist-item-img-del,.action-list-inner .del-btn");
                    commonFuncObj.loadVideoInfo();
                    let finishVideos = Object.values(currentConfig.historyVideoInfo)
                        .filter(video => video.finish);
                    if (finishVideos.length > 0) {
                        finishVideos.sort((v1, v2) => v2.index - v1.index);
                        let messageObj = {
                            title: "删除已播放成功",
                        }
                        let message = "";
                        for (let i = 0; i < finishVideos.length; i++) {
                            let fv = finishVideos[i];
                            message += `${fv.bv_id}: ${fv.title}\n`;
                            allBtn.get(fv.index).click();
                        }
                        messageObj.message = message;
                        messageObj.timeout = 5000;
                        commonFuncObj.notification(messageObj);
                    }

                }
                this.clearConfig = () => {
                    commonFuncObj.GMSetValue("bilibili_current_config", defaultBiliBiliConfig);
                    window.location.reload();
                }
                this.start = function () {
                    this.createEventListener();
                    GM_registerMenuCommand("设置", () => this.showModuleMenu())
                    GM_registerMenuCommand("还原设置", () => this.clearConfig())
                }
            }

            try {
                (new innerClassControlModule()).start();
            } catch (e) {
                console.error("innerClassControlModule " + e)
            }
        }
        this.controlHistory = function () {
            function innerClassControlHistory() {
                this.video = commonFuncObj.video();
                this.videoInfo = null;
                this.currentBvid = null;

                this.createEventListener = () => {
                    class VideoEvent extends Enumerable {
                        static abort = new VideoEvent();
                        static loadedmetadata = new VideoEvent();
                        static timeupdate = new VideoEvent();
                        static ended = new VideoEvent();
                        static _ = this.closeEnum();

                        constructor() {
                            super();
                        }
                    }

                    // abort loadedmetadata timeupdate ended
                    $(this.video).on(VideoEvent.enumKeys.join(" "), (e) => {
                        let event = VideoEvent.enumValueOf(e.type);
                        switch (event) {
                            case VideoEvent.loadedmetadata: {
                                this._setCurrentBvid(this._getCurrentBvid());
                                this._setCurrentVideoDuration();
                                if (currentConfig.moduleMap.autoLike) {
                                    commonFuncObj.moduleAutoLike();
                                }
                                break;
                            }
                            case VideoEvent.abort : {
                                currentConfig.historyVideoInfo = this.videoInfo;
                                if (this._isFinishCurrentVideo()) {
                                    this._setCurrentVideoCurrentTime();
                                }
                                this._setCurrentBvid(null);
                                commonFuncObj.GMSetValue("bilibili_current_config", currentConfig);
                                break
                            }
                            case VideoEvent.timeupdate: {
                                this._setCurrentVideoCurrentTime();
                                break;
                            }
                            case VideoEvent.ended: {
                                this._setCurrentVideoFinish();
                                break
                            }
                        }

                    })
                }

                this._setCurrentVideoDuration = () => {
                    if (this.currentBvid !== null) this.videoInfo[this.currentBvid].duration = this.video.duration;
                }
                this._setCurrentVideoCurrentTime = () => {
                    if (this.currentBvid !== null) {
                        let temp = this.videoInfo[this.currentBvid].currentTime;
                        let max = Math.max(this.video.currentTime, temp ? temp : 0);
                        this.videoInfo[this.currentBvid].currentTime = max;
                    }
                }
                this._setCurrentBvid = (bvid) => {
                    this.currentBvid = bvid;
                }
                this._getCurrentBvid = () => {
                    let bvid;
                    let urlParam = new URLSearchParams(window.location.search);
                    bvid = urlParam.get("bvid");
                    if (bvid !== null) {
                        return bvid;
                    }
                    let pathname = window.location.pathname;
                    bvid = pathname.substring(pathname.lastIndexOf("/") + 1)
                    return bvid
                }
                this._setCurrentVideoFinish = () => {
                    if (this.currentBvid !== null) {
                        this.videoInfo[this.currentBvid].finish = true;
                    }
                }
                this._isFinishCurrentVideo = () => {
                    if (this.currentBvid !== null) {
                        let duration = this.videoInfo[this.currentBvid].duration;
                        let currentTime = this.videoInfo[this.currentBvid].currentTime;
                        if (currentTime / duration * 100 > 90) {
                            return true;
                        }
                    }
                    return false;
                }

                this.start = () => {
                    // todo 1. 读取列表信息 并 合并历史数据
                    this.videoInfo = commonFuncObj.loadVideoInfo();

                    // todo 2. 绑定 video 监听
                    this.createEventListener();
                }
            }

            try {
                let pathname = window.location.pathname;
                if (pathname.indexOf("watchlater") > 0) {
                    (new innerClassControlHistory()).start();
                }
            } catch (e) {
                console.error("innerClassControlHistory " + e)
            }
        }
        this.start = function () {
            this.controlHistory();
            this.controlSpeed();
            this.controlModule();
        }
    }

    try {
        $(document).on("readystatechange", (e) => {
            setTimeout(() => {
                (new bilibiliHelper()).start();
                console.log("[视频播放速度调整器]: 已加载!");
                if (!currentConfig.moduleMap) {
                    currentConfig.moduleMap = {}
                }
                if (currentConfig.shortcutKeyMap.showShortcutKeyMenu) {
                    currentConfig.shortcutKeyMap = defaultBiliBiliConfig.shortcutKeyMap;
                }
                if (currentConfig.moduleMap.autoLike) {
                    commonFuncObj.moduleAutoLike(true);
                }
            }, 3000)
        });

    } catch (e) {
        console.error(e);
    }
})();