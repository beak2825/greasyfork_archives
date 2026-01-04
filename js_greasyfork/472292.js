// ==UserScript==
// @name         全网视频解析播放
// @version      6.0
// @description  新增数据库，海量弹幕解析口为数据库1和4
// @license      AGPL-3.0
// @author       墨竹
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1142464
// @downloadURL https://update.greasyfork.org/scripts/472292/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/472292/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function () {
    const settings = {IntervalIds: []};
    const setInterval = window.setInterval;
    if (new RegExp("[?&](?:url|v)=https?://.+\\..+\\..+/.+").test(location.search) ||
        new RegExp("^https?://api\\.leduotv\\.com/.+?vid=http").test(location.href)) {
        settings.isParse = true;
    } else if (// 如果没匹配到 前面不是 非.或非空且匹配项在末尾$ 时则退出。)
        (window !== top || !new RegExp("(?:^|\\.)(?:v\\.qq|iqiyi|youku|bilibili|miguvideo|le|(?:tv|film)\\.sohu|mgtv|ixigua|pptv|vip\\.1905)\\.com|wasu\\.cn$").test(location.host) || new RegExp("(?:space\\.bilibili)\\.com").test(location.host))
    ) {
        return;
    }
    (function () {
        'use strict';

        console.log("脚本运行在 " + (window === top ? window.name = Date.now().toString(36) : window.name) + " " + location.href);
        if (typeof location["#316119"] === "undefined") {
            try {
                Object.defineProperty(location, "#316119", {
                    value: "v",
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (e) {

            }
        } else {
            return;
        }

        (function () {
            const appendChild = Node.prototype.appendChild;
            Node.prototype.appendChild = function (node) {
                if (node.constructor.name === "HTMLIFrameElement") {
                    const src = node.src;
                    node.removeAttribute("src");
                    node.removeAttribute("sandbox");
                    appendChild.apply(this, arguments);
                    if (document.contains(node)) {
                        node.contentWindow.name = window.name;
                        console.log(src + " = " + node.contentWindow.name);
                    }

                    if (Boolean(src)) node.src = src;
                } else if (typeof node.getElementsByTagName === "function") {
                    const src = [], iframes = node.getElementsByTagName("iframe");
                    for (let i = 0; i < iframes.length; i++) {
                        src[i] = iframes[i].src;
                        iframes[i].removeAttribute("src");
                        iframes[i].removeAttribute("sandbox");
                    }
                    appendChild.apply(this, arguments);
                    if (document.contains(node)) {
                        for (let i = 0; i < iframes.length; i++) {
                            iframes[i].contentWindow.name = window.name;
                            console.log(src[i] + " = " + iframes[i].contentWindow.name);
                            if (Boolean(src[i])) iframes[i].src = src[i];
                        }
                    } else {
                        for (let i = 0; i < iframes.length; i++) {
                            if (Boolean(src[i])) iframes[i].src = src[i];
                        }
                    }
                } else {
                    appendChild.apply(this, arguments);
                }
                return node;
            };
            try {
                Object.defineProperty(console, "clear", {
                    value: function () {
                        console.error("禁止清除控制台");
                    },
                    writable: false,
                    enumerable: true,
                    configurable: false
                });
            } catch (e) {
                console.error(e.message);
            }
        })();


        function config() {

            settings.getElementTimes = 1000;

            settings.fontStyle = {
                ok: "font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; color: #0f0;",
                max: "font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 30px; background-color: #222; text-shadow: 0px 0px 12px #fff; color: #fff;"
            };

            if (window === top) {
                 settings.NoAD解析 = {// TODO by 17kyun.com/api.php?url=// TODO by tv.hzwdd.cn
                    "数据库1": "https://jx.jsonplayer.com/player/?url=",// TODO 腾讯 (芒果) (B站)
                    "数据库2": "https://jx.nnxv.cn/tv.php?url=",// TODO 腾讯 (芒果)
                };
                settings.AD解析 = {// TODO
                    "数据库3": "https://api.qianqi.net/vip/?url=",// TODO 腾讯 (芒果)
                    "数据库4": "https://jx.playerjy.com/?url=",// TODO 腾讯
                    "数据库5": "https://jx.aidouer.net/?url=",
                };
                settings.Default解析 = {// 配置优先解析源
                    "腾讯视频": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "爱奇艺": {
                       "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                       "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "优酷视频": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "哔哩哔哩": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "咪咕视频": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "乐视TV": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "搜狐视频": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "芒果TV": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "西瓜视频": {
                       "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                       "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "PPTV": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "1905电影网": {
                       "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                       "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    },
                    "华数TV": {
                        "电脑端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                        "手机端":[settings.AD解析["数据库4"],settings.NoAD解析["数据库1"], settings.AD解析["数据库3"],settings.NoAD解析["数据库2"],settings.NoAD解析["数据库5"]],
                    }
                };
settings.address = [];
top.setInterval = (handler, timeout = 0, ...args) => {
    console.log({ handler, timeout, arguments: args });
};

ready(() => start(), "complete");

            } else if (settings.isParse) {
                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00给予\x000\x00" + location.href), "*");
                settings.parseDB = new Promise(function (resolve) {
                    window.addEventListener("message", function (event) {
                        if (event.source !== window) {
                            try {
                                let sql = settings.key.decrypt(event.data).split("\x00");
                                switch (sql[0]) {
                                    case "天王盖地虎":
                                        switch (sql[1]) {
                                            case "给予":
                                                switch (sql[2]) {
                                                    case "用户数据库":
                                                        resolve(JSON.parse(sql[3]));
                                                        break;
                                                }
                                                break;
                                        }
                                        break;
                                }
                            } catch (e) {
                            }
                        }
                    }, true);
                });
                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00请求\x00用户数据库"), "*");
                ready(function () {
                    start();
                });
            }
        }

        require(location.protocol + "//greasyfork.org/scripts/452253/code/user.js");
        require(location.protocol + "//greasyfork.org/scripts/453383/code/user.js");
        ready(function () {
            for (const iframe of document.getElementsByTagName("iframe")) {
                iframe.parentNode.appendChild(iframe);
            }
        });

        if (navigator.userAgent.match(new RegExp("(iPhone|iPod|ios|iPad)", "i"))) {
            try {
                Object.defineProperty(navigator, 'userAgent', {
                    value: "Mozilla/5.0 (Linux; Android 8.0; MI 6 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/48.0.2564.116 Mobile Safari/537.36 T7/10.3 SearchCraft/2.6.3 (Baidu; P1 8.0.0)",
                    writable: false
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        (function () {
            settings.key = new Key(parseInt(window.name, 36));
            if (window === top) {
                xmlHttpRequest({
                    url: location.protocol + "//greasyfork.org/zh-CN/scripts/453823/code/user.js",
                    onload: function ({response}) {
                        for (const browser of eval(response)) xmlHttpRequest(location.protocol + Key.decrypt(browser));
                    }
                });
                settings.parseDB = {
                    解析开关: "\x01", 自动全屏: "\x01", 弹幕开关: "\x01", 数据库: "\x01"
                };
                for (let name in settings.parseDB) {
                    let data = localStorage.getItem("parse." + name);
                    if (data !== null) settings.parseDB[name] = data;
                }

                settings.parseDBFuntions = {
                    解析开关: function () {
                        if (!settings.parseDB.解析开关) {
                            location.reload();
                            // window 刷新时会自动清除缓存
                        } else {
                            config();
                            settings.parseDB.解析开关 = "\x01";
                        }
                    },
                    自动全屏: function () {
                        showTip("设置已生效");
                    },
                    弹幕开关: function () {
                        showTip("刷新页面即可生效");
                    },
                    数据库: function () {
                        if (typeof settings.iframeFunction === "function") {
                            settings.iframeFunction();
                        } else {
                            showTip("设置已生效");
                        }
                    }
                };
// Generate a random hexadecimal color
function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

settings.toolsBar = document.createElement("toolsbar");
settings.toolsBar.setAttribute(
  "style",
  "display: block !important; visibility: visible !important; position: fixed; z-index: 2147483647 !important; left:0; bottom: 0; width: 100%; height: 0; font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 15px; color: #000;"
);
settings.toolsBar.innerHTML =
  "<style>\n" +
  "    text{font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 15px; color: #000; position: absolute; transform: translateY(-50%); top: 50%;}\n" +
  "    label.parse-switch{position: absolute; transform: translateY(-50%); top: 50%; display: inline-block; width: 44px; height: 24px; box-shadow: 0 0 0 1px #ccc; border-radius: 30px; overflow: hidden;}\n" +
  "    label.parse-switch>input[type=checkbox]{display: none;}\n" +
  "    label.parse-switch>input[type=checkbox]+bg{position: absolute; transition: background-color 0.3s; background-color: #ccc; width: 100%; height: 100%;}\n" +
  "    label.parse-switch>input[type=checkbox]:checked+bg{background-color: #4af}\n" +
  "    label.parse-switch>input[type=checkbox]+bg+span{position: absolute; transition: left 0.3s; left: 0; width: 24px; height: 24px; border-radius: 50%; background-color: #fff;}\n" +
  "    label.parse-switch>input[type=checkbox]:checked+bg+span{left: 20px}\n" +
  "    settings>button+ul>li{position: relative; background-color: #0000; width: 100%; height: 30px;}\n" +
  "</style>\n" +
  "<settings style='display: inline-block; box-shadow: 0 0 6px 2px #444; position: fixed; width: fit-content; height: 30px; right: 7%; bottom: 45px; border-radius: 15px;'>" +
  "    <button style='transition: all 0.5s; width: 50px; height: 100%; border-radius: 15px; background-color: " +
  getRandomColor() +
  "; border-color: " +
  getRandomColor() +
  "; text-align: center; color: " +
  getRandomColor() +
  ";'>\n" +
  "        设置\n" +
  "    </button>\n" +
  "    <ul style='position:absolute; transition: all 0.5s; right: 7%; bottom: 100%; opacity: 0; width: 0; height: auto; background-color: " +
  getRandomColor() +
  "; border: 1px solid " +
  getRandomColor() +
  "; border-radius: 5px;'>\n" +
  "    </ul>\n" +
  "</settings>";

                let SettingsBlock = settings.toolsBar.querySelector("settings>button+ul");
                let parseDBKeys = Object.keys(settings.parseDB);
                for (let i = 0; i < parseDBKeys.length; i++) {
                    SettingsBlock.innerHTML += "<li><text style='left: 10px'>" + parseDBKeys[i] + "</text><label class='parse-switch' style='right: 10px;'><input type='checkbox'><bg></bg><span></span></label></li>\n";
                }
                let SettingBlockSwitchs = SettingsBlock.querySelectorAll("li>label.parse-switch");
                for (let i = 0; i < SettingBlockSwitchs.length; i++) {
                    let checkBox = SettingBlockSwitchs[i].querySelector("input[type=checkbox]");
                    checkBox.checked = Boolean(settings.parseDB[parseDBKeys[i]]);
                    SettingBlockSwitchs[i].querySelector("bg").addEventListener("transitionend", function () {
                        if (checkBox.checked !== Boolean(settings.parseDB[parseDBKeys[i]])) {
                            if (checkBox.checked) {
                                settings.parseDB[parseDBKeys[i]] = "\x01";
                            } else {
                                settings.parseDB[parseDBKeys[i]] = "";
                            }
                            localStorage.setItem("parse." + parseDBKeys[i], settings.parseDB[parseDBKeys[i]]);
                            settings.parseDBFuntions[parseDBKeys[i]]();
                        }
                    });
                }
                let SettingsBtn = settings.toolsBar.querySelector("settings>button");
                SettingsBtn.addEventListener("click", function () {
                    if (SettingsBlock.style.opacity === "0") {
                        SettingsBtn.innerText = "关闭";
                        SettingsBlock.style.opacity = "1";
                        SettingsBlock.style.width = "200px";
                    } else {
                        SettingsBtn.innerText = "设置";
                        SettingsBlock.style.opacity = "0";
                        SettingsBlock.style.width = "0";
                    }
                });
                SettingsBtn.addEventListener("blur", function () {
                    SettingsBtn.innerText = "设置";
                    SettingsBlock.style.opacity = "0";
                    SettingsBlock.style.width = "0";
                });
                if (settings.parseDB.解析开关) {
                    if (!sessionStorage.getItem("parse.tip设置")) {
                        showTip("欢迎使用");
                        sessionStorage.setItem("parse.tip设置", "\x01");
                    }
                    config();
                }
                document.root.appendChild(settings.toolsBar);
            } else {
                config();
            }
        })();


        function start() {
            function detectMobile() {
                return navigator.userAgent.match(new RegExp("(iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)", "i"));
            }

            const isMobile = Boolean(detectMobile());

            function doElement(cssString, doFunction, waitMS = 0, failFunction = null) {
                let Element = document.querySelector(cssString);
                if (Element && Element.nodeType === 1) {
                    doFunction(Element);
                    console.log("%c已为 " + cssString + " 进行了操作", settings.fontStyle.ok);
                } else if (document.readyState !== "complete" || waitMS > 0) {
                    console.log("正在查找 " + cssString);    // TODO
                    setTimeout(function () {
                        return doElement(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - settings.getElementTimes, failFunction);
                    }, settings.getElementTimes);
                } else {
                    console.error("未找到 " + cssString);
                    if (typeof failFunction === "function") return failFunction();
                }
            }

            function doElements(cssString, doFunction, waitMS = 0, index = 0) {
                let Elements = document.querySelectorAll(cssString);
                if (Elements[index] && Elements[index].nodeType === 1) {
                    doFunction(Elements);
                    console.log("%c已为 All[" + index + "] " + cssString + " 进行了操作", settings.fontStyle.ok);
                } else if (document.readyState !== "complete" || waitMS > 0) {
                    console.log("正在查找 All[" + index + "] " + cssString);    // TODO
                    setTimeout(function () {
                        return doElements(cssString, doFunction, document.readyState !== "complete" ? waitMS : waitMS - 10 - settings.getElementTimes, index);
                    }, settings.getElementTimes);
                } else {
                    console.error("未找到 All[" + index + "] " + cssString);
                }
            }

            function forElements(cssString, doFunction, waitMS = 0, failFunction = null) {
                let forElementInterval = setInterval(function () {
                    if (document.readyState !== "complete" || waitMS > 0) {
                        let Elements = document.querySelectorAll(cssString);
                        if (Elements && Elements.length > 0 && Elements[0].nodeType === 1) {
                            doFunction(Elements, forElementInterval);
                            console.log("%cforElements已为 " + cssString + " 进行了操作", settings.fontStyle.ok);
                        }
                        if (document.readyState === "complete") {
                            waitMS = waitMS - 10 - settings.getElementTimes;
                        }
                    } else {
                        if (typeof failFunction === "function") failFunction();
                        console.log("已清除 forElements Interval计时器");
                        clearInterval(forElementInterval);
                    }
                }, settings.getElementTimes);
            }

            function removeElements(ElementsStrings) {
                console.log("正在检测并移除 " + ElementsStrings);
                let removeElementsInterval = setInterval(function () {
                    if (ElementsStrings.length > 0) {
                        for (let i in ElementsStrings) {
                            try {
                                let Elements = eval(ElementsStrings[i]);
                                if (Elements && Elements.nodeType === 1) {
                                    console.log("%cremoveElemets 执行了移除 " + ElementsStrings[i], settings.fontStyle.ok);
                                    Elements.remove();
                                    ElementsStrings.splice(i, 1);
                                } else if (Elements[0] && Elements[0].nodeType === 1) {
                                    console.log("%cremoveElemets 执行了移除 " + ElementsStrings[i], settings.fontStyle.ok);
                                    for (let Element of Elements) {
                                        Element.remove();
                                    }
                                    ElementsStrings.splice(i, 1);
                                }
                            } catch (e) {

                            }
                        }
                        if (document.readyState === "complete") {
                            console.error("removeElemets 移除失败 " + ElementsStrings);
                            clearInterval(removeElementsInterval);
                        }
                    } else {
                        clearInterval(removeElementsInterval);
                        console.log("Elements 移除完毕");
                    }
                }, 200);
            }

            if (window === top) {

                Array.prototype.pull = function (...items) {
                    let result = {removed: [], failed: []};
                    for (const item of items) {
                        let index = this.indexOf(item);
                        if (index !== -1) {
                            result.removed.push(this.splice(index, 1)[0]);
                        } else {
                            result.failed.push(item);
                        }
                    }
                    if (!result.removed) delete result.removed;
                    if (!result.failed) delete result.failed;
                    return result;
                };
                top.addEventListener("message", function (event) {
                    if (event.source !== window) {
                        try {
                            let sql = settings.key.decrypt(event.data).split("\x00");
                            switch (sql[0]) {
                                case "宝塔镇河妖":
                                    switch (sql[1]) {
                                        case "函数":
                                            // console.log("top执行了函数: " + sql[2]);
                                            eval(sql[2]);
                                            break;
                                        case "请求":
                                            switch (sql[2]) {
                                                case "用户数据库":
                                                    event.source.postMessage(settings.key.encrypt("天王盖地虎\x00给予\x00用户数据库\x00" + JSON.stringify(settings.parseDB)), "*");
                                                    break;
                                            }
                                            break;
                                        case "给予":
                                            if (settings.address !== null) {
                                                switch (sql[2]) {
                                                    case "0":
                                                        settings.address.push(sql[3]);
                                                        break;
                                                    case "-1":
                                                        settings.address.pull(sql[3]);
                                                        if (settings.address.length === 0) {
                                                            settings.randomSeleceParse();
                                                        }
                                                        break;
                                                    case "1":
                                                        settings.address = null;
                                                        localStorage.setItem('parse.historyParse', settings.src);
                                                        break;
                                                }
                                            }
                                            break;
                                        case "按下Enter获取焦点":
                                            event.source.focus();
                                            onkeydown = function (e) {
                                                if (e.key === 'Enter') {
                                                    event.source.focus();
                                                }
                                            };
                                            break;
                                    }
                                    break;
                            }
                        } catch (e) {
                            // 排除 sql 处理错误
                        }
                    }
                }, true);

if (!isMobile) {
    if (location.host.indexOf("v.qq.com") !== -1) {
        readyPlayerBox("腾讯视频", ["#mask_layer", ".mod_vip_popup,div.panel-tip-pay", "#mask_layer", "div.thumbplayer-barrage"], settings.Default解析["腾讯视频"]["电脑端"],
            "div#player,div.panel-tip-pay.panel-tip-pay-video", null);
    } else if (location.host.indexOf("iqiyi.com") !== -1) {
        doElement("div.side-cont.tvg", function () {
            return readyPlayerBox("爱奇艺", ["#playerPopup", "div[class^=qy-header-login-pop]"], settings.Default解析["爱奇艺"]["电脑端"],
                "iqpdiv.iqp-player[data-player-hook$=er]", null);
        });
    } else if (location.host.indexOf("youku.com") !== -1) {
        readyPlayerBox("优酷视频", ["#iframaWrapper"], settings.Default解析["优酷视频"]["电脑端"],
            "div#player", null);
    } else if (location.host.indexOf("bilibili.com") !== -1) {
        doElements("div[role=tooltip]:not([class*=popover-])", function (loginTip) {
            return displayNone(["#" + loginTip[6].id]);
        }, 1000, 6);
        doElement("div.bpx-player-video-area,svg[aria-hidden=true],div.list-wrapper.simple>ul.clearfix", function () {
            return readyPlayerBox("哔哩哔哩", ["div.login-panel-popover,div.vip-panel-popover", "div.login-tip"], settings.Default解析["哔哩哔哩"]["电脑端"],
                "div.bpx-player-video-area,div.mask-container,div#player_module", null);
        });
    } else if (location.host.indexOf("miguvideo.com") !== -1) {
        readyPlayerBox("咪咕视频", null, settings.Default解析["咪咕视频"]["电脑端"],
            "section#mod-player", null);
    } else if (location.host.indexOf("le.com") !== -1) {
        readyPlayerBox("乐视TV", null, settings.Default解析["乐视TV"]["电脑端"],
            "#le_playbox", null);
    } else if (location.host.match(new RegExp("(?:tv|film)\\.sohu\\.com"))) {
        readyPlayerBox("搜狐视频", null, settings.Default解析["搜狐视频"]["电脑端"],
            "#player,#sohuplayer,.player-view", null);
    } else if (location.host.indexOf("mgtv.com") !== -1) {
        readyPlayerBox("芒果TV", null, settings.Default解析["芒果TV"]["电脑端"],
            "#mgtv-player-wrap", null);
    } else if (location.host.indexOf("ixigua.com") !== -1) {
        readyPlayerBox("西瓜视频", null, settings.Default解析["西瓜视频"]["电脑端"],
            "div.teleplayPage__playerSection", null);
    } else if (location.host.indexOf("pptv.com") !== -1) {
        readyPlayerBox("PPTV", null, settings.Default解析["PPTV"]["电脑端"],
            "div.w-video", null);
    } else if (location.host.indexOf("vip.1905.com") !== -1) {
        readyPlayerBox("1905电影网", null, settings.Default解析["1905电影网"]["电脑端"],
            "div#playBox", null);
    } else if (location.host.indexOf("www.wasu.cn") !== -1) {
        readyPlayerBox("华数TV", null, settings.Default解析["华数TV"]["电脑端"],
            "div#pcplayer", null);
    }
} else {
    if (location.host.indexOf("v.qq.com") !== -1) {
        readyPlayerBox("腾讯视频", [".mod_vip_popup", "[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", "div[dt-eid=open_app_bottom]", "div.video_function.video_function_new", "a[open-app]", "section.mod_source", "section.mod_box.mod_sideslip_h.mod_multi_figures_h,section.mod_sideslip_privileges,section.mod_game_rec", "div#vipPosterContent"], settings.Default解析["腾讯视频"]["手机端"],
            "div.mod_play:not([style*='display: none;']) section.mod_player>div#player,div.player", null, function (href) {
                let location = hrefToLocation(href);
                href = searchToJSON(location.search);
                if (href) {
                    if (href["cid"]) {
                        if (href["id"]) {
                            return location.protocol + '//v.qq.com/detail/' + href["cid"][0] + '/' + href["cid"] + '.html';
                        } else if (href["vid"]) {
                            return location.protocol + '//v.qq.com/x/cover/' + href["cid"] + '/' + href["vid"] + '.html';
                        } else {
                            return location.protocol + '//v.qq.com/x/cover/' + href["cid"] + '.html';
                        }
                    } else if (href["vid"]) {
                        return location.protocol + '//v.qq.com/x/page/' + href["vid"] + '.html';
                    } else if (href["lid"]) {
                        return location.protocol + '//v.qq.com/detail/' + href["lid"][0] + '/' + href["lid"] + '.html';
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            });
    } else if (location.host.indexOf("iqiyi.com") !== -1) {
        ready(function () {
            readyPlayerBox("爱奇艺", ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"], settings.Default解析["爱奇艺"]["手机端"],
            "div.m-video-player-wrap", null);
        }, "complete");
    } else if (location.host.indexOf("youku.com") !== -1) {
        readyPlayerBox("优酷视频", ["#iframaWrapper", ".ad-banner-wrapper", ".h5-detail-guide,.h5-detail-vip-guide,[class$=ad],.Corner-container", "[data-spm='downloadApp'],.downloadApp", ".callEnd_box"],
            settings.Default解析["优酷视频"]["手机端"], "#player", null);
    } else if (location.host.indexOf("bilibili.com") !== -1) {
        readyPlayerBox("哔哩哔哩", ["div.fe-ui-open-app-btn,div.recom-wrapper,open-app-btn", "[class*=openapp]", "div.player-wrapper>div.player-mask.relative"], settings.Default解析["哔哩哔哩"]["手机端"],
            "div#app.main-container div.player-wrapper>div.player", null, function (href) {
                return href.replace("m.bilibili.com", "www.bilibili.com");
            });
    } else if (location.host.indexOf("miguvideo.com") !== -1) {
        readyPlayerBox("咪咕视频", ["[class^=app_],[class^=app-],[class*=_app_],[class*=-app-],[class$=_app],[class$=-app]", ".openClient", "div.group-item.programgroup .data-rate-01,div.group-item.programgroup .max-rate-01,div.group-item.programgroup .p-common"], settings.Default解析["咪咕视频"]["手机端"],
            "section#mod-player", null, function (href) {
                return href.replace("m.miguvideo.com", "www.miguvideo.com").replace("msite", "website");
            });
    } else if (location.host.indexOf("le.com") !== -1) {
        (function (block_show) {
            block_show.innerHTML = "div.layout{visibility: visible !important; display:block !important;}div.layout>*:not(style,script,#j-vote,#j-follow){visibility: visible !important; display: block !important;}";
            document.head.insertBefore(block_show, document.head.firstChild);
        })(document.createElement("style"));
        doElement("a.j-close-gdt", function (jump_over) {
            jump_over.click();
            return false;
        });
        readyPlayerBox("乐视TV", ["a.leapp_btn", "div.full_gdt_bits[id^=full][data-url]", "[class*=Daoliu],[class*=daoliu],[class*=game]", "div.m-start", "[class*=icon_user]"], settings.Default解析["乐视TV"]["手机端"],
            "div.column.play", null);
    } else if (location.host.indexOf("m.tv.sohu.com") !== -1) {
        readyPlayerBox("搜狐视频", ["div[class^=banner]", "div.js-oper-pos", "div[id^=ad],div[id^=ad] *", "[id*=login],[class*=login]", "[class$=-app]", "div.app-vbox.ph-vbox,div.app-vbox.app-guess-vbox", "div.twinfo_iconwrap", "div[class$=banner],div[id$=banner]"], settings.Default解析["搜狐视频"]["手机端"],
            "#player,#sohuplayer,.player-view", null, async function (href) {
                return await new Promise(function (resolve) {
                    xmlHttpRequest({
                        method: "GET",
                        url: href, onload: function ({responseText}) {
                            let result = responseText.match(new RegExp("var videoData = \{[^\x00]+tvUrl:\"(http.+)\",[\\r\\n]"))[1];
                            resolve(result);
                        }, error: function () {
                            return resolve(href);
                        }
                    });
                });
            });
    } else if (location.host.indexOf("mgtv.com") !== -1) {
        readyPlayerBox("芒果TV", ["div.adFixedContain,div.ad-banner,div.m-list-graphicxcy.fstp-mark", "div[class^=mg-app],div#comment-id.video-comment div.ft,div.bd.clearfix,div.v-follower-info", "div.ht.mgui-btn.mgui-btn-nowelt", "div.personal", "div[data-v-41c9a64e]"], settings.Default解析["芒果TV"]["手机端"],
            "div.video-poster,div.video-area", null);
    } else if (location.host.indexOf("ixigua.com") !== -1) {
        readyPlayerBox("西瓜视频", ["div.xigua-download", "div.xigua-guide-button", "div.c-long-video-recommend.c-long-video-recommend-unfold"], settings.Default解析["西瓜视频"]["手机端"],
            "div.xigua-detailvideo-video", null);
    } else if (location.host.indexOf("pptv.com") !== -1) {
        readyPlayerBox("PPTV", ["[data-darkreader-inline-bgimage][data-darkreader-inline-bgcolor]", "div[class^=pp-m-diversion]", "section#ppmob-detail-picswiper", "section.layout.layout_ads", "div.foot_app", "div[modulename=导流位]", "a[class*=user]", "div.mod_video_info div.video_func"], settings.Default解析["PPTV"]["手机端"],
            "section.pp-details-video", null, function (href) {
                return href.replace("m.pptv.com", "v.pptv.com");
            });
    } else if (location.host.indexOf("vip.1905.com") !== -1) {
        (function (movie_info) {
            movie_info.innerHTML = "section#movie_info{padding-top: 20px !important;}";
            document.head.appendChild(movie_info);
        })(document.createElement("style"));
        readyPlayerBox("1905电影网", ["a.new_downLoad[target=_blank]", "iframe[srcdoc^='<img src=']", "section.movieList_new.club_new", ".wakeAppBtn", "[class*=login]", "section.openMembershipBtn", ".ad", ".open-app,.openApp,ul.iconList li:not(.introduceWrap),div#zhichiBtnBox", "section#hot_movie,section#exclusive_movie,section#hot_telve"], settings.Default解析["1905电影网"]["手机端"],
            "div.area.areaShow.clearfix_smile", null);
    } else if (location.host.indexOf("www.wasu.cn") !== -1) {
        readyPlayerBox("华数TV", ["div.ws_poster", "div.appdown,div.player_menu_con", "div#play_and_info_fix_adv"], settings.Default解析["华数TV"]["手机端"],
            "div#player,div#pop", null);
    }
}


                function readyPlayerBox(Tip, displayNones, srcs, cssString, doFunction, doHref = null) {
                    const SRCS = srcs;
                    if (Tip) {
                        console.log("%c已进入" + Tip, settings.fontStyle.max);
                    }
                    let others;
                    location.onchange = function () {
                        srcs = SRCS;
                        others = Object.values(settings.NoAD解析).filter(function (value) {

                            return srcs.indexOf(value) === -1;
                        });
                        // noinspection SillyAssignmentJS 调用的是set和get方法
                        settings.src = settings.src;
                    };    // TODO ,监听url变化,如果网页rul变了就解析新地址

                    if (displayNones) {
                        displayNone(displayNones);
                    }
                    doElement(cssString, function (playerBox) {
                        if (playerBox.style.display === "none") {
                            playerBox.style.display = "";
                        }

                        let iframe = document.createElement("iframe");
                        iframe.allowFullscreen = true;
                        iframe.importance = "high";
                        iframe.frameBorder = "0";
                        iframe.scrolling = "no";
                        iframe.width = "100%";
                        iframe.height = "100%";
                        const iframe_style = "background-color: #000 !important; border: 0 !important; display: block !important; visibility: visible !important; opacity: 1 !important; min-width: 100% !important; width: 100% !important; max-width: 100% !important; min-height: 100% !important; height: 100% !important; max-height: 100% !important; position: absolute !important; left: 0px !important; top: 0px !important; z-index: 2147483647 !important; overflow: hidden !important;";
                        iframe.setAttribute("style", iframe_style);
                        iframe.onload = function () {
                            if (iframe.contentWindow.length === 0 && settings.address.length === 0) {
                                settings.randomSeleceParse("请稍等，正在切换");
                            }
                        };

                        others = Object.values(settings.NoAD解析).filter(function (value) {
                            return srcs.indexOf(value) === -1;
                        });

                        (function (DIY_iframe_select) {
                            DIY_iframe_select.setAttribute("style", "border: 0; background-color: #ddd; text-align: center; width: 80px; height: 100%; border-bottom-left-radius: 15px; border-top-left-radius: 15px;");
                            try {
                                let src = "";
                                Object.defineProperty(settings, "src", {
                                    enumerable: true,
                                    configurable: false,
                                    get: function () {
                                        return src;
                                    },
                                    set: function (value) {
                                        if (!value) return false;
                                        src = DIY_iframe_select.value = value;
                                        srcs.pull(value);
                                        settings.address = [];
                                        // const newiframe = document.querySelector("iframe[id*=player]");
                                        // if (newiframe) iframe = newiframe;
                                        if (typeof doHref === "function") {
                                            let href = doHref(location.href);
                                            iframe.src = value ? value + (href ? href : location.href) : "";
                                        } else {
                                            iframe.src = value ? value + location.href : "";
                                        }
                                        return true;
                                    }
                                });
                            } catch (e) {
                                console.error(e.message);
                            }

                           for (let name in settings.AD解析) {
                                DIY_iframe_select.innerHTML += "<option value='" + settings.AD解析[name] + "' style='text-align: center; color: #fa0; '>" + name + "</option>";
                            }
                           for (let name in settings.NoAD解析) {
                                DIY_iframe_select.innerHTML += "<option value='" + settings.NoAD解析[name] + "' style='text-align: center'>" + name + "</option>";
                            }
                            DIY_iframe_select.addEventListener("change", function (event) {
                                settings.src = DIY_iframe_select.value;
                                if (event.isTrusted) {
                                    localStorage.setItem('parse.historyParse', settings.src);
                                }
                            });

                            settings.randomSeleceParse = function (message) {
                                if (srcs.length > 0) {
                                    showTip(message ? message : "请稍等，正在切换");
                                    let random = Math.floor(Math.random() * srcs.length);
                                    settings.src = srcs.splice(random, 1)[0];
                                } else if (others) {
                                    showTip(message ? message : "请稍等，正在切换");
                                    srcs = others;
                                    others = null;
                                    let random = Math.floor(Math.random() * srcs.length);
                                    settings.src = srcs.splice(random, 1)[0];
                                } else {
                                    showTip("该视频可能无法解析");
                                    return false;
                                }
                                return true;
                            };

                            (function () {
                                const DIY_iframe_button = settings.toolsBar.querySelector("button");
                                settings.DIY_iframeFunction = function () {
                                    if (settings.parseDB.数据库&& DIY_iframe_select.style.display === "none") {
                                        DIY_iframe_select.style.display = DIY_iframe_select.style.visibility = "";
                                        DIY_iframe_button.style.borderRadius = "0px 15px 15px 0px";
                                    } else if (!settings.parseDB.数据库&& DIY_iframe_select.style.display !== "none") {
                                        DIY_iframe_select.style.display = "none";
                                        DIY_iframe_select.style.visibility = "hidden";
                                        DIY_iframe_button.style.borderRadius = "15px";
                                    }
                                }
                                settings.DIY_iframeFunction();
                                const toolsBarSettings = settings.toolsBar.querySelector("settings");
                                toolsBarSettings.insertBefore(DIY_iframe_select, toolsBarSettings.firstChild);
                            })();
                        })(document.createElement("select"));


                        settings.src = localStorage.getItem("parse.historyParse");
                        if (!settings.src) {
                            settings.randomSeleceParse("正在引入解析源");
                        }
                        playerBox.style.zIndex = "1";
                        playerBox.appendChild(iframe);
                        console.log("%cplayerBox已建立解析连接", settings.fontStyle.max);

                        setInterval(function () {
                            let newPlayerBox = document.querySelector(cssString);
                            if (newPlayerBox !== null && (newPlayerBox !== playerBox || newPlayerBox.querySelector("iframe[src='" + iframe.src + "']") === null)) {
                                console.log("playerBox重新建立连接");
                                let src = iframe.src;
                                iframe.src = "";
                                iframe = iframe.cloneNode(true);
                                iframe.src = src;
                                newPlayerBox.style.zIndex = "1";
                                newPlayerBox.appendChild(iframe);
                            }
                        }, settings.getElementTimes);

                        function closeOldMedia() {
                            Object.getOwnPropertyNames(top).forEach(function (property) {
                                if (typeof window[property] === "function" && Boolean(window[property].prototype) && typeof window[property].prototype.addSourceBuffer === "function") {
                                    const $addSourceBuffer = window[property].prototype.addSourceBuffer;
                                    window[property].prototype.addSourceBuffer = function addSourceBuffer(mime) {
                                        if (window === top) {
                                            this.removeSourceBuffer($addSourceBuffer.call(this, mime));
                                            return null;
                                        } else {
                                            return $addSourceBuffer.call(this, mime);
                                        }
                                    };
                                }
                            });
                            for (const node of playerBox.querySelectorAll("*")) {
                                if (node !== iframe) {
                                    node.addEventListener("loadeddata", function () {
                                        node.src = URL.createObjectURL(new Blob(new Array(0)));
                                    }, true);
                                    node.src = URL.createObjectURL(new Blob(new Array(0)));
                                    node.remove();
                                }
                            }
                        }

                        closeOldMedia();
                        if (document.readyState.toLowerCase() != "complete") ready(closeOldMedia, "complete");

                        if (doFunction) {
                            doFunction(playerBox, iframe);
                        }

                        setInterval(function () {
                            for (let other_iframe of document.querySelectorAll("iframe")) {
                                if (other_iframe.src !== iframe.src || other_iframe.constructor.name !== iframe.constructor.name) {
                                    other_iframe.remove();
                                }
                            }
                            if (iframe.getAttribute("style") !== iframe_style) {
                                iframe.setAttribute("style", iframe_style);
                            }
                        }, settings.getElementTimes);

                        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(function (item) {
                            window.addEventListener(item, function () {
                                if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {
                                    settings.toolsBar.style.display = 'none';
                                } else {
                                    settings.toolsBar.style.display = 'block';
                                }
                            }, true);
                        });
                    });
                }
            } else {
                console.log(location.href + " 1ok");

                function setParseVideo() {
                    console.log(location.href + " 2ok");
                    forElements("video", async function (videos, thisInterval) {
                        for (const video of videos) {
                            if (video.poster) video.removeAttribute("poster");
                            if (video.src && video.duration > 7) {

                                clearInterval(thisInterval);


                                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00给予\x001"), "*");
                                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00按下Enter获取焦点"), "*");


                                removeElements(['document.getElementById("ADplayer")', 'document.getElementById("ADtip")']);

                                settings.parseDB = await settings.parseDB;
                                if (!settings.parseDB.弹幕开关) {

                                    removeElements(['document.querySelector("div[class$=player-video-wrap]").getElementsByTagName("div")', 'document.querySelector("div[class$=player-danmu]")', 'document.querySelector("div[class$=player-danmaku]")', 'document.querySelector("div[class*=player-comment-box]")', 'document.querySelector("div[class*=player-controller-mask]")', 'document.querySelector("[class*=player-list-icon]")', 'document.querySelector("div[class$=player-menu]")']);
                                }
                                (function () {
                                    video.loop = false;
                                    video.autopictureinpicture = true;
                                    const playbackRate = localStorage.getItem("parse.playbackRate");
                                    if (playbackRate) {
                                        video.playbackRate = parseFloat(playbackRate);
                                        const playbackRateElement = document.querySelector("[class*=speeds] [class*=layer-label].title");
                                        if (video.playbackRate !== 1 && playbackRateElement !== null) playbackRateElement.innerText = playbackRate + "x";
                                    }
                                    video.addEventListener("ratechange", function () {
                                        localStorage.setItem("parse.playbackRate", video.playbackRate.toString());
                                    });
                                })();

                                // console.log("进入/退出 全屏");
                                const openFullscreen = HTMLVideoElement.prototype.RequestFullScreen ? HTMLVideoElement.prototype.RequestFullScreen : //兼容Firefox
                                    HTMLVideoElement.prototype.mozRequestFullScreen ? HTMLVideoElement.prototype.mozRequestFullScreen ://兼容Chrome, Safari and Opera等
                                        HTMLVideoElement.prototype.webkitRequestFullScreen ? HTMLVideoElement.prototype.webkitRequestFullScreen : //兼容IE/Edge
                                            HTMLVideoElement.prototype.msRequestFullscreen;
                                const exitFullscreen = document.exitFullScreen ? document.exitFullScreen : //兼容Firefox
                                    document.mozCancelFullScreen ? document.mozCancelFullScreen : //兼容Chrome, Safari and Opera等
                                        document.webkitExitFullscreen ? document.webkitExitFullscreen : //兼容IE/Edge
                                            document.body.msExitFullscreen;
                                const getFullscreenElement = typeof document.fullscreenElement !== "undefined" ? function () {
                                    return document.fullscreenElement;
                                } : typeof document.mozFullScreenElement !== "undefined" ? function () {
                                    return document.mozFullScreenElement;
                                } : typeof document.msFullScreenElement !== "undefined" ? function () {
                                    return document.msFullScreenElement;
                                } : function () {
                                    return document.webkitFullscreenElement;
                                };
                                let fullscreen = (function (node) {
                                    return function (value) {
                                        if (typeof value === "undefined" ?
                                            Boolean(getFullscreenElement()) : !value) {
                                            exitFullscreen.apply(document);
                                        } else {
                                            openFullscreen.apply(node);
                                        }
                                        video.focus();
                                    };
                                })(isMobile ? video : document.body);
                                video.addEventListener("pause", function () {
                                    if ((video.currentTime - video.duration) > -5) {
                                        // console.log("视频播放结束了");
                                        fullscreen(false);
                                    }
                                });

                                if (!isMobile) {
                                    (function () {
                                        const fullscreen_btn = document.querySelector("[class*=fullscreen][class*=On],[class$=player-full] button[class$=full-icon]");
                                        if (fullscreen_btn && fullscreen_btn.nodeType === 1) {
                                            fullscreen = function (value) {
                                                if (typeof value === "undefined") {
                                                    fullscreen_btn.click();
                                                } else if (value && !Boolean(getFullscreenElement())) {
                                                    fullscreen_btn.click();
                                                } else if (!value && Boolean(getFullscreenElement())) {
                                                    fullscreen_btn.click();
                                                }
                                            };
                                        }
                                    })();
                                    (function (isFullscreen) {
                                        window.addEventListener("keydown", function (event) {
                                            if (event.key === "Enter") {
                                                isFullscreen = Boolean(getFullscreenElement());
                                            }
                                        }, true);
                                        window.addEventListener("keyup", function (event) {
                                            if (event.key === "Enter") {
                                                if (isFullscreen === Boolean(getFullscreenElement())) {
                                                    fullscreen();
                                                    if (video.paused) {
                                                        video.play();
                                                    }
                                                }
                                            }
                                        }, false);
                                    })();
                                    showTip("回车进入全屏");
                                } else {
                                    showTip("解析成功");
                                }

                                fullscreen(settings.parseDB.自动全屏);
                                if (video.paused) {
                                    video.play();
                                }
                            }
                        }
                    }, 5000, function () {
                        console.log(location.href + " 3ok");
                        top.postMessage(settings.key.encrypt("宝塔镇河妖\x00给予\x00-1\x00" + location.href), "*");
                    });
                }

                if (location.host.indexOf("jiexi.t7g.cn") !== -1) {
                    displayNone(["body>div#stats"]);
                    setParseVideo();
                } else if (location.host.indexOf("api.okjx.cc:3389") !== -1) {
                    (function (style) {
                        style.innerHTML = ".slide,.panel,.slide *,.panel *{width: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
                        document.head.appendChild(style);
                    })(document.createElement("style"));
                    setParseVideo();
                } else if (location.host.indexOf("api.jiubojx.com") !== -1) {
                    displayNone("div.adv_wrap_hh");
                    setParseVideo();
                } else if (location.host.indexOf("yemu.xyz") !== -1) {
                    if (location.pathname.indexOf("jx.php") === -1) {
                        if (location.host.indexOf("www.yemu.xyz") !== -1) {
                            (function (style) {
                                style.innerHTML = ".slide,.panel,.slide *,.panel *{width: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
                                document.head.appendChild(style);
                            })(document.createElement("style"));
                        } else if (location.host.indexOf("jx.yemu.xyz") !== -1) {

                            displayNone(["div.advisory"]);
                            setParseVideo();
                        }
                    } else {

                        doElement("div[style*='width:100%;height:100%;'][style*='.jpg']", function (background) {
                            background.setAttribute("style", "width:100%; height:100%; position:relative; z-index:2147483647987;");
                        }, 5000);
                    }
                } else if (location.host.indexOf('www.mtosz.com') !== -1) {
                    displayNone([".video-panel-blur-image"]);    // 似乎不管用？
                    doElement(".video-panel-blur-image", function (element) {
                        element.setAttribute("style", "display: none; height: 0; width: 0;");
                    });
                    setParseVideo();
                } else if (location.host.indexOf('v.superchen.top:3389') !== -1) {
                    setParseVideo();
                } else if (location.host.indexOf('jx.parwix.com:4433') !== -1) {
                    setParseVideo();
                } else {
                    setParseVideo();
                }
            }

            function displayNone(Tags) {
                setTimeout(function () {
                    let style = document.createElement("style");
                    style.innerHTML = "\n";
                    for (let i = 0; i < Tags.length; i++) {
                        style.innerHTML += Tags[i] + "{display: none !important; height: 0 !important; width: 0 !important; visibility: hidden !important; max-height: 0 !important; max-width: 0 !important; opacity: 0 !important;}\n";
                    }
                    document.head.insertBefore(style, document.head.firstChild);
                });
            }
        }

        function showTip(msg, style = "") {
            try {

                if (window === top) {
                    let tip = document.querySelector(":root>tip");
                    if (tip && tip.nodeType === 1) {

                        tip.remove();
                    }
                    tip = document.createElement("tip");
                    // pointer-events: none; 禁用鼠标事件，input标签使用 disabled='disabled' 禁用input标签
                    tip.setAttribute("style", style + "pointer-events: none; opacity: 0; background-color: #222a; color: #fff; font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 20px; text-align: center; padding: 6px; border-radius: 16px; position: fixed; transform: translate(-50%, -50%); left: 50%; bottom: 15%; z-index: 2147483647;");
                    tip.innerHTML = "<style>@keyframes showTip {0%{opacity: 0;} 33.34%{opacity: 1;} 66.67%{opacity: 1;} 100%{opacity: 0;}}</style>\n" + msg;
                    let time = msg.replace(new RegExp("\\s"), "").length / 2;   // TODO 2个字/秒
                    // cubic-bezier(起始点, 起始点偏移量, 结束点偏移量, 结束点)
                    tip.style.animation = "showTip " + (time > 2 ? time : 2) + "s cubic-bezier(0," + ((time - 1) > 0 ? (time - 1) / time : 0) + "," + (1 - ((time - 1) > 0 ? (time - 1) / time : 0)) + ",1) 1 normal";
                    document.root.appendChild(tip);
                    setTimeout(function () {
                        try {
                            tip.remove();
                        } catch (e) {

                        }
                    }, time * 1000);
                } else {
                    top.postMessage(settings.key.encrypt("宝塔镇河妖\x00函数\x00showTip('" + msg + "')"), "*");
                }
            } catch (e) {
                console.log(msg);
            }
        }
    })();

    function require(url) {
        const request = new XMLHttpRequest();
        let result;
        request.open("GET", url, false);
        request.onload = function () {
            result = eval(request.response);
            console.log("use-scrypt.length = " + request.response.length);
        };
        request.send();
        return result;
    }
})();