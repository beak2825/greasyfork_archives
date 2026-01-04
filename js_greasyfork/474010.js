// ==UserScript==
// @name         bilibili固定进度条
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在b站播放器内固定显示进度条
// @author       somenothing
// @homepage     https://github.com/somenothing/bilibili-progress-bar-pin
// @supportURL   https://github.com/somenothing/bilibili-progress-bar-pin/issues
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474010/bilibili%E5%9B%BA%E5%AE%9A%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/474010/bilibili%E5%9B%BA%E5%AE%9A%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enable_modification(control_top) {
        control_top.setAttribute("style", "opacity: 1; visibility: visible; bottom: -6px; padding: 0px; ");
    }

    function disable_modification(control_top) {
        control_top.removeAttribute("style");
    }

    window.onload = function(){
        console.log("【已加载bilibili固定进度条】")
        const control_entity = document.querySelector(".bpx-player-control-entity");
        const control_top = document.querySelector(".bpx-player-control-top");
        const progress_area = document.querySelector(".bpx-player-shadow-progress-area");

        if (control_entity.getAttribute("data-shadow-show") == "true") {
            enable_modification(control_top);
        }

        let id = setInterval(() => {
            if (document.querySelector(".bpx-player-shadow-progress-area") != null) {
                document.querySelector(".bpx-player-shadow-progress-area").setAttribute("style", "opacity: 0; visibility: hidden");
                clearInterval(id)
            }
        }, 500)

        const observer_config = { attributes: true, attributeName: "data-shadow-show", attributeOldValue: true };
        const observer_callback = function(mutationsList) {
            for(let mutation of mutationsList) {
                if (mutation.type === "attributes") {
                    if (control_entity.getAttribute("data-shadow-show") == "true") {
                        enable_modification(control_top);
                    }
                    else {
                        disable_modification(control_top);
                    }
                }
            }
        };
        const controller_observer = new MutationObserver(observer_callback);
        controller_observer.observe(control_entity, observer_config);
    }
})();
