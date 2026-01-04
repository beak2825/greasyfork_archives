// ==UserScript==
// @name         京东直播助手
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.1.7
// @description  解决电脑浏览器无法获取京东直播的问题，重写直播观看页面，支持流媒体、商品讲解、SKU跳转等！
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAMAAADWOFNCAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAgdQTFRFAAAA+1pg/l1k/WJm/WFl/mJm/FFc90RS+0VU+ERT8kBN/lxj/3Bu/3Fu/29t/2Bm/1xk/U5Z/ElW+0dV9kVT/V5j/2Vo/EtY+UNV+lhe/2pr+UVU/Fpg/19l/lhh+0lV/0lJ/2Ro/lVf+UZU+0VV+EJT+0hV9kJS/2dq/VJd+UZT+kZU/2hq+ktX90NT/21s/ldg+kZU+UdU/11l/VFc+0dV/1tj/ExY+kdU+UVU/EhW8DxT8T5P8j1O8j5P8zxO+1Ba/VJd/lli8zxQ8z1P8j1P9T5P+kxa/VRe/U5a9D5P8TxO8j1P+k1a+1Bc/lpj/lZf90NT8j1Q8j1P/2dp/1Fd/VZg/U1Y90RT/2tr/2Nn/VBc/lRd9kJR/2Fn/1Rk/ldh/1pi9EBR/2xr/2Fm+1Jd8z5Q/Fph/zNm+kZV+kdU+URU+ENS+UNT9D9Q+kZV9kNS90JS+UdU+0hW9D5Q90NU+kZV+ERT/0pa+UVT+EZU+kdV+UZU90JS+EVV9UBR+0hV+UVT/llh/1Nf+UVT+UVU9D9R8T5O+UVU7zxQ8jxQ90RT+UVT+0dV8j1Q+0hV8z9Q8j1P8TxO/1tk/lRe9UJS/lNd/U9b+EVU+EVT8j1P/0lJ9UdS/ElV90NT8z5P+UZV+0ZV9UFR8kBN+EVV8z5P8j1P8zxP+UJU90RT+UdV9UJR8z1V0WtuNgAAAK10Uk5TAI3T6/Dv4MCriBTH//////////pZ2P//KjH/5LL///8O///bgU3+cP/9KOr/2pz//+zV///3///v4P4ileqyVarX/Wbi/0o27v8tqZtxwv//n+q//z/3/////9X///9A+//////W/+gK9v+k/6P//1f/4///efD/H8uP9/8+2f/8//9rWeX/b7ZArYeg7mD//9mA//////////cHGf3/rsn//yiy//BqVbjn0xVmFkYMAAACIElEQVR4nO3U51sUMRAH4KC4a+NYggVREBUEscPpIXYwIsUCqFjBLoq9YUcpIhaKigUbKCCWP5KtyUzuNix+5vctzzPv7iaZWUImghM3aXI8zBQNRTczddp0Cc2YmYASSjRgkqid5FkIzU6QMgchYy51kwLQvJCEUjEyPETnA7VAQqE0jNK5WpghVLykFkmvWrwkM0tfarNsX5UjIWNZrlm0XK1WyMhYaRWtUqrVUWjNWqsoT6nyo1TYqs1ap1JpUWh9hNKCDYWUq42bNm/ZipTdE9q27UXgBCmIqYp3MDM7hXL2pJnPK9nFVSlSZeXMTgVXbkvstj97z15ntQ8iWlnlIFbtqf3uw93dHjhor2qQOsSwOnzEwIqQo+biGEL0OFKptWL74nDrTpyMYHUKqNNn4FHDGTqLET0n1Hl8QWj06i9AdJEJpSkUIQ1AXQqsyGWhrgRXuRxdZcHVNa6uj0Pd8NDNW4HV7Tv8VY0soLp7L9YVj6HuPwDoIQukHj1GfdEUSDU8QegpU6nmFtu0tkkt+Mwqbq+KqZrDVLfQ80IJOXfV4c3yC6BMY0Z/+eq1ZLyj6PD+G51cOSZmurq5sv5RPW+Ipd6mvwvX+BpKe5lQbrT3HyIKQUEDAqWrCezacaiP7D8U7CSgspXoE0B9n4X68lWBvsE++g7nod/XDPxA3fcTjd6gD2ocgmb4Fx5YMvL7T0F0/laDVHT+IxPxyShiJfbkZpkjoQAAAABJRU5ErkJggg==
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/hls.js/8.0.0-beta.3/hls.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/qrcodejs/1.0.0/qrcode.min.js
// @match        *://lives.jd.com/*
// @match        *://joyspace.jd.com/*
// @connect      api.m.jd.com
// @connect      greasyfork.org
// @connect      livecms.jd.com
// @connect      item.jd.com
// @connect      npcitem.jd.hk
// @run-at       document-body
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes     true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472528/%E4%BA%AC%E4%B8%9C%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472528/%E4%BA%AC%E4%B8%9C%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    "use strict";
    const newGM_addStyle = GM_addStyle;
    // 重写GM_addStyle函数
    GM_addStyle = function (css) {
        const allStyles = document.querySelectorAll("style");
        for (const styleDom of allStyles) {
            if (styleDom.textContent === css) {
                return false;
            }
        }
        newGM_addStyle(css);
    }
    CSS_mainPage();
    const host = window.location.host; // 获取host
    const href = window.location.href; // 获取href
    const search = window.location.search; // 获取search
    const pathName = host + window.location.pathname; // 获取pathname
    const { GetQueryString } = Plug_fnClass();

    // 直播内容
    if (host === "lives.jd.com" && GetQueryString("id")) {
        livePlugRun();
        changeFavicon(GM_info.script.icon);
        return false;
    }
    // 自定义直播内容
    if (host === "lives.jd.com" && GetQueryString("images")) {
        livePlugRunDiy();
        changeFavicon(GM_info.script.icon);
        return false;
    }
    // 修改页面ico
    function changeFavicon(newIconPath) {
        const link = document.querySelector("link[rel='icon']") || document.createElement("link");
        link.rel = "icon";
        link.href = newIconPath;
        document.head.appendChild(link);
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
         * 读取开关设置
         * @param {string} name 开关名称
         * @returns 返回当前开关状态
         */
        SwitchRead = (name) => {
            const switchConfig = GM_getValue("switchConfig", {});
            return switchConfig[name] || {};
        }

        /**
         * 修改开关设置
         * @param {string} name 开关名称
         * @param {object} config 开关配置
         * @returns 返回当前开关状态
         */
        SwitchWrite = (name, config) => {
            const switchConfig = GM_getValue("switchConfig", {});
            if (typeof config === "object") {
                switchConfig[name] = config;
                GM_setValue("switchConfig", switchConfig);
            }
            return switchConfig[name] || {};
        }

        /**
         * 读取存储
         * @param {string} name 存储的键名
         * @param {object} def 为空的默认返回内容，不填返回undefined
         * @returns 
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
         * @returns 
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
         * 文本复制函数
         * @param {string} content 需要复制的文本
         */
        CopyText(content) {
            const input = document.createElement("input");
            input.setAttribute("value", content);
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
        }

        /**
         * 格式化时间
         * @param {string} format 时间格式，默认YYYY-MM-DD
         * @param {Date} date （可选）传入一个时间对象
         * @returns 返回格式化后的时间格式
         */
        FormatTime(format = "YYYY-MM-DD", date) {
            const time = date && new Date(date) || new Date();
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");
            const second = time.getSeconds().toString().padStart(2, "0");
            const formattedDate = format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hour)
                .replace('hh', hour)
                .replace('mm', minute)
                .replace('ss', second);
            return formattedDate;
        }

        /**
         * 天数加减法
         * @param {string | Date} date 需要运算的时间
         * @param {number} day 需要加减的天数
         * @param {string} format 时间格式，默认YYYY-MM-DD
         * @returns 返回格式化后的时间格式
         */
        DiffDay = (date, day, format = "YYYY-MM-DD") => {
            const oldTime = new Date(date);
            oldTime.setDate(oldTime.getDate() - day);
            return this.FormatTime(format, oldTime);
        }

        /**
         * 获取Cookie
         * @param {string} cookieName Cookie键名
         * @returns 返回对应键值的名称
         */
        GetCookie(cookieName) {
            const cookieRegex = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            const cookieValue = document.cookie.replace(cookieRegex, "$1");
            return cookieValue;
        }

        /**
         * 复制dom元素为图片
         * @param {string} nodeName 节点选择器字符串
         * @returns 返回一个Promise，成功为True
         */
        CopyHtml2Img(nodeName) {
            return new Promise(function (resolve, reject) {
                html2canvas(document.querySelector(nodeName), {
                    scale: 2, //缩放比例,默认为1
                    allowTaint: false, //是否允许跨域图像污染画布
                    useCORS: false, //是否尝试使用CORS从服务器加载图像
                    //width: "240", //画布的宽度
                    //height: "480", //画布的高度
                    //backgroundColor: "#000000", //画布的背景色，默认为透明
                }).then((canvas) => {
                    // 将临时canvas中的图像转换为文件对象
                    canvas.toBlob((blob) => {
                        const blobIMG = new ClipboardItem({ [blob.type]: blob });
                        navigator.clipboard.write([blobIMG]).then(() => {
                            resolve(true);
                        }).catch((error) => {
                            console.error("无法复制：", error);// 如果用户没有授权，则抛出异常
                            reject(false);
                        })
                    })
                })
            })
        }

        /**
         * 跨域的网络请求
         * @param {object} config 请求配置
         * @param {function} fun 请求的回调
         * @returns 使用then方法获取结果或者await
         */
        GM_XHR({ method, url, data, header, timeout = 10000, isWith = true }, fun = () => { }) {
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
                    anonymous: isWith,
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
         * XMLHttpRequest方法
         * @param {object} config 请求配置
         * @param {function} fun 请求的回调
         * @returns 使用then方法获取结果或者await
         */
        HTTP_XHR({ method, url, data = null, header, isWith = false }, fun = () => { }) {
            return new Promise(function (resolve, reject) {
                try {
                    let xhr = new XMLHttpRequest();
                    xhr.withCredentials = isWith;
                    xhr.open(method, url);
                    for (const headKey in header) {
                        if (header.hasOwnProperty(headKey)) {
                            xhr.setRequestHeader(headKey, header[headKey]);
                        }
                    }
                    xhr.send(JSON.stringify(data));
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            fun(xhr);
                            resolve(xhr);
                        }
                    }
                } catch (err) {
                    fun(err);
                    reject({ msg: "失败" });
                }
            })
        }

        /**
         * 等待元素出现在页面中
         * @param {string} nodeName 选择器元素的名称
         * @param {boolean} showType （可选）是否启用窗口在前台才继续？默认关闭
         * @returns 返回Promise，成功则返回等待的元素
         */
        AwaitSelectorShow(nodeName, showType) {
            const config = {
                type: !showType
            }
            return new Promise(function (resolve, reject) {
                queryNode();
                function queryNode() {
                    const node = document.querySelector(nodeName);
                    if (node) {
                        document.body.removeEventListener("DOMNodeInserted", queryNode);
                        config.node = node;
                        return _backRun();
                    } else if (!config.queryEvent) {
                        config.queryEvent = true;
                        document.body.addEventListener("DOMNodeInserted", queryNode);
                    }
                }
                showNode();
                function showNode() {
                    const visible = document.visibilityState === "visible";
                    if (visible) {
                        document.body.removeEventListener("visibilitychange", showNode);
                        config.type = visible;
                        return _backRun();
                    } else if (!config.typeEvent) {
                        config.typeEvent = true;
                        document.addEventListener("visibilitychange", showNode);
                    }
                }
                function _backRun() {
                    if (!!config.node && !!config.type) {
                        resolve(config.node);
                    }
                }
            })
        }

        /**
         * 等待img加载完成
         * @param {number} time 时间参数，单位ms，不管图片是否完成加载
         * @returns 返回Promise，成功则返回true
         */
        AwaitImgLoaded(time) {
            return new Promise(function (resolve, reject) {
                if (time) {
                    setTimeout(() => resolve(true), time)
                }
                const images = document.querySelectorAll("img");
                const loadedCount = [];
                for (const img of images) {
                    if (img.complete) {
                        loadedCount.push(0);
                    } else {
                        img.onload = () => {
                            loadedCount.push(0);
                            if (loadedCount.length === images.length) {
                                resolve(true);
                            }
                        }
                    }
                }
                if (loadedCount.length === images.length) {
                    resolve(true);
                }
            })
        }

        /**
         * 获取当前网页url参数值
         * @param {string} name 键值的名称
         * @param {string} text （可选）从自定义参数结构
         * @returns 返回键值
         */
        GetQueryString(name, text) {
            const search = (text || window.location.href).match(/\?(.*)/);
            if (!!search && search.length > 1) {
                const urlParams = new URLSearchParams(search[1]);
                return urlParams.get(name);
            }
            if (text) {
                const urlParams = new URLSearchParams(text);
                return urlParams.get(name);
            }
            return null;
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
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        div.style = `opacity: 1;height: ${height}px;${middle[place]}`;
                    })
                })
            }
            function remove(time = 0.6) {
                const fadeTime = 300; // 淡出动画时间
                const totalTime = time * 1000; // 总延迟转换为毫秒
                const fadeOutDelay = totalTime > fadeTime ? totalTime - fadeTime : 0;
                msgDem.then(div => {
                    setTimeout(() => {
                        requestAnimationFrame(() => {
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
         * 窗口移动函数
         * @param {object} dome 触发的dom元素
         * @param {object} frame 需要变化位置的元素
         * @param {function} callback 各方向的回调事件
         */
        WindowMove(dome, frame, callback) {
            dome.addEventListener("mousedown", function (down) {
                const diffLeft = down.clientX - frame.offsetLeft;
                const diffTop = down.clientY - frame.offsetTop;
                const innerWidth = frame.offsetParent.clientWidth;
                const innerHeight = frame.offsetParent.clientHeight;
                document.addEventListener("mousemove", setMove);
                document.addEventListener("mouseup", setOver);
                function setMove(move) {
                    const factorHeight = innerHeight - frame.offsetHeight;
                    const factorWidth = innerWidth - frame.offsetWidth;
                    const top = check(move.clientY - diffTop, factorHeight);
                    const bottom = check(factorHeight - move.clientY + diffTop, factorHeight);
                    const left = check(move.clientX - diffLeft, factorWidth);
                    const right = check(factorWidth - move.clientX + diffLeft, factorWidth);
                    function check(value, factor) {
                        if (value < 0) {
                            value = 0;
                        } else if (value > factor) {
                            value = factor;
                        }
                        return value;
                    }
                    if (move.preventDefault) {
                        move.preventDefault();
                    }
                    if (callback) {
                        callback({
                            top, bottom, left, right
                        })
                    }
                }
                function setOver() {
                    document.removeEventListener("mousemove", setMove);
                    document.removeEventListener("mouseup", setOver);
                }
            })
        }

        /**
         * 节点创建函数
         * @param {object} nodeObject 需要创建的元素结构
         * @param {number} index （可选）返回元素的配置，默认返回第一个元素，传入下标则返回指定元素，"true"为所有元素
         * @returns 返回指定下标的元素（或全部）
         */
        AddDOM = async ({ addNode, addData }, index = 0) => {
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
                                if (elem[key] === undefined) {
                                    elem.setAttribute(key, node[key]);
                                } else {
                                    elem[key] = node[key];
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
         * 点击任意位置隐藏元素
         * @param {Array} domArr 排除元素被点击不能隐藏
         * @param {Element} children 需要隐藏的元素
         */
        DisplayWindow(domArr, children) {
            document.addEventListener("mousedown", (c) => {
                if (!c.isTrusted) {
                    return false;
                }
                const isContains = domArr.filter((list) => {
                    const isWork = list.contains(c.target);
                    return isWork;
                })
                if (isContains.length === 0) {
                    children.style.display = "none";
                }
            });
        }

        /**
         * 对象变化监听
         * @param {Object} obj 需要监听的对象
         * @param {string} property 监听的键名
         * @param {Function} callback 变化时的回调
         */
        ObjectProperty(obj, property, callback) {
            // 如果还没有为该属性创建回调数组，则初始化为空数组
            const callbacksKey = `__${property}_callbacks`;
            if (!obj.hasOwnProperty(callbacksKey)) {
                Object.defineProperty(obj, callbacksKey, {
                    value: [],
                    enumerable: false,
                    writable: true
                })
                let value = obj[property];
                Object.defineProperty(obj, property, {
                    get: function () {
                        return value;
                    },
                    set: function (newValue) {
                        value = newValue;
                        // 当属性值改变时，遍历并执行所有回调函数
                        for (const call of obj[callbacksKey]) {
                            call({
                                name: property,
                                value: newValue
                            });
                        }
                    }
                })
            }
            // 将新的回调添加到回调数组中
            obj[callbacksKey].push(callback);
            // 立即执行回调函数
            callback({
                name: property,
                value: obj[property]
            });
            // 返回当前的属性值
            return {
                name: property,
                value: obj[property]
            };
        }

        /**
         * 节流器，指定时间内频繁触发，只运行最后一次
         * @param {Function} callback 节流的回调函数
         * @param {number} delay 节流时间
         * @returns 返回节流器的触发函数
         */
        ThrottleOver(callback, delay = 300) {
            let timer = null;
            return function () {
                const context = this;
                const args = arguments;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    callback.apply(context, args);
                    timer = null;
                }, delay);
            };
        }

        /**
         * 网络请求监听器
         * @param {object} params 传入一个配置对象，键名：{ method, url, callback, stop }
         */
        WaylayHTTP(params) {
            if (!window.waylayConfig) {
                window.waylayConfig = [];
            }
            window.waylayConfig.push(...params);
            if (!window.waylayOpen) {
                window.waylayOpen = true;
            } else {
                return false;
            }

            // 重写xhr，监听网络请求
            const XMLopen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function () {
                const config = window.waylayConfig;
                const meter = arguments;
                this.meter = meter;
                for (const list of config) {
                    if (!list.method || list.method === meter[0]) {
                        if (meter[1].includes(list.url) && !!list.stop) {
                            return false;
                        }
                    }
                }
                XMLopen.apply(this, arguments);
            };
            // 重写xhr，监听网络请求
            const XMLsend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (loads) {
                const self = this;
                const meter = self.meter;
                const config = window.waylayConfig;
                for (const list of config) {
                    if (!list.method || list.method === meter[0]) {
                        if (meter[1].includes(list.url)) {
                            self.addEventListener("load", function () {
                                list.callback({
                                    type: "send",
                                    data: this,
                                    loads: loads
                                })
                            })
                        }
                    }
                }
                XMLsend.apply(self, arguments);
            }
        }

        /**
         * 导出为EXCEl文件
         * @param {array} excelName 数组数据
         * @param {string} name 导出的名称
         */
        /**
         * 导出为EXCEl文件
         * @param {string} excelName 文件名称
         * @returns 回调方法
         */
        ExportToExcel(excelName) {
            // 创建工作簿对象
            const workbook = XLSX.utils.book_new();
            // 添加数据到表
            function pushData(data, sheetName = "数据") {
                // 创建一个工作表
                const worksheet = XLSX.utils.json_to_sheet(data);
                // 将工作表添加到工作簿
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            }
            // 导出Excel文件
            function download(downName = excelName) {
                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(excelData);
                link.download = downName || "data.xlsx";
                link.click();
                link.remove();
            }
            /**
             * 下载数据
             * @param {object} data 表数据
             * @param {string} sheetName Sheet名称
             */
            function play(data, sheetName) {
                pushData(data, sheetName);
                download();
            }
            /**
             * 多Sheet下载
             * @param {object} params 表数据参数[{ sheetData, sheetName }]
             */
            function sheet(params) {
                for (const list of params) {
                    const { sheetData, sheetName } = list;
                    pushData(sheetData, sheetName);
                }
                download();
            }
            return { play, sheet }
        }

        /**
         * 获取京东后台用户信息
         * @returns 返回用户信息
         */
        GetUserInfo = async () => {
            const nick = document.querySelector(".avatar span");
            const plugConfig = this.GET_DATA("GM_CONFIG", {}).userInfo || {};
            if (!nick || plugConfig.nick !== nick.textContent) {
                const xhr = await this.HTTP_XHR({ method: "GET", url: "/api/user/getUserInfo" });
                const responseText = xhr.responseText;
                if (!!responseText && xhr.status === 200) {
                    const content = JSON.parse(xhr.responseText).content;
                    this.SET_DATA("GM_CONFIG", {
                        userInfo: content
                    })
                    return content;
                }
            }
            return plugConfig;
        }

        /**
         * 异步队列并发管理器
         * @param {number} maxRun 并发数量，默认1个
         * @param {number} maxRetry 错误最大运行次数，默认1次，使用catch捕获的错误，请在函数抛出错误
         * @returns push添加函数队列，stop停止，play继续，endBack结束的回调，error错误的回调
         */
        QueueTaskRunner(maxRun = 1, maxRetry = 1) {
            const params = {
                isRun: false, // 是否运行
                isStop: false, // 终止
                maxRun, // 最大并发数
                maxRetry, // 最大并发数
                running: 0, // 当前正在执行的请求数
                runCallback: [], // 请求的数据，队列
                endCallback: () => { }, // 完成后的回调
                errCallback: () => { } // 执行中途错误的回调
            }
            async function _run() {
                while (!params.isStop && params.running < params.maxRun && params.runCallback.length > 0) {
                    const task = params.runCallback.shift();
                    params.running++;
                    _executeTask(task);
                }
            }
            async function _executeTask(task, attempt = 1) {
                const { callback, resolve, reject } = task;
                callback().then(result => {
                    resolve(result);
                    _taskCompleted();
                }).catch(error => {
                    if (attempt < params.maxRetry) {
                        console.error("队列重试:", attempt, error);
                        _executeTask(task, attempt + 1);
                    } else {
                        console.error("Task Error:", error);
                        params.errCallback(error);
                        reject(error);
                        _taskCompleted();
                    }
                });
            }
            function _taskCompleted() {
                params.running--;
                _run();
                _runEnd();
            }
            async function _runEnd() {
                if (params.isRun && !params.isStop && params.running === 0 && params.runCallback.length === 0) {
                    params.isRun = false;
                    params.endCallback();
                }
            }
            const functionAll = {
                /**
                 * 添加队列函数
                 * @param {function} callback 函数
                 * @returns 返回执行结果 - Promise
                 */
                push(callback) {
                    params.isRun = true;
                    return new Promise((resolve, reject) => {
                        params.runCallback.push({ callback, resolve, reject });
                        _run();
                    });
                },
                /**
                 * 终止队列
                 */
                stop() {
                    params.isStop = true;
                },
                /**
                 * 开始队列
                 */
                play() {
                    params.isStop = false;
                    _run();
                },
                /**
                 * 队列完成的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                endBack(callback) {
                    params.endCallback = callback;
                    _runEnd();
                    return functionAll;
                },
                /**
                 * 队列错误的回调
                 * @param {function} callback 函数
                 * @returns 返回所有方法
                 */
                error(callback) {
                    params.errCallback = callback;
                    return functionAll;
                }
            }
            return functionAll;
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

// 自定义页面
function livePlugRunDiy() {
    cssFast();
    const { GetQueryString, QueueTaskRunner, AddDOM, GM_XHR, GET_DATA, SET_DATA, MessageTip } = Plug_fnClass();
    AddDOM({
        addNode: document.body,
        addData: [{
            name: "div",
            class: "live-diy-main",
            add: [{
                name: "div",
                class: "live-diy-base",
                add: [{
                    name: "div",
                    function: (element) => {
                        const baseTitle = GetQueryString("title");
                        if (!baseTitle) { return false };
                        const opTime = GetQueryString("op-time");
                        const qcTime = GetQueryString("qc-time");
                        const mkOpTime = new Date(opTime).getTime();
                        const mkQcTime = new Date(qcTime).getTime();
                        const isOutTime = mkQcTime - mkOpTime > 0 ? "审核超时" : "";
                        AddDOM({
                            addNode: element,
                            addData: [{
                                name: "div",
                                className: "base-title",
                                add: [{
                                    name: "span",
                                    innerHTML: baseTitle || "错误：未传递标题"
                                }, {
                                    name: "span",
                                    style: "color: #ff0000;",
                                    innerHTML: isOutTime
                                }]
                            }]
                        })
                    }
                }, {
                    name: "div",
                    function: (element) => {
                        const baseInfo = [{
                            name: "分类",
                            value: GetQueryString("class")
                        },
                        // {
                        //     name: "直播ID",
                        //     value: GetQueryString("live-id")
                        // },
                        {
                            name: "主播ID",
                            value: GetQueryString("user-id")
                        }, {
                            name: "主播PIN",
                            value: GetQueryString("user-pin")
                        }, {
                            name: "主播名称",
                            value: GetQueryString("user-name")
                        }, {
                            name: "等级",
                            value: GetQueryString("grade")
                        }]
                        AddDOM({
                            addNode: element,
                            addData: [{
                                name: "div",
                                className: "base-info",
                                add: baseInfo.map(item => {
                                    if (item.value) {
                                        return {
                                            name: "span",
                                            add: [{
                                                name: "span",
                                                style: "font-weight: bold;margin-right: 5px;",
                                                innerHTML: `${item.name}:`
                                            }, {
                                                name: "span",
                                                innerHTML: `${item.value}`
                                            }]
                                        }
                                    }
                                })
                            }]
                        }).then(div => {
                            if (div.children.length === 0) {
                                div.remove();
                            }
                        })
                    }
                }, {
                    name: "div",
                    function: (element) => {
                        const aiBackInfo = JSON.parse(GetQueryString("ai-info") || "[]").filter(item => item !== "") || [];
                        const qcBackInfo = JSON.parse(GetQueryString("qc-info") || "[]").filter(item => item !== "") || [];
                        AddDOM({
                            addNode: element,
                            addData: [{
                                name: "div",
                                className: "base-back",
                                add: [...aiBackInfo.map(backText => {
                                    return {
                                        name: "div",
                                        innerHTML: "机审驳回：" + backText
                                    }
                                }), ...qcBackInfo.map(backText => {
                                    return {
                                        name: "div",
                                        innerHTML: "人审驳回：" + backText
                                    }
                                })]
                            }]
                        }).then(div => {
                            if (div.children.length === 0) {
                                div.remove();
                            }
                        })
                    }
                }, {
                    name: "div",
                    function: (element) => {
                        const images = JSON.parse(GetQueryString("images") || "[]").filter(item => item !== "") || [];
                        const sortArr = ["首页", "直播间", "裁剪横向"];
                        const imgObj = images.map(list => {
                            const newText = list.replace("http", "@@http");
                            const [title, src] = newText.split("@@");
                            const sortIndex = sortArr.findIndex(letter => title.includes(letter));
                            return {
                                src,
                                title,
                                sortIndex: sortIndex === -1 ? Number.MAX_SAFE_INTEGER : sortIndex
                            }
                        })
                        imgObj.sort((a, b) => a.sortIndex - b.sortIndex);
                        AddDOM({
                            addNode: element,
                            addData: [{
                                name: "div",
                                className: "base-img",
                                add: imgObj.map(({ title, src }) => {
                                    return {
                                        name: "div",
                                        add: [{
                                            name: "div",
                                            className: "base-p",
                                            innerHTML: title
                                        }, {
                                            name: "img",
                                            src: src
                                        }]
                                    }
                                })
                            }]
                        }).then(div => {
                            if (div.children.length === 0) {
                                element.style = "line-height: 50px;text-align: center;";
                                div.innerHTML = "空列表";
                            }
                        })
                    }
                }]
            }, {
                name: "div",
                class: "live-diy-sku",
                add: [{
                    name: "div",
                    class: "sku-title",
                    add: [{
                        name: "div",
                        innerHTML: "商卡列表"
                    }, {
                        name: "button",
                        class: "gm-button sku-open",
                        innerHTML: "全部打开",
                        click: skuAllOpen
                    }]
                }, {
                    name: "div",
                    class: "sku-body",
                    function: (element) => {
                        const skuList = JSON.parse(GetQueryString("sku") || "[]").filter(item => item !== "") || [];
                        AddDOM({
                            addNode: element,
                            addData: skuList.map((href, index) => {
                                if (href) {
                                    return {
                                        name: "div",
                                        className: "sku-li",
                                        add: [{
                                            name: "span",
                                            style: "user-select: none;pointer-events: none;",
                                            innerHTML: index + 1 + "："
                                        }, {
                                            name: "span",
                                            style: "color: #4a90e2;",
                                            innerHTML: href,
                                        }],
                                        click: () => {
                                            window.open(href);
                                        }
                                    }
                                }
                            })
                        }).then(() => {
                            if (element.children.length === 0) {
                                element.style = "line-height: 50px;text-align: center;";
                                element.innerHTML = "空列表";
                            }
                        })
                    }
                }, {
                    name: "div",
                    function: (element) => versionPlug(element)
                }]
            }]
        }]
    }, 0).then(liveDom => getSkuInfo(liveDom));
    function skuAllOpen() {
        const skuList = JSON.parse(GetQueryString("sku") || "[]").filter(item => item !== "") || [];
        if (!skuList || skuList.length === 0) {
            return MessageTip("❌", "列表为空", 3);
        }
        for (const url of skuList) {
            if (url) {
                window.open(url);
            }
        }
    }
    function getSkuInfo(liveDom) {
        // 由于接口频权，不获取信息
        if (liveDom) {
            return false;
        }
        const skuArr = liveDom.querySelectorAll(".sku-body>div");
        const getSku = QueueTaskRunner(3, 2);
        for (const list of skuArr) {
            const aDom = list.querySelector("a");
            if (aDom) {
                getSku.push(() => GM_XHR({
                    method: "GET",
                    url: aDom.href
                }).then((xhr) => {
                    const responseText = xhr.responseText;
                    const htmlDom = htmlTextMark(responseText);
                    const specImg = htmlDom && htmlDom.querySelector("#spec-img");
                    if (specImg) {
                        markSku(list, {
                            title: specImg.alt,
                            src: specImg.getAttribute("data-origin"),
                            href: aDom.href
                        })
                    } else {
                        throw "重试"
                    }
                }))
            }
        }
    }
    function markSku(skuDom, { title, src }) {
        skuDom.innerHTML = "";
        skuDom.className = "sku-info";
        AddDOM({
            addNode: skuDom,
            addData: [{
                name: "img",
                src: src
            }, {
                name: "span",
                innerHTML: title
            }]
        })
    }
    function htmlTextMark(htmlString) {
        try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(htmlString, "text/html");
            return dom;
        } catch (error) {
            return null;
        }
    }
    function cssFast() {
        GM_addStyle(`
            a {
                cursor: pointer;
            }
            .live-diy-main {
                user-select: text;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
                height: 100%;
                width: 100%;
                background: #f0f2f5;
                display: flex;
                flex-direction: row;
                justify-content: center;
                overflow-y: auto;
                gap: 30px;
            }
            .live-diy-main * {
                font-size: 14px;
            }
            .live-diy-main div,
            .live-diy-main span {
                user-select: text;
                color: rgba(0,0,0,.65);
            }
            .live-diy-sku,
            .live-diy-base {
                width: 50%;
                min-width: 500px;
                max-width: 800px;
                background: #e1e1e1;
                height: 100%;
                overflow-y: auto;
            }
            .live-diy-base img {
                width: 100%;
                width: 100%;
                margin-top: 5px;
                border-radius: 8px;
            }
            .live-diy-base .base-p {
                font-size: 16px;
            }
            .live-diy-base .base-img {
                margin: 20px;
            }
            .live-diy-base .base-img>div {
                margin-bottom: 10px;
            }
            .live-diy-base .base-title {
                margin: 20px;
                background: #e1e1e1;
                display: flex;
                justify-content: space-between;
            }
            .live-diy-base .base-title span {
                font-size: 20px;
                font-weight: bold;
            }
            .live-diy-base .base-info {
                gap: 5px 10px;
                display: flex;
                flex-wrap: wrap;
                margin: 20px;
            }
            .live-diy-base .base-back {
                margin: 20px;
                font-size: 16px;
            }
            .live-diy-base .base-info * {
                font-size: 16px;
            }
            .live-diy-sku {
                max-width: 600px;
                background: #ffffff;
                display: flex;
                flex-direction: column;
            }
            .live-diy-sku .sku-open {
                position: absolute;
                top: 8px;
                right: 15px;
            }
            .live-diy-sku .sku-body {
                height: 100%;
                overflow-y: auto;
            }
            .live-diy-sku .sku-body::-webkit-scrollbar {
                background-color: #ffffff;
            }
            .live-diy-sku .sku-title {
                position: relative;
                height: 50px;
                line-height: 50px;
                background: #e1e1e1;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
            }
            .live-diy-sku .sku-li {
                padding: 10px;
                cursor: pointer;
                transition: 0.2s ease-in-out;
            }
            .live-diy-sku .sku-li:hover {
                background: #e3f2fd;
            }
            .live-diy-sku .sku-info {
                display: flex;
                gap: 10px;
            }
            .live-diy-sku .sku-info img {
                height: 120px;
                border-radius: 6px;
            }
            
            /*滚动条样式*/
            ::-webkit-scrollbar {
                width: 5px;
                height: 5px;
                background-color: #edeff2;
            }
            ::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: rgba(160,169,173,0.45);
            }
            ::-webkit-scrollbar-thumb:hover {
                background-color: rgba(160,169,173,0.8);
            }
        `)
    }

    // 版本控制器
    function versionPlug(children) {
        GM_addStyle(`
            #MyPlugVer * {
                font-size: 12px;
                font-weight: bold;
            }
            #MyPlugVer {
                background: #e1e1e1;
                padding: 3px;
                gap: 15px;
                display: flex;
                align-items: center;
                flex-direction: row;
                justify-content: center;
            }
            #MyPlugVer #click {
                cursor: pointer;
                color: green;
            }
            #MyPlugVer a,
            #MyPlugVer span {
                background: rgba(0,0,0,0);
                border-radius: 3px;
                padding: 2px;
                line-height: 1;
                transition: 0.3s ease-in-out;
            }
            #MyPlugVer a:hover,
            #MyPlugVer #click:hover {
                background: #F44336 !important;
                color: #fff !important;
                user-select: none;
            }
        `)
        const plugConfig = GET_DATA("GM_CONFIG", {});
        const plugUrl = "https://greasyfork.org/scripts/472528-京东直播助手";
        const openUrl = plugUrl + "/code/京东直播助手.user.js";
        const version = GM_info.script.version;
        const plugName = GM_info.script.name;
        AddDOM({
            addNode: children,
            addData: [{
                name: "div",
                id: "MyPlugVer",
                add: [{
                    name: "span",
                    innerHTML: `${plugName}：${version}`
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
                }]
            }]
        })
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return MessageTip("❌", "新版插件下载中，请稍后...", 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(openUrl + "?time=" + toTime, "_self");
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerHTML === "有更新") {
                return document.myUpVisible();
            }
            if (element.innerHTML === "检测中") {
                return MessageTip("❌", "正在检测中，请稍后...", 3);
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
                    method: "GET",
                    url: plugUrl + "/code"
                }, (xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    if (!!newVer) {
                        plugConfig.plugtime = toTime;
                        plugConfig.plugver = newVer;
                        checkPlug(element, plugConfig, true);
                        SET_DATA("GM_CONFIG", plugConfig);
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
}

// 直播页面重写
async function livePlugRun() {
    const { SwitchPrompt, GetQueryString, GM_XHR, GET_DATA, SET_DATA, AddDOM, MessageTip } = Plug_fnClass();
    // 创建设置按钮
    const VPNGetData = SwitchPrompt("百川内容接口", "VPNGetData", 0);
    const liveHref = /lives.jd.com/;
    let liveID = GetQueryString("id").match(/^\d+/);
    if (!!liveID) {
        liveID = liveID[0];
    }
    if (!liveHref.test(window.location.host) || !liveID) {
        try {
            document.querySelector(".qrcode-tips .tips").innerHTML = `未找到直播间ID，无法加载直播页面`;
        } catch { }
        return false;
    }
    addLiveCSS();
    GM_addStyle(`
        #app {
            background: #0f081d !important;
        }
    `)

    const eid = "V5HJ24MYGDSV52GNE2CCKYL4TGTM4T6B7DEPZ52L5LAKWGKWXTH2X3ANOV26CAKVMZGFKHO22NG36ONGCXQ6CUCWNE";
    const liveUrl = `https://api.m.jd.com/api?appid=h5-live&functionId=getImmediatePlayToM&body={"liveId":"${liveID}"}`;
    const liveShop = `https://api.m.jd.com/api?appid=h5-live&functionId=liveDetailToM&eid=${eid}&body={"liveId":"${liveID}"}`;
    const skuUrl = `https://api.m.jd.com/api?appid=h5-live&functionId=liveCartDetailToM&eid=${eid}&body={"liveId":"${liveID}"}`;

    const vpnGet = `http://livecms.jd.com/live-verify/video-detail?from=bcms`;

    // 创建树结构
    await AddDOM({
        "addNode": document.body,
        "addData": [{
            "name": "div",
            "id": "liveDiv",
            "add": [{
                "name": "div",
                "id": "liveClass",
            }, {
                "name": "div",
                "id": "liveInfo",
                "add": [{
                    "name": "div",
                    "id": "liveUser",
                    "add": [{
                        "name": "div",
                        "id": "livePlugVer",
                        "function": (e) => {
                            versionPlug(e);
                        }
                    }]
                }, {
                    "name": "div",
                    "id": "liveSKU",
                }]
            }]
        }]
    })

    // 重新获取数据
    function getLoading(params) {
        const { element, calldata, callback } = params;
        if (!element) {
            return { loaded: () => { }, loaderror: () => { }, reloading: () => { } };
        }
        element.innerHTML = `<Article id="Loader_div"></Article>`;
        element.style = `display: flex;align-items: center;justify-content: center;`;
        // 加载完成
        function loaded() {
            element.style = "";
            element.innerHTML = "";
        }
        // 加载失败
        async function loaderror() {
            element.innerHTML = "";
            return AddDOM({
                addNode: element,
                addData: [{
                    name: "span",
                    id: "LoadError",
                    add: [{
                        name: "img",
                        draggable: false,
                        style: "width: 230px;border-radius: 10px;border: 15px solid #fff;",
                        function: (e) => {
                            return new Promise(function (resolve, reject) {
                                // 创建二维码
                                const qrCode = new QRCode(document.createElement("div"), {
                                    text: window.location.href,
                                    correctLevel: QRCode.CorrectLevel.L
                                });
                                const img = qrCode._el.lastChild;
                                img.onload = function () {
                                    e.src = img.src;
                                    resolve();
                                }
                            })
                        }
                    }, {
                        name: "span",
                        style: "font-size: 18px;color: #c1c1c1;",
                        innerHTML: "没有获取到直播数据，直播间可能已被删除！",
                    }]
                }]
            }, 0)
        }
        // 重新加载
        async function reloading() {
            element.innerHTML = "";
            return AddDOM({
                addNode: element,
                addData: [{
                    name: "span",
                    id: "LoadError",
                    add: [{
                        name: "img",
                        draggable: false,
                        style: `width: 200px;`,
                        src: "https://storage.360buyimg.com/live-common/prod/jd-live/img/emptydog.45f34d84.png"
                    }, {
                        name: "span",
                        style: "font-size: 18px;color: #c1c1c1;"
                    }, {
                        name: "div",
                        innerHTML: "重新加载",
                        click: (e) => {
                            callback(calldata);
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }]
                }]
            }, 0)
        }
        return { loaded, loaderror, reloading };
    }

    // 获取数据
    async function getLiveData(params) {
        const { callback, element, url, noError } = params;
        const { loaded, loaderror, reloading } = getLoading({
            element,
            calldata: params,
            callback: getLiveData,
        });
        const timestamp = new Date().getTime();
        GM_XHR({
            method: "GET",
            url: `${url}&t=${timestamp}`,
            header: { "Origin": "https://lives.jd.com", "x-rp-client": "h5_1.0.0", "content-type": "application/x-www-form-urlencoded" },
            timeout: 3000
        }).then((xhr) => {
            if (xhr.status === 403) {
                reloading().then((msgDiv) => {
                    msgDiv.querySelector("span").innerHTML = "接口频权，请稍后重试";
                })
                return false;
            }
            const data = JSON.parse(xhr.responseText);
            if (data.code != 0) {
                throw "请求失败";
            }
            if (data.data) {
                loaded();
                return callback(data);
            }
            // 数据为空
            if (!noError) {
                loaderror();
            } else {
                reloading();
            }
        }).catch((error) => {
            reloading();
            console.error(error);
        })
    }

    // 获取百川数据
    async function getLiveBcms(params) {
        const { callback, element, url, noError } = params;
        const { loaded, loaderror, reloading } = getLoading({
            element,
            calldata: params,
            callback: getLiveBcms,
        });
        const timestamp = new Date().getTime();
        function loaderrorBcms() {
            loaderror().then((msgDiv) => {
                msgDiv.querySelector("span").innerHTML = "未获取到数据，你可能没有权限 或 未登录百川系统，请先登录";
                msgDiv.innerHTML += "<a href='http://bcms.jd.com/' target='_blank'>登录百川系统</a>";
            })
        }
        GM_XHR({
            method: "POST",
            url: `${url}&t=${timestamp}`,
            data: JSON.stringify({ id: liveID }),
            header: {
                "Origin": "http://livecms.jd.com",
                "Content-Type": "application/json;charset=UTF-8"
            },
            isWith: false,
            timeout: 3000
        }).then((xhr) => {
            if (xhr.status !== 200) {
                loaderrorBcms();
                return false;
            }
            const data = JSON.parse(xhr.responseText);
            if (data.discoveryLive) {
                loaded();
                return callback(data);
            }
            if (!data.success) {
                loaderrorBcms();
                return false;
            }
            // 数据为空
            if (!noError) {
                loaderror();
            } else {
                reloading();
            }
        }).catch((error) => {
            if (typeof error === "object" && error.status === 0 || error.UNSENT === 0) {
                loaderrorBcms();
                return false;
            }
            reloading();
            console.error(error);
        })
    }

    if (!!VPNGetData) {
        // 获取直播
        getLiveBcms({
            element: document.querySelector("#liveClass"),
            url: vpnGet,
            callback: (data) => {
                ShowLiveVideo({
                    "videoUrl": data.discoveryLive.videoPlayUrl,
                    "blurredImg": data.discoveryLive.squareIndexImage
                })
                UserInfoTOP({
                    skuNumber: data.goodsList.length || 0,
                    name: data.disRulerUser.userName,
                    avatar: data.disRulerUser.userPic,
                    authorId: data.disRulerUser.id,
                    isOfficial: "加载中",
                })
                ShowBcmsSKU(data.goodsList);
                getLiveData({
                    url: liveShop,
                    callback: (userXhr) => {
                        UserInfoTOP({
                            skuNumber: data.goodsList.length || 0,
                            name: data.disRulerUser.userName,
                            avatar: data.disRulerUser.userPic,
                            authorId: data.disRulerUser.id,
                            isOfficial: userXhr.data.author.isOfficial,
                        })
                    }
                })
            }
        })
    } else {
        // 获取直播
        getLiveData({
            element: document.querySelector("#liveClass"),
            url: liveUrl,
            callback: ({ data }) => {
                ShowLiveVideo(data);
            }
        })
        // 获取用户信息
        getLiveData({
            element: document.querySelector("#liveSKU"),
            url: liveShop,
            noError: true,
            callback: (userXhr) => {
                const userInfo = userXhr.data;
                UserInfoTOP({
                    name: userInfo.author.name,
                    avatar: userInfo.author.avatar,
                    authorId: userInfo.author.authorId,
                    isOfficial: userInfo.author.isOfficial,
                })
                getLiveData({
                    element: document.querySelector("#liveSKU"),
                    url: skuUrl,
                    noError: true,
                    callback: (sukXhr) => {
                        const skuList = sukXhr.data.skuList;
                        ShowLiveSKU(skuList);
                        UserInfoTOP({
                            skuNumber: skuList.length,
                            name: userInfo.author.name,
                            avatar: userInfo.author.avatar,
                            authorId: userInfo.author.authorId,
                            isOfficial: userInfo.author.isOfficial,
                        })
                    }
                })
            }
        })
    }

    // 输出直播视频
    let videoPlay = null;
    async function ShowLiveVideo(params) {
        const { videoUrl, blurredImg, } = params;
        const liveClass = document.querySelector("#liveClass");
        const video = await AddDOM({
            addNode: liveClass,
            addData: [{
                name: "video",
                id: "liveVideo",
                poster: blurredImg,
                controls: true,
                autoplay: true
            }]
        }, 0)
        if (Hls.isSupported()) {
            let hls = new Hls();
            videoPlay = (videoSrc) => {
                hls.stopLoad(); // 停止当前加载
                hls.destroy(); // 销毁之前的实例
                hls = new Hls({
                    maxBufferLength: 60 // 设置缓冲区长度为 60s
                });
                hls.attachMedia(video);
                hls.loadSource(videoSrc);
                hls.startLoad(); // 开始播放
            }
            videoPlay(videoUrl);
        } else {
            MessageTip("❌", `你的浏览器不支持HLS.js！`, 5);
        }
        videoRate(video);
        AddDOM({
            "addNode": liveClass,
            "addData": [{
                "name": "div",
                "id": "liveIntro",
                "add": [{
                    "name": "span",
                    "id": "text",
                    "innerHTML": "商品讲解中"
                }, {
                    "name": "span",
                    "id": "click",
                    "innerHTML": "回到直播",
                    "click": (e) => {
                        const active = document.querySelector("#skuIntro.active");
                        active ? active.className = "" : "";
                        e.target.parentNode.style = "left: -300px;";
                        videoPlay(videoUrl);
                        setTimeout(() => {
                            restRate();
                        }, 200)
                    }
                }],
            }]
        });
        const leftQRcode = await AddDOM({
            "addNode": liveClass,
            "addData": [{
                "name": "div",
                "id": "QRcode",
                "style": `left: -170px;`,
                "add": [{
                    "name": "img",
                    "draggable": false,
                    "style": `width: 150px;height: 150px;border-radius: 0 10px 10px 0;border: 10px solid #fff;background: #fff;`,
                    "function": (e) => {
                        // 创建二维码
                        const qrCode = new QRCode(document.createElement("div"), {
                            text: window.location.href,
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        const img = qrCode._el.lastChild;
                        img.onload = function () {
                            e.src = img.src;
                            if (video.paused) {
                                leftQRcode.style = "left: 0px;";
                            }
                        };
                    }
                }],
            }]
        }, 0);
        video.addEventListener("play", function (e) {
            leftQRcode.style = `left: -${leftQRcode.scrollWidth + 20}px;`;
        });
        video.addEventListener("pause", function (e) {
            leftQRcode.style = "left: 0px;";
        });
    }

    // 倍速播放按钮
    let restRate = () => { };
    async function videoRate(video, rateNumber = 1) {
        const liveClass = document.querySelector("#liveClass");
        const Rate = [4, 3, 2, 1.5, 1, 0.5];
        video.playbackRate = rateNumber;
        const liveRate = await AddDOM({
            "addNode": liveClass,
            "addData": [{
                "name": "div",
                "id": "liveRate"
            }]
        }, 0);
        Rate.forEach(async (num) => {
            await AddDOM({
                "addNode": liveRate,
                "addData": [{
                    "name": "span",
                    "className": num === rateNumber ? "active" : "",
                    "id": "Rate" + Rate.indexOf(num),
                    "innerHTML": num.toFixed(1),
                    "click": () => {
                        rateNumber = num;
                        restRate();
                    }
                }]
            })
        })
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
        const isKeyDown = {};
        document.addEventListener("keydown", function (event) {
            isKeyDown[event.key] = true;
        })
        document.addEventListener("keyup", function (event) {
            isKeyDown[event.key] = false;
        })
        function handleScroll(event) {
            if (isKeyDown["Shift"]) {
                event.preventDefault();
                const scrollAmount = event.deltaY > 0 ? 0.5 : -0.5;
                video.currentTime += scrollAmount;
            }
        }
        video.addEventListener("wheel", handleScroll);
    }

    // top信息
    function UserInfoTOP({ skuNumber, name, avatar, authorId, isOfficial }) {
        const liveUser = document.querySelector("#liveUser");
        const divAll = liveUser.querySelectorAll("div");
        divAll.forEach((e, i) => {
            if (i !== 0) { e.remove() }
        });
        document.title = `京东直播 - ${name}`;
        const official = isOfficial == 0 ? "普通账号" : isOfficial == 1 ? "官方账号" : isOfficial || "加载失败";
        AddDOM({
            addNode: liveUser,
            addData: [{
                name: "div",
                id: "logo",
                add: [{
                    name: "img",
                    draggable: false,
                    src: avatar
                }]
            }, {
                name: "div",
                id: "title",
                add: [{
                    name: "div",
                    add: [{
                        name: "span",
                        style: "font-size: 20px;font-weight: bold;letter-spacing: 1px;",
                        innerHTML: name
                    }]
                }, {
                    name: "span",
                    style: "font-size: 14px;",
                    innerHTML: `${!!skuNumber ? "商卡：" + skuNumber + " | " : ""}直播ID：${liveID + " | "}类型：`,
                    add: [{
                        name: "span",
                        innerHTML: official,
                        function: (element) => {
                            if (official === "官方账号") {
                                element.style = "background: #fff1e8;color: #ff8c33;padding: 0 8px;border-radius: 10px;text-shadow: none;";
                            }
                            if (official === "加载失败") {
                                element.style = "color: #ff0000;";
                            }
                        }
                    }]
                }]
            }]
        })
    }

    // 百川SKU列表
    function ShowBcmsSKU(skuList) {
        const liveSKU = document.querySelector("#liveSKU");
        if (skuList.length === 0) {
            liveSKU.style = "display: flex;align-items: center;justify-content: center;";
            AddDOM({
                "addNode": liveSKU,
                "addData": [{
                    "name": "span",
                    "style": "display: flex;align-items: center;flex-direction: column;",
                    "add": [{
                        "name": "img",
                        "draggable": false,
                        "style": "width: 200px;",
                        "src": "https://storage.360buyimg.com/live-common/prod/jd-live/img/emptydog.45f34d84.png"
                    }, {
                        "name": "div",
                        "innerHTML": "主播未上传商品",
                        "style": "margin: 20px;color: #888;"
                    }]
                }]
            })
            return false;
        }
        for (const { sku, skuImg, sort, title, promotionPrice } of skuList) {
            AddDOM({
                addNode: liveSKU,
                addData: [{
                    name: "div",
                    click: () => {
                        window.open(`https://item.jd.com/${sku}.html`);
                    },
                    add: [{
                        name: "div",
                        id: "skuImg",
                        add: [{
                            name: "img",
                            draggable: false,
                            src: skuImg
                        }, {
                            name: "span",
                            id: "skuImgNum",
                            innerHTML: sort
                        }]
                    }, {
                        name: "div",
                        id: "skuInfo",
                        add: [{
                            name: "div",
                            id: "skuTitle",
                            add: [{
                                "name": "span",
                                "innerHTML": title
                            }]
                        }, {
                            name: "div",
                            style: "display: flex;gap: 10px;color: #ff0000;",
                            add: [{
                                name: "span",
                                innerHTML: "历史 ¥" + Number(promotionPrice),
                            }]
                        }]
                    }]
                }]
            })
        }
    }

    // 输出SKU列表
    function ShowLiveSKU(skuList) {
        const liveSKU = document.querySelector("#liveSKU");
        if (skuList.length === 0) {
            liveSKU.style = "display: flex;align-items: center;justify-content: center;";
            AddDOM({
                addNode: liveSKU,
                addData: [{
                    name: "span",
                    style: "display: flex;align-items: center;flex-direction: column;",
                    add: [{
                        name: "img",
                        draggable: false,
                        style: "width: 200px;",
                        src: "https://storage.360buyimg.com/live-common/prod/jd-live/img/emptydog.45f34d84.png"
                    }, {
                        name: "div",
                        innerHTML: "主播未上传商品",
                        style: "margin: 20px;color: #888;"
                    }]
                }]
            })
            return false;
        }
        for (const { sku, img, top, sort, title, price, priceTag, marketPrice, marketPriceTag, isOfficial, historyLowest, explain } of skuList) {
            const div = document.createElement("div");
            liveSKU.appendChild(div);
            AddDOM({
                addNode: div,
                addData: [{
                    name: "div",
                    id: "skuImg",
                    add: [{
                        name: "img",
                        draggable: false,
                        src: img
                    }, {
                        name: "span",
                        id: "skuImgNum",
                        innerHTML: top ? "TOP" : sort,
                        style: top ? "background: linear-gradient(135deg,#ff5f8c,#ff2121);" : ""
                    }, {
                        name: "span",
                        innerHTML: historyLowest ? historyLowest : "",
                        id: historyLowest ? "skuImgBottom" : ""
                    }]
                }, {
                    name: "div",
                    id: "skuInfo",
                    add: [{
                        name: "div",
                        id: "skuTitle",
                        add: [{
                            name: "span",
                            innerHTML: !!isOfficial ? "自营" : "",
                            id: isOfficial ? `userOfficial` : ""
                        }, {
                            name: "span",
                            innerHTML: title
                        }]
                    }, {
                        name: "div",
                        add: [{
                            name: "div",
                            style: "display: flex;",
                            add: [{
                                name: "span",
                                innerHTML: price.text ? price.text : "",
                                style: `color: ${price.textColor}`
                            }, {
                                name: "span",
                                style: !!priceTag.tagImg ? `background: url(${priceTag.tagImg});min-width: 45px;margin-left: 5px;background-size: 100% 100%;` : ""
                            }]
                        }, {
                            name: "div",
                            style: "display: flex;",
                            add: [{
                                name: "span",
                                innerHTML: marketPrice.text ? marketPrice.text : "",
                                style: `color: ${marketPrice.textColor}`
                            }, {
                                name: "span",
                                style: !!marketPriceTag.tagImg ? `background: url(${marketPriceTag.tagImg});min-width: 45px;margin-left: 5px;background-size: 100% 100%;` : ""
                            }]
                        }]
                    }]
                }]
            })
            if (!!explain.videoUrl) {
                AddDOM({
                    addNode: div,
                    addData: [{
                        name: "div",
                        id: "skuIntro",
                        click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                        add: [{
                            name: "span",
                            id: "none",
                            style: "display: none;",
                            innerHTML: "讲解中",
                        }, {
                            name: "span",
                            id: "look",
                            innerHTML: "看讲解",
                            click: (e) => {
                                const active = document.querySelector("#skuIntro.active");
                                active ? active.className = "" : "";
                                e.target.parentNode.className = "active";
                                const liveIntro = document.querySelector("#liveIntro");
                                const span = liveIntro.querySelector("span");
                                span.innerHTML = `#${top ? "TOP" : sort} 商品讲解中`;
                                liveIntro.style = "left: 0;";
                                span.onclick = () => {
                                    div.scrollIntoView({ behavior: "smooth", block: "center" });
                                };
                                // 设置讲解的视频
                                videoPlay(explain.videoUrl);
                                setTimeout(() => {
                                    restRate();
                                }, 200)
                            }
                        }]
                    }]
                })
            }
            div.onclick = () => {
                window.open(`https://item.jd.com/${sku}.html`);
            };
        }
    }

    // 版本控制器
    function versionPlug(children) {
        const plugConfig = GET_DATA("GM_CONFIG", {});
        const plugUrl = "https://greasyfork.org/scripts/472528-京东直播助手";
        const openUrl = plugUrl + "/code/京东直播助手.user.js";
        const version = GM_info.script.version;
        const plugName = GM_info.script.name;
        AddDOM({
            addNode: children,
            addData: [{
                name: "span",
                innerHTML: `${plugName} ${version}`
            }, {
                name: "a",
                href: plugUrl + "/versions",
                target: "_blank",
                innerHTML: "版本信息"
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
            }]
        })
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return MessageTip("❌", "新版插件下载中，请稍后...", 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(openUrl + "?time=" + toTime, "_self");
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerHTML === "有更新") {
                return document.myUpVisible();
            }
            if (element.innerHTML === "检测中") {
                return MessageTip("❌", "正在检测中，请稍后...", 3);
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
                    method: "GET",
                    url: plugUrl + "/code"
                }, (xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    if (!!newVer) {
                        plugConfig.plugtime = toTime;
                        plugConfig.plugver = newVer;
                        checkPlug(element, plugConfig, true);
                        SET_DATA("GM_CONFIG", plugConfig);
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
}
function addLiveCSS() {
    GM_addStyle(`
        body {
            padding: 0;
            margin: 0;
            position: relative;
        }
        #liveDiv {
            top: 0;
            z-index: 100;
            width: 100%;
            height: 100%;
            position: absolute;
            background: #0f081d;
            display: flex;
            font-size: 16px;
        }

        #liveClass {
            height: 100%;
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        #liveInfo {
            width: 100%;
            max-width: 650px;
            min-width: 470px;
            height: 100%;
            display: flex;
            flex-direction: column;
            background: #fff;
        }
        #liveVideo,
        #liveVideo video {
            width: 100%;
            height: 100%;
            display: flex;
        }
        #liveVideo div,
        #liveVideo button {
            display: none;
        }
        #liveRate {
            position: absolute;
            bottom: 100px;
            right: 0;
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

        #liveUser {
            background: linear-gradient(270deg, #673AB7, #2196F3);
            color: #fff;
            height: 60px;
            position: relative;
            display: flex;
            align-items: center;
            user-select: text;
        }
        #liveUser #logo {
            margin: 0 10px;
            height: 45px;
            min-width: 45px;
            max-width: 45px;
        }
        #liveUser #title {
            overflow: hidden;
            white-space: nowrap;
            padding-right: 10px;
            display: flex;
            flex-direction: column;
            text-shadow: 0 0 2px rgba(0,0,0,.5);
        }
        #liveUser #logo img {
            height: 100%;
            width: 100%;
            object-fit: contain;
            background: linear-gradient(0deg,#f70024,#ff6047);
            border-radius: 50%;
        }
        #liveSKU {
            height: calc(100% - 60px);;
            overflow-y: auto;
        }
        #liveSKU>div {
            padding: 10px;
            display: flex;
            cursor: pointer;
            position: relative;
            transition: 0.2s ease-in-out;
        }
        #liveSKU>div:hover {
            background: rgba(0,0,0,.1);
        }
        #skuImg {
            width: 120px;
            height: 120px;
            position: relative;
            border-radius: 5px;
        }
        #skuImg img {
            max-width: 120px;
            max-height: 120px;
            min-width: 120px;
            min-height: 120px;
            object-fit: contain;
            border-radius: 8px;
        }
        #skuImgNum {
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
            font-size: 14px;
            padding: 2px 8px;
            border-radius: 8px 0;
            background: rgba(0,0,0,.4);
        }
        #skuImgBottom {
            position: absolute;
            left: 0;
            bottom: 0;
            color: #fff;
            width: 100%;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
            border-radius: 0 0 8px 8px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            background: linear-gradient(135deg,#ff5f8c,#ff2121);
        }
        #skuInfo {
            padding: 5px 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        #skuTitle {
            overflow: hidden;
            display: -webkit-box;
            word-break: break-all;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        #userOfficial {
            color: #FFF;
            background: red;
            padding: 2px 5px;
            border-radius: 5px;
            font-size: 14px;
            margin-right: 5px;
        }
        #skuIntro span {
            position: absolute;
            color: #fff;
            right: 30px;
            bottom: 20px;
            line-height: 1;
            background: red;
            padding: 8px 18px;
            border-radius: 5px;
            transition: 0.3s ease-in-out;
        }
        #skuIntro span:hover {
            background: #ff5858;
        }
        #skuIntro.active #look {
            display: none;
        }
        #skuIntro.active #none {
            cursor: no-drop;
            background: #888;
            display: block !important;
        }
        #liveIntro {
            position: absolute;
            font-size: 18px;
            top: 0;
            left: -300px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            transition: 0.3s ease-in-out;
        }
        #liveIntro span {
            line-height: 1.2;
            cursor: pointer;
            background: #fff;
            padding: 6px 15px;
            border-radius: 5px;
            margin: 10px 10px 0;
            transition: 0.2s ease-in-out;
        }
        #liveIntro #click {
            color: #fff;
            background: red;
        }
        #liveIntro #text:hover {
            background: #ddd;
        }
        #liveIntro #click:hover {
            background: #ff5858;
        }
        #QRcode {
            top: 45%;
            height: 0;
            position: absolute;
            display: flex;
            align-items: center;
            transition: 0.5s ease-in-out;
        }

        /*加载动画、加载错误*/
        #Loader_div {
            border: 6px solid rgba(0, 0, 0, 0);
            border-radius: 50%;
            border-top: 6px solid #389fff;
            border-bottom: 6px solid #389fff;
            width: 70px;
            height: 70px;
            animation: load_frames 1s linear infinite;
        }
        @keyframes load_frames {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        #LoadError {
            height: 60px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
        }
        #LoadError div,
        #LoadError span {
            color: #fff;
            border-radius: 5px;
            margin-top: 10px;
            line-height: 1.5;
            padding: 2px 10px;
            transition: 0.2s ease-in-out;
        }
        #LoadError div {
            cursor: pointer;
            background: red;
        }
        #LoadError div:hover {
            background: #ff5858;
        }

        /*气泡消息*/
        .bubble_center {
            position: fixed;
            display: flex;
            opacity: 0;
            z-index: 2000;
            pointer-events: none;
            font-size: 16px;
            left: 0;
            right: 0;
            align-items: center;
            justify-content: center;
        }
        .bubble_msg_main {
            display: flex;
            background: #ffffff;
            color: #000000;
            padding: 12px 12px;
            text-align: center;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            line-height: 1;
            pointer-events: auto;
            user-select: text;
        }
        .bubble_msg_ico,
        .bubble_msg_text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .bubble_msg_text {
            font-size: 16px;
            line-height: 1.2;
        }

        /*插件信息*/
        #livePlugVer {
            position: absolute;
            right: 0;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            align-items: flex-end;
            font-weight: bold;
            margin-right: 10px;
            text-shadow: 0 0 2px rgba(0,0,0,.5);
        }
        #livePlugVer #click {
            cursor: pointer;
            color: green;
        }
        #livePlugVer a,
        #livePlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.2s ease-in-out;
        }
        #livePlugVer a:hover,
        #livePlugVer #click:hover {
            background: #fff !important;
            text-shadow: 0 0 2px #fff;
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

// 全局样式
function CSS_mainPage() {
    // 全局高亮
    GM_addStyle(`
        .gm-highlight {
            color: #ffffff;
            border-radius: 4px;
            box-decoration-break: clone;
            -webkit-box-decoration-break: clone;
            padding: 0px 2px;
            display: inline-block;
            background: #ffb300;
            text-indent: 0;
        }
    `)
    // 全局checkbox样式
    GM_addStyle(`
        .gm-switch {
            --button-width: 40px;
            --button-height: 20px;
            --toggle-diameter: 16px;
            --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
            --toggle-shadow-offset: 10px;
            --toggle-wider: 25px;
            --color-grey: #cccccc;
            --color-green: #4296f4;
        }
        .gm-slider {
            display: inline-block;
            width: var(--button-width);
            height: var(--button-height);
            background-color: var(--color-grey);
            border-radius: calc(var(--button-height) / 2);
            position: relative;
            transition: 0.3s all ease-in-out;
            cursor: pointer;
            display: flex;
        }
        .gm-slider::after {
            content: "";
            display: inline-block;
            width: var(--toggle-diameter);
            height: var(--toggle-diameter);
            background-color: #fff;
            border-radius: calc(var(--toggle-diameter) / 2);
            position: absolute;
            top: var(--button-toggle-offset);
            transform: translateX(var(--button-toggle-offset));
            box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
            transition: 0.3s all ease-in-out;
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider {
            background-color: var(--color-green);
        }
        .gm-switch input[type="checkbox"]:checked + .gm-slider::after {
            transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset)));
            box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.1);
        }
        .gm-switch input[type="checkbox"] {
            display: none;
        }
        .gm-switch input[type="checkbox"]:active + .gm-slider::after {
            width: var(--toggle-wider);
        }
        .gm-switch input[type="checkbox"]:checked:active + .gm-slider::after {
            transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset)));
        }           
    `)
    // 全局input样式
    GM_addStyle(`
        .gm-input[type=text] {
            outline: none;
            border-radius: 5px;
            border: 1px solid #cccccc;
            padding: 5px 10px;
            transition: 0.25s;
        }
        .gm-input[type=text]:hover {
            border: 1px solid #7ab5f7;
        }
        .gm-input[type=text]:focus-visible {
            border: 1px solid #2196f3;
        }
        .gm-input[type=text]::placeholder {
            color: rgba(153,153,153,0.5);
        }
    `)
    // 全局按钮样式
    GM_addStyle(`
        .gm-button {
            color: white;
            border: 0 solid rgba(0,0,0,0);
            outline: none;
            cursor: pointer;
            text-align: center;
            transition: ease-in 0.2s;
            user-select: none;
        }
        .gm-button {
            height: 32px;
            line-height: 32px;
            padding: 0 20px; 
            border-radius: 5px;
        }
        .gm-button.small {
            height: 24px;
            line-height: 24px;
            padding: 0 7px; 
            border-radius: 3px;
        }
        .gm-button.large {
            height: 40px;
            line-height: 40px;
            padding: 0 30px; 
            border-radius: 5px;
        }
        .gm-button {
            background: #40a9ff;
        }
        .gm-button:hover {
            background: #1890ff;
        }
        .gm-button:active {
            background: #096dd9;
            transition: all ease-in 0.1s;
        }
        .gm-button.warning {
            background: #ffb300;
        }
        .gm-button.warning:hover {
            background: #ffca28;
        }
        .gm-button.warning:active {
            background: #ff8f00;
            transition: all ease-in 0.1s;
        }
        .gm-button.danger {
            background: #ff6060;
        }
        .gm-button.danger:hover {
            background: #ff4d4f;
        }
        .gm-button.danger:active {
            background: #d9363e;
            transition: all ease-in 0.1s;
        }
    `)
}