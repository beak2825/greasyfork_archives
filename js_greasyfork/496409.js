// ==UserScript==
// @name         pwd填充工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填充广东法院诉讼服务网、上海法院诉讼服务网密码
// @author       Bor1s
// @match        https://ssfw.gdcourts.gov.cn/web/loginA
// @match        https://www.hshfy.sh.cn/shwfy/ssfww/login.jsp
// @icon         https://www.hshfy.sh.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496409/pwd%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/496409/pwd%E5%A1%AB%E5%85%85%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取当前页面的完整URL
    var currentUrl = window.location.href;

    if (currentUrl.indexOf('ssfw.gdcourts.gov.cn') !== -1) {
        console.log('当前在广东法院诉讼服务网');
        var checkExistence = setInterval(function() {
            var targetContainer = document.querySelector("#form_login > div > div:nth-child(3)");
            if (targetContainer) {
                clearInterval(checkExistence); // 停止检查，因为找到了目标元素
                var newButton = document.createElement('button');
                newButton.textContent = '填充密码';
                targetContainer.appendChild(newButton);
                newButton.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止按钮默认行为
                    document.querySelector("#psw").value="•••••••••";//障眼法
                    document.querySelector("#login_pwdkey_txt").value="Cc123456%";//写入真实密码
                });

            }
        }, 1000);
    }

    else if (currentUrl.indexOf('www.hshfy.sh.cn') !== -1) {
        console.log('当前在上海法院诉讼服务网');
        var checkExistence1 = setInterval(function() {
            var targetContainer1 = document.querySelector("#grlogin > form > div:nth-child(10)");
            if (targetContainer1) {
                clearInterval(checkExistence1); // 停止检查，因为找到了目标元素
                var newButton1 = document.createElement('button');
                newButton1.textContent = '填充密码';
                targetContainer1.appendChild(newButton1);
                newButton1.addEventListener('click', function(event) {
                    event.preventDefault(); // 阻止按钮默认行为
                    document.querySelector("#mm_dsr").value="Cc123456";
                });

            }
        }, 1000);
    }
})();

