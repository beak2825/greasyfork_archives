// ==UserScript==
// @name         京东种草秀助手
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.0.5
// @description  解决京东种草秀页面适配问题，视频加载区域优化！
// @icon         data:image/png;base64,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
// @match        *://eco.m.jd.com/*
// @connect      greasyfork.org
// @run-at       document-body
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479850/%E4%BA%AC%E4%B8%9C%E7%A7%8D%E8%8D%89%E7%A7%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479850/%E4%BA%AC%E4%B8%9C%E7%A7%8D%E8%8D%89%E7%A7%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(async function () {
    "use strict";
    addLiveCSS();
    const { MessageTip, AwaitSelectorShow, GM_XHR, GET_DATA, SET_DATA, AddDOM, WaylayHTTP } = Plug_fnClass();
    const plugConfig = GET_DATA("PLUG_CONFIG") || {};
    const isMainPage = window === window.top;

    // 宽度调整
    function ChangeSize(slugName, backName, changeName) {
        let leftWidth = 500;
        const slug = document.querySelector(slugName);
        const back = document.querySelector(backName);
        const changePage = document.querySelector(changeName);
        slug.addEventListener("mousedown", startResize, false);
        function startResize(e) {
            e.preventDefault();
            back.style.display = "block";
            window.addEventListener("mousemove", resize, false);
            window.addEventListener("mouseup", stopResize, false);
        }
        function resize(e) {
            leftWidth = e.clientX;
            if (leftWidth < 400) {
                leftWidth = 400;
            } else if (leftWidth > 800) {
                leftWidth = 800;
            }
            changePage.style.width = leftWidth + "px";
            changePage.style.minWidth = leftWidth + "px";
        }
        function stopResize() {
            plugConfig.leftWidth = leftWidth;
            SET_DATA("PLUG_CONFIG", plugConfig);
            back.style.display = "none";
            window.removeEventListener("mousemove", resize, false);
            window.removeEventListener("mouseup", stopResize, false);
        }
    }

    // 解析视频列表
    const listArr = [];
    WaylayHTTP([{
        method: "POST",
        stop: isMainPage,
        url: "video_videoDetail",
        callback: (params) => {
            const { list = [] } = params.data.responseText && JSON.parse(params.data.responseText) || {};
            for (const item of list) {
                const isFind = listArr.find(obj => obj.id === item.id);
                if (!isFind) {
                    listArr.push(item);
                }
            }
        }
    }, {
        method: "POST",
        stop: isMainPage,
        url: "talent_head_findTalentMsg",
        callback: (params) => {
            // 设置标题
            const { result } = params.data.responseText && JSON.parse(params.data.responseText) || {};
            if (result) {
                window.parent.postMessage({ name: "iframeTitle", msg: result.talentName }, "*");
            }
        }
    }])

    // 运行主程序
    if (isMainPage) {
        const href_url = window.location.href; //获取href
        document.body.style.overflow = "hidden";
        const rootPage = await AwaitSelectorShow("#root");
        rootPage.style.display = "none";
        const leftStyle = plugConfig.leftWidth ? `width:${plugConfig.leftWidth}px;min-width:${plugConfig.leftWidth}px;` : "";
        const jdDom = await AddDOM({
            addNode: document.body,
            addData: [{
                name: "div",
                id: "jd-main",
                add: [{
                    name: "div",
                    id: "jd-video-left",
                    style: leftStyle,
                    add: [{
                        name: "iframe",
                        id: "jd-iframe",
                        src: href_url,
                    }, {
                        name: "div",
                        id: "jd-plug",
                    }, {
                        name: "div",
                        id: "jd-slug-bar",
                    }]
                }, {
                    name: "div",
                    id: "jd-video-right",
                    add: [{
                        name: "video",
                        id: "jd-video-main",
                        style: "display: none",
                        controls: "controls",
                        autoplay: "autoplay",
                    }, {
                        name: "div",
                        id: "jd-video-text",
                        innerHTML: "点击视频即可预览"
                    }]
                }, {
                    name: "div",
                    id: "jd-slug-back",
                }],
            }]
        }, 0);
        ChangeSize("#jd-slug-bar", "#jd-slug-back", "#jd-video-left");
        const videoDom = jdDom.querySelector("video");
        window.addEventListener("message", function (event) {
            if (event.data.isRun) {
                return setIframe();
            }
            const mag = event.data.msg;
            if (!event.data || !mag) {
                return false;
            }
            if (event.data.name === "iframeVideo") {
                const playUrl = mag.playInfo.videoUrl;
                if (playUrl) {
                    videoDom.src = playUrl;
                    videoRate(videoDom);
                }
            }
            if (event.data.name === "iframeTitle") {
                document.title = mag;
            }
        });
        function setIframe() {
            const iframe = jdDom.querySelector("iframe");
            iframe.contentWindow.postMessage({ isRun: "isRun" }, "*");
        }
        versionPlug();
    }

    // 嵌套的页面
    if (!isMainPage) {
        await AwaitSelectorShow(".swiper-wrapper");
        window.parent.postMessage({ isRun: "isRun" }, "*");
        window.addEventListener("message", function (event) {
            if (event.data.isRun) {
                runClick();
            }
        });
        function runClick() {
            for (let i = 1; i <= 6; i++) {
                const list = document.querySelector("#listDomId-" + i);
                if (list) {
                    list.addEventListener("click", postMsg);
                }
            }
        }
        function postMsg(e) {
            if (e.target.className === "empty-btn" || e.target.innerHTML === "重新加载") {
                return MessageTip("✔️", `重新加载！`, 3);
            }
            e.stopPropagation(); // 阻止事件冒泡
            e.preventDefault(); // 阻止默认行为
            const img = e.target.querySelectorAll("img");
            if (img.length !== 1) {
                return false;
            }
            const imgName = img[0].src.replace(/.*jfs/, "");
            const videoList = listArr.find(obj => obj.indexImage.includes(imgName));
            if (!videoList) {
                return MessageTip("❌", `点击事件中未捕获到视频！`, 3);
            }
            window.parent.postMessage({ name: "iframeVideo", msg: videoList }, "*");
        }
    }

    // 倍速播放按钮
    let restRate = null;
    let rateNumber = 1.5;
    async function videoRate(video) {
        const videoDom = document.querySelector("#jd-video-main");
        const videoText = document.querySelector("#jd-video-text");
        videoDom.style.display = "block";
        videoText.style.display = "none";
        const videoDiv = document.querySelector("#jd-video-right");
        const Rate = [0.5, 1, 1.5, 2, 3, 4];
        video.playbackRate = rateNumber;
        let liveRate = document.querySelector("#liveRate");
        if (!liveRate) {
            liveRate = await AddDOM({
                addNode: videoDiv,
                addData: [{
                    name: "div",
                    id: "liveRate"
                }]
            }, 0);
            Rate.forEach(async (num) => {
                await AddDOM({
                    addNode: liveRate,
                    addData: [{
                        name: "span",
                        className: num === rateNumber ? "active" : "",
                        id: "Rate" + Rate.indexOf(num),
                        innerHTML: num.toFixed(1),
                        click: () => {
                            rateNumber = num;
                            restRate();
                        }
                    }]
                })
            })
        }
        restRate = (index = rateNumber) => {
            const active = liveRate.querySelector(".active");
            !!active ? active.className = "" : "";
            const spanRate = liveRate.querySelector("#Rate" + Rate.indexOf(index));
            if (!!spanRate) {
                spanRate.className = "active";
                video.play();
                video.playbackRate = index;
                return false;
            }
        }
    }

    // 版本控制器
    function versionPlug() {
        const plugUrl = "https://greasyfork.org/zh-CN/scripts/479850-京东种草秀助手";
        const openUrl = plugUrl + "/code/京东种草秀助手.user.js";
        const version = GM_info.script.version;
        const plugName = GM_info.script.name;
        AddDOM({
            addNode: document.querySelector("#jd-plug"),
            addData: [{
                name: "div",
                id: "MyPlugVer",
                add: [{
                    name: "span",
                    innerHTML: `版本：${version}`
                }, {
                    name: "span",
                    id: "click",
                    innerHTML: "初始化",
                    function: (element) => {
                        clickPlug(element);
                    },
                    click: (e) => {
                        clickPlug(e.target, true);
                    }
                }, {
                    name: "a",
                    href: plugUrl + "/versions",
                    target: "_blank",
                    innerHTML: "版本信息"
                }, {
                    name: "span",
                    id: "click",
                    innerHTML: "重置宽度",
                    click: () => {
                        const videoLeft = document.querySelector("#jd-video-left");
                        videoLeft.style = "width: 500px;min-width: 500px;";
                        plugConfig.leftWidth = 500;
                        SET_DATA("PLUG_CONFIG", plugConfig);
                    }
                }]
            }]
        })
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return MessageTip("❌", `新版插件下载中，请稍后...`, 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(openUrl + "?time=" + toTime, "_self");
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState == "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerHTML === "有更新") {
                return document.myUpVisible();
            }
            if (element.innerHTML === "检测中") {
                return MessageTip("❌", `正在检测中，请稍后...`, 3);
            }
            element.style = "color: red;";
            element.innerHTML = "检测中";
            return updatesPlug(element, click);
        }
        function checkPlug(element, obj, click) {
            const oldVer = Number(version.replace(/[\s.]+/g, ""));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ""));
            if (!!obj.plugver && newVer > oldVer) {
                element.innerHTML = "有更新";
                MessageTip("❌", `${plugName}发现新的版本：${obj.plugver} <a onclick="document.myUpVisible();">更新助手</a>`, 6);
            } else if (!!obj.plugver) {
                element.innerHTML = "最新版";
                element.style = "";
                if (!!click) {
                    MessageTip("✔️", `${plugName}已经是最新版本！`, 3);
                }
            }
        }
        function updatesPlug(element, click) {
            const toTime = (new Date()).getTime();
            if (!plugConfig.plugver || toTime - plugConfig.plugtime >= 1000 * 60 * 60 * 12 || !!click) {
                GM_XHR({
                    how: "GET",
                    url: plugUrl + "/code"
                }, (xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    if (!!newVer) {
                        plugConfig.plugtime = toTime;
                        plugConfig.plugver = newVer;
                        checkPlug(element, plugConfig, true);
                        SET_DATA("PLUG_CONFIG", plugConfig);
                    } else {
                        MessageTip("❌", `${plugName}检测更新失败！`, 3);
                        checkPlug(element, "", true);
                    }
                })
            } else {
                checkPlug(element, plugConfig);
            }
        }
    }
})();

// 常用方法
function Plug_fnClass() {
    class Plug_Plug {
        /**
         * 插件开关设置
         * @param {string | object} name 开关名称
         * @param {string} saveName 开关键名（key）
         * @param {number} initial 默认开、关，不设置为1（开）
         * @param {boolean} click 点击标识，反转开关（不可传参）
         * @returns 返回当前开关状态
         */
        SwitchPrompt = (name, saveName, initial = true, click) => {
            const self = this;
            const state = ["❌ ", "✔️ "];
            const isOpen = GM_getValue(saveName, initial);
            let configName = state[Number(isOpen)] + name;
            if (typeof name === "object") {
                configName = name[Number(isOpen)];
            }
            GM_registerMenuCommand(configName, () => { self.SwitchPrompt(name, saveName, isOpen, true) });
            if (!!click) {
                GM_setValue(saveName, !initial);
                location.reload();
            }
            return isOpen;
        }

        /**
         * 读取存储
         * @param {string} name 存储的键名
         * @param {object} def 为空的默认返回内容，不填返回undefined
         * @returns 返回GET的值
         */
        GET_DATA = (name, def = undefined) => {
            if (!name) {
                return def;
            }
            return JSON.parse(localStorage.getItem(name)) || def;
        }

        /**
         * 存储写入
         * @param {string} name 存储的键名
         * @param {object} data 存储的内容
         * @returns 返回写入的值
         */
        SET_DATA = (name, data) => {
            if (!name) {
                return data;
            }
            if (name === "GM_CONFIG") {
                const oldData = this.GET_DATA(name);
                data = { ...oldData, ...data };
            }
            localStorage.setItem(name, JSON.stringify(data));
            return data;
        }

        /**
         * 跨域的网络请求
         * @param {object} config 请求配置
         * @param {function} fun 请求的回调
         * @returns 使用then方法获取结果或者await
         */
        GM_XHR({ method, url, data, header, timeout = 10000 }, fun = () => { }) {
            const headers = {}
            headers["Content-Type"] = "application/json";
            for (const head in header) {
                if (header.hasOwnProperty(head)) {
                    headers[head] = header[head];
                }
            }
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: method || "GET",
                    url: url,
                    data: data,
                    headers: header,
                    timeout: timeout,
                    onload: function (data) {
                        if (data.readyState == 4) {
                            fun(data);
                            resolve(data);
                        }
                    },
                    onerror: function (error) {
                        fun(error);
                        reject(error);
                    },
                    ontimeout: function (out) {
                        fun(out);
                        reject(out);
                    },
                })
            })
        }

        /**
         * 等待元素出现在页面中
         * @param {string} nodeName 选择器元素的名称
         * @param {boolean} showType （可选）是否启用窗口在前台才继续？默认关闭
         * @param {function} callback （可选）由函数控制元素是否应该加载，无法保证返回元素，返回一个结束函数，传入true则完成等等
         * @returns 返回Promise，成功则返回等待的元素
         */
        AwaitSelectorShow = (nodeName, showType, callback = () => { }) => {
            const ObserverDOM = this.ObserverDOM;
            const config = {
                type: !showType,
                node: undefined,
                observer: null,
                over: false
            }
            return new Promise(function (resolve, reject) {
                function over(params) {
                    if (params === true && !config.over) {
                        config.node = null;
                        return _backRun();
                    }
                }
                callback(over);
                queryNode();
                function queryNode() {
                    const node = document.querySelector(nodeName);
                    if (node) {
                        config.observer && config.observer.stop();
                        config.node = node;
                        return _backRun();
                    } else if (!config.queryEvent) {
                        config.queryEvent = true;
                        config.observer = ObserverDOM(queryNode).observe(document, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    }
                }
                showNode();
                function showNode() {
                    const visible = document.visibilityState === "visible";
                    if (visible) {
                        document.removeEventListener("visibilitychange", showNode);
                        config.type = visible;
                        return _backRun();
                    } else if (!config.typeEvent) {
                        config.typeEvent = true;
                        document.addEventListener("visibilitychange", showNode);
                    }
                }
                function _backRun() {
                    if ((!!config.node || config.node === null) && !!config.type) {
                        resolve(config.node);
                    }
                }
            })
        }

        /**
         * 气泡提示
         * @param {string} ico 提示气泡的emoji
         * @param {string} text 提示文字
         * @param {number} time 气泡显示时间
         * @param {number} place 气泡的位置
         * @returns 返回创建的气泡，以及修改气泡位置的回调函数
         */
        MessageTip = (ico, text, time, place = 1) => {
            if (ico === undefined) {
                const msgConfig = {};
                return (ico, text, time, place) => {
                    if (!msgConfig.remove) {
                        msgConfig.remove = this.ThrottleOver(() => {
                            if (msgConfig.msgTip) {
                                msgConfig.msgTip.remove();
                                msgConfig.msgTip = null;
                            }
                        })
                    }
                    if (time) {
                        msgConfig.remove.time(time * 1000);
                    }
                    if (!msgConfig.msgTip) {
                        msgConfig.msgTip = this.MessageTip(ico, text, "", place);
                    } else {
                        msgConfig.msgTip.ico(ico);
                        msgConfig.msgTip.text(text);
                    }
                    msgConfig.remove();
                    return msgConfig.msgTip;
                }
            }
            const openEnd = [
                "margin-left: 0;margin-top: 0;",//左上
                "margin-top: 0;margin-top: 0;",//居中
                "margin-right: 0;",//右上
                "margin-right: 0;margin-bottom: 0;",//右下
                "margin-left: 0;margin-bottom: 0;",//左下
            ]
            const middle = [
                "margin-left: 30px;margin-top: 15px;",//左上
                "margin-top: 15px;",//居中
                "margin-right: 30px;margin-top: 15px;",//右上
                "margin-right: 30px;margin-bottom: 15px;",//右下
                "margin-left: 30px;margin-bottom: 15px;",//左下
            ]
            const inRunFrame = this.RunFrame;
            const createTip = async (addNode) => {
                const className = "gm-message-place-" + place;
                const tipDom = addNode.querySelector(`:scope>.${className}`);
                if (tipDom) { return tipDom };
                return this.AddDOM({
                    addNode: addNode,
                    addData: [{
                        name: "div",
                        className: "gm-message " + className
                    }]
                }, 0);
            }
            const createBody = async (addNode, body) => {
                return createTip(addNode).then(tipDiv => {
                    if (body instanceof HTMLElement) {
                        tipDiv.appendChild(body);
                        display(body);
                        return body;
                    } else {
                        return this.AddDOM({
                            addNode: tipDiv,
                            addData: body
                        }, 0).then(div => {
                            display(div);
                            return div;
                        })
                    }
                })
            }
            const msgDem = createBody(document.body, [{
                name: "div",
                className: "gm-message-main",
                add: [{
                    name: "div",
                    className: "gm-message-body",
                    add: [{
                        name: "div",
                        className: "gm-message-ico",
                        innerHTML: ico
                    }, {
                        name: "div",
                        className: "gm-message-text",
                        innerHTML: text
                    }]
                }]
            }])
            time && remove(time);
            function display(div) {
                div.style = "height: auto;";
                const height = div.clientHeight;
                div.style = `opacity: 0;${openEnd[place]}`;
                inRunFrame(() => {
                    div.style = `opacity: 1;height: ${height}px;${middle[place]}`;
                }, 1)
            }
            function remove(reTime = 0.6) {
                const fadeTime = 300; // 淡出动画时间
                const totalTime = reTime * 1000; // 总延迟转换为毫秒
                const fadeOutDelay = totalTime > fadeTime ? totalTime - fadeTime : 0;
                msgDem.then(div => {
                    setTimeout(() => {
                        inRunFrame(() => {
                            div.style = `opacity: 0;${openEnd[place]}`;
                            setTimeout(() => {
                                div.remove();
                            }, fadeTime);
                        });
                    }, fadeOutDelay);
                })
            }
            function editDom(params, className) {
                msgDem.then(div => {
                    const textDom = div.querySelector(className);
                    if (typeof params === "object") {
                        textDom.innerHTML = "";
                        this.AddDOM({
                            addNode: textDom,
                            addData: params
                        })
                    } else {
                        textDom.innerHTML = params;
                    }
                })
            }
            return {
                node: msgDem,
                remove: remove,
                open: (element) => msgDem.then(div => createBody(element, div)),
                text: (data) => editDom(data, ".gm-message-text"),
                ico: (data) => editDom(data, ".gm-message-ico"),
            }
        }

        /**
         * 节点创建函数
         * @param {object} nodeObject 需要创建的元素结构
         * @param {number} index （可选）返回元素的配置，默认返回第一个元素，传入下标则返回指定元素，"true"为所有元素
         * @returns 返回指定下标的元素（或全部）
         */
        AddDOM = async ({ addNode, addData }, index = 0) => {
            const ObjectProperty = this.ObjectProperty;
            const All = [];
            for (const node of addData) {
                if (typeof node === "object" && node.name) {
                    const elem = document.createElement(node.name); // 创建元素
                    if (!!addNode) {
                        addNode.appendChild(elem);
                    }
                    delete node.name;
                    const setRule = {
                        function: async (key) => {
                            await node[key](elem);
                        },
                        click: (key) => {
                            elem.addEventListener("click", (e) => { node[key](e, elem) }, false);
                        },
                        default: (key) => {
                            if (key !== "add") {
                                const values = node[key];
                                if (Array.isArray(values) && typeof values[0] === "object" && typeof values[1] === "string") {
                                    ObjectProperty(values[0], values[1], (params) => {
                                        if (params.value !== undefined && values[2] !== null) {
                                            return setValue(params.value);
                                        } else {
                                            setValue(values[2]);
                                        }
                                    })
                                } else {
                                    setValue(values);
                                }
                            }
                            function setValue(value) {
                                if (elem[key] === undefined) {
                                    elem.setAttribute(key, value);
                                } else {
                                    elem[key] = value;
                                }
                            }
                        }
                    }
                    const keys = Object.keys(node);
                    for (const key of keys) {
                        const ruleBack = setRule[key];
                        if (ruleBack) {
                            await ruleBack(key);
                        } else {
                            setRule.default(key);
                        }
                    }
                    // 递归创建子元素
                    if (!!node.add && node.add.length > 0) {
                        await this.AddDOM({
                            addNode: elem,
                            addData: node.add
                        });
                    }
                    All.push(elem);
                }
            }
            if (index === true) {
                return All;
            }
            return All[index];
        }

        /**
         * 网络请求监听器
         * @param {object} params 传入一个配置对象，键名：[{ method, url: [{ type, match }], callback, stop }]
         * @returns callback({ type: "send", data, sendBody, stop })
         */
        WaylayHTTP(params) {
            if (!window.WaylayHTTPConfig) {
                window.WaylayHTTPConfig = [];
                // 重写xhr，监听网络请求
                const XMLopen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function () {
                    const meter = arguments;
                    this.meter = meter;
                    XMLopen.apply(this, arguments);
                };
                // 重写xhr，监听网络请求
                const XMLsend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function (sendBody) {
                    const self = this;
                    const meter = self.meter;
                    const config = window.WaylayHTTPConfig;
                    for (const list of config) {
                        if (!list.method || list.method === meter[0]) {
                            if (isUrl(list.url, meter[1], sendBody)) {
                                const backData = {
                                    type: "send",
                                    sendBody: sendBody,
                                    data: this,
                                    stop: () => stop(list)
                                }
                                if (!!list.stop) {
                                    return list.callback(backData);
                                }
                                self.addEventListener("load", function () {
                                    list.callback({ ...backData, data: this });
                                })
                            }
                        }
                    }
                    XMLsend.apply(self, arguments);
                };
                function stop(list) {
                    const taskObj = window.WaylayHTTPConfig.filter(item => item.uuid !== list.uuid);
                    window.WaylayHTTPConfig = taskObj;
                }
                function isUrl(findText, urlStr, bodyStr) {
                    const matchArr = [];
                    addMatch(findText);
                    function addMatch(findParams) {
                        const isArray = Array.isArray(findParams);
                        const isObject = typeof findParams === "object" && !isArray;
                        if (typeof findParams === "string") {
                            matchArr.push({ match: findParams });
                        } else if (isArray) {
                            findParams.forEach(addMatch);
                        } else if (isObject) {
                            matchArr.push(findParams);
                        }
                    }
                    const resultArr = matchArr.map((list) => {
                        if (!list.type || list.type === "and") {
                            return urlStr.includes(list.match);
                        }
                        if (list.type === "out") {
                            return !urlStr.includes(list.match);
                        }
                        if (list.type === "body-and") {
                            return bodyStr.includes(list.match);
                        }
                        if (list.type === "body-out") {
                            return !bodyStr.includes(list.match);
                        }
                    })
                    return !resultArr.includes(false);
                }
            }
            for (const list of params) {
                window.WaylayHTTPConfig.push({ ...list, uuid: crypto.randomUUID() });
            }
        }

        /**
         * 页面渲染时运行函数
         * @param {function} callback 回调函数
         * @param {number} index 运行帧，默认直接（0）
         */
        RunFrame = (callback, index = 0) => {
            return new Promise((resolve, reject) => {
                let count = 0;
                function frame() {
                    if (count === index || index < 0) {
                        resolve(callback());
                    } else if (count < index) {
                        count++;
                        requestAnimationFrame(frame);
                    } else {
                        reject(new Error("Index超过帧数"));
                    }
                }
                requestAnimationFrame(frame);
            })
        }

        /**
         * 元素变化观察器
         * @param {function} runback 需要运行的回调（mutation）
         * @returns 返回实例功能 observer(element, config); stop(); callback(callback);
         */
        ObserverDOM(runback = () => { }) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(runback);
            })
            const result = {
                observe: (element, config) => {
                    observer.observe(element, config);
                    return result;
                },
                stop: () => {
                    observer.disconnect();
                    return result;
                },
                callback: (callback) => {
                    runback = callback;
                    return result;
                }
            }
            return result;
        }
    }
    // 气泡消息
    GM_addStyle(`
        .gm-message {
            position: fixed;
            display: flex;
            z-index: 2000000;
            pointer-events: none;
            font-size: 16px;
        }
        .gm-message-place-0,
        .gm-message-place-2 {
            top: 0;
            left: 0;
            flex-direction: column;
        }
        .gm-message-place-2 {
            right: 0;
        }
        .gm-message-place-3,
        .gm-message-place-4 {
            bottom: 0;
            left: 0;
            flex-direction: column-reverse;
            margin-bottom: 30px;
        }
        .gm-message-place-3 {
            right: 0;
        }
        .gm-message-place-1 {
            top: 0;
            left: 0;
            right: 0;
            align-items: center;
            flex-direction: column;
        }
        .gm-message-main {
            opacity: 0;
            margin: auto;
            height: 0;
            transition: 0.3s;
            overflow: hidden;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
        }
        .gm-message-body {
            display: flex;
            padding: 12px 12px;
            text-align: center;
            line-height: 1;
            color: #000000;
            background: #ffffff;
            pointer-events: auto;
            user-select: text;
        }
        .gm-message-ico,
        .gm-message-text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .gm-message-text {
            font-size: 16px;
            line-height: 1.2;
        }
    `)
    return new Plug_Plug();
}

function addLiveCSS() {
    GM_addStyle(`
        .empty-btn,
        .tab-list-item,
        .showcard-imgtags,
        .content-item-info-pic {
            cursor: pointer;
        }
        #m_common_tip {
            display: none;
        }

        #jd-main {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: row;
        }
        #jd-video-left {
            position: relative;
            width: 500px;
            min-width: 500px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        #jd-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        #jd-plug {
            width: 100%;
            font-size: 14px;
            box-shadow: 0 0 5px 5px #ffffff;
        }
        #jd-slug-bar {
            position: absolute;
            cursor: col-resize;
            z-index: 10;
            top: 0;
            right: -2px;
            width: 4px;
            height: 100%;
            background: #ccc;
            transition: 0.1s ease-in-out;
        }
        #jd-slug-bar:hover {
            width: 8px;
            right: -4px;
        }
        #jd-slug-back {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            display: none;
            background: rgba(0,0,0,0);
        }
        #jd-video-right {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #jd-video-main,
        #jd-video-right {
            width: 100%;
            height: 100%;
            background: #333333;
        }
        #jd-video-text {
            font-size: 30px;
            font-weight: bold;
            color: #ffffff;
            letter-spacing: 2px;
        }

        #liveRate {
            position: absolute;
            left: 0;
            bottom: 90px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-shadow: 0 0 3px rgba(0,0,0,.5);
        }
        #liveRate span {
            margin: 5px 5px 0;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            border-radius: 5px;
            padding: 10px 20px;
            transition: 0.2s ease-in-out;
        }
        #liveRate span:hover {
            background: #ffffff50;
        }
        #liveRate .active {
            background: #ffffff40;
        }

        /*插件信息*/
        #MyPlugVer {
            padding-bottom: 3px;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        #MyPlugVer #click {
            cursor: pointer;
            color: green;
        }
        #MyPlugVer a,
        #MyPlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.3s ease-in-out;
        }
        #MyPlugVer a:hover,
        #MyPlugVer #click:hover {
            background: #F44336 !important;
            color: #fff !important;
        }

        a {
            cursor: pointer !important;
            color: #1890ff !important;
            text-decoration: none !important;
            background-color: transparent !important;
            transition: color .3s !important;
        }
        a:hover {
            color: #40a9ff !important;
        }
        a:active {
            color: #096dd9 !important;
        }
    `)
}
