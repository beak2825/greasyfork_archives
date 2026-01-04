// ==UserScript==
// @name         CCCViewCanvasScaler
// @namespace    http://tampermonkey.net/
// @version      2025-05-29
// @description  ccc tool
// @author       QQ:1543728366
// @include      http://192.168.*
// @icon         https://www.cocos.com//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537941/CCCViewCanvasScaler.user.js
// @updateURL https://update.greasyfork.org/scripts/537941/CCCViewCanvasScaler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener("engineVersion", function (event) {
        // 引擎开始加载
        const version = event.detail; // 引擎版本号
        // 监听引擎初始化完成 cc.Game.EVENT_ENGINE_INITED
        // 监听渲染器初始化完成
        cc.game.once(cc.Game.EVENT_RENDERER_INITED, function () {
            engineRendererInited();
        });
    });

    function engineRendererInited() {
        // 顶部工具栏
        const toolbar = document.querySelector(".toolbar");
        if (!toolbar) return;

        cc._gameFrameRect = document.getElementById("GameDiv").getBoundingClientRect();
        cc._maxViewRect = document.querySelector(".contentWrap").getBoundingClientRect();

        window._setVScale_Ohjbfh8 = function (scale) {
            const dpr = window.devicePixelRatio;
            const policy = cc.view.getResolutionPolicy();

            const frame_size = cc.size(cc._gameFrameRect);
            const max_view_size = cc.size(cc._maxViewRect);
            const scale_x = max_view_size.width / frame_size.width / dpr;
            const scale_y = max_view_size.height / frame_size.height / dpr;

            cc.view.setDesignResolutionSize(max_view_size.width * scale_x * scale, max_view_size.height * scale_y * scale, policy);
            cc.screen.windowSize = new cc.Size(max_view_size.width * dpr, max_view_size.height * dpr);
            cc.view.emit("canvas-resize");
        }

        const div_item = document.createElement("div");
        div_item.className = "item";
        div_item.innerHTML = `<span style="font-size: small;" class="item">缩放:</span><input id="set_canvas_scale" type="number" value="1" onwheel="_handleWheel_GBfdauys89(event)" onkeypress="if(event.keyCode == 13){_onClickEnter_GBfdauys89(event)}">`;
        toolbar.appendChild(div_item);

        window._onClickEnter_GBfdauys89 = function (event) {
            event.preventDefault();
            _setVScale_Ohjbfh8(event.target.value);
        }
        window._handleWheel_GBfdauys89 = function (event) {
            event.preventDefault();
            const currentValue = parseFloat(event.target.value) || 1;
            const newValue = (currentValue + (event.deltaY > 0 ? 0.1 : -0.1)).toFixed(2);
            event.target.value = newValue;
            _setVScale_Ohjbfh8(newValue);
        }
    }
})();