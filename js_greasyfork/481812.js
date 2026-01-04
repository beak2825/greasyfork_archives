// ==UserScript==
// @name         Netflix 踢人工具
// @namespace    NetflixLogoutTool
// @version      0.2
// @description  快速按 Profile 踢掉用户的设备
// @author       TGSAN
// @include      /https{0,1}\:\/\/www.netflix.com/manageaccountaccess
// @run-at       document-end
// @grant        GM_unregisterMenuCommand
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/481812/Netflix%20%E8%B8%A2%E4%BA%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/481812/Netflix%20%E8%B8%A2%E4%BA%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener("load", () => {
        let timeoutId = setInterval(() => {
            if (document.getElementsByClassName("device-list-item").length > 0) {
                clearInterval(timeoutId);
                let userMap = new Map();
                for (let element of document.getElementsByClassName("device-list-item")) {
                    let deviceId = element.getElementsByClassName("device-list-item-header")[0].getAttribute("data-uia");
                    let profileName = element.getElementsByClassName("profile-name")[0].innerText;
                    let buttons = element.getElementsByTagName("button");
                    if (buttons.length > 0) {
                        if (!userMap.has(profileName)) {
                            userMap.set(profileName, new Array());
                        }
                        /** @type {Array} */
                        let logoutItems = userMap.get(profileName);
                        logoutItems.push({
                            button: buttons[0],
                            deviceId: deviceId
                        });
                    }
                }

                function logoutUsingAPI(profileName) {
                    let userAuthURL;
                    try {
                        userAuthURL = unsafeWindow.netflix.reactContext.models.userInfo.data.authURL;
                    } catch {
                        alert("无法获取 Netflix API 验证密钥，直接操作网页");
                        return;
                    }
                    let logoutItems = userMap.get(profileName);
                    logoutItems.forEach(logoutItem => {
                        let body = "authURL=" + encodeURIComponent(userAuthURL) +
                            "&param=" + encodeURIComponent(JSON.stringify({
                                "flow": "memberSimplicity",
                                "mode": "manageAccountAccess",
                                "action": "deviceSignOutAction",
                                "fields": {
                                    "esn": {
                                        "value": logoutItem.deviceId
                                    }
                                }
                            }));
                        fetch("https://www.netflix.com/api/aui/pathEvaluator/web/%5E2.0.0?netflixClientPlatform=browser&method=call&callPath=%5B%22aui%22%2C%22moneyball%22%2C%22next%22%5D", {
                            "body": body,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                    });
                }

                function logoutUsingClick(profileName) {
                    /** @type {Array} */
                    let logoutItems = userMap.get(profileName);
                    logoutItems.forEach(logoutItem => {
                        logoutItem.button.click()
                    });
                }

                for (let profileName of userMap.keys()) {
                    GM_registerMenuCommand("踢掉 " + profileName, () => {
                        logoutUsingAPI(profileName);
                        logoutUsingClick(profileName);
                    });
                }
            }
        }, 1000);
    });
})();