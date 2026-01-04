// ==UserScript==
// @name         Twitter Scroll to Top Button
// @namespace    mundane
// @version      1.1
// @description  Add a button to scroll the page to the top on Twitter website
// @author       none
// @match        https://twitter.com/*
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB0PSIxNjk5NDU4NzE3NjU4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQwMTgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ5LjkyIDUxLjJIMTc0LjA4Yy02Ny44NjU2IDAtMTIyLjg4IDU1LjAxNDQtMTIyLjg4IDEyMi44OHY2NzUuODRjMCA2Ny44NjU2IDU1LjAxNDQgMTIyLjg4IDEyMi44OCAxMjIuODhoNjc1Ljg0YzY3Ljg2NTYgMCAxMjIuODgtNTUuMDE0NCAxMjIuODgtMTIyLjg4VjE3NC4wOGMwLTY3Ljg2NTYtNTUuMDE0NC0xMjIuODgtMTIyLjg4LTEyMi44OHogbS05My42NTUwNCAzMzYuNTg4OGEzMTcuMDgxNiAzMTcuMDgxNiAwIDAgMSAwLjQzNTIgMTYuMTE3NzZjMCAxNjUuMTYwOTYtMTI2LjgyMjQgMzU1LjUzNzkyLTM1OC42NTYgMzU1LjUzNzkyLTcxLjE0NzUyIDAtMTM3LjQyMDgtMjAuNzIwNjQtMTkzLjI0NDE2LTU2LjA1ODg4YTI0OC42MjcyIDI0OC42MjcyIDAgMCAwIDMwLjA0OTI4IDEuNzY2NCAyNTQuODA3MDQgMjU0LjgwNzA0IDAgMCAwIDE1Ni41NjQ0OC01My40NTc5MmMtNTUuMTM3MjgtMS4wODU0NC0xMDEuNjc4MDgtMzcuMjgzODQtMTE3LjcxMzkyLTg2Ljc5NDI0IDcuNjc0ODggMS4zNzIxNiAxNS42MTYgMi4yOTg4OCAyMy43NDY1NiAyLjI5ODg4YTEyNC42MjA4IDEyNC42MjA4IDAgMCAwIDMzLjEzMTUyLTQuNTAwNDhjLTU3LjYxMDI0LTExLjQ3OTA0LTEwMS4wODQxNi02MS45NDE3Ni0xMDEuMDg0MTYtMTIyLjU0MjA4di0xLjQ2NDMyYzE3LjAyOTEyIDkuMjE2IDM2LjQ4NTEyIDE0Ljk2MDY0IDU3LjE1NDU2IDE1LjU5NTUyLTMzLjg1ODU2LTIyLjQ5NzI4LTU2LjA2NC02MC42NjY4OC01Ni4wNjQtMTA0LjAzMzI4IDAtMjIuODE0NzIgNi4xNDkxMi00NC40MzY0OCAxNy4wNjQ5Ni02Mi45MDQzMmEzNTkuMjE5MiAzNTkuMjE5MiAwIDAgMCAyNTkuODA0MTYgMTMwLjYyMTQ0IDEyNS4zNzM0NCAxMjUuMzczNDQgMCAwIDEtMy4yOTIxNi0yOC41MDgxNmMwLTY4Ljk3NjY0IDU2LjQyNzUyLTEyNC45MTI2NCAxMjYuMDU5NTItMTI0LjkxMjY0IDM2LjI0NDQ4IDAgNjguOTYxMjggMTUuMDc4NCA5MS44ODg2NCAzOS40MDM1MiAyOC43MzM0NC01LjUyOTYgNTUuNzMxMi0xNi4wMjU2IDgwLjA5NzI4LTMwLjMwNTI4LTkuNDAwMzIgMjkuMTI3NjgtMjkuNDI0NjQgNTMuNzg1Ni01NS40ODAzMiA2OS4yNDI4OCAyNS42MjA0OC0zLjE0ODggNDkuODk0NC05LjgyMDE2IDcyLjQ3ODcyLTE5LjgyNDY0YTI0Ny44NDM4NCAyNDcuODQzODQgMCAwIDEtNjIuOTQwMTYgNjQuNzIxOTJ6IiBmaWxsPSIjMDNBOUY0IiBwLWlkPSI0MDE5Ij48L3BhdGg+PC9zdmc+
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464905/Twitter%20Scroll%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/464905/Twitter%20Scroll%20to%20Top%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建回到顶部的按钮
    const btn = document.createElement('div');
    btn.innerHTML = `<svg t="1682512204349" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6702" width="48" height="48"><path d="M721.12 529.28C708.64 541.76 688.384 541.76 675.872 529.28L544 397.12 544 736C544 753.6 529.696 768 512 768 494.304 768 480 753.6 480 736L480 397.12 348.128 529.28C335.616 541.76 315.328 541.76 302.88 529.28 290.368 516.48 290.368 496.32 302.88 483.84L483.872 302.72C491.552 295.04 502.048 292.8 512 294.72 521.952 292.8 532.448 295.04 540.128 302.72L721.12 483.84C733.632 496.32 733.632 516.48 721.12 529.28L721.12 529.28ZM512 0C229.216 0 0 229.12 0 512 0 794.88 229.216 1024 512 1024 794.784 1024 1024 794.88 1024 512 1024 229.12 794.784 0 512 0L512 0Z" fill="#1296db" p-id="6703"></path></svg>`;
    btn.style.position = 'fixed';
    btn.style.right = '500px';
    btn.style.bottom = '75px';

    btn.style.cursor = 'pointer';



    document.body.appendChild(btn);

    // 点击按钮时滚动页面到顶部
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();
