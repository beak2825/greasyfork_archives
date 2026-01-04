// ==UserScript==
// @name         Anchor link guides
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.01.13.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://testpage.qipeiyigou.com/mshop/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523175/Anchor%20link%20guides.user.js
// @updateURL https://update.greasyfork.org/scripts/523175/Anchor%20link%20guides.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const setupUIElements = () => {
        $("body").append(`
        <div id="colorPicker-container"><input type="color" id="colorPicker" value="#ff0000"></div>
        <div class="switch-container">
            <label class="switch">
                <input type="checkbox" id="mySwitch" checked>
                <span class="slider round"></span>
            </label>
        </div>
        <style id="stylex">
            .ref-line {
                background-color: #ff0000;
            }

            #up-posx,
            #down-posx {
                display: inline-block;
            }
        </style>
        <style>
            .anchor-link {
                border-width: 5px !important;
            }

            .guide {
                display: none !important;
            }

            #colorPicker-container {
                z-index: 10000;
                position: fixed;
                top: 12px;
                right: 296px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                overflow: hidden;
            }

            #colorPicker {
                position: relative;
                top: -30px;
                left: -30px;
                width: 100px;
                height: 100px;
                background-color: transparent;
            }

            #up-posx,
            #down-posx {
                position: absolute;
                background-color: red;
                color: white;
                height: 30px;
                padding: 5px 10px;
                max-height: 50%;
            }

            #up-posx {
                border-radius: 0 0 10px 0;
            }

            #down-posx {
                border-radius: 0 10px 0 0;
                bottom: 5px;
                left: 5px;
            }

            .ref-line {
                position: absolute;
                mix-blend-mode: color-dodge;
            }

            #upx,
            #downx {
                width: 300vw;
                height: 5px;
                left: -100vw;
            }

            #leftx,
            #rightx {
                width: 5px;
                height: 300vh;
                top: -100vh;
            }

            #downx {
                bottom: 0;
            }

            #rightx {
                right: 0;
            }

            /* 容器 */
            .switch-container {
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                position: fixed;
                top: 12px;
                right: 216px;
            }

            /* 开关样式 */
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 36px;
            }

            /* 隐藏的复选框 */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* 滑块 */
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 5px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            /* 激活状态下的样式 */
            input:checked+.slider {
                background-color: #2196F3;
            }

            input:checked+.slider:before {
                transform: translateX(26px);
            }
        </style>
            `);
    };

    const updateRefLineBackground = (color) => {
        $("#stylex").html(function (n, v) {
            return v.replace(/#[0-9a-fA-F]{6}/, color);
        });
    };

    const setupColorPicker = () => {
        let color = localStorage.getItem("color");
        if (color != null) {
            $("#colorPicker").val(color);
            updateRefLineBackground(color);
        }
        $("#colorPicker").on("input", function () {
            color = $(this).val();
            localStorage.setItem("color", color);
            updateRefLineBackground(color);
        });
    };

    const setupSwitch = () => {
        let switch_status = localStorage.getItem("switch");
        if (switch_status === "on") {
            $("#mySwitch").prop("checked", true);
            $("#stylex").html(function (n, v) {
                return v.replace(/none/, "inline-block");
            });
        } else if (switch_status === "off") {
            $("#mySwitch").prop("checked", false);
            $("#stylex").html(function (n, v) {
                return v.replace(/inline-block/, "none");
            });
        }
        $("#mySwitch").on("change", function () {
            if (this.checked) {
                localStorage.setItem("switch", "on");
                $("#stylex").html(function (n, v) { return v.replace(/none/, "inline-block"); });
            } else {
                localStorage.setItem("switch", "off");
                $("#stylex").html(function (n, v) { return v.replace(/inline-block/, "none"); });
            }
        });
    };

    const get_storedcolor_switchstatus = () => {
        setupColorPicker();
        setupSwitch();
    };

    const triggerMouseEvent = (element, eventType) => {
        let event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1
        });
        element.dispatchEvent(event);
    };

    const autotrigger = () => {
        let movexElement = document.getElementById("movex");
        triggerMouseEvent(movexElement, "mousedown");
        triggerMouseEvent(movexElement, "mouseup");
    };

    const countSubstringInArray = (arr, substr) => {
        return arr.filter(item => item.includes(substr)).length;
    };

    const calc_pos = () => {
        let anchorBoxes = $(".list-group .anchor-box");
        let top_pos_list = anchorBoxes.not("#movex").map((i, el) => parseFloat($(el).css("top"))).get();
        let left_pos_list = anchorBoxes.not("#movex").map((i, el) => parseFloat($(el).css("left"))).get();
        let movexTop = $("#movex").position().top;
        let closestTop = top_pos_list.find(top => Math.abs(movexTop - top) < 5);
        if (closestTop !== undefined && Math.abs(movexTop - closestTop) !== 0) {
            $("#movex").css("top", closestTop);
        } else {
            console.log("No suitable top position found.");
        }
        let movexleft = $("#movex").position().left;
        let closestleft = left_pos_list.find(left => Math.abs(movexleft - left) < 5);
        if (closestleft !== undefined && Math.abs(movexleft - closestleft) !== 0) {
            $("#movex").css("left", closestleft);
        } else {
            console.log("No suitable left position found.");
        }
        top_pos_list = anchorBoxes.map((i, el) => $(el).css("top")).get();
        left_pos_list = anchorBoxes.map((i, el) => $(el).css("left")).get();
        anchorBoxes.each((i, el) => {
            let $el = $(el);
            let top = $el.css("top");
            let left = $el.css("left");
            $el.find("#up-posx").text(`上边距：${top}`).css({
                backgroundColor: countSubstringInArray(top_pos_list, top) > 1 ? "green" : "red"
            });
            $el.find("#down-posx").text(`左边距：${left}`).css({
                backgroundColor: countSubstringInArray(left_pos_list, left) > 1 ? "green" : "red"
            });
        });
    };

    const micro_pos = (direction, offset, e) => {
        e.preventDefault();
        let $movex = $("#movex");
        if (direction == "up" || direction == "down") {
            $movex.css("top", (parseFloat($movex.css("top")) + offset) + "px");
        } else if (direction == "left" || direction == "right") {
            $movex.css("left", (parseFloat($movex.css("left")) + offset) + "px");
        }
        autotrigger();
    };

    const setupEventHandlers = () => {
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowUp": micro_pos("up", -1, e); break;
                case "ArrowDown": micro_pos("down", 1, e); break;
                case "ArrowLeft": micro_pos("left", -1, e); break;
                case "ArrowRight": micro_pos("right", 1, e); break;
            }
        });

        $(document).on("mousedown", ".list-group .anchor-box", function (e) {
            $("#movex").removeAttr("id");
            let $this = $(this);
            if (!$this.find("#up-posx").length) {
                $this.find(".anchor-link").append(`
                    <div id="up-posx"></div>
                    <div id="down-posx"></div>
                `);
            }
            if (!$this.find(".ref-line").length) {
                $this.append(`
                    <div id="upx" class="ref-line"></div>
                    <div id="downx" class="ref-line"></div>
                    <div id="leftx" class="ref-line"></div>
                    <div id="rightx" class="ref-line"></div>
                `);
            }
            $this.css("z-index", 10000).attr("id", "movex");
        });

        $(document).on("mouseup", ".list-group .anchor-box", function (e) {
            calc_pos();
            $(this).find(".ref-line").remove();
            $(this).css("z-index", 2);
        });

        $(document).on("mouseleave", ".list-group .anchor-box", function (e) {
            autotrigger();
        });
    };
    setupUIElements();
    get_storedcolor_switchstatus();
    setupEventHandlers();
})();
/*2025.01.13.080000 - Line : 331*/