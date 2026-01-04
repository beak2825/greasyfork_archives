// ==UserScript==
// @name         耿大腚专属 VIP 解析
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  耿大腚，专属 VIP👻
// @author HASN from EQHASN
// @license "Copyright © 2024 by HASN from EQHASN. All rights reserved. No modification or redistribution allowed."
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/510430/%E8%80%BF%E5%A4%A7%E8%85%9A%E4%B8%93%E5%B1%9E%20VIP%20%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/510430/%E8%80%BF%E5%A4%A7%E8%85%9A%E4%B8%93%E5%B1%9E%20VIP%20%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function openPopup() {
        const popupWindow = window.open('', '_blank', 'width=500,height=600');
        popupWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #f5f5f5;
                        background-image: url("background_main.png");
                        background-size: cover;
                        background-repeat: no-repeat;
                        margin: 0;
                        padding: 0;
                    }
                   .container {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                   .search-container {
                        background-color: rgba(51, 51, 51, 0.7);
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                        display: flex;
                        flex-direction: column;
                    }
                   .search-input {
                        width: 400px;
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                    }
                   .button-style {
                        padding: 10px 20px;
                        background-color: #f36;
                        border: none;
                        border-radius: 5px;
                        color: #fff;
                        cursor: pointer;
                        margin: 5px;
                    }
                   .button-row {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                    }
                   .result-list {
                        list-style-type: none;
                        padding: 0;
                        margin: 20px;
                    }
                   .result-item {
                        background-color: #fff;
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin-bottom: 10px;
                        border-radius: 5px;
                    }
                   .result-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }
                   .result-description {
                        color: #666;
                        margin-top: 5px;
                    }
                   .shoutout {
                        position: fixed;
                        bottom: 50px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-family: "宋体";
                        font-weight: bold;
                        font-style: italic;
                        opacity: 0.7;
                        color: #888;
                    }
                </style>
                <title id="title">耿大腚，我爱你哦🤪&nbsp;&nbsp;&nbsp;&nbsp;</title>
                <link rel="icon" href="icon.png" type="image/png">
            </head>
            <body>
                <div class="container">
                    <div class="search-container">
                        <input type="text" id="urlInput">
                        <div class="button-container">
                            <div class="button-row">
                                <button id="button1" class="button-style">按钮 1</button>
                                <button id="button2" class="button-style">按钮 2</button>
                                <button id="button3" class="button-style">按钮 3</button>
                            </div>
                            <div class="button-row">
                                <button id="button4" class="button-style">按钮 4</button>
                                <button id="button5" class="button-style">按钮 5</button>
                                <button id="button6" class="button-style">按钮 6</button>
                            </div>
                        </div>
                    </div>
                    <p class="shoutout">@HASN 傻逼大屁股的耿舒楠，就知道看电视</p>
                    <script>
                        document.getElementById('button1').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`http://jiexi.vipno.cn/?v=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                        document.getElementById('button6').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`https://im1907.top/?jx=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                        document.getElementById('button3').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`https://jx.playerjy.com/?url=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                        document.getElementById('button4').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`https://jx.m3u8.tv/jiexi/?url=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                        document.getElementById('button5').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`http://www.jzmhtt.com/zdy/vip/?url=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                        document.getElementById('button2').addEventListener('click', () => {
                            const url = document.getElementById('urlInput').value;
                            const redirectedUrl = \`https://2.08bk.com/?url=\${url}\`;
                            window.location.href = redirectedUrl;
                        });
                    </script>
                </div>
            </body>
            </html>
        `);
    }

    GM_registerMenuCommand('打开耿大腚 VIP 解析', openPopup);
})();