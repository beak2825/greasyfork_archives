// ==UserScript==
// @name         浙工大麦课2025课程助手
// @version      0.7
// @author       1208nn
// @match        *://weiban.mycourse.cn/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1123336
// @description 快速完成2025级新生安全教育
// @downloadURL https://update.greasyfork.org/scripts/545653/%E6%B5%99%E5%B7%A5%E5%A4%A7%E9%BA%A6%E8%AF%BE2025%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545653/%E6%B5%99%E5%B7%A5%E5%A4%A7%E9%BA%A6%E8%AF%BE2025%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add CSS for floating button
    GM_addStyle(`
        #helper-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #3498db;
            color: white;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            font-weight: bold;
            user-select: none;
        }
        #helper-button:hover {
            background-color: #2980b9;
        }
    `);

    // Create and add floating button
    const floatingButton = document.createElement('div');
    floatingButton.id = 'helper-button';
    floatingButton.textContent = '完成';
    floatingButton.addEventListener('click', extractAndRequest);
    document.body.appendChild(floatingButton);

    // Register the context menu item
    GM_registerMenuCommand("完成该课程", extractAndRequest);

    function extractAndRequest() {
        // Get current URL
        const currentUrl = window.location.href;

        // Try to extract userCourseId from URL
        const userCourseIdMatch = currentUrl.match(/userCourseId=([^&]+)/);

        if (!userCourseIdMatch) {
            alert("无法从当前URL中获取userCourseId");
            return;
        }

        const userCourseId = userCourseIdMatch[1];

        // Construct the request URL
        const requestUrl = `https://weiban.mycourse.cn/pharos/usercourse/v2/${userCourseId}.do?userCourseId=${userCourseId}&tenantCode=31000007`;

        // Make the request
        GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            onload: function (response) {
                if (response.responseText != 'null({"msg":"ok","code":"0","detailCode":"0"})') {
                    console.log(response.responseText);
                    alert("失败");
                } else history.back();
            },
            onerror: function (error) {
                alert("失败");
            }
        });
    }
})();