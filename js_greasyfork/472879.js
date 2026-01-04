// ==UserScript==
// @name         视频加速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  网页内视频内容加速播放。使用方法：右键-Tampermonkey-视频加速-点击修改
// @author       Coldarra
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNjkxNzI1NDUyNjgyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQzMjMiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMTg1LjA5IDUzOC43NWMwLTkuODkgMC41OC0xNC44NSAxLjcxLTI0LjQ0IDE0LjQ3LTEyMi42MyAxMTguNzctMjE3Ljc1IDI0NS4yOC0yMTcuNzVzMjMwLjkzIDk1LjIzIDI0NS4zMSAyMThhMTc0Ljc3IDE3NC43NyAwIDAgMSAxLjY4IDI0LjI0IiBmaWxsPSIjMjc5QUNDIiBwLWlkPSI0MzI0Ii8+PHBhdGggZD0iTTUxMS4zMyA2NzIuMDRtLTgzLjYzIDBhODMuNjMgODMuNjMgMCAxIDAgMTY3LjI2IDAgODMuNjMgODMuNjMgMCAxIDAtMTY3LjI2IDBaIiBmaWxsPSIjMjc5QUNDIiBwLWlkPSI0MzI1Ii8+PHBhdGggZD0iTTUxMS4zMyA3NjMuMjJBOTEuMTkgOTEuMTkgMCAxIDEgNjAyLjUxIDY3MmE5MS4yOSA5MS4yOSAwIDAgMS05MS4xOCA5MS4yMnogbTAtMTMxLjkxQTQwLjczIDQwLjczIDAgMSAwIDU1Mi4wNiA2NzJhNDAuNzcgNDAuNzcgMCAwIDAtNDAuNzMtNDAuNjl6IiBmaWxsPSIjMzAzMDMwIiBwLWlkPSI0MzI2Ii8+PHBhdGggZD0iTTUxMS4zMyA4ODkuMDVjLTIwNi42IDAtMzc0LjY4LTE2OC4wOS0zNzQuNjgtMzc0LjY5czE2OC4wOC0zNzQuNjkgMzc0LjY4LTM3NC42OVM4ODYgMzA3Ljc1IDg4NiA1MTQuMzYgNzE3Ljk0IDg4OS4wNSA1MTEuMzMgODg5LjA1eiBtMC02OTguOTNjLTE3OC43OCAwLTMyNC4yMyAxNDUuNDUtMzI0LjIzIDMyNC4yNHMxNDUuNDUgMzI0LjIzIDMyNC4yMyAzMjQuMjMgMzI0LjI0LTE0NS40NSAzMjQuMjQtMzI0LjIzLTE0NS40NS0zMjQuMjQtMzI0LjI0LTMyNC4yNHoiIGZpbGw9IiMzMDMwMzAiIHAtaWQ9IjQzMjciLz48cGF0aCBkPSJNNzI5Ljc0IDUzOS41NGEyNS4yMiAyNS4yMiAwIDAgMS0yNS4yMy0yNS4yMmMwLTEwNi41Mi04Ni42Ni0xOTMuMTgtMTkzLjE4LTE5My4xOFMzMTguMTYgNDA3LjggMzE4LjE2IDUxNC4zMmEyNS4yMyAyNS4yMyAwIDAgMS01MC40NiAwQzI2Ny43IDM4MCAzNzcgMjcwLjY4IDUxMS4zMyAyNzAuNjhTNzU1IDM4MCA3NTUgNTE0LjMyYTI1LjIyIDI1LjIyIDAgMCAxLTI1LjI2IDI1LjIyeiIgZmlsbD0iIzMwMzAzMCIgcC1pZD0iNDMyOCIvPjxwYXRoIGQ9Ik01MTEuMzMgMzY3YTI1LjI0IDI1LjI0IDAgMCAxLTI1LjIzLTI1LjIzdi00NS44NmEyNS4yMyAyNS4yMyAwIDEgMSA1MC40NiAwdjQ1LjgyQTI1LjI0IDI1LjI0IDAgMCAxIDUxMS4zMyAzNjd6TTYzMy40IDQxNy41MmEyNS4yMyAyNS4yMyAwIDAgMS0xNy44NC00My4wN2wzMi40LTMyLjRhMjUuMjMgMjUuMjMgMCAwIDEgMzUuNjggMzUuNjhsLTMyLjQgMzIuNGEyNS4xOCAyNS4xOCAwIDAgMS0xNy44NCA3LjM5ek0zODkuMjcgNDE3LjUyYTI1LjIgMjUuMiAwIDAgMS0xNy44NS03LjM5TDMzOSAzNzcuNzNhMjUuMjMgMjUuMjMgMCAwIDEgMzUuNjgtMzUuNjhsMzIuNCAzMi40YTI1LjI0IDI1LjI0IDAgMCAxLTE3Ljg0IDQzLjA3ek0zMzguNzEgNTM5LjU4aC00NS44MmEyNS4yMyAyNS4yMyAwIDEgMSAwLTUwLjQ1aDQ1LjgyYTI1LjIzIDI1LjIzIDAgMSAxIDAgNTAuNDV6TTcyOS43OCA1MzkuNThINjg0YTI1LjIzIDI1LjIzIDAgMSAxIDAtNTAuNDVoNDUuODJhMjUuMjMgMjUuMjMgMCAwIDEgMCA1MC40NXpNNTMxLjE0IDYzNC4zNWEyNS4yMyAyNS4yMyAwIDAgMS0yMy41Ni0zNC4yM0w1NTcuNjYgNDY5YTI1LjIyIDI1LjIyIDAgMSAxIDQ3LjEzIDE4bC01MC4wOCAxMzEuMTJhMjUuMjMgMjUuMjMgMCAwIDEtMjMuNTcgMTYuMjN6IiBmaWxsPSIjMzAzMDMwIiBwLWlkPSI0MzI5Ii8+PC9zdmc+
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/472879/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/472879/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // 🟢🔴
    let menuCommand = 0;
    let speed = 1;
    const ConfigSpeed = () => {
        let elements = document.getElementsByTagName('video');
        if (elements.length === 0) {
            alert('页面中没有找到视频');
            return;
        }
        const result = prompt('请输入倍速', speed);
        let sp = parseFloat(result);
        if (sp >= 0 && sp <= 100 && elements.length > 0) {
            speed = sp;
            try {
                elements.playbackRate = sp;
            }
            catch { }
            elements.forEach((el) => {
                el.playbackRate = sp;
            });
            GM_unregisterMenuCommand(menuCommand);
            RegisterMenuCommand();
        }
    };
    const RegisterMenuCommand = () => {
        menuCommand = GM_registerMenuCommand(`🟢当前视频倍速：${speed}，点击修改`, ConfigSpeed);
    };
    RegisterMenuCommand();
})();
