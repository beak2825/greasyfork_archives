// ==UserScript==
// @name         [ADM]更丰富的B站弹幕管理功能（去除B站彩色弹幕样式）
// @namespace    http://www.tampermonkey.com/
// @namespace    https://greasyfork.org/zh-CN/scripts/467997
// @version      Alpha1.03
// @description  (Advanced_Bilibili_Danmaku_Manager)目前支持的功能：去除B站彩色弹幕样式
// @author       Tinyblack_QvQ
// @license      GPL-3.0
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/bangumi/play/ep*
// @match        *://www.bilibili.com/bangumi/play/ss*
// @match        *://www.bilibili.com/cheese/play/ep*
// @match        *://www.bilibili.com/cheese/play/ss*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/467997/%5BADM%5D%E6%9B%B4%E4%B8%B0%E5%AF%8C%E7%9A%84B%E7%AB%99%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD%EF%BC%88%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/467997/%5BADM%5D%E6%9B%B4%E4%B8%B0%E5%AF%8C%E7%9A%84B%E7%AB%99%E5%BC%B9%E5%B9%95%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD%EF%BC%88%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // DEBUG使用内容
    // var GM_dic = {};
    // function GM_getValue(k) {
    //     return GM_dic[k];
    // }
    // function GM_setValue(k, v) {
    //     GM_dic[k] = v;
    // }

    // 字符串字典
    var string = {
        "bili-dm": "bili-dm",
        "bili-roll": "bili-roll",
        "bili-show": "bili-show",
        "bili-vip-dm": "bili-dm-vip",
        "bili-comment-container-class": "comment-container",
        "bili-container-vue-id": "video-container-v1",  // 用于获取vue产生的随机id的元素
        "right-panel-inject-element-id": "danmukuBox",  // 被注入的元素id
        "injected-element-class": "danmaku-warp",       // 注入的元素class，用于直接适用css

        "ADM": {
            "test-text": "userscript-ADM-testtext",
            "style-sheet": "userscript-ADM-stylesheet",

            "header-box": "userscript-ADM-cfgpanel-header",
            "header-arrow-icon": "usercript-ADM-cfgpanel-arrow-icon",
            "panel-box": "userscript-ADM-cfgpanel-box",
            "alert": "userscript-ADM-alert-icon",
            "error": "userscript-ADM-error-icon",
            "save-button": "userScript-cfg-save",
            "cancel-button": "userScript-cfg-cancel"
        },
        "config": {
            "script-initialized": "scriptInitialized",
            "search-danmu-limit": "searchDanmuLimit",
            "remove-vip-danmu-style": "removeVipDanmuStyle",
            "refresh-time": "refreshTime",
            "alert-wait-time": "alertWaitTime",
            "error-wait-time": "errorWaitTime",
            "initialize-refresh-time": "initializeRefreshTime"
        },
        "input": {
            "remove-vip-danmu-style": "remove_vip_danmu",
            "refresh-time": "refresh_time"
        },
        "style": {
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-weight": "fontWeight",
            "text-shadow": "textShadow",
            "--webkit--text-stroke": "webkitTextStroke",
            "background": "background"
        }
    };
    // 脚本初始配置
    var defaultconfig = {
        "scriptInitialized": false,     // 脚本是否初始化（第一次使用）
        "removeVipDanmuStyle": true,    // 是否清除vip弹幕样式
        "searchDanmuLimit": 100,        // 在获取初始弹幕样式函数中，搜寻弹幕数量的上限
        "initializeRefreshTime": 300,   // 当脚本处于初始化状态时，每次刷新间隔的时间
        "refreshTime": 1000,            // 监测弹幕刷新时间
        "alertWaitTime": 3000,          // 发现问题直到出现警告的等待时间
        "errorWaitTime": 20000          // 发现问题直到出现报错的等待时间
    };
    // 存储初始弹幕样式
    var defaultStyle = {};

    // 脚本样式表
    var styleSheet = `
.userScript-debug-text {
    color: red;
}

.userScript-invisible {
    visibility: hidden;
}

.userScript-ADM-icon {
    position: absolute;
}

.userscript-ADM-cfgpanel-header {
    position: relative;
    background-color: #f1f2f3;
    cursor: pointer;
    display: flex;
    vertical-align: middle;
    align-items: center;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 15px;
    font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
    font-weight: 400;
    padding: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 18px;
    transition: 0.3s;
}

.userscript-ADM-cfgpanel-icon {
    position: relative;
    left: 3%;
}

.usercript-ADM-cfgpanel-arrow-icon {
    position: absolute;
    right: 17px;
    transition: 0.3s;
    user-select: none;
}

.usercript-ADM-cfgpanel-arrow-icon>svg {
    position: relative;
    height: 16px;
    width: 16px;
    transition: 0.3s;
    transform: rotate(90deg);
}

.userscript-ADM-cfgpanel-dev-info {
    position: absolute;
    right: 2%;
    bottom: 6%;
    opacity: 40%;
    color: grey;
    font-size: 4px;
    font-weight: 200;
    user-select: none;
}

.userscript-ADM-cfgpanel-box {
    overflow: hidden;
    position: relative;
    display: flex;
    border-radius: 6px;
    padding: 0px 15px 0px 15px;
    height: 0px;
    transition: 0.3s;
}


.userScript-ADM-cfgpanel-form-grid {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 5fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    column-gap: 12px;
    row-gap: 4px;
}

.userScript-ADM-cfgpanel-form-input {
    max-width: 50px;
    border: solid 1px;
    text-indent: 2px;
}
    
.userScript-ADM-cfgPanel-submit-area>input {
    border: solid 1px;
    height: 24px;
}

.userScript-ADM-cfgPanel-submit-area {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#userScript-cfg-save {
    flex: 1;
    border-radius: 0px 0px 0px 6px;
    transition: 0.3s;
    background-color: #ffffff;
}

#userScript-cfg-save:hover {
    flex: 1.5;
    background-color: aquamarine;
}

#userScript-cfg-cancel {
    border-radius: 0px 0px 6px 0px;
    flex: 1;
    transition: 0.3s;
    background-color: #ffffff;
}

#userScript-cfg-cancel:hover {
    flex: 1.5;
    background-color: rgb(236, 150, 150);
}
    `;
    // 脚本配置面板html
    var cfgPanelHtml = `
<div class="userscript-ADM-cfgpanel-header" id="userscript-ADM-cfgpanel-header">
<p> 弹幕管理 </p>
<div class="userscript-ADM-cfgpanel-icon">
    <span class="userScript-invisible userScript-ADM-icon" id="userscript-ADM-alert-icon">⚠</span>
    <span class="userScript-invisible userScript-ADM-icon" id="userscript-ADM-error-icon">🚫</span>
    <span class="userScript-invisible userScript-ADM-icon" id="userscript-ADM-loading-icon">🔷</span>
    <span class="userScript-invisible userScript-ADM-icon" id="userscript-ADM-complete-icon">✅</span>
    <!--占位符--><span style="visibility: hidden;">space</span>
</div>
<span class="userscript-ADM-cfgpanel-dev-info">Powered by Advanced Danmaku Manager</span>
<span class="usercript-ADM-cfgpanel-arrow-icon" >
    <svg id="usercript-ADM-cfgpanel-arrow-icon" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" viewBox="0 0 16 16">
        <path
            d="m9.188 7.999-3.359 3.359a.75.75 0 1 0 1.061 1.061l3.889-3.889a.75.75 0 0 0 0-1.061L6.89 3.58a.75.75 0 1 0-1.061 1.061l3.359 3.358z">
        </path>
    </svg>
</span>
<p class="userScript-invisible" id="userscript-ADM-testtext">This is a test text</p>
</div>
<div class="userscript-ADM-cfgpanel-box" id="userscript-ADM-cfgpanel-box">
<form>
    <div class="userScript-ADM-cfgpanel-form-grid">
        <input class="userScript-ADM-cfgpanel-form-input" type="checkbox" check="checked" name="remove_vip_danmu">
        <p class="userScript-ADM-cfgpanel-form-passage">移除彩色弹幕样式</p>
        <input class="userScript-ADM-cfgpanel-form-input" type="number" name="refresh_time">
        <p class="userScript-ADM-cfgpanel-form-passage">弹幕检测更新时间 (ms)</p>
    </div>
    <br>
    <div class="userScript-ADM-cfgPanel-submit-area">
        <input id="userScript-cfg-save" type="button" value="保存">
        <input id="userScript-cfg-cancel" type="button" value="取消">
    </div>
</form>
</div>
    `;

    // 脚本加载进程
    // 0：未开始
    // 1：成功注入样式表和配置面板
    // 2：成功加载本地配置
    // 3：成功获取默认弹幕样式（完成）
    var loadProgress = 0;

    // 配置功能，静态模块
    var cfg = {
        // 配置的临时保存位置
        content: {},

        // 设置配置值，结果保存于content
        setValue(k, v) {
            this.content[k] = v;
        },

        // 通过key值获取配置值，来源于content
        getValue(k) {
            return this.content[k];
        },

        // 从本地加载配置
        // 先从预设配置找到key值，之后尝试访问，并将结果放至content中
        // 若autoLoadDefault为true，则检测到脚本第一次打开时，将自动加载默认配置并保存至gm
        loadCfgFromLocalSave(autoLoadDefault) {
            for (const key in defaultconfig) {
                if (Object.hasOwnProperty.call(defaultconfig, key)) {
                    this.content[key] = GM_getValue(key);
                }
            }
            if (this.getValue(string.config["script-initialized"]) != true && autoLoadDefault) {
                this.loadCfgFromDefault();
                this.setValue(string.config["script-initialized"], true);
                this.applyChange();
            }
        },

        // 将配置保存到本地
        applyChange() {
            for (const key in this.content) {
                if (Object.hasOwnProperty.call(this.content, key)) {
                    const ele = this.content[key];
                    GM_setValue(key, ele);
                }
            }
        },

        // 加载默认配置
        loadCfgFromDefault() {
            this.content = defaultconfig;
        }
    };

    function refreshCfgPanelFromLocalCfg() {
        var input_rmVipDm = document.getElementsByName(string.input["remove-vip-danmu-style"])[0];
        var input_refreshTime = document.getElementsByName(string.input["refresh-time"])[0];
        input_rmVipDm.checked = cfg.getValue(string.config["remove-vip-danmu-style"]);
        input_refreshTime.value = cfg.getValue(string.config["refresh-time"]);
    }

    // 将函数插入元素中
    function addFunc() {
        // 添加在 id:userscript-ADM-cfgpanel-header 上，用于控制面板开合
        function headerFold() {
            if (panelFold) {
                panel.style.height = "90px";
                panel.style.marginBottom = "18px";
                panel.style.paddingTop = "15px";
                panel.style.paddingBottom = "15px";
                header.style.marginBottom = "6px";
                arrow.style.transform = "rotate(-90deg)";
                panelFold = false;
            }
            else {
                panel.style.height = "0px";
                panel.style.marginBottom = "0px";
                panel.style.paddingTop = "0px";
                panel.style.paddingBottom = "0px";
                header.style.marginBottom = "18px";
                arrow.style.transform = "rotate(90deg)";
                panelFold = true;
            }
        }
        function saveConfig() {
            cfg.setValue(string.config["remove-vip-danmu-style"], input_rmVipDm.checked);
            if (input_refreshTime.value < 100) {
                cfg.setValue(string.config["refresh-time"], 100);
            }
            else {
                cfg.setValue(string.config["refresh-time"], input_refreshTime.value);
            }
            cfg.applyChange();
            //重启主循环
            clearInterval(mainInterval);
            setTimeout(() => {
                mainCirculation();
            }, 1000);
        }

        var panelFold = true;
        var panel = document.getElementById(string.ADM["panel-box"]);
        var header = document.getElementById(string.ADM["header-box"]);
        var arrow = document.getElementById(string.ADM["header-arrow-icon"]);
        var input_rmVipDm = document.getElementsByName(string.input["remove-vip-danmu-style"])[0];
        var input_refreshTime = document.getElementsByName(string.input["refresh-time"])[0];
        var input_save = document.getElementById(string.ADM["save-button"]);
        var input_cancel = document.getElementById(string.ADM["cancel-button"]);

        header.addEventListener("click", headerFold);
        input_save.addEventListener("click", saveConfig);
        input_cancel.addEventListener("click", refreshCfgPanelFromLocalCfg);
    }

    // 倒计时检测脚本是否出现运行问题，时间到后出现图标提醒
    function alertCountdown() {
        setTimeout(() => {
            if (loadProgress != 3) {
                document.getElementById(string.ADM.alert).style.visibility = "visible";
                setTimeout(() => {
                    if (loadProgress != 3) {
                        document.getElementById(string.ADM.alert).style.visibility = "hidden";
                        document.getElementById(string.ADM.error).style.visibility = "visible";
                    }
                }, defaultconfig[string.config["error-wait-time"]]);
            }
        }, defaultconfig[string.config["alert-wait-time"]]);
    }

    // 初始化脚本
    function initializeScript() {
        // 向网页中注入css和配置html
        function inject() {
            // 获取vue元素随机id
            var randomVueContainerId = document.getElementsByClassName(string["bili-container-vue-id"])[0].attributes[1].name;
            if (document.getElementById(string.ADM["test-text"]) == undefined) {
                document.getElementById(string["right-panel-inject-element-id"]).insertAdjacentHTML("afterend", cfgPanelHtml);
                // 添加vue元素随机id
                document.getElementById(string.ADM["header-box"]).setAttribute(randomVueContainerId, randomVueContainerId);
                document.getElementById(string.ADM["panel-box"]).setAttribute(randomVueContainerId, randomVueContainerId);
            }
            if (document.getElementById(string.ADM["style-sheet"]) == undefined) {
                var e = document.createElement("style");
                e.id = string.ADM["style-sheet"];
                e.innerText = styleSheet;
                document.head.appendChild(e);
            }
            addFunc();
        }
        // 检测初始化进度
        function checkProgress(pro) {
            switch (pro) {
                case 0:
                    return 1;
                case 1:
                    // 检测html和css是否注入网页
                    return !(document.getElementById(string.ADM["test-text"]) == undefined
                        || document.getElementById(string.ADM["style-sheet"]) == undefined);
                case 2:
                    // 检测配置是否加载
                    return cfg.getValue(string.config["script-initialized"]) != undefined;
                case 3:
                    // 检测默认弹幕样式是否已获取
                    return defaultStyle[string.style["text-shadow"]] != undefined;
            }
        }
        // 注入css/html
        if (loadProgress == 0) {
            inject();
            if (checkProgress(1))
                loadProgress = 1;
        }
        // 加载配置
        else if (loadProgress == 1) {
            cfg.loadCfgFromLocalSave(true);
            if (checkProgress(2))
            {
                refreshCfgPanelFromLocalCfg();
                loadProgress = 2;
            }
        }
        // 获取默认弹幕样式
        else if (loadProgress == 2) {
            getDefaultStyle();
            if (checkProgress(3))
                loadProgress = 3;
        }
    }

    // 检测页面是否加载完成
    function checkPageLoaded() {
        return document.getElementsByClassName(string["bili-comment-container-class"]).length != 0;
    }

    // 解释csstext
    function interpretCsstext(csstext) {
        var cssList = csstext.split(';');
        var style = {};
        cssList.forEach(key => {
            var k = key.split(':')[0].replace("--", "").replace(" ", "");
            var v = key.split(':')[1];
            style[k] = v;
        });
        return style;
    }

    // 获取初始弹幕样式
    function getDefaultStyle() {
        var dmList = document.getElementsByClassName(string["bili-roll"]);
        if (dmList.length >= 1) {
            // 获取弹幕样例，保存样式
            for (let i = 0; i < dmList.length && i < cfg.getValue(string.config["search-danmu-limit"]); i++) {
                // 由于b站第一个弹幕没有直接设置textShadow，所以使用循环来强制获取
                var example = interpretCsstext(dmList[i].style.cssText);
                defaultStyle = {
                    "fontFamily": example.fontFamily,
                    "fontWeight": example.fontWeight,
                    "textShadow": example.textShadow
                };
                // 获取到后即可跳出
                if (defaultStyle.textShadow != undefined)
                    break;
            }
        }
    }

    // 清除vip弹幕样式
    function clearVipDanmuStyle(element) {
        if (element.style.background != "none") {
            // 清除特殊样式
            element.style.background = "none";
            element.style.webkitTextStroke = "";
            // 设置初始样式
            element.style.fontFamily = defaultStyle["fontFamily"];
            element.style.fontWeight = defaultStyle["fontWeight"];
            element.style.textShadow = defaultStyle["textShadow"];
        }
    }

    // 代码运行入口如下
    // ——————————————————————————————
    // alertCountdown();
    // 先检测页面是否加载完成（存在评论区）
    // 之后进入初始化循环，等待加载
    // 加载完成后进入主循环
    var mainInterval;

    var checkInterval = setInterval(
        () => {
            // 检测页面是否加载完成
            if (checkPageLoaded()) {
                clearInterval(checkInterval);

                var initializeInterval = setInterval(() => {
                    initializeScript();
                    //当加载完成后，启动正常循环
                    if (loadProgress == 3) {
                        clearInterval(initializeInterval);
                        mainCirculation();
                    }
                }, defaultconfig[string.config["initialize-refresh-time"]]);
            }
        }
        , 200);

    function mainCirculation() {
        mainInterval = setInterval(() => {
            if (cfg.getValue(string.config["remove-vip-danmu-style"])) {
                document.getElementsByClassName(string["bili-vip-dm"]).forEach(element => {
                    clearVipDanmuStyle(element);
                });
            }
        }, cfg.getValue(string.config["refresh-time"]));
    }

})();