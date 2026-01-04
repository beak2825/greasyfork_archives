// ==UserScript==
// @name 夜间模式-shift快捷键版
// @description 自由调整每个网页亮度，实现不同网站使用不同亮度（快捷键：shift+鼠标左键双击）。
// @author jxb
// @version 1.2
// @match *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/694396
// 之前在油猴里发现了个加遮罩层降低网页亮度的脚本，修改亮度点击Ctrl+鼠标左键双击就能修改，很实用方便。 但后来发现这个脚本已经在已经在油猴官网里下掉了，故此备份一下。感谢原作者的辛勤付出。
// Ctrl+鼠标左键双击太容易误触了，把快捷键修改为shift+鼠标左键双击
// https://github.com/cellargalaxy/blog-code/blob/master/折腾/20211121/夜间模式油猴脚本备份.md
// @downloadURL https://update.greasyfork.org/scripts/437290/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F-shift%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/437290/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F-shift%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (self != top) {
        return false;
    } else {
        var eve = new class {
            constructor() {
                this.handles = {}
            }

            on(event, callback, index = 0) {
                if (!this.handles[event]) {
                    this.handles[event] = []
                }
                this.handles[event].push({
                    callback: callback,
                    index: index
                });
                this.handles[event].sort((a, b) => {
                    return b.index - a.index
                })
            }

            emit(event, ...data) {
                if (this.handles[event]) {
                    for (let i of this.handles[event]) {
                        if (i.callback(...data) === false) break
                    }
                }
            }

            off(event, callback, index = 0) {
                if (this.handles[event]) {
                    let s = [];
                    for (let i of this.handles[event]) {
                        if (i.callback != callback && i.index != index) {
                            s.push(i)
                        }
                    }
                    this.handles[event] = s
                }
            }
        }();
        const Default_config = {
            globalBrightness: 0.95,
            SingleConfigMap: {}
        };
        const wordsMap = {
            MenuCmd: "打开亮度调整菜单",
            settingsTitle: "亮度调整",
            setAsDefault: "设为默认亮度",
            closeSettingWindow: "关闭设置窗口",
            DeafultSetText: "网页默认亮度已被设置为",
        };
        const body = document.querySelector("body");
        let gm = new class {
            constructor() {
                this.key = "mscststs-brightness";
                this.init()
            }

            init() {
                GM_registerMenuCommand(wordsMap.MenuCmd, () => {
                    eve.emit("Cmd-OpenMenu")
                });
                GM_addValueChangeListener(this.key, (name, old_value, new_value, remote) => {
                    eve.emit("SettingUpdated", new_value)
                })
            }

            getNowBrightness() {
                let config = this.getConfig();
                return config.SingleConfigMap[window.location.host] || config.globalBrightness
            }

            getConfig() {
                return GM_getValue(this.key, Default_config)
            }

            setConfig(value) {
                GM_setValue(this.key, value)
            }

            setGlobalBrightness(value) {
                let config = this.getConfig();
                config.globalBrightness = value;
                this.setConfig(config)
            }

            setHostBrightness(value, host = window.location.host) {
                let config = this.getConfig();
                config.SingleConfigMap[host] = value;
                this.setConfig(config)
            }
        }();

        function OpenMenuPage() {
            if (document.querySelector("#helper_brightness")) {
            } else {
                let div = document.createElement("div");
                div.id = "helper_brightness";
                div.innerHTML = '<div class="brightness-title">' + wordsMap.settingsTitle + '</div><div class="brightness-Menu"><div class="single"><div class="controller"><input id="helper_brightness_range" type="range" min="0" max="1" step="0.01" value="' + gm.getNowBrightness() + '"/></div><div class="desc"><div id="brightness-value">' + gm.getNowBrightness() + '</div><div><button id="helper_brightness_setAsDefault">' + wordsMap.setAsDefault + '</button></div><div><button id="helper_brightness_closeSettingPage">' + wordsMap.closeSettingWindow + '</button></div></div></div></div><style>#helper_brightness{position:fixed;color:black!important;display:block;left:calc(50% - 210px);top:10%;border:1px solid #aaa;min-height:300px;width:400px;border-radius:8px;box-shadow:0 0 15px 0 #999;background-color:#eee;padding:10px;user-select:none;z-index:1000000;//100w}.brightness-title{color:black!important;text-align:center;border-bottom:1px solid #ccc;font-size:1.7em;line-height:2.5em}#helper_brightness input[type=range]{background-color:#ddd;-webkit-appearance:none;width:300px;border-radius:10px}#helper_brightness input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}#helper_brightness input[type=range]::-webkit-slider-runnable-track{height:15px;border-radius:10px;box-shadow:0 1px 1px #def3f8,inset 0 .125em .125em #0d1112}#helper_brightness input[type=range]:focus{outline:0}#helper_brightness input[type="range"]::-webkit-slider-thumb{width:25px;-webkit-appearance:none;height:25px;margin-top:-5px;background:#fff;border-radius:50%;border:solid .125em rgba(205,224,230,0.5);box-shadow:0 .125em .125em #3b4547}#helper_brightness .brightness-Menu{margin-top:25px}#helper_brightness .controller{padding:5px 0;margin:0 auto;width:300px}#helper_brightness .desc{text-align:center;line-height:35px}#helper_brightness button{background-color:#eee;font-size:14px;line-height:30px;border:1px #bebebe solid;height:30px;padding-left:5px;padding-right:5px}#helper_brightness button:hover{border:1px #999 solid}#brightness-value{font-size:2.6em;height:60px;line-height:60px;color:black!important}</style>'
                body.appendChild(div);
                let rangeController = document.querySelector("#helper_brightness_range");
                let setAsDefaultBtn = document.querySelector("#helper_brightness_setAsDefault");
                let closeSettingPage = document.querySelector("#helper_brightness_closeSettingPage");
                let brightnessValue = document.querySelector("#brightness-value");
                rangeController.addEventListener("input", (e) => {
                    let value = e.target.value;
                    brightnessValue.innerText = value;
                    gm.setHostBrightness(value);
                });
                setAsDefaultBtn.addEventListener("click", (e) => {
                    let value = rangeController.value;
                    gm.setGlobalBrightness(value);
                    alert(wordsMap.DeafultSetText + value + "!");
                });
                closeSettingPage.addEventListener("click", (e) => {
                    CloseMenuPage();
                })
            }
        };

        function CloseMenuPage() {
            let menu = document.querySelector("#helper_brightness");
            if (menu) {
                menu.remove();
            }
        }

        eve.on("Cmd-OpenMenu", () => {
            OpenMenuPage();
        });
        eve.on("SettingUpdated", () => {
            Init();
        });
        let CurrentBrightness = null;
        let styleNode = document.createElement("style");
        document.querySelector("head").append(styleNode);

        function Init() {
            if (CurrentBrightness && CurrentBrightness == gm.getNowBrightness()) {
            } else {
                CurrentBrightness = gm.getNowBrightness();
            }
            styleNode.innerHTML = 'body::after{content:"";display:block;background-color:#000;opacity:' + parseFloat(1 - CurrentBrightness).toFixed(2) + ';position:fixed;left:0;top:0;z-index:999999;width:100%;height:100%;pointer-events:none;}';
        };
        Init();
        body.addEventListener("dblclick", (e) => {
            if (e.shiftKey) {
                eve.emit("Cmd-OpenMenu");
            }
        })
    }
})();