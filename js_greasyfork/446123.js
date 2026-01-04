// ==UserScript==
// @name         微信读书护眼配色多种模式选择
// @namespace    https://github.com/Licoy/wechat-read-mode
// @version      0.1
// @description  微信读书护眼配色多种模式选择，现已集成10种不同的颜色模式来供于你的阅读！
// @author       Licoy
// @grant        none
// @match        *://*.weread.qq.com/*
// @supportURL   https://github.com/Licoy/wechat-read-mode/issues/new
// @homepage     https://github.com/Licoy/wechat-read-mode
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446123/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%8A%A4%E7%9C%BC%E9%85%8D%E8%89%B2%E5%A4%9A%E7%A7%8D%E6%A8%A1%E5%BC%8F%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/446123/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%8A%A4%E7%9C%BC%E9%85%8D%E8%89%B2%E5%A4%9A%E7%A7%8D%E6%A8%A1%E5%BC%8F%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colors = [
        {bg: "#5c4e11", rbg: "#3c3405", bgb: "#443b06", white: false},
        {bg: "#262626", rbg: "#2a2727", bgb: "#322f2f", white: false},
        {bg: "#343400", rbg: "#282802", bgb: "#2e2e04", white: false},
        {bg: "#5c4e11", rbg: "#3c3405", bgb: "#443b06", white: false},
        {bg: "#140d0e", rbg: "#201819", bgb: "#2e2325", white: false},
        {bg: "#153a0f", rbg: "#143010", bgb: "#1f441a", white: false},
        {bg: "#ecd9ac", rbg: "#f3e3bc", bgb: "#fbefd1", white: true},
        {bg: "#b5b5b5", rbg: "#c5c5c5", bgb: "#dbdbdb", white: true},
        {bg: "#bbf5ea", rbg: "#9fe5d8", bgb: "#b7efe5", white: true},
        {bg: "#98d2ef", rbg: "#8ed3f7", bgb: "#7bc7ef", white: true},
    ]

    let originChangeModeBtn = null;

    setTimeout(load, 100);

    function load() {
        const style = getStyleStr();
        document.head.innerHTML = document.head.innerHTML + style;
        const controls = document.querySelector("#routerView > div.readerControls.readerControls");
        if (!controls) {
            return
        }
        const buttons = controls.querySelectorAll("button");
        if (buttons.length == 0) {
            return
        }
        originChangeModeBtn = buttons[4];
        const modeChangeBtn = document.createElement("button");
        modeChangeBtn.title = "切换模式";
        modeChangeBtn.className = "readerControls_item change-mode-plugins";
        modeChangeBtn.innerHTML = "<span>模式</span>";
        controls.insertBefore(modeChangeBtn, buttons[0]);
        init();
        modeChangeBtn.onclick = function () {
            const body = document.body;
            const mode = body.getAttribute("data-mode");
            let nextMode = null;
            if (!mode) {
                nextMode = 0;
                body.classList.add("wr-mode-0");
                body.setAttribute("data-mode", 0);
            } else {
                nextMode = (parseInt(mode) + 1);
                if (nextMode >= colors.length) {
                    nextMode = 0;
                }
            }
            changeMode(nextMode, mode);
        }
    }

    function init() {
        const localMode = localStorage.getItem("wr-mode");
        if (localMode) {
            changeMode(localMode);
        }
    }

    function changeMode(modeIndex, currentModeIndex = null) {
        const body = document.body;
        const color = colors[modeIndex];
        if (color.white && !body.classList.contains("wr_whiteTheme")) {
            originChangeModeBtn.click();
        } else if (!color.white && body.classList.contains("wr_whiteTheme")) {
            originChangeModeBtn.click();
        }
        if (currentModeIndex) {
            body.classList.remove("wr-mode-" + currentModeIndex);
        }
        body.classList.add("wr-mode-" + modeIndex);
        body.setAttribute("data-mode", modeIndex);
        localStorage.setItem("wr-mode", modeIndex);
    }

    function getStyleStr() {
        let style = "<style>";
        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            style += `
                body.wr-mode-${i} .change-mode-plugins span{
                    color:${color.white ? '#2a2a2a' : '#b9b9ba'};
                }
                body.wr-mode-${i}{
                    background-color:${color.bg} !important;
                }
                body.wr-mode-${i} .readerTopBar,body.wr-mode-${i} .reader_toolbar_container,body.wr-mode-${i} .readerWriteReviewPanel .readerWriteReviewPanel_bg{
                    background-color:${color.rbg} !important;
                }
                body.wr-mode-${i} .readerControls_item,body.wr-mode-${i} .readerControls_fontSize,body.wr-mode-${i} .app_content
                {
                    background-color:${color.bgb} !important;
                }
            `;
            if (color.white) {
                style += `
                    body.wr-mode-${i} .readerFooter_button,body.wr-mode-${i} .readerFooter_button:hover{
                        background-color:${color.bg} !important;
                        color:#2a2a2a !important;
                    }
                `
            }
        }
        style += "</style>";
        return style;
    }

})();