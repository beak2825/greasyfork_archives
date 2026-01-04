// ==UserScript==
// @name         XCUWIFI自动登录
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  实现了许昌学院 XCU WIFI自动登录
// @author       许昌学院 - Jawon
// @match        *://10.5.0.100/*
// @icon         https://www.xcu.edu.cn/favicon.ico
// @run-at       document-end
// @license MIT
// @grant window.close
// @downloadURL https://update.greasyfork.org/scripts/453643/XCUWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453643/XCUWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

/*
    使用步骤：
        1.在电脑WiFi列表将校园网XCU设置为自动连接
        2.手动登录一次10.5.0.100并选择记住密码
        3.若要完全自动化，需要设置连接 WIFI 后自动打开 10.5.0.100 登录，可联系 QQ2870881842，获取具体配置步骤
*/

(function () {
    "use strict";

    //如果是自助服务页面，就下线所有设备
    if (RegExp("10.5.0.100:8800", "i").test(location.href)) {
        let LogoutItv = setInterval(() => {
            //点击一键下线按钮
            let LogoutALL = document.querySelector(".btn.btn-xs.btn-danger");
            if (LogoutALL) {
                LogoutALL.click();
                setTimeout(() => {
                    let YesBtn = document.querySelector(".btn.btn-warning");
                    if (YesBtn) {
                        YesBtn.click();
                    }
                }, 500);
            }
            else{
                //返回登录页面
                location.href = "http://10.5.0.100";
            }
        }, 1000);
        return;
    }

    let waitSeconds = 0;
    let clicked = false;
    let queryInterval = setInterval(() => {
        let loginBtn = document.querySelector("#login-account");
        let logoutBtn = document.querySelector("#logout");

        // 如果找到注销按钮就不再查询
        if (logoutBtn != undefined) {
            console.log("已登录");
            clearInterval(queryInterval);
            window.close();
        }
        // 超时后停止查询
        else if (waitSeconds > 20) {
            console.log("登录超时，已停止自动登录");
            clearInterval(queryInterval);
        }
        // 如果找到登录按钮就点一下
        else if (loginBtn != undefined) {
            //防止频繁点击被检测
            if (clicked) return;

            loginBtn.click();
            console.log("已点击登录");
            clicked = true;
            setTimeout(() => {
                //检测是否提示已有设备登录错误
                let errorLog = document.querySelector("body > div:nth-child(10) > div > div.content > div.section");
                if (errorLog && (RegExp("E2901", "i").test(errorLog.innerText))) {
                    //去自助页面强制下线其他设备
                    document.querySelector("#self-service").click();
                    window.close();
                    // location.href = "https://10.5.0.100:8800/home";
                }
            }, 500);
            setTimeout(() => {
                clicked = false;
            }, 2000);
        }
        waitSeconds++;
    }, 300);

})();
