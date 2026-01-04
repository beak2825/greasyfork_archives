// ==UserScript==
// @name         bilibili视频倍速
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  在B站的倍速选择中添加拖动条设置倍速
// @author       Peng
// @match        *://bilibili.tv/*
// @match        *://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546154/bilibili%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546154/bilibili%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
const sliderHTML = `
    <div class="bpx-player-speed-slider" style="padding: 8px 12px;">
        <div class="bpx-player-speed-slider-header">
            <div class="bpx-player-speed-selected">custom speed</div>
        </div>
        <div class="bpx-player-speed-slider-container">
            <div class="bpx-player-speed-indicator">
                <li class="bpx-player-speed-text bpx-player-ctrl-playbackrate-menu-item" data-value="1.00">1.00x</li>
            </div>
            <input id="bpx-player-speed-slider"
                   type="range"
                   min="0.25"
                   max="4"
                   step="0.05"
                   value="1.0"
                   style="width: 100%; margin: 8px 0;">
        </div>
    </div>
    `; // 拖动条html ai写的，感觉比较蠢，不过html只要能用就行，就懒得改了
function changeSpeed()
{
    // const text=[1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75,4].reverse();
    // text=text.map(sp=>`<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="${sp}">${sp}x</li>`).join("");
    const a = document.querySelector(".bpx-player-ctrl-playbackrate-menu"); // ul 菜单
    if (!a) return;
    // document.querySelectorAll(".bpx-player-ctrl-playbackrate-menu-item")[0].remove(); //移除2倍速
    a.style.width='130px';
    a.insertAdjacentHTML('afterbegin',sliderHTML);
    const slider = document.getElementById('bpx-player-speed-slider'); // 拖动条 input
    const speedText = document.querySelector(".bpx-player-speed-text"); // li
    // const speedValue = document.querySelector(".bpx-player-speed-value"); // 文本显示 div
    // const result=document.querySelector(".bpx-player-ctrl-playbackrate-result");
    slider.addEventListener("input", function() { // 用户拖动时
        if (speedText.isContentEditable) {
            return;
        }
        const value = parseFloat(this.value).toFixed(2);
        console.log(slider.value);
        speedText.textContent = `${value}x`;
        // speedValue.textContent = value;
        speedText.dataset.value = value;
    });
    slider.addEventListener("change", function() { // 用户拖动结束后
        speedText.click();
    });
    // 点击li标签
    speedText.addEventListener("click", function(e) {
        // e.isTrusted 检查是否为真实用户点击
        // 如果是用户点击，并且当前不是编辑状态，则可以进行响应
        // 如果是脚本点击 (isTrusted: false) 或 正在编辑中，则不处理
        if (e.isTrusted && !this.isContentEditable) {
            e.preventDefault();
            e.stopPropagation();// 阻止事件冒泡

            this.contentEditable = true;
            this.textContent = this.dataset.value; // 将 "1.00x" 变为 "1.00"
            this.style.backgroundColor = "#eee";
            this.style.color = "#222";
            this.style.outline = "1px solid #00a1d6";

            // 自动全选文本
            const range = document.createRange();
            range.selectNodeContents(this);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });

    // 按下回车
    speedText.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.blur(); // 触发失焦
        }
    });

    // 3. 失焦 (输入完成)
    speedText.addEventListener("blur", function() {
        this.contentEditable = false;
        this.style.backgroundColor = ""; // 恢复样式
        this.style.color = "";
        this.style.outline = "";

        // 获取、校验、格式化值
        let value = parseFloat(this.textContent);
        if (isNaN(value)) value = 1.0;
        if (value < 0.25) value = 0.25;
        if (value > 4) value = 4.0;
        const formattedValue = value.toFixed(2);

        // 将格式化后的值同步回所有组件
        this.textContent = `${formattedValue}x`;
        this.dataset.value = formattedValue;
        slider.value = formattedValue;

        // 触发一次非受信任(isTrusted: false)的点击从而应用速度并关闭菜单
        this.click();
    });
}
(function() {
    'use strict';
    const timeout = 5000; // 5秒超时
    const startTime = Date.now();
    console.log('start change video')
    var interval = setInterval(function() {
    var confirmButton = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
    console.log(confirmButton)
    if (confirmButton) {
        console.log('find out');
        changeSpeed();
        clearInterval(interval); // 取消定时器
    } else if (Date.now() - startTime > timeout) {
        console.log('cant find out');
        clearInterval(interval);
    }
}, 500);
})();