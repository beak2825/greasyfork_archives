// ==UserScript==
// @name         隐藏NSFW
// @namespace    http://tampermonkey.net/
// @version      24.12.31
// @description  避免网站NSFW图片直接展示到电脑屏幕
// @author       Rawwiin
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lens.google

// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/522262/%E9%9A%90%E8%97%8FNSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/522262/%E9%9A%90%E8%97%8FNSFW.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) if (this[i] == val) return i;
        return -1;
    }
    Array.prototype.remove = function (val) {
        while (true) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            } else {
                break;
            }
        }
    }

    var hpop_config_custom;
    var hpop_config_default = {
        "version": "24.12.31",
        "sitesHide": [],
        "sitesShow": [],
        "position": {
            "top": window.innerHeight / 2 - 14 + "",
            "left": "0",
            "right": "auto"
        },
        "globalHide": true
    }

    const STYLE_RAW_HPOP = `
        .hpop-panel {
            position: fixed;
            width: 64px;
            height: 20px;
            font-size: 12px;
            font-weight: 500;
            font-family: Verdana, Arial, '宋体';
            background: #f1f1f1;
            z-index: 2147483647;
            margin: 0;
            opacity: 0.4;
            transition: 0.3s;
            overflow: hidden;
            user-select: none;
            text-align: left;
            white-space: nowrap;
            line-height: 20px;
            padding: 3px 6px;
            border: 1px solid #ccc;
            box-sizing: content-box;
        }

        .hpop-panel-left {
            transform: translate(-63px, 0);
            border-width: 1px 1px 1px 0;
            border-top-right-radius: 14px;
            border-bottom-right-radius: 14px;
        }

        .hpop-panel-right {
            transform: translate(63px, 0);
            border-width: 1px 0 1px 1px;
            border-top-left-radius: 14px;
            border-bottom-left-radius: 14px;
            padding-left: 10px;
            padding-right: 0;
        }

        .hpop-panel input {
            margin: 0;
            padding: 0;
            vertical-align: middle;
            -webkit-appearance: checkbox;
            -moz-appearance: checkbox;
            position: static;
            clip: auto;
            opacity: 1;
            cursor: pointer;
        }

        .hpop-panel.hpop-panel-active {
            width: 70px;
            opacity: 0.9;
        }

        .hpop-panel.hpop-panel-left-active {
            left: 0px;
            transform: translate(0, 0);
        }

        .hpop-panel.hpop-panel-right-active {
            right: 0px;
            transform: translate(0, 0);
        }

        .hpop-panel label {
            margin: 0;
            padding: 0 0 0 3px;
            font-weight: 500;
        }

        .hpop-panel-move {
            border-width: 1px 1px 1px 0;
            border-radius: 14px;
        }
    `;

    const STYLE_RAW = `
        .transparent-image {
            opacity: 0.02; 
        }
        .transparent-image:hover {
            opacity: 1; 
        }
    `;

    function init() {
        GM_addStyle(STYLE_RAW);
        // 取出本地缓存配置
        hpop_config_custom = GM_getValue("hpop_config");
        if (!hpop_config_custom) {
            hpop_config_custom = hpop_config_default;
        }
        hpop_config_custom.position.left = Math.min(window.innerWidth - 28, Math.max(0, hpop_config_custom.position.left))
        hpop_config_custom.position.top = Math.min(window.innerHeight - 28, Math.max(0, hpop_config_custom.position.top))

        // 将数据结构的变更保存到本地缓存配置
        var updFlag = false;
        for (var _key in hpop_config_default) {
            if (!hpop_config_custom.hasOwnProperty(_key)) {
                hpop_config_custom[_key] = hpop_config_default[_key];
                updFlag = true;
            }
        }
        if (updFlag) {
            // 保存当前配置到本地缓存
            GM_setValue("hpop_config", hpop_config_custom);
        }


        generateControlPanel();
        menu_Func_regist();


        // 根据记忆状态（显示/隐藏）初始化该网站
        if ((hpop_config_custom.sitesHide.indexOf(document.location.hostname) > -1 || hpop_config_custom.globalHide)
            && hpop_config_custom.sitesShow.indexOf(document.location.hostname) < 0) {
            document.querySelector("#hpop-switch").checked = true;
            $(document).ready(function () {
                imgHide();
            });
        }
        console.log(hpop_config_custom)
    }

    function menu_Func_regist() {
        return GM_registerMenuCommand(
            `${hpop_config_custom.globalHide ? '✅' : '❌'}` + '全局隐藏',
            function (event) {
                hpop_config_custom.globalHide = !hpop_config_custom.globalHide;
                if (hpop_config_custom.sitesHide.indexOf(document.location.hostname) < 0
                    && hpop_config_custom.sitesShow.indexOf(document.location.hostname) < 0) {
                    hpop_config_custom.globalHide ? imgHide() : imgShow();
                }
                // 保存当前配置到本地缓存
                GM_setValue("hpop_config", hpop_config_custom);
                menu_Func_regist();
            },
            {
                id: "1",
                accessKey: "s",
                autoClose: true
            }
        );
    };
    // 生成控制面板（浮动元素）
    function generateControlPanel() {
        // 新建控制面板元素
        var node = document.createElement("hide-pictures-on-page");
        node.id = "hpop-panel";
        if (hpop_config_custom.position.left == 0) {
            node.className = "hpop-panel hpop-panel-left";
        }
        if (hpop_config_custom.position.right == 0) {
            node.className = "hpop-panel hpop-panel-right";
        }
        node.style.cssText = "position:fixed;top:" + hpop_config_custom.position.top + "px;"
            + "left:" + hpop_config_custom.position.left + "px;"
            + "right:" + hpop_config_custom.position.right + "px;";
        node.innerHTML = "<input type='checkbox' id='hpop-switch' />"
            + "<label style='cursor:pointer;font-size:12px;color:3d3d3d;'>隐藏NSFW</label>";
        // 仅在顶层窗口添加控制面板
        if (window.self === window.top) {
            if (document.querySelector("body")) {
                document.body.appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
        // 添加控制面板所需样式
        var _style = document.createElement("style");
        _style.type = "text/css";
        _style.innerHTML = STYLE_RAW_HPOP;
        if (document.querySelector("#hpop-panel")) {
            document.querySelector("#hpop-panel").appendChild(_style);
        } else {
            GM_addStyle(STYLE_RAW_HPOP);
        }
        // 给控制面板添加鼠标滑入/滑出时展开/吸附效果
        node.addEventListener("mouseover", function () {
            node.classList.add("hpop-panel-active");
            if (hpop_config_custom.position.left == 0) {
                node.classList.add("hpop-panel-left-active");
            }
            if (hpop_config_custom.position.right == 0) {
                node.classList.add("hpop-panel-right-active");
            }
        });
        node.addEventListener("mouseleave", function () {
            setTimeout(function () {
                node.classList.remove("hpop-panel-active");
                node.classList.remove("hpop-panel-left-active");
                node.classList.remove("hpop-panel-right-active");
            }, 300);
        });
        // 给控制面板添加拖拽效果
        node.addEventListener("mousedown", function (event) {
            node.style.transition = "null";
            var dispX = event.clientX - node.offsetLeft;
            var dispY = event.clientY - node.offsetTop;

            var move = function (event) {
                node.classList.add("hpop-panel-move");
                // 限制菜单在视口内移动
                node.style.left = Math.min(window.innerWidth - 28, Math.max(0, event.clientX - dispX)) + "px";
                node.style.top = Math.min(window.innerHeight - 28, Math.max(0, event.clientY - dispY)) + "px";
            }

            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", function () {
                node.classList.remove("hpop-panel-move");

                node.style.transition = "0.3s";
                document.removeEventListener("mousemove", move);
                var bodyWidth = document.body.clientWidth;
                var hpop_nodeWidth = node.offsetLeft + node.offsetWidth / 2;
                if (hpop_nodeWidth > bodyWidth / 2) {
                    node.style.left = "auto";
                    node.style.right = 0;
                    node.classList.remove("hpop-panel-left");
                    node.classList.add("hpop-panel-right");
                    hpop_config_custom.position.left = "auto";
                    hpop_config_custom.position.right = "0";
                } else {
                    node.style.left = hpop_config_custom.position.left = 0;
                    node.style.right = hpop_config_custom.position.right = "auto";
                    node.classList.add("hpop-panel-left");
                    node.classList.remove("hpop-panel-right");
                }
                hpop_config_custom.position.top = node.offsetTop;
                // 保存当前配置到本地缓存
                GM_setValue("hpop_config", hpop_config_custom);
            });
        });

        // 给控制面板添加点击显示/隐藏效果
        var toggleShowHide = function () {
            if (document.querySelector("#hpop-switch").checked) {
                document.querySelector("#hpop-switch").checked = false;
                imgShow();
                // 取消记忆本网站下次默认隐藏图片
                hpop_config_custom.sitesHide.remove(document.location.hostname);
                hpop_config_custom.sitesShow.push(document.location.hostname);
            } else {
                document.querySelector("#hpop-switch").checked = true;
                imgHide();
                // 记忆本网站下次默认隐藏图片
                hpop_config_custom.sitesHide.push(document.location.hostname);
                hpop_config_custom.sitesShow.remove(document.location.hostname);
            }
            // 保存当前配置到本地缓存
            GM_setValue("hpop_config", hpop_config_custom);
        }
        node.addEventListener("click", toggleShowHide);
        node.querySelector("#hpop-switch").addEventListener("click", toggleShowHide);
    }

    function imgHide() {
        $("img").addClass("transparent-image");
    }

    function imgShow() {
        $("img").removeClass("transparent-image");
    }

    init();
})();