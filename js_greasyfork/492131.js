// ==UserScript==
// @name         【加速工具，按要求下载使用】国家开放大学/国开全网办学平台/上海开放/广东开放等开放大学全部可以自动刷课
// @namespace    一心向善
// @version      0.0.3
// @description  直接可以秒学相关视频自动学习自动看视频程序，如失效，最新版免费获取可反馈群：756253160
// @license      MIT
// @author       yelo
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492131/%E3%80%90%E5%8A%A0%E9%80%9F%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%8C%89%E8%A6%81%E6%B1%82%E4%B8%8B%E8%BD%BD%E4%BD%BF%E7%94%A8%E3%80%91%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%BD%E5%BC%80%E5%85%A8%E7%BD%91%E5%8A%9E%E5%AD%A6%E5%B9%B3%E5%8F%B0%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E7%AD%89%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%85%A8%E9%83%A8%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/492131/%E3%80%90%E5%8A%A0%E9%80%9F%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%8C%89%E8%A6%81%E6%B1%82%E4%B8%8B%E8%BD%BD%E4%BD%BF%E7%94%A8%E3%80%91%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9B%BD%E5%BC%80%E5%85%A8%E7%BD%91%E5%8A%9E%E5%AD%A6%E5%B9%B3%E5%8F%B0%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E7%AD%89%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%85%A8%E9%83%A8%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create the floating window
    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'floating-window';
    floatingWindow.innerHTML = `
        <div id="close-button" onclick="closeFloatingWindow()">×</div>
        <a id="download-button" href="https://laozihaowangke.lanzouq.com/b0ize9hqf" target="_blank">脚本无效，直接点击这里下载工具使用（密码：640105435），帮做可加Q 640105435</a>
        <img id="custom-image" src="http://m.qpic.cn/psc?/V53jO7n43Uu0oV4d70DV1k2Qwp1gtWoi/bqQfVz5yrrGYSXMvKr.cqZHDUQ2O.kp74J*D8W90whbGY1k*KVSirSGowDUIOt6kmNEBq1*nNEVdhsauDyWtbdLCdbwBDn9sz7Vd4fAZJSo!/b&bo=rAOpBqwDqQYBFzA!&rf=viewer_4&t=5">
    `;
    document.body.appendChild(floatingWindow);

    // Style the floating window
    const style = document.createElement('style');
    style.textContent = `
        #floating-window {
            position: fixed;
            top: 50%;
            left: 10%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            width: 300px;
            height: 400px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 999;
            overflow: hidden;
        }

        #close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }

        #download-button {
            display: block;
            margin-top: 10px;
            padding: 8px 12px;
            background-color: #4CAF50;
            color: #fff;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
        }

        #custom-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    `;
    document.head.appendChild(style);

    // Function to close the floating window
    window.closeFloatingWindow = function () {
        floatingWindow.style.display = 'none';
    };
        setTimeout(function () {
        closeFloatingWindow();
    }, 10000);
})();
