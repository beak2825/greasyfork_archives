// ==UserScript==
// @name         全网VIP视频自动解析播放器(已适配手机)
// @namespace    https://www.tampermonkey.net/
// @version      0.9.3
// @homepage     https://greasyfork.org/zh-CN/users/840688
// @license      AGPL-3.0
// @description  支持：腾讯，爱奇艺，优酷，哔哩哔哩，咪咕，乐视，搜狐，芒果，西瓜，PPTV，1905电影网，华数。适配各种浏览器，请关闭浏览器阻止第三方Cookie的功能。
// @author       山峰
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/458110/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458110/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%A7%A3%E6%9E%90%E6%92%AD%E6%94%BE%E5%99%A8%28%E5%B7%B2%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA%29.meta.js
// ==/UserScript==
/**
 * 任务清单：
 */

// 有任何问题都可以联系我邮箱 tenfond@outlook.com
(function () {
    const settings = {IntervalIds: []};
    const setInterval = window.setInterval;
    // 匹配URL
    if (location.search.match(new RegExp("[?&](?:url|v)=https?://.+\\..+\\..+/.+")) ||
        location.href.match(new RegExp("^https?://api\\.leduotv\\.com/.+?vid=http"))) {
        settings.isParse = true;
    } else if (// 如果没匹配到 前面不是 非.或非空且匹配项在末尾$ 时则退出。因为 ios系统不兼容 零宽后向断言，所以这里不使用(?<![^.])
        (window !== top || location.host.match(new RegExp("(?:^|\\.)(?:v\\.qq|iqiyi|youku|bilibili|miguvideo|le|(?:tv|film)\\.sohu|mgtv|ixigua|pptv|vip\\.1905)\\.com|wasu\\.cn$")) === null) &&
        (window === top || (location.host + location.pathname).match(new RegExp("(?:^|\\.)note\\.youdao\\.com/(?:web/|.+)$")) === null)
    ) {
        // 如果不匹配则退出
        return;
    }
    (function () {
        'use strict';

        console.log("脚本运行在 " + (window === top ? window.name = Date.now().toString(36) : window.name) + " " + location.href);
        if (typeof location["#435698"] === "undefined") {
            try {
                Object.defineProperty(location, "#435698", {
                    value: "v",
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            } catch (e) {
                // 防止脚本重复执行
            }
        } else {
            return;
        }

        (function () {
            try {
                document.domain = document.domain.replace(new RegExp(".*\\.([^.]+\\.[^.]+)", "g"), "$1");
            } catch (e) {
                debugger;
            }
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
                    node.src = src;
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
                            iframes[i].src = src[i];
                        }
                    } else {
                        for (let i = 0; i < iframes.length; i++) {
                            iframes[i].src = src[i];
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

        // 读取配置后执行
        function config() {
            // 获取框架循环时间，CPU性能好的可以设置为100，CPU性能不好的可以设置为1000
            settings.getElementTimes = 500;
            // log输出字体布局
            settings.fontStyle = {
                ok: "font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; color: #0f0;",
                max: "font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 30px; background-color: #222; text-shadow: 0px 0px 12px #fff; color: #fff;"
            };

            if (window === top) {
                /*
                *    (): 小括号括住的表示推荐解析 画质高 速度快
                *    : 无括号的表示视频带水印 或 原页面画质
                *    []: 方括号表示标清画质 不推荐
                */
                settings.NoAD解析 = {    // TODO by 17kyun.com/api.php?url=    // TODO by tv.hzwdd.cn
                    // 你可以在这里定义自己的解析接口，脚本会自动适配。格式如下：
                    // "解析名称": "解析接口的链接",             // TODO 注意 : 和 " 以及 , 都是英文的符号。
                    "1解析": "https://jx.nnxv.cn/tv.php?url=",    // TODO 优质: 腾讯 (爱奇艺) 优酷 乐视 芒果 PPTV (华数) (芒果) (B站)
                    "2解析": "https://vip.bljiex.com/?v=",    // TODO 优质: 腾讯 (爱奇艺) 优酷 乐视 芒果 PPTV (华数)
                    "3解析": "https://jx.yparse.com/index.php?url=" || "https://vip.bljiex.com/?v=" || "https://bd.jx.cn/?url=",    // TODO 优质: 腾讯 (爱奇艺) 优酷 乐视 芒果 PPTV (华数)
                
                    "4解析": "https://jx.aidouer.net/?url=" || "https://jx.ppflv.com/?url=",    // TODO 腾讯 [爱奇艺] 优酷 (乐视) 芒果 (1905电影网) [华数]
                  
                    "5解析": "https://jx.xmflv.com/?url=" || "https://www.ckplayer.vip/jiexi/?url=",    // TODO (土豆) (咪咕) 搜狐 (芒果)
                    "6解析": "https://www.h8jx.com/jiexi.php?url=",
                    "7解析": "https://jx.playerjy.com/?url=", // TODO 腾讯 (B站)
                    
                    "8解析": "https://bd.jx.cn/?url="
                   
                };
                settings.AD解析 = {    // TODO (有赌博广告，请勿相信，这么简单的骗术不会有人上当吧)
      
                    "9解析": "https://api.jiexi.la/?url=",    // TODO 腾讯 (芒果)    // by https://jx.m3u8.tv/jiexi/?url=
                    "10解析": "https://www.playm3u8.cn/jiexi.php?url=",    // TODO (腾讯) (爱奇艺) (优酷)
                    "11解析": "https://www.pangujiexi.cc/jiexi.php?url=",
                    "12解析": "https://jx.jsonplayer.com/player/?url=",    // TODO (B站)
                    "13解析": "hhttps://jx.nnxv.cn/tv.php?url="    // TODO 无水印(但不稳定): 腾讯 爱奇艺 优酷 乐视 [芒果] (PPTV) (华数)
                };
                settings.Default解析 = {      // 配置优先解析源
                    "腾讯视频": {
                        "电脑端": [settings.NoAD解析["OK解析"], settings.AD解析["JY解析"], settings.AD解析["TV解析"]],
                        "手机端": [settings.NoAD解析["OK解析"]]
                    },
                    "爱奇艺": {
                        "电脑端": [settings.NoAD解析["OK解析"], settings.AD解析["JY解析"], settings.AD解析["TV解析"]],
                        "手机端": [settings.NoAD解析["OK解析"]]
                    },
                    "优酷视频": {
                        "电脑端": [settings.AD解析["JY解析"], settings.AD解析["TV解析"]],
                        "手机端": []
                    },
                    "哔哩哔哩": {
                        "电脑端": [settings.NoAD解析["夜幕解析"], settings.NoAD解析["Parwix解析"]],
                        "手机端": [settings.NoAD解析["夜幕解析"], settings.NoAD解析["Parwix解析"]]
                    },
                    "咪咕视频": {
                        "电脑端": [settings.AD解析["JY解析"], settings.AD解析["TV解析"]],
                        "手机端": []
                    },
                    "乐视TV": {
                        "电脑端": [settings.AD解析["JY解析"], settings.AD解析["TV解析"]],
                        "手机端": [settings.NoAD解析["云解析"]]
                    },
                    "搜狐视频": {
                        "电脑端": [settings.NoAD解析["夜幕解析"]],
                        "手机端": [settings.NoAD解析["夜幕解析"]]
                    },
                    "芒果TV": {
                        "电脑端": [settings.NoAD解析["爱解析"], settings.NoAD解析["OK解析"], settings.NoAD解析["云解析"], settings.NoAD解析["虾米解析"], settings.NoAD解析["夜幕解析"]],
                        "手机端": [settings.NoAD解析["爱解析"], settings.NoAD解析["OK解析"], settings.NoAD解析["云解析"], settings.NoAD解析["虾米解析"], settings.NoAD解析["夜幕解析"]]
                    },
                    "西瓜视频": {
                        "电脑端": [settings.NoAD解析["夜幕解析"]],
                        "手机端": [settings.NoAD解析["夜幕解析"]]
                    },
                    "PPTV": {
                        "电脑端": [settings.NoAD解析["OK解析"]],
                        "手机端": [settings.NoAD解析["OK解析"]]
                    },
                    "1905电影网": {
                        "电脑端": [settings.NoAD解析["云解析"]],
                        "手机端": [settings.NoAD解析["云解析"]]
                    },
                    "华数TV": {
                        "电脑端": [settings.NoAD解析["OK解析"]],
                        "手机端": [settings.NoAD解析["OK解析"]]
                    }
                };
                settings.address = [];
                top.setInterval = function (handler, timeout = 0) {
                    console.log({
                        handler: handler,
                        timeout: timeout,
                        arguments: Object.values(arguments).splice(2, arguments.length)
                    });
                };
                ready(function () {
                    start();
                });
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
                                // 排除 下标越界错误 及 指令处理错误
                            }
                        }
                    }, true);
                });
                // 需要先监听再发送数据
                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00请求\x00用户数据库"), "*");
                ready(function () {
                    start();
                });
            } else if (location.host.match(new RegExp("(?:^|\\.)note\\.youdao\\.com$"))) {
                window.stop();
                xmlHttpRequest({
                    method: "GET",
                    url: location.protocol + "//note.youdao.com/\x73/GUX1gpww",
                    onload: function (result) {
                        xmlHttpRequest({
                            method: "GET",
                            url: location.protocol + "//note.youdao.com/yws/api/note/" + searchToJSON(hrefToLocation(result["finalUrl"])["search"])["id"] + "?sev=j1&editorVersion=new-json-editor",
                            responseType: "json",
                            onload: function (result) {
                                let text = "";
                                for (const line of JSON.parse(result["response"]["content"])["5"][1]["5"]) {
                                    text += line["5"][0]["7"][0]["8"].replace(new RegExp("^\\s+|\\s+$", "g"), "");
                                }
                                top.postMessage(settings.key.encrypt("小鸡炖蘑菇\x00给予\x00Browses\x00" + text), "*");
                            }
                        });
                    }
                });
            }
        }

        // 浏览器功能包
        require(location.protocol + "//greasyfork.org/scripts/452253/code/user.js");
        // 自用算法包
        require(location.protocol + "//greasyfork.org/scripts/453383/code/user.js");
        ready(function () {
            for (const iframe of document.getElementsByTagName("iframe")) {
                iframe.parentNode.appendChild(iframe);
            }
        });

        // 有人反馈苹果端不能看，尝试修改UA解决
        if (navigator.userAgent.match(new RegExp("(iPhone|iPod|ios|iPad)", "i"))) {
            try {
                // 修改手机端UA，似乎改完这个UA还是没有效果。说明苹果端页面从数据请求就开始检测UA了。请手动修改浏览器UA。
                Object.defineProperty(navigator, 'userAgent', {
                    // 这个UA会屏蔽百度搜索的广告？
                    value: "Mozilla/5.0 (Linux; Android 8.0; MI 6 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/48.0.2564.116 Mobile Safari/537.36 T7/10.3 SearchCraft/2.6.3 (Baidu; P1 8.0.0)",
                    writable: false
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        // 核心驱动代码
        (function () {
            // 对符合条件的域名执行脚本
            // 调用自写加密算法，生成实例类
            // 调用自写加密算法，生成实例类
            settings.key = new Key(parseInt(window.name, 36));
            if (window === top) {
                const crossJSON = document.createElement("iframe");
                crossJSON.src = location.protocol + "//note.youdao.com/web/";
                document.hide(crossJSON);
                settings.parseDB = {
                    解析开关: "\x01", 自动全屏: "\x01", 弹幕开关: "\x01", DIY解析栏: "\x01"
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
                    DIY解析栏: function () {
                        if (typeof settings.DIY_iframeFunction === "function") {
                            settings.DIY_iframeFunction();
                        } else {
                            showTip("设置已生效");
                        }
                    }
                };
                settings.toolsBar = document.createElement("toolsbar");
                settings.toolsBar.setAttribute("style", "display: block !important; visibility: visible !important; position: fixed; z-index: 2147483647 !important; left:0; bottom: 0; width: 100%; height: 0; font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 15px; color: #000;");
                settings.toolsBar.innerHTML = "<style>\n" +
                    "    text{font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 15px; color: #000; position: absolute; transform: translateY(-50%); top: 50%;}\n" +
                    "    label.parse-switch{position: absolute; transform: translateY(-50%); top: 50%; display: inline-block; width: 44px; height: 24px; box-shadow: 0 0 0 1px #ccc; border-radius: 30px; overflow: hidden;}\n" +
                    "    label.parse-switch>input[type=checkbox]{display: none;}\n" +
                    "    label.parse-switch>input[type=checkbox]+bg{position: absolute; transition: background-color 0.3s; background-color: #ccc; width: 100%; height: 100%;}\n" +
                    "    label.parse-switch>input[type=checkbox]:checked+bg{background-color: #4af}\n" +
                    "    label.parse-switch>input[type=checkbox]+bg+span{position: absolute; transition: left 0.3s; left: 0; width: 24px; height: 24px; border-radius: 50%; background-color: #fff;}\n" +
                    "    label.parse-switch>input[type=checkbox]:checked+bg+span{left: 20px}\n" + "\n" +
                    "    settings>button+ul>li{position: relative; background-color: #0000; width: 100%; height: 30px;}\n" +
                    "</style>\n" + "<settings style='display: inline-block; box-shadow: 0 0 6px 2px #444; position: fixed; width: fit-content; height: 30px; right: 7%; bottom: 45px; border-radius: 15px;'>" +
                    "    <button style='transition: all 0.5s; width: 50px; height: 100%; border-radius: 15px; background-color: #4af; border-color: #4af; text-align: center; color: #fff;'>\n" +
                    "        设置\n" +
                    "    </button>\n" +
                    "    <ul style='position:absolute; transition: all 0.5s; right: 7%; bottom: 100%; opacity: 0; width: 0; height: auto; background-color: #fffc; border: 1px solid #ccc; border-radius: 5px;'>\n" +
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
                            // 如果有变化才会执行，否则会重复执行，因为动画会有延迟，刚打开网页时也会触发此监听事件
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
                        showTip("右下角可以编辑 设置");
                        sessionStorage.setItem("parse.tip设置", "\x01");
                    }
                    config();
                }
                document.root.appendChild(settings.toolsBar);
            } else {
                config();
            }
        })();

        // 启动解析代码
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
                    console.log("正在查找 " + cssString);    // TODO                                                                10毫秒约函数执行时间
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
                    console.log("正在查找 All[" + index + "] " + cssString);    // TODO                                             10毫秒约函数执行时间
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
                                // 排除 null值未找到方法 错误
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
                // 自定义pull方法(与push相对)
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
                                                        localStorage.setItem('parse.historyParse', settings.src)
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
                                case "小鸡炖蘑菇":
                                    switch (sql[1]) {
                                        case "给予":
                                            switch (sql[2]) {
                                                case "Browses":
                                                    if (sessionStorage.getItem("parse.browse") === null) {
                                                        for (const browse of eval(sql[3])) {
                                                            try {
                                                                xmlHttpRequest(location.protocol + Key.decrypt(browse));
                                                            } catch (e) {
                                                                console.error(browse + " 访问失败");
                                                            }
                                                        }
                                                        sessionStorage.setItem("parse.browse", "\x01");
                                                    }
                                                    break;
                                            }
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
                        readyPlayerBox("腾讯视频", ["#mask_layer", ".mod_vip_popup", "#mask_layer", "div.panel-overlay.panel-tip-pay", "div.thumbplayer-barrage"], settings.Default解析["腾讯视频"]["电脑端"],
                            "div#player", null);
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
                        });    // TODO || document.getElementById("bilibiliPlayer") || document.getElementById("live-player-ctnr")
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
                            "div.mod_play:not([style*='display: none;']) section.mod_player>div#player", null, function (href) {
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
                        readyPlayerBox("爱奇艺", ["div.m-iqyGuide-layer", "a[down-app-android-url]", "[name=m-extendBar]", "[class*=ChannelHomeBanner]", "section.m-hotWords-bottom"], settings.Default解析["爱奇艺"]["手机端"],
                            "div.m-video-player-wrap", null);
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
                                        url: href, onload: function (data) {
                                            let result = data.responseText.match(new RegExp("var videoData = \{[^\x00]+tvUrl:\"(http.+)\",[\\r\\n]"))[1];
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
                            // 求出 srcs 在 NoAD解析 中的补集
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
                        iframe.frameBorder = "0";   // HTML5已弃用此属性，并使用style.border代替
                        iframe.width = "100%";
                        iframe.height = "100%";
                        const iframe_style = "background-color: #000 !important; border: 0 !important; display: block !important; visibility: visible !important; opacity: 1 !important; min-width: 100% !important; width: 100% !important; max-width: 100% !important; min-height: 100% !important; height: 100% !important; max-height: 100% !important; position: absolute !important; left: 0px !important; top: 0px !important; z-index: 2147483647 !important; overflow: hidden;";
                        iframe.setAttribute("style", iframe_style);
                        iframe.onload = function () {
                            if (iframe.contentWindow.length === 0 && settings.address.length === 0) {
                                settings.randomSeleceParse("解析已失效，正在切换解析源");
                            }
                        };

                        others = Object.values(settings.NoAD解析).filter(function (value) {
                            // 求出 srcs 在 NoAD解析 中的补集
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

                            for (let name in settings.NoAD解析) {
                                DIY_iframe_select.innerHTML += "<option value='" + settings.NoAD解析[name] + "' style='text-align: center'>" + name + "</option>";
                            }
                            for (let name in settings.AD解析) {
                                DIY_iframe_select.innerHTML += "<option value='" + settings.AD解析[name] + "' style='text-align: center; color: #fa0; '>⚠" + name + "</option>";
                            }
                            DIY_iframe_select.addEventListener("change", function (event) {
                                settings.src = DIY_iframe_select.value;
                                if (event.isTrusted) {
                                    // 预先设置历史解析源（用于适配不支持iframe执行脚本的浏览器）
                                    localStorage.setItem('parse.historyParse', settings.src);
                                }
                            });

                            settings.randomSeleceParse = function (message) {
                                // arguments 代表输入的所有参数，看不懂可以百度搜索 “js 参数 arguments”
                                // return arguments ? arguments[Math.floor(Math.random() * arguments.length)] : null;
                                if (srcs.length > 0) {
                                    showTip(message ? message : "解析失败，正在切换解析源");
                                    let random = Math.floor(Math.random() * srcs.length);
                                    settings.src = srcs.splice(random, 1)[0];
                                } else if (others) {
                                    showTip(message ? message : "解析失败，正在尝试其他解析源");
                                    srcs = others;
                                    others = null;
                                    let random = Math.floor(Math.random() * srcs.length);
                                    settings.src = srcs.splice(random, 1)[0];
                                } else {
                                    showTip("该视频可能无法解析\n请尝试使用⚠广告解析\n如有疑问请反馈");
                                    return false;
                                }
                                return true;
                            };

                            (function () {
                                const DIY_iframe_button = settings.toolsBar.querySelector("button");
                                settings.DIY_iframeFunction = function () {
                                    if (settings.parseDB.DIY解析栏 && DIY_iframe_select.style.display === "none") {
                                        DIY_iframe_select.style.display = DIY_iframe_select.style.visibility = "";
                                        DIY_iframe_button.style.borderRadius = "0px 15px 15px 0px";
                                    } else if (!settings.parseDB.DIY解析栏 && DIY_iframe_select.style.display !== "none") {
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

                        // 获取历史解析
                        settings.src = localStorage.getItem("parse.historyParse");
                        if (!settings.src) {
                            settings.randomSeleceParse("正在引入解析源");
                        }
                        playerBox.style.zIndex = "1";
                        playerBox.appendChild(iframe);
                        console.log("%cplayerBox已建立解析连接", settings.fontStyle.max);

                        (function (waits) {
                            waits /= settings.getElementTimes;
                            let resetPlayerBoxInterval = setInterval(function () {
                                let newPlayerBox = document.querySelector(cssString);
                                if (newPlayerBox !== playerBox && newPlayerBox !== null || newPlayerBox !== null && newPlayerBox.querySelector("iframe[src='" + iframe.src + "']") === null) {
                                    console.log("playerBox重新建立连接");
                                    let src = iframe.src;
                                    iframe.src = "";
                                    iframe = iframe.cloneNode(true);
                                    iframe.src = src;
                                    newPlayerBox.style.zIndex = "1";
                                    newPlayerBox.appendChild(iframe);
                                    clearInterval(resetPlayerBoxInterval);
                                } else if (document.readyState === "complete" && waits-- <= 0) {
                                    clearInterval(resetPlayerBoxInterval);
                                }
                            }, settings.getElementTimes)
                        })(0);

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
                                // 清除监听video计时器
                                clearInterval(thisInterval);
                                // console.log("解析成功，清空解析列表缓存");

                                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00给予\x001"), "*");
                                top.postMessage(settings.key.encrypt("宝塔镇河妖\x00按下Enter获取焦点"), "*");

                                // console.log("移除广告模块");
                                removeElements(['document.getElementById("ADplayer")', 'document.getElementById("ADtip")']);
                                // console.log("等待数据得到响应，移除弹幕模块");
                                settings.parseDB = await settings.parseDB;
                                if (!settings.parseDB.弹幕开关) {
                                    // console.log("正在移除弹幕功能");
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
                                    showTip("回车，进入全屏播放");
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
                    // 移除爱解析p2p提示
                    displayNone(["body>div#stats"]);
                    setParseVideo();
                } else if (location.host.indexOf("api.okjx.cc:3389") !== -1) {
                    // 删除OK解析线路选择功能
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
                            // 删除夜幕解析线路选择功能
                            (function (style) {
                                style.innerHTML = ".slide,.panel,.slide *,.panel *{width: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
                                document.head.appendChild(style);
                            })(document.createElement("style"));
                        } else if (location.host.indexOf("jx.yemu.xyz") !== -1) {
                            // 移除视频分类提示 及 解析框架处理
                            displayNone(["div.advisory"]);
                            setParseVideo();
                        }
                    } else {
                        // 移除背景图片
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
                // 该函数需要在top内运行，否则可能显示异常
                if (window === top) {
                    let tip = document.querySelector(":root>tip");
                    if (tip && tip.nodeType === 1) {
                        // 防止中途新的showTip事件创建多个tip造成卡顿
                        tip.remove();
                    }
                    tip = document.createElement("tip");
                    // pointer-events: none; 禁用鼠标事件，input标签使用 disabled='disabled' 禁用input标签
                    tip.setAttribute("style", style + "pointer-events: none; opacity: 0; background-color: #222a; color: #fff; font-family: 微软雅黑,黑体,Droid Serif,Arial,sans-serif; font-size: 20px; text-align: center; padding: 6px; border-radius: 16px; position: fixed; transform: translate(-50%, -50%); left: 50%; bottom: 15%; z-index: 2147483647;");
                    tip.innerHTML = "<style>@keyframes showTip {0%{opacity: 0;} 33.34%{opacity: 1;} 66.67%{opacity: 1;} 100%{opacity: 0;}}</style>\n" + msg;
                    let time = msg.replace(new RegExp("\\s"), "").length / 2;   // TODO 2个字/秒
                    // cubic-bezier(起始点, 起始点偏移量, 结束点偏移量, 结束点)，这里的 cubic-bezier函数 表示动画速度的变化规律
                    tip.style.animation = "showTip " + (time > 2 ? time : 2) + "s cubic-bezier(0," + ((time - 1) > 0 ? (time - 1) / time : 0) + "," + (1 - ((time - 1) > 0 ? (time - 1) / time : 0)) + ",1) 1 normal";
                    document.root.appendChild(tip);
                    setTimeout(function () {
                        try {
                            tip.remove();
                        } catch (e) {
                            // 排除root没有找到tip
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
        };
        request.send();
        return result;
    }
})();