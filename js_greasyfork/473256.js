/*
 * ============================================================================== *
 ******************************* CoCoClick v1.0.2 *******************************
 ****************** Copyright (C) 2023 xiaohong2022 *****************
 * ============================================================================== *
 */

// ==UserScript==
// @name         CoCoClick
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  CoCo点击方式添加控件！
// @author       小宏XeLa
// @match        *://coco.codemao.cn/editor/*
// @icon         https://coco.codemao.cn/favicon.ico
// @grant        GM_addStyle
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473256/CoCoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/473256/CoCoClick.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var dataTransfer = {
        setData(n, v) {
            this[n] = v;
        },
        getData(n) {
            return this[n];
        }
    };
    setInterval(() => {
        document.querySelectorAll(`*[class*="WidgetList_widgetItem"]`).forEach((e) => {
            if (e.cococlick) return;
            e.cococlick = true;
            e.draggable = false;
            e.style.cursor = "pointer";
            e.addEventListener("click", function () {
                var sen = document.querySelector(`*[class*="PreviewArea_main"]`);
                var x = sen.offsetLeft + sen.offsetWidth / 2;
                var y = sen.offsetTop + sen.offsetHeight / 2;
                var keys = Object.keys(e);
                var key = keys.find((e) => e.startsWith("__reactEventHandlers"));
                e[key].onDragStart({
                    target: e,
                    dataTransfer,
                    persist:() => true,
                    clientX: x,
                    clientY: y,
                    x: x + 100,
                    y
                });
                var stage = document.querySelector(`*[class*="PreviewArea_stage"]`);
                stage[key].onDragOver({ preventDefault() { } });
                stage[key].onDrop({
                    dataTransfer,
                    persist:() => true,
                    clientX: x + 142,
                    clientY: y - 3,
                    x: x + 100,
                    y
                });
                if (e.dataset.widgetType == "BRUSH_WIDGET" || e.dataset.widgetType == "ACTOR_WIDGET") {
                    document.querySelectorAll(`*[data-widget-type="CANVAS_WIDGET"][id*="CANVAS_WIDGET"]`).forEach((en, _, array) => {
                        function click(ew) {
                            en[key].onDragEnter({
                                dataTransfer,
                                persist: () => true,
                                stopPropagation: () => true,
                            });
                            stage[key].onDragOver({ preventDefault() { } });
                            en[key].onDrop({
                                dataTransfer,
                                persist: () => true,
                                stopPropagation: () => true,
                                clientX: ew.clientX,
                                clientY: ew.clientY,
                                x: ew.x,
                                y: ew.y
                            });
                            stage[key].onDrop({
                                dataTransfer,
                                persist: () => true,
                            });
                            array.forEach(e => e.removeEventListener("click", e.cococlickfunc, false));
                            e[key].onDragEnd();
                        }
                        en.cococlickfunc = click;
                        en.addEventListener("click", click, false);
                    });
                } else {
                    e[key].onDragEnd();
                }
            });
        });
    }, 100);
    
})();
