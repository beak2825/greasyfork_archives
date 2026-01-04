// ==UserScript==
// @name         旋转水印（网址定制）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在左上角显示旋转 45° 的文字水印，可定制梯形背景、透明度、颜色、大小等
// @author       aotmd
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528838/%E6%97%8B%E8%BD%AC%E6%B0%B4%E5%8D%B0%EF%BC%88%E7%BD%91%E5%9D%80%E5%AE%9A%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528838/%E6%97%8B%E8%BD%AC%E6%B0%B4%E5%8D%B0%EF%BC%88%E7%BD%91%E5%9D%80%E5%AE%9A%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ✅ 网址配置（不同网站不同样式）
    const config = {
        "example.com": {
            text: "示例网站",
            fontSize: 24,
            textColor: "#000000",
            backgroundColor: "#ffcccc",
            opacity: 0.6,
            trapezoidHeight: 30,  // 梯形高度
            strokeColor: "#ff0000"
        },
        "10.80.20.111": {
            text: "测试环境",
            fontSize: 30,
            textColor: "#ffffff",
            backgroundColor: "blue",
            opacity: 0.7,
            trapezoidHeight: 35,
            strokeColor: "#ffffff"
        },
        "10.97.192.86": {
            text: "开发环境",
            fontSize: 30,
            textColor: "#ffffff",
            backgroundColor: "#ff0000",
            opacity: 0.7,
            trapezoidHeight: 35,
            strokeColor: "#ffffff"
        }
    };

    // 获取当前网站的 host
    const host = window.location.hostname;
    let siteConfig = null;
    for (const site in config) {
        if (host.includes(site)) {
            siteConfig = config[site];
            break;
        }
    }

    // 如果当前网址有匹配的配置，则生成水印
    if (siteConfig) {
        const { text, fontSize, textColor, backgroundColor, opacity, trapezoidHeight, strokeColor } = siteConfig;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 计算文字尺寸
        ctx.font = `${fontSize}px Arial`;
        const textWidth = fontSize * 3.11;
        const textHeight = fontSize * 1.5; // 文字高度

        // 计算旋转后画布大小
        const canvasSize = Math.ceil(Math.sqrt((textWidth + trapezoidHeight * 2) ** 2 + (textHeight + trapezoidHeight * 2) ** 2));
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // 旋转画布
        ctx.translate(canvasSize / 2, canvasSize / 2);
        ctx.rotate(-Math.PI / 4); // 逆时针旋转 45°
        ctx.translate(-canvasSize / 2, -canvasSize / 2);

        // ✅ 绘制“底边 45° 的梯形”背景
        ctx.globalAlpha = opacity;
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();

        // 根据梯形高度计算底边的基线长度
        const diagonalLength = Math.sqrt(Math.pow(canvasSize, 2) * 2); // 画布的对角线
        const bottomWidth = diagonalLength;  // 底边等于对角线

        // 设置梯形的高度（垂直方向增加）
        const topWidth = textWidth * 999;  // 上边较短
        const centerX = canvasSize / 2;
        const bottomY = fontSize+trapezoidHeight;  // 梯形底边的基线在画布的底部基线位置
        const topY = bottomY - fontSize-trapezoidHeight; // 高度垂直向上增加
        debugger

        // 计算梯形的四个顶点
        ctx.moveTo(centerX - topWidth / 2, topY);  // 顶边左侧
        ctx.lineTo(centerX + topWidth / 2, topY);  // 顶边右侧
        ctx.lineTo(centerX + bottomWidth / 2, bottomY); // 底边右侧
        ctx.lineTo(centerX - bottomWidth / 2, bottomY); // 底边左侧
        ctx.closePath();
        ctx.fill();

        // ✅ 绘制边框
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // ✅ 绘制文字
        ctx.fillStyle = textColor;
        ctx.globalAlpha = 1; // 文字不透明
        ctx.textAlign = "center";  // 水平居中
        ctx.textBaseline = "middle"; // 垂直居中
        ctx.font = `${fontSize}px Arial`; // 设置文字大小
        ctx.fillText(text, centerX, (topY + bottomY) / 2);  // 文字垂直居中

        // ✅ 生成图片并插入页面
        const img = document.createElement("img");
        img.src = canvas.toDataURL();
        img.style.position = "fixed";
        img.style.top = "0px";
        img.style.left = "0px";
        img.style.zIndex = "9999";
        img.style.pointerEvents = "none"; // 让鼠标事件穿透
        document.body.appendChild(img);
    }
})();
