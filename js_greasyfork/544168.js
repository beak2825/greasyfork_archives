// ==UserScript==
// @name              AI搜索引擎聚合增强😈
// @name:zh           AI搜索引擎聚合增强😈
// @name:zh-TW        AI搜索引擎聚合增強😈
// @namespace         ai_search_engine_enhancements_up
// @version           2025-07-08
// @description       AI搜索引擎功能增强,元宝AI搜索全自动跳转，kimi搜索跳转，百度添加网址显示，google结果新标签页打开,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @description:zh    AI搜索引擎功能增强,元宝AI搜索全自动跳转，kimi搜索跳转，百度添加网址显示，google结果新标签页打开,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @description:zh-TW AI搜索引擎功能增強,元寶AI搜索全自動跳轉，kimi搜索跳轉，百度添加網址顯示，google結果新標籤頁打開,導航可自定義網址【腳本長期維護更新，完全免費，無廣告，僅限學習交流！！】
// @author            smilingpoplar,CathyElla,annyqyq
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA5NJREFUWEfFl89vVFUUxz/nzpsyJe1MO6W1tFqkqUoCLdGyEIMYjMbE4MIVJiRd4gYT/StYagIu3KImEsOOhYkSIoIa0y76g4UKrRaLwHSG+VFgmM7cS+4M084rb957Vcjc1WTuOfd83rnnfO+9QsiRSpmBmOKw1hwUGEUYAroeuWcxLBqYVYqLRc253l65EWZpCTLKpc2raD4W4UiQbeO8MZxB8VmiR37182sKcOGCcfaN8qmB45sJvNFW4NTkLJ8cOiRlr3U8AVYyZkxXOI2w9/8EX/M1TKsIEx1JmfEAdP+Vv20OoDgHJJ5I8PVFcmgOx/vkUuO6rgxUv1xz8SkEr8fMKcXBxkysAdg9H9/D5BNLe7P0Gaan5thXr4k1gMKyORmm4HQFillNMQ/3M5r2pCIWh1iXQkXCbZotzM5t8pG1rgLYVhPDL0Hu/05rbs2VKd193LKtAwb2RujbHY7CCPtti9YAUuaboD6fO1vmXlq7Inf2C4WbxvVfclgx8pYT9C1YnUj0ygdiFW6LsOTn8cd3ZbKL7uDdQ4pXjtYCLf+pWfi5Qv5GDWb4DYdtL6lAiAeGQSmkzTFj+KKZdWZec/UHTw1h+PUI7d1C/+5asIVLFeZ/qlR/jx2JEkv4C60IH0ouZb4S4agXgC7D7LerPCi407zRtjEbk6dXyS0ZuncqXnjbfyuM4WvJp8w0wpgXwN204crZ1cBUWoOtPcL+Y1Gy/ximvlxFHBifaEP5MRhmJL9s7jScaq5g6Wuaa+e90+9FNfq+Q3xAuPx5DXrXuw7xZ31rIWsBmuZ3aarM0pS7+PzSYWti54EI50+UqmaD44rBcf9t8AXILGiufh8+A7YW7LjzqGN2vecQ3+7fDb5bYPve9v9/GSoqvDwRJeKvS1nfIrSyO3OmRGll8whdO4QX34n6O9oi9GtD6337SoW/Ltd6ezNj5M0oyRF/Hai2YZAQ2aBWiKwghR09zzt09Cq29kHnYHOvqhCFkWK7xPLvmvkfg+th+x6Htvb1woslIbHDG6IqxXYqzGFk7Yo5w/XfKmSva0wDixWd7ucUQ685KAW5RSjfWw8aH4L2HjfE2mFUBQh5HNeXsBK9clNTuKXpfEbR0a9cimfnc39DKV/z8ARoPI6tUdgLSdg6sPJWzICKwpa42+uxC4mdbvmVzEK09FJaT1JLr+V1iJY+TOoQLX2aNdZsyx6nG9vtaT3PHwJueJlAXsXHsQAAAABJRU5ErkJggg==

// @include           *://www.baidu.com/*
// @include           *://www.so.com/s*
// @include           *://www.sogou.com/web*
// @include           *://www.sogou.com/sogou*
// @include           *://cn.bing.com/search*
// @include           *://www.bing.com/search*
// @include           *://www4.bing.com/search*
// @include           *://so.toutiao.com/search*
// @include           *://www.google.com/search*
// @include           *://www.google.com.hk/search*
// @include           *://duckduckgo.com*
// @include           *://kimi.moonshot.cn/*
// @include           *://www.kimi.com/*
// @include           *://kimi.moonshot.cn/*
// @include           *://yuanbao.tencent.com/*
// @include           *://chat.deepseek.com/*
// @include           *://chat.qwen.ai/*
// @include           *://www.doubao.com/*

// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require           https://greasyfork.org/scripts/454236-findandreplacedomtext-huahuacat/code/findAndReplaceDOMText-huahuacat.js?version=1112990


// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @license           AGPL License
// @run-at            document-idle
// @charset		      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/544168/AI%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%81%9A%E5%90%88%E5%A2%9E%E5%BC%BA%F0%9F%98%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544168/AI%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%81%9A%E5%90%88%E5%A2%9E%E5%BC%BA%F0%9F%98%88.meta.js
// ==/UserScript==







(function () {
    'use strict';

    //共有方法，全局共享
    function CommonFunction() {
        this.GMgetValue = function (name, value = null) {
            let storageValue = value;
            if (typeof GM_getValue === "function") {
                storageValue = GM_getValue(name, value);
            } else if (typeof GM.setValue === "function") {
                storageValue = GM.getValue(name, value);
            } else {
                var arr = window.localStorage.getItem(name);
                if (arr != null) {
                    storageValue = arr
                }
            }
            return storageValue;
        };
        this.GMsetValue = function (name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else if (typeof GM.setValue === "function") {
                GM.setValue(name, value);
            } else {
                window.localStorage.setItem(name, value)
            }
        };
        this.GMaddStyle = function (css) {
            var myStyle = document.createElement('style');
            myStyle.textContent = css;
            var doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        };
        this.GMopenInTab = function (url, options = { "active": true, "insert": true, "setParent": true }) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, options);
            } else {
                GM.openInTab(url, options);
            }
        };
        this.addScript = function (url) {
            var s = document.createElement('script');
            s.setAttribute('src', url);
            document.body.appendChild(s);
        };
        this.randomNumber = function () {
            return Math.ceil(Math.random() * 100000000);
        };
        this.request = function (method, url, param, headers = { "Content-Type": "application/json;charset=UTF-8" }) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    url: url,
                    method: method,
                    data: param,
                    headers: headers,
                    onload: function (response) {
                        var status = response.status;
                        var playurl = "";
                        if (status == 200 || status == '200') {
                            var responseText = response.responseText;
                            resolve({ "result": "success", "data": responseText });
                        } else {
                            reject({ "result": "error", "data": null });
                        }
                    }
                });
            })
        };
        this.crossRequest = function (method, url, param) {
            if (!method) {
                method = "get";
            }
            if (!url) {
                return new Promise(function (resolve, reject) {
                    reject({ "result": "error", "data": null });
                });
            }
            if (!param) {
                param = {};
            }
            method = method.toUpperCase();
            let config = {
                method: method
            };
            if (method === 'POST') {
                config.headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(param);
            }
            return new Promise(function (resolve, reject) {
                fetch(url, config).then(response => response.text()).then(text => {
                    resolve({ "result": "success", "data": text });
                }).catch(error => {
                    reject({ "result": "error", "data": null });
                });
            });
        };
        this.addCommonHtmlCss = function () {
            var cssText =
                `
                a[name='navigation'] {
                    transition: all 0.3s ease;
                    border: none;
                    border-radius: 4px;
                    padding: 1px 6px;
                    color: #666666;
                    text-decoration: none !important;
                    text-decoration-line: none !important;
                }
                a[name='navigation']:hover {
                    background: rgba(49, 94, 251, 0.1);
                    color: #315EFB;
                    text-decoration: none !important;
                    text-decoration-line: none !important;
                }
                .web-toast-kkli9{
                    position: fixed;
                    background: rgba(0, 0, 0, 0.7);
                    color: #fff;
                    font-size: 14px;
                    line-height: 1;
                    padding:10px;
                    border-radius: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    -webkit-transform: translateX(-50%);
                    -moz-transform: translateX(-50%);
                    -o-transform: translateX(-50%);
                    -ms-transform: translateX(-50%);
                    z-index: 999999999999999999999999999;
                    white-space: nowrap;
                }
                .fadeOut{
                    animation: fadeOut .5s;
                }
                .fadeIn{
                    animation:fadeIn .5s;
                }
                `;
            this.GMaddStyle(cssText);
        };
        this.webToast = function (params) {	//小提示框
            var time = params.time;
            var background = params.background;
            var color = params.color;
            var position = params.position;  //center-top, center-bottom
            var defaultMarginValue = 50;

            if (time == undefined || time == '') {
                time = 1500;
            }

            var el = document.createElement("div");
            el.setAttribute("class", "web-toast-kkli9");
            el.innerHTML = params.message;
            //背景颜色
            if (background != undefined && background != '') {
                el.style.backgroundColor = background;
            }
            //字体颜色
            if (color != undefined && color != '') {
                el.style.color = color;
            }

            //显示位置
            if (position == undefined || position == '') {
                position = "center-bottom";
            }

            //设置显示位置，当前有种两种形式
            if (position === "center-bottom") {
                el.style.bottom = defaultMarginValue + "px";
            } else {
                el.style.top = defaultMarginValue + "px";
            }
            el.style.zIndex = 999999;

            document.body.appendChild(el);
            el.classList.add("fadeIn");
            setTimeout(function () {
                el.classList.remove("fadeIn");
                el.classList.add("fadeOut");
                /*监听动画结束，移除提示信息元素*/
                el.addEventListener("animationend", function () {
                    document.body.removeChild(el);
                });
                el.addEventListener("webkitAnimationEnd", function () {
                    document.body.removeChild(el);
                });
            }, time);
        };
        this.filterStr = function (str) {
            if (!str) return "";
            str = str.replace(/\t/g, "");
            str = str.replace(/\r/g, "");
            return encodeURIComponent(str)
        };
        this.getParamterQueryUrl = function (text, tag) { //查询GET请求url中的参数
            if (text.indexOf("?") != -1) { //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
                var textArray = text.split("?");
                text = "?" + textArray[textArray.length - 1];
            }
            var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
            var a = text.substr(1).match(t);
            if (a != null) {
                return a[2];
            }
            return "";
        };
        this.getEndHtmlIdByUrl = function (url) { //获得以html结束的ID
            if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
            }
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
            }
            var splitText = url.split("/");
            var idText = splitText[splitText.length - 1];
            idText = idText.replace(".html", "");
            return idText;
        };
        this.suningParameter = function (url) {
            const regex = /product\.suning\.com\/(\d+\/\d+)\.html/;
            const match = url.match(regex);
            if (match) {
                return match[1].replace(/\//g, '-');
            }
            return null;
        };
        this.getEcommercePlatform = function (host = window.location.host) {
            let platform = "";
            if (host.indexOf(".taobao.") != -1 || host.indexOf(".liangxinyao.") != -1) {
                platform = "taobao";
            } else if (host.indexOf(".tmall.") != -1) {
                platform = "tmall";
            } else if (host.indexOf(".jd.") != -1 || host.indexOf(".yiyaojd.") != -1 || host.indexOf(".jkcsjd.") != -1) {
                platform = "jd";
            } else if (host.indexOf(".vip.") != -1 || host.indexOf(".vipglobal.") != -1) {
                platform = "vpinhui";
            } else if (host.indexOf(".suning.") != -1) {
                platform = "suning";
            }
            return platform;
        }
        this.isPC = function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        this.getBilibiliBV = function () {
            var pathname = window.location.pathname;
            var bv = pathname.replace("/video/", "").replace("/", "");
            return bv;
        };
        this.getSystemOS = function () {
            var u = navigator.userAgent;
            if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
                return 'windows';
            } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
                return 'macOS';
            } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
                return 'ios';
            } else if (!!u.match(/android/i)) {
                return 'android';
            } else {
                return 'other';
            }
        };
        this.RPCDownloadFile = function (fileName, url, savePath = "D:/", RPCURL = "ws://localhost:16800/jsonrpc", RPCToken = "") {
            const self = this;
            if (!savePath) {
                savePath = "D:/";
            }
            if (!RPCURL) {
                RPCURL = "ws://localhost:16800/jsonrpc";
            }
            let options = { //下载配置文件
                "dir": savePath,
                "max-connection-per-server": "16",
                "header": ["User-Agent:" + navigator.userAgent + "", "Cookie:" + document.cookie + "", "Referer:" + window.location.href + ""]
            }
            if (!!fileName) {
                options.out = fileName;
            }
            let jsonRPC = {
                "jsonrpc": "2.0",
                "id": "huahuacat",
                "method": "aria2.addUri",
                "params": [[url], options],
            }
            if (!!RPCToken) {
                jsonRPC.params.unshift("token:" + RPCToken); // 必须要加在第一个
            }
            return new Promise(function (resolve, reject) {
                var webSocket = new WebSocket(RPCURL);
                webSocket.onerror = function (event) {
                    console.log("webSocket.onerror", event);
                    reject("Aria2连接错误，请打开Aria2和检查RPC设置！");
                }
                webSocket.onopen = function () {
                    webSocket.send(JSON.stringify(jsonRPC));
                }
                webSocket.onmessage = function (event) {
                    let result = JSON.parse(event.data);
                    switch (result.method) {
                        case "aria2.onDownloadStart":
                            resolve("Aria2 开始下载【" + fileName + "】");
                            webSocket.close();
                            break;
                        case "aria2.onDownloadComplete":
                            break;
                        default:
                            break;
                    }
                }
            });
        };
        this.getElementObject = function (selector, target = document.body, allowEmpty = true, delay = 10, maxDelay = 10 * 1000) {
            return new Promise((resolve, reject) => {
                if (selector.toUpperCase() === "BODY") {
                    resolve(document.body);
                    return;
                }
                if (selector.toUpperCase() === "HTML") {
                    resolve(document.html);
                    return;
                }
                let totalDelay = 0;

                let element = target.querySelector(selector);
                let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
                if (result) {
                    resolve(element);
                }

                const elementInterval = setInterval(() => {
                    if (totalDelay >= maxDelay) {
                        clearInterval(elementInterval);
                        resolve(null);
                    }
                    element = target.querySelector(selector);
                    result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
                    if (result) {
                        clearInterval(elementInterval);
                        resolve(element);
                    } else {
                        totalDelay += delay;
                    }
                }, delay);
            });
        };
        /**
         * @param {Object} time
         * @param {Object} format
         * 时间格式化
         * DateFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss")
         */
        this.DateFormat = function (time, format) {
            var o = {
                "M+": time.getMonth() + 1, //月份
                "d+": time.getDate(), //日
                "h+": time.getHours(), //小时
                "m+": time.getMinutes(), //分
                "s+": time.getSeconds(), //秒
                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
                "S": time.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return format;
        };
        this.decryptStr = function (str) {
            let result = atob(str);
            return result.split('').reverse().join('');
        };
        this.encryptStr = function (str) {
            let result = str.split('').reverse().join('');
            return btoa(result);
        };
    }
    //全局弹窗对象
    const dialog = (function () {
        class Dialog {
            constructor() {
                this.mask = document.createElement('div');
                this.dialogStyle = document.createElement('style');

                this.setStyle(this.mask, {
                    "width": '100%',
                    "height": '100%',
                    "backgroundColor": 'rgba(0, 0, 0, .6)',
                    "position": 'fixed',
                    "left": "0px",
                    "top": "0px",
                    "bottom": "0px",
                    "right": "0px",
                    "z-index": "9999999999999"
                });

                this.content = document.createElement('div');
                this.setStyle(this.content, {
                    "max-width": '450px',
                    "width": "100%",
                    "max-height": '600px',
                    "backgroundColor": '#fff',
                    "boxShadow": '0 0 2px #999',
                    "position": 'absolute',
                    "left": '50%',
                    "top": '50%',
                    "transform": 'translate(-50%,-50%)',
                    "borderRadius": '5px'
                })
                this.mask.appendChild(this.content);
            }
            middleBox(param) {
                // 先清空中间小div的内容 - 防止调用多次，出现混乱
                this.content.innerHTML = '';

                let title = '默认标题内容';
                if ({}.toString.call(param) === '[object String]') {
                    title = param;
                } else if ({}.toString.call(param) === '[object Object]') {
                    title = param.title;
                }

                document.body.appendChild(this.mask);
                this.title = document.createElement('div');
                this.setStyle(this.title, {
                    "width": '100%',
                    "height": '40px',
                    "lineHeight": '40px',
                    "boxSizing": 'border-box',
                    "background-color": "#dedede",
                    "color": '#000',
                    "text-align": 'center',
                    "font-weight": "700",
                    "font-size": "17px",
                    "border-radius": "4px 4px 0px 0px"
                });

                this.title.innerText = title;
                this.content.appendChild(this.title);

                this.closeBtn = document.createElement('div');
                this.closeBtn.innerText = '×';

                this.setStyle(this.closeBtn, {
                    "textDecoration": 'none',
                    "color": '#000',
                    "position": 'absolute',
                    "right": '10px',
                    "top": '0px',
                    "fontSize": '25px',
                    "display": "inline-block",
                    "cursor": "pointer"
                })
                this.title.appendChild(this.closeBtn);

                const self = this;
                this.closeBtn.onclick = function () {
                    self.close();
                    if (param.onClose && (typeof param.onClose) === "function") {
                        param.onClose();
                    }
                }
            }
            showMake(param) {
                //添加公用样式表
                if (param.hasOwnProperty("styleSheet")) {
                    this.dialogStyle.textContent = param.styleSheet;
                }
                document.querySelector("head").appendChild(this.dialogStyle);

                this.middleBox(param);
                this.dialogContent = document.createElement('div');
                this.setStyle(this.dialogContent, {
                    "padding": "15px",
                    "max-height": "400px"
                });
                this.dialogContent.innerHTML = param.content;
                this.content.appendChild(this.dialogContent);
                param.onContentReady(this);
            }
            close() {
                document.body.removeChild(this.mask);
                document.querySelector("head").removeChild(this.dialogStyle);
            }
            setStyle(ele, styleObj) {
                for (let attr in styleObj) {
                    ele.style[attr] = styleObj[attr];
                }
            }
        }
        let dialog = null;
        return (function () {
            if (!dialog) {
                dialog = new Dialog()
            }
            return dialog;
        })()
    })();

    //全局统一方法对象
    const commonFunctionObject = new CommonFunction();
    commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加


    /**
     * 搜索引擎资源提醒
    */
    function SearchEnginesNavigation() {

        this.customNavigationkey = "custom-navigation-key-8898";
        this.serverNavigationkey = "server-navigation-key-8898";
        this.searchEnginesData = [
            { "host": "www.baidu.com", "element": "#content_right", "elementInput": "#kw" },
            { "host": "www.so.com", "element": "#side", "elementInput": "#keyword" },
            { "host": "www.sogou.com", "element": "#right", "elementInput": "#upquery" },
            { "host": "cn.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
            { "host": "www.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
            { "host": "www4.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
            { "host": "so.toutiao.com", "element": ".s-side-list", "elementInput": "input[type='search']" },
            { "host": "www.google.com", "element": "#rhs", "elementInput": "textarea[name='q']" },
            { "host": "www.google.com.hk", "element": "#rhs", "elementInput": "textarea[name='q']" },
            { "host": "duckduckgo.com", "element": ".react-results--sidebar", "elementInput": "#search_form_input" }
        ];
        this.defaultNavigationData = [
            {
                "name": "资源搜索", "list": [
                    {
                        "name": "Google",
                        "url": "https://www.google.com/search?q=@@"
                    },
                    {
                        "name": "DuckDuckGo",
                        "url": "https://duckduckgo.com/?t=h_&q=@@&ia=web"
                    },
                    {
                        "name": "百度",
                        "url": "https://www.baidu.com/s?wd=@@"
                    },
                    {
                        "name": "必应",
                        "url": "https://cn.bing.com/search?q=@@"
                    },
                    {
                        "name": "360搜索",
                        "url": "https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@"
                    },
                    {
                        "name": "搜狗",
                        "url": "https://www.sogou.com/web?query=@@"
                    },
                    {
                        "name": "搜狗|公众号",
                        "url": "https://weixin.sogou.com/weixin?type=2&query=@@"
                    },
                    {
                        "name": "头条搜索",
                        "url": "https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@"
                    },
                    {
                        "name": "高德地图",
                        "url": "https://ditu.amap.com/search?query=@@"
                    },
                    {
                        "name": "网易云搜索",
                        "url": "https://music.163.com/#/search/m/?s=@@"
                    },
                    {
                        "name": "百度百科",
                        "url": "https://baike.baidu.com/item/@@"
                    },
                    {
                        "name": "知乎搜索",
                        "url": "https://www.zhihu.com/search?type=content&q=@@"
                    },
                    {
                        "name": "抖音搜索",
                        "url": "https://www.douyin.com/search/@@"
                    },
                    {
                        "name": "Bilibili",
                        "url": "https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851"
                    },
                    {
                        "name": "Github",
                        "url": "https://github.com/search?q=@@"
                    },
                    {
                        "name": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=@@&page={startPage?}&utm_source=opensearch"
                    },
                    {
                        "name": "推特搜索",
                        "url": "https://x.com/search?q=@@"
                    },
                    {
                        "name": "图标搜索",
                        "url": "https://www.iconfont.cn/search/index?searchType=icon&q=@@"
                    },
                    {
                        "name": "维基百科",
                        "url": "https://en.wikipedia.org/w/index.php?search=@@"
                    },
                    {
                        "name": "ChatGPT",
                        "url": "http://chatgpt.com/?q=@@"
                    },
                    {
                        "name": "MetaSo",
                        "url": "https://metaso.cn/?q=@@"
                    },
                    {
                        "name": "Qwen",
                        "url": "https://chat.qwen.ai/?q=@@"
                    },
                    {
                        "name": "DeepSeek🐳",
                        "url": "http://chat.deepseek.com/?q=@@"
                    },
                    {
                        "name": "Kimi🌙",
                        "url": "https://www.kimi.com?q=@@"
                    },
                    {
                        "name": "元宝🌕️",
                        "url": "https://yuanbao.tencent.com/?q=@@"
                    },
                    {
                        "name": "豆包🍭",
                        "url": "https://www.doubao.com/chat/?q=@@"
                    }
                ]
            }
        ];
        this.getNavigationData = async function (element, elementInput) {
            const self = this;
            let navigationData = self.defaultNavigationData;
            let finalNavigationData = null;
            try {
                let customNavigationData = commonFunctionObject.GMgetValue(self.customNavigationkey, null); //自定义的数据
                if (!!customNavigationData) {
                    finalNavigationData = [].concat(customNavigationData);
                    // console.log("使用本地");
                } else {
                    let currentMS = (new Date()).getTime();
                    let delayMS = 1000 * 60 * 5;
                    let serverNavigationData = commonFunctionObject.GMgetValue(self.serverNavigationkey, null);
                    if (!serverNavigationData || (currentMS - serverNavigationData.ms) > delayMS) {
                        // 直接使用 this.defaultNavigationData 存入本地
                        commonFunctionObject.GMsetValue(self.serverNavigationkey, self.defaultNavigationData);
                        serverNavigationData = self.defaultNavigationData;
                    }

                    if (!!serverNavigationData) {
                        finalNavigationData = JSON.parse(serverNavigationData.list);
                    } else {
                        finalNavigationData = navigationData;
                    }
                }
            } catch (e) {
                finalNavigationData = navigationData;
            }
            self.createHtml(element, elementInput, finalNavigationData);
        };
        this.createCss = function (elementNum) {
            var innnerCss = `
			#dsdsd99mmmjj7760011{
				margin-bottom:20px;
			}
			.tab`+ elementNum + `{
				margin-bottom:8px;
			}
			.tab-c-titles`+ elementNum + `{
				margin-bottom:8px;
			}
			.tab-c-links`+ elementNum + `{

			}

			.tabs-t`+ elementNum + `{
				display: inline-block;
				width: 80px;
				height: 28px;
				line-height: 28px;
				font-size: 15px;
				letter-spacing: 0;
				text-align: center;
				font-weight: 400;
				border-radius: 6px;
				cursor: pointer;
				background: #f8f8f8;
				color: #333;
			}
			.tabs-t-selected-ddsds1idddx90{
			    color: #315EFB;
			    font-weight: 500;
			    background: rgba(49, 94, 251, 0.1);
			}
			.tabs-t-small-ddsds1idddx90{
			    margin-left: 8px;
			}

			.tab-c-links`+ elementNum + ` a[name='navigation']{
				display:inline-block;
				text-align:center;
				margin-right:12px;
				margin-top:2px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow:ellipsis;
				box-sizing:border-box;
				line-height:20px;
				font-size:14px!important;
				text-decoration: none;
				color: #666666;
			}
			.tab-c-links`+ elementNum + ` a[name='navigation']:hover{
				text-decoration: underline;
				color: #315EFB;
			}

			.bookmarks`+ elementNum + `{
				min-height:50px;
			}
		`;
            if ($("#plugin_css_style_dddsoo").length == 0) {
                $("body").prepend("<style id='plugin_css_style_dddsoo'>" + innnerCss + "</style>");
            }
        };
        this.showSetingDialog = function () {
            const self = this;

            var customNavigationData = "";
            const customNavigation = commonFunctionObject.GMgetValue(self.customNavigationkey, null);
            if (!!customNavigation) {
                customNavigationData = JSON.stringify(customNavigation, null, 4);
            }
            const content = `
			<div>
				<div style="font-size:13px;color:red;">
					注意事项如下：
					<br>1、请严格按照格式添加，否则不生效
					<br>2、数据为json格式，请确保json格式正确，必要时请到<a target="_blank" href="https://www.json.cn/">https://www.json.cn/</a>校验
					<br>3、点击下面”示例“按钮，查看具体格式情况
					<br>4、链接中的搜索关键词请用”@@“代替，脚本会自动替换成当前搜索词。例如：https://www.baidu.com/s?wd=@@
					<br>5、大家可以自定义导航数据，<b>但是必须要注意数据格式，发现出现错误，可点“初始化”</b>
				</div>
				<div style="margin-top:5px;height:200px;width:100%;">
					<textarea
						placeholder="请严格按照格式填写，否则不生效"
						class="navigation-textarea"
						style="color:#000;font-size:14px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;padding:5px;height:100%;width:100%;Overflow:auto;border:1px solid #ccc;resize:none;background-color:#FFF;outline:none;">`+ customNavigationData + `</textarea>
				</div>
				<div style="text-align:center;margin-top:15px;">
					<button class="navigation-init" style="color:#000;cursor:pointer;">初始化</button>
					<button class="navigation-example" style="color:#000;cursor:pointer;">示例</button>
					<button class="navigation-clear" style="color:#000;cursor:pointer;">清空</button>
					<button class="navigation-save" style="color:#000;cursor:pointer;">保存自定义导航</button>
				</div>
			</div>
		`;
            dialog.showMake({
                "title": "自定义添加导航",
                "content": content,
                "onClose": function () {
                    location.reload();
                },
                "onContentReady": function ($that) {
                    var $navigationExample = $that.dialogContent.querySelector(".navigation-example");
                    var $navigationClear = $that.dialogContent.querySelector(".navigation-clear");
                    var $navigationSave = $that.dialogContent.querySelector(".navigation-save");
                    var $navigationInit = $that.dialogContent.querySelector(".navigation-init");

                    var $textarea = $that.dialogContent.querySelector(".navigation-textarea");
                    $navigationExample.addEventListener("click", function () {
                        $textarea.value = JSON.stringify(self.defaultNavigationData, null, 4);
                    });
                    $navigationClear.addEventListener("click", function () {
                        $textarea.value = "";
                    });
                    $navigationInit.addEventListener("click", function () {
                        $textarea.value = "";
                        commonFunctionObject.GMsetValue(self.customNavigationkey, null);
                    });
                    $navigationSave.addEventListener("click", function () {
                        var content = $textarea.value;
                        if (!content) {
                            commonFunctionObject.GMsetValue(self.customNavigationkey, null);
                            commonFunctionObject.webToast({ "message": "保存成功：数据为空", "background": "#FF4D40" });
                            return;
                        }
                        if (content.length == 0 || content.indexOf("{") == -1 || content.indexOf("[") == -1) {
                            commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#FF4D40" });
                            return;
                        }
                        try {
                            var contentJson = JSON.parse(content);
                            if (Array.isArray(contentJson)) { //开始必须是数组
                                var isOK = true;
                                for (var i = 0; i < contentJson.length; i++) {
                                    if (Array.isArray(contentJson[i])) { //此处必须是对象
                                        isOK = false;
                                        break;
                                    }
                                    if (!contentJson[i].hasOwnProperty("name") || !contentJson[i].hasOwnProperty("list")) {
                                        isOK = false;
                                        break;
                                    }
                                    if (typeof (contentJson[i]["name"]) != "string") {
                                        isOK = false;
                                        break;
                                    }
                                    if (!Array.isArray(contentJson[i]["list"])) { //此处必须是数组
                                        isOK = false;
                                        break;
                                    }
                                    for (var j = 0; j < contentJson[i]["list"].length; j++) {
                                        if (!contentJson[i]["list"][j].hasOwnProperty("name") || !contentJson[i]["list"][j].hasOwnProperty("url")) {
                                            isOK = false;
                                            break;
                                        }
                                        if (typeof (contentJson[i]["list"][j]["name"]) != "string" || typeof (contentJson[i]["list"][j]["url"]) != "string") {
                                            isOK = false;
                                            break;
                                        }
                                    }
                                    if (!isOK) {
                                        break;
                                    }
                                }
                                if (isOK) {
                                    commonFunctionObject.GMsetValue(self.customNavigationkey, contentJson);
                                    commonFunctionObject.webToast({ "message": "保存成功", "background": "#FF4D40" });
                                } else {
                                    commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#FF4D40" });
                                }
                            } else {
                                commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#FF4D40" });
                            }
                        } catch (e) {
                            commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#FF4D40" });
                        }
                    });
                }
            })
        }
        this.createHtml = function (element, elementInput, navigationData) {
            $("#dsdsd99mmmjj7760011").remove();

            var isComplate = true;
            const host = window.location.host;
            const self = this;
            const elementNum = commonFunctionObject.randomNumber();
            const elementInterval = setInterval(function () {
                if (isComplate) {
                    var $element = $(element);
                    var $box = $("#dsdsd99mmmjj7760011");
                    isComplate = false;
                    if ($element.length != 0 && $box.length == 0) {
                        var nameArray = [];
                        var linkArray = [];
                        for (var i = 0; i < navigationData.length; i++) {
                            var name = "";
                            if (i == 0) {
                                name += '<span class="tabs-t' + elementNum + ' tabs-t-selected-ddsds1idddx90" name="tab-list-xxsddddssd-' + i + '">' + navigationData[i].name + '</span>';
                            } else {
                                name += '<span class="tabs-t' + elementNum + ' tabs-t-small-ddsds1idddx90" name="tab-list-xxsddddssd-' + i + '">' + navigationData[i].name + '</span>';
                            }
                            nameArray.push(name);

                            var links = "";
                            if (i == 0) {
                                links = '<div id="tab-list-xxsddddssd-' + i + '">';
                            } else {
                                links = '<div id="tab-list-xxsddddssd-' + i + '" style="display:none;">';
                            }
                            for (var j = 0; j < navigationData[i].list.length; j++) {
                                let url = navigationData[i].list[j].url;
                                url = url.replace("${t}", (new Date()).getTime());
                                let name = navigationData[i].list[j].name;
                                links += "<a target='_blank' name='navigation' data-url='" + url + "' href='javascript:void(0);'>" + name + "</a>"
                            }
                            links += "</div>";
                            linkArray.push(links);
                        }

                        var html = `
						<div id="dsdsd99mmmjj7760011" style="position:relative!important;left:0px!important;">
							<div class="tab`+ elementNum + `">
								<div class="tab-c-titles`+ elementNum + `">` + nameArray.join("") + `</div>
								<div class="tab-c-links`+ elementNum + `">` + linkArray.join("") + `</div>
							</div>
							<div style='margin-bottom:10px;margin-top:5px;font-size:12px;'>
								<a href="javascript:void(0);" name="customNavigation" style="color: #666;background-color: #efefef;padding: 2px 5px; border-radius: 2px;">🔧自定义网址</a>
							</div>
						<div>
					`;

                        // //添加css 添加html
                        self.createCss(elementNum);
                        $element.prepend(html);


                        //点击切换tab
                        $("#dsdsd99mmmjj7760011 .tabs-t" + elementNum).on("click", function (e) {
                            $("div[id^='tab-list-xxsddddssd-']").hide();
                            $(".tabs-t" + elementNum).removeClass("tabs-t-selected-ddsds1idddx90");

                            $("#" + $(this).attr("name")).show();
                            $(this).addClass("tabs-t-selected-ddsds1idddx90");
                        });

                        //点击链接
                        $("#dsdsd99mmmjj7760011 a[name='navigation']").on("click", function (e) {
                            commonFunctionObject.GMopenInTab($(this).data("url").replace("@@", $(elementInput).val()));
                            e.preventDefault()
                        });

                        //弹出自定义导航弹窗
                        $("#dsdsd99mmmjj7760011 a[name='customNavigation']").on("click", function (e) {
                            self.showSetingDialog();
                            e.preventDefault()
                        });
                    }
                    isComplate = true;
                }
            }, 100);
        };
        this.hookBaidu = function () {
            let items = document.querySelectorAll("#content_left>div");
            for (let item of items) {
                //给处理完成的做一个标识
                if (!!item.getAttribute("baidu_dealxx")) {
                    continue;
                }
                item.setAttribute("baidu_dealxx", "--");

                let a = item.querySelector("a");
                if (!a || !a.href) {
                    continue;
                }

                //标注了html网址的忽略
                let OP_LOG_LINK = item.querySelector(".OP_LOG_LINK");
                if (!!OP_LOG_LINK && OP_LOG_LINK.innerText.search("http") != -1) {
                    continue;
                }

                //有多个点击点的忽略
                let cGapBottomSmall = item.querySelector(".c-gap-bottom-small");
                if (!!cGapBottomSmall) {
                    continue;
                }

                //https://www.baidu.com/s?wd=一夜醒来欠地铁600 много钱?官方回应
                if (a.href.includes("www.baidu.com/link?url=")) {
                    let url = item.getAttribute("mu");
                    if (url && url.indexOf("http") != -1 && !url.includes("nourl.ubs.baidu.com")) {
                        a.href = url;
                        item.innerHTML += `<div style="color:#ccc;font-size:12px;display:flex;align-items:center;width:100%;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;">
										<img style="width:15px;height:15px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAKhJREFUOE+9k9ENwjAMBc8RA7AR7UhMQDsBszBBw0YMAAmKrBS3pM1HpOb/ne9ZjtD4pDHPEYBTB2FSU9fD21vrisEcHsF5BS0hFYCLwAhh0KkZGOZcBSATyAM4K8QNEC8Q+1yjAEhTPjeQ50+bq0KW4QRZAWxnXsBdO4euFC4AbOe1fvlijEGebrecOqeXl/gP2aiwr125g2wSvd321skfccr7363Z4Asklz4RHmdA1gAAAABJRU5ErkJggg=="/>
										<a style="color:#626675;" href="`+ url + `" target="_blank">` + url + `</a>
									</div>`;
                    }
                }

                let itemNews = item.querySelectorAll("[class^=single-card-wrapper] div,[class^=group-wrapper] div");
                if (!itemNews) {
                    continue;
                }
                //single-card-wrapper: https://www.baidu.com/s?ie=UTF-8&wd=es6                          xxx的最新相关信息
                //group-wrapper:       https://www.baidu.com/s?ie=UTF-8&wd=五一消费成绩单折射市场活力     资讯
                for (let itemNew of itemNews) {
                    let dataUrl = null;
                    let divs = itemNew.querySelectorAll("div");
                    for (let div of divs) {
                        dataUrl = div.getAttribute("data-url")
                        if (dataUrl) {
                            let a = itemNew.querySelector("a");
                            a.setAttribute("href", dataUrl);
                        }
                    }
                }
            }
        };
        this.hookGoogle = function () {
            let items = document.querySelectorAll("#center_col a");
            for (let a of items) {
                if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
            }
        };
        this.hooks = function () {
            const host = window.location.host;
            const href = window.location.href;
            const search = window.location.search;
            const self = this;
            setInterval(function () {
                if (host === "www.baidu.com") {
                    self.hookBaidu();
                } else if (host === "www.google.com" || host === "www.google.com.hk") {
                    self.hookGoogle();
                }
            }, 300);
        };
        this.show = function () {
            const self = this;
            const host = window.location.host;
            const href = window.location.href;
            if ((host === "www.baidu.com")
                || (host === "www.so.com" && href.indexOf("www.so.com/s") != -1)
                || (host === "www.sogou.com" && (href.indexOf("www.sogou.com/web") != -1 || href.indexOf("www.sogou.com/sogou") != -1))
                || (host === "cn.bing.com" && href.indexOf("cn.bing.com/search") != -1)
                || (host === "www.bing.com" && href.indexOf("www.bing.com/search") != -1)
                || (host === "www4.bing.com" && href.indexOf("www4.bing.com/search") != -1)
                || (host === "so.toutiao.com" && href.indexOf("so.toutiao.com/search") != -1)
                || (host === "www.google.com" && href.indexOf("www.google.com/search") != -1)
                || (host === "www.google.com.hk" && href.indexOf("www.google.com.hk/search") != -1)
                || (host === "duckduckgo.com" && href.indexOf("duckduckgo.com") != -1)) {
                let currentSearchEnginesData = null;
                for (var i = 0; i < self.searchEnginesData.length; i++) {
                    if (host === self.searchEnginesData[i].host) {
                        currentSearchEnginesData = self.searchEnginesData[i];
                    }
                }
                if (currentSearchEnginesData != null) {
                    self.getNavigationData(currentSearchEnginesData.element, currentSearchEnginesData.elementInput);
                }
                self.hooks();
            }
        };
        this.start = function () {
            this.show();
        };
    }
    try {
        (new SearchEnginesNavigation()).start();
    } catch (e) {
        console.log("搜索引擎导航：error：" + e);
    }

    /**
     * 给kimi网站添加q查询参数
    */

    async function addKimiQueryParam() {

        const log = (msg, ...args) => console.log(`[Kimi Fix] ${msg}`, ...args);
        const error = (msg, ...args) => console.error(`[Kimi ERROR] ${msg}`, ...args);

        function getQueryParam() {
            return new URLSearchParams(window.location.search).get('q');
        }

        function waitForElement(selector, timeout = 15000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const check = () => {
                    const elem = document.querySelector(selector);
                    if (elem) {
                        log(`元素已找到 (${Date.now()-startTime}ms): ${selector}`);
                        return resolve(elem);
                    }
                    if (Date.now() - startTime < timeout) {
                        setTimeout(check, 100);
                    } else {
                        reject(new Error(`元素未找到: ${selector}`));
                    }
                };
                check();
            });
        }

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        async function autoFillQuery() {
            const query = getQueryParam();
            if (!query) {
                log("未检测到查询参数 q");
                return;
            }

            try {
                log(`开始处理查询: "${query}"`);

                // 1. 获取Lexical编辑器
                const editorSelector = '.chat-input-editor[contenteditable="true"][data-lexical-editor]';
                const editor = await waitForElement(editorSelector);

                // 2. 确保焦点
                editor.focus();
                await delay(200);

                // 3. 清空内容
                editor.textContent = '';
                editor.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    inputType: 'deleteContentBackward'
                }));
                await delay(100);

                // 4. 设置新内容
                editor.innerHTML = `<p dir="ltr"><span data-lexical-text="true">${query}</span></p>`;

                // 5. 触发Lexical更新事件链
                editor.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    inputType: 'insertText',
                    data: query
                }));

                editor.dispatchEvent(new Event('compositionend', {
                    bubbles: true,
                    composed: true
                }));

                // 6. 等待Lexical完成内部状态更新
                log("等待Lexical编辑器更新 (1000ms)...");
                await delay(1000);

                // 7. 验证内容
                const currentContent = editor.textContent.trim();
                if (currentContent !== query.trim()) {
                    error(`内容验证失败! 期望: "${query}", 实际: "${currentContent}"`);
                    return;
                }
                log(`内容验证成功: "${currentContent}"`);

                // 8. 直接使用完整键盘事件链发送
                log("尝试使用完整键盘事件链发送消息");

                // 派发完整的键盘事件序列
                const keyEvents = ['keydown', 'keypress', 'keyup'];
                keyEvents.forEach(type => {
                    editor.dispatchEvent(new KeyboardEvent(type, {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true,
                        composed: true,
                        shiftKey: false,
                        ctrlKey: false,
                        altKey: false,
                        metaKey: false,
                        isComposing: false,
                        location: 0,
                        repeat: false
                    }));
                });

                log("✅ 已尝试完整键盘事件链发送");
                log("消息应已成功发送!");

            } catch (err) {
                error("自动发送失败:", err);
            }
        }

        // 执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', autoFillQuery);
        } else {
            autoFillQuery();
        }
    }

    try {
        //如果匹配到kimi.moonshot.cn，就执行addKimiQueryParam函数
        if (window.location.host === 'kimi.moonshot.cn' || window.location.host === 'www.kimi.com') {
            addKimiQueryParam();
        }
    } catch (e) {
        console.log("给kimi网站添加q查询参数：error：" + e);
    }


    /*
     * 给元宝添加查询参数
    */
    async function addYuanbaoQueryParam() {


        const params = new URLSearchParams(window.location.search);
        const query = params.has('q') ? decodeURIComponent(params.get('q')) : null;
        // console.log("查询参数："+query)
        if (!query?.trim()) return;



        // 增强版元素等待器
        function waitForElement(selector, timeout = 8000) {
            return new Promise((resolve, reject) => {
                let retry = 0;
                const check = () => {
                    const elem = document.querySelector(selector);
                    if (elem) {
                        console.log(`[加载跟踪] 元素${selector}在第${Date.now() - start}ms加载完成`);
                        resolve(elem);
                    } else if (Date.now() - start > timeout) {
                        reject(`元素加载超时: ${selector}`);
                    } else {
                        setTimeout(check, 500);
                    }
                };
                const start = Date.now();
                check();
            });
        }

        try {
            // 等待富文本编辑器
            const inputBox = await waitForElement('.ql-editor[contenteditable="true"]');

            // 模拟真实输入
            inputBox.focus();
            await new Promise(r => setTimeout(r, 300));
            inputBox.innerHTML = `<p>${query}</p>`; // 富文本特殊处理

            // 触发React状态更新
            inputBox.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                composed: true
            }));

            // 提交优化（增加延迟确保渲染完成）
            setTimeout(() => {
                inputBox.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    bubbles: true
                }));
            }, 1200);

        } catch (error) {
            console.error('[最终错误处理]', error);
        }
    }

    try {
        //如果匹配到yuanbao.tencent.com，就执行addYuanbaoQueryParam函数
        if (window.location.host === 'yuanbao.tencent.com') {
            addYuanbaoQueryParam();
        }
    } catch (e) {
        console.log("给元宝添加q查询参数：error：" + e);
    }

    /*
     * 给DeepSeek添加q查询参数
    */
    async function addDeepSeekQueryParam() {
        const query = new URLSearchParams(window.location.search).get('q');
        if (!query) return;

        const waitForElement = (selector) => {
            return new Promise((resolve) => {
                const elem = document.querySelector(selector);
                if (elem) {
                    return resolve(elem);
                }

                const observer = new MutationObserver(() => {
                    const elem = document.querySelector(selector);
                    if (elem) {
                        observer.disconnect();
                        resolve(elem);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        };
        const getReactProps = el => el[Object.keys(el).find(k => k.startsWith('__reactProps$'))];
        const delay = (ms) => new Promise(res => setTimeout(res, ms));


        const chat = await waitForElement("#chat-input");
        chat.value = query;
        getReactProps(chat)?.onChange?.({
            target: { value: query },
            currentTarget: { value: query },
            preventDefault: () => { },
            stopPropagation: () => { }
        });

        await delay(500);
        getReactProps(chat)?.onKeyDown?.({
            key: 'Enter',
            keyCode: 13,
            shiftKey: false,
            target: chat,
            currentTarget: chat,
            preventDefault: () => { },
            stopPropagation: () => { },
        });
    }


    try {
        //如果匹配到deepseek.com，就执行addDeepSeekQueryParam函数
        if (window.location.host === 'chat.deepseek.com') {
            addDeepSeekQueryParam();
        }
    } catch (e) {
        console.log("给DeepSeek添加q查询参数：error：" + e);
    }



    async function addQwenQueryParam() {
        // 获取URL查询参数
        const getQueryParam = () => {
            const q = new URLSearchParams(window.location.search).get('q');
            return q;
        };

        // 等待元素加载
        const waitForElement = async (selector, timeout = 20000) => {
            const start = Date.now();
            return new Promise((resolve, reject) => {
                const check = () => {
                    const el = document.querySelector(selector);
                    if (el) {
                        return resolve(el);
                    }
                    if (Date.now() - start > timeout) {
                        return reject(new Error(`Element timeout: ${selector}`));
                    }
                    setTimeout(check, 100);
                };
                check();
            });
        };

        // 模拟完整用户输入流程
        const simulateInput = async (text) => {
            try {
                const chatBox = await waitForElement('#chat-input');

                // 模拟点击聚焦
                chatBox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                chatBox.focus();

                // 设置输入值并触发事件（兼容React）
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    "value"
                ).set;

                nativeInputValueSetter.call(chatBox, text);

                // 触发输入事件链
                ['input', 'change', 'keydown', 'keyup'].forEach(eventType => {
                    chatBox.dispatchEvent(new Event(eventType, {
                        bubbles: true,
                        cancelable: true
                    }));
                });

                // 等待内容处理完成
                await new Promise(resolve => setTimeout(resolve, 300));

                // 模拟回车发送
                ['keydown', 'keypress', 'keyup'].forEach(eventType => {
                    const event = new KeyboardEvent(eventType, {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true
                    });
                    chatBox.dispatchEvent(event);
                });



            } catch (error) {
                console.error('[QwenAutoInput] 错误详情:', error);
            }
        };
        const query = getQueryParam();
        if (!query) return;

        // 确保页面完全加载
        await waitForElement('#chat-input');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 执行自动输入
        await simulateInput(query);
    }

    try {
        if (window.location.host === 'chat.qwen.ai') {
            addQwenQueryParam();
        }
    } catch (e) {
        console.log("给qwen添加q查询参数：error：" + e);
    }





    // 豆包搜索添加q参数
    async function addDoubaoQueryParam() {
        const query = new URLSearchParams(window.location.search).get('q');
        if (!query) {
            console.log('URL中未检测到q参数，脚本终止');
            return;
        }

        console.log(`检测到查询参数：${query}`);

        // 元素等待函数（优化版）
        const waitForElement = async (selectors, timeout = 10000) => {
            const selectorList = Array.isArray(selectors) ? selectors : [selectors];
            const startTime = Date.now();

            while (Date.now() - startTime < timeout) {
                for (const selector of selectorList) {
                    const element = document.querySelector(selector);
                    if (element) {
                        console.log(`通过选择器 "${selector}" 定位到元素`);
                        return element;
                    }
                }
                await delay(300);
            }

            console.error(`元素定位超时：${selectorList.join(' / ')}`);
            throw new Error(`元素定位超时：${selectorList.join(' / ')}`);
        };

        // 延时函数
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // 注入式输入内容（保留核心逻辑）
        async function injectText(element, text) {
            console.log(`开始注入内容，长度：${text.length} 字符`);
            const chunks = splitTextIntoChunks(text);

            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                setNativeValue(element, chunk.content);
                triggerInputEvents(element);
                await delay(150 + Math.random() * 100);
            }

            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log(`内容注入完成：${text}`);
        }

        // 简化的文本分块函数
        function splitTextIntoChunks(text) {
            const chunks = [];
            const maxChunkSize = 20;
            for (let i = 0; i < text.length; i += maxChunkSize) {
                chunks.push({ content: text.substring(i, i + maxChunkSize) });
            }
            return chunks;
        }

        // 设置原生值（保留必要逻辑）
        function setNativeValue(element, value) {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
        }

        // 触发输入事件（简化版）
        function triggerInputEvents(element) {
            ['focus', 'input', 'change'].forEach(eventName => {
                const event = new Event(eventName, { bubbles: true, cancelable: true, composed: true });
                element.dispatchEvent(event);
            });
        }

        // 优化的点击函数
        async function realisticClick(element) {
            try {
                const rect = element.getBoundingClientRect();
                const clickX = rect.left + rect.width / 2;
                const clickY = rect.top + rect.height / 2;

                // 基础鼠标事件序列
                element.dispatchEvent(new MouseEvent('mouseenter', { clientX: clickX, clientY: clickY, bubbles: true }));
                await delay(100);

                element.dispatchEvent(new MouseEvent('mousedown', { clientX: clickX, clientY: clickY, bubbles: true, buttons: 1 }));
                await delay(50);

                element.dispatchEvent(new MouseEvent('mouseup', { clientX: clickX, clientY: clickY, bubbles: true, buttons: 0 }));
                element.dispatchEvent(new MouseEvent('click', { clientX: clickX, clientY: clickY, bubbles: true }));

                await delay(150);
            } catch (error) {
                console.log('鼠标模拟失败，尝试直接点击', error);
                element.click();
            }
        }

        try {
            // 定位输入框
            const textarea = await waitForElement([
                '[data-testid="chat_input_input"]',
                '.semi-input-textarea.semi-input-textarea-autosize'
            ]);

            textarea.focus();
            await delay(600);
            textarea.value = '';
            triggerInputEvents(textarea);
            await delay(200);

            // 注入内容
            await injectText(textarea, query);

            // 验证内容
            if (textarea.value.trim() !== query.trim()) {
                setNativeValue(textarea, query);
                triggerInputEvents(textarea);
                await delay(300);
            }

            console.log(`内容已成功设置：${query}`);
            await delay(500);

            // 定位发送按钮
            const sendButton = await waitForElement([
                '[data-testid="chat_input_send_button"]',
                '.semi-button-primary:not([disabled])'
            ]);

            console.log('准备发送消息...');
            textarea.focus();
            await delay(200);

            // 点击发送按钮（优化版）
            await realisticClick(sendButton);

            // 等待发送结果
            await delay(1000);

            if (textarea.value.trim() !== '') {
                console.warn('警告：尝试使用Enter键发送');
                const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
                textarea.dispatchEvent(enterEvent);
                await delay(150);
                textarea.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true }));
                await delay(1000);
            }

            console.log('消息已成功发送！');

        } catch (error) {
            console.error('脚本执行失败:', error.message);
        }
    }

    if (window.location.host === 'www.doubao.com' && window.location.pathname.startsWith('/chat')) {
        addDoubaoQueryParam();
    }


})();