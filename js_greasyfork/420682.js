// ==UserScript==
// @name            一键隐藏图片
// @namespace       https://github.com/sdokio
// @version         0.3.3
// @author          SoyaDokio
// @description     摸鱼时页面显示与工作不相关的图片未免有些明目张胆，这时候就需要一键隐藏全图了。
// @homepage        https://github.com/sdokio/UserScript
// @icon            data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMACAYGBwYFCAcHBwkJCAoMFQ4MCwsMGRITDxUeGyAfHhsdHSElMCkhIy0kHR0qOSotMTM2NjYgKDs/OjQ+MDU2M//bAEMBCQkJDAsMGA4OGDMiHSIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM//AABEIABAAEAMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAABAUG/8QAIxAAAgICAgEEAwAAAAAAAAAAAQIDBAURITEGEhMiQRVhcf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAHBEBAAEEAwAAAAAAAAAAAAAAAQACESExcZHh/9oADAMBAAIRAxEAPwDe5rOXLmYEMk9nH4ZZjX9+sR63fj5NtTpNhgNHsHf6drZH8HlKdZcw2Uo2pBCTIys0LkEjTKPkDrRB62D98lzGLRyEqZDGz5DGzTGWKSLZauTyysoIJXeyCAeyP7Pw/jT2fIjNDVkq4avMs0QsKRI7qrKAo3sINg7I2eufotcy8RM2KQ79n//Z
// @icon64          https://cdn.jsdelivr.net/gh/sdokio/UserScript/assets/images/hide_pictures_on_page_64x64.jpg
// @supportURL      https://github.com/sdokio/UserScript/issues/new/choose
// @license         MIT

// @match           *://*/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @run-at          document-start

// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue

// @note            2022/01/24 0.3.3 新功能：记忆特定网站习惯（如在www.baidu.com隐藏了图片，关闭浏览器下次再进入仍是默认隐藏。如需再次显示需要自行设置为显示）
// @note            2021/01/29 0.3.2 添加logo
// @note            2021/01/29 0.3.1 新功能：拖拽控制面板；控制面板位置记忆
// @note            2021/01/27 0.2.1 修复复选框点击无效问题；添加动图使用说明
// @note            2021/01/26 0.1   初版发布
// @downloadURL https://update.greasyfork.org/scripts/420682/%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/420682/%E4%B8%80%E9%94%AE%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
    "use strict";

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
        "version": "0.3.3",
        "sitesHide": [],
        "position": {
            "top": window.innerHeight / 2 - 14 + "",
            "left": "0",
            "right": "auto"
        }
    }

    const STYLE_RAW = "" +
        ".hpop-panel{" +
        "position:fixed;" +
        "width:64px;" +
        "height:20px;" +
        "font-size:12px;" +
        "font-weight: 500;" +
        "font-family:Verdana, Arial, '宋体';" +
        "background:#f1f1f1;" +
        "z-index:2147483647;" +
        "margin: 0;" +
        "opacity:0.4;" +
        "transition:0.3s;" +
        "overflow:hidden;" +
        "user-select:none;" +
        "text-align:left;" +
        "white-space:nowrap;" +
        "line-height:20px;" +
        "padding:3px 6px;" +
        "border:1px solid #ccc;" +
        "box-sizing: content-box;" +
        "}" +
        ".hpop-panel-left{" +
        "transform:translate(-63px,0);" +
        "border-width:1px 1px 1px 0;" +
        "border-top-right-radius: 14px;" +
        "border-bottom-right-radius: 14px;" +
        "}" +
        ".hpop-panel-right{" +
        "transform:translate(63px,0);" +
        "border-width:1px 0 1px 1px;" +
        "border-top-left-radius: 14px;" +
        "border-bottom-left-radius: 14px;" +
        "padding-left: 10px;" +
        "padding-right: 0;" +
        "}" +
        ".hpop-panel input{" +
        "margin: 0;" +
        "padding: 0;" +
        "vertical-align:middle;" +
        "-webkit-appearance:checkbox;" +
        "-moz-appearance:checkbox;" +
        "position: static;" +
        "clip: auto;" +
        "opacity: 1;" +
        "cursor: pointer;" +
        "}" +
        ".hpop-panel.hpop-panel-active{" +
        "width:70px;" +
        "opacity: 0.9;" +
        "}" +
        ".hpop-panel.hpop-panel-left-active{" +
        "left: 0px;" +
        "transform:translate(0,0);" +
        "}" +
        ".hpop-panel.hpop-panel-right-active{" +
        "right: 0px;" +
        "transform:translate(0,0);" +
        "}" +
        ".hpop-panel label{" +
        "margin:0;" +
        "padding:0 0 0 3px;" +
        "font-weight:500;" +
        "}" +
        ".hpop-panel-move{" +
        "border-width:1px 1px 1px 0;" +
        "border-radius: 14px;" +
        "}" +
        " ";

    main();

    function main() {
        // 取出本地缓存配置
        hpop_config_custom = GM_getValue("hpop_config");
        if (!hpop_config_custom) {
            hpop_config_custom = hpop_config_default;
        }
        // 将数据结构的变更保存到本地缓存配置
        var updFlag = false;
        for (var _key in hpop_config_default) {
            if (!hpop_config_custom.hasOwnProperty(_key)) {
                hpop_config_custom._key = hpop_config_default._key;
                updFlag = true;
            }
        }
        if (updFlag) {
            // 保存当前配置到本地缓存
            GM_setValue("hpop_config", hpop_config_custom);
        }

        generateControlPanel();
    }

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
            + "<label style='cursor:pointer;font-size:12px;color:3d3d3d;'>隐藏图片</label>";
        // 仅在顶层窗口添加控制面板
        if (window.self === window.top) {
            if (document.querySelector("body")) {
                document.body.appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }
        // 根据记忆状态（显示/隐藏）初始化该网站
        if (hpop_config_custom.sitesHide.indexOf(document.location.hostname) > -1) {
            document.querySelector("#hpop-switch").checked = true;
            $(document).ready(function() {
                $("img").hide();
            });
        }
        // 添加控制面板所需样式
        var _style = document.createElement("style");
        _style.type = "text/css";
        _style.innerHTML = STYLE_RAW;
        if (document.querySelector("#hpop-panel")) {
            document.querySelector("#hpop-panel").appendChild(_style);
        } else {
            GM_addStyle(STYLE_RAW);
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
                node.style.left = event.clientX - dispX + "px";
                node.style.top = event.clientY - dispY + "px";
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
                $("img").show("500");
                // 取消记忆本网站下次默认隐藏图片
                hpop_config_custom.sitesHide.remove(document.location.hostname);
            } else {
                document.querySelector("#hpop-switch").checked = true;
                $("img").hide("500");
                // 记忆本网站下次默认隐藏图片
                hpop_config_custom.sitesHide.push(document.location.hostname);
            }
            // 保存当前配置到本地缓存
            GM_setValue("hpop_config", hpop_config_custom);
        }
        node.addEventListener("click", toggleShowHide);
        node.querySelector("#hpop-switch").addEventListener("click", toggleShowHide);
    }
})();
