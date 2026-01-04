// ==UserScript==
// @name         自律助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  帮助自律
// @author       You
// @match        http://rz.muc.edu.cn/srun_portal_pc_success.php
// @match        http://rz.muc.edu.cn/srun_portal_pc.php?ac_id=1&
// @match        http://192.168.2.231:8800/home
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490244/%E8%87%AA%E5%BE%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490244/%E8%87%AA%E5%BE%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//更新后记得把学号和密码改成你们自己的！！！
// 如果有bug请及时反馈

// user_account、user_password 分别是账号和密码，账号是你的学号，密码不是身份证后六位了，和统一认证登陆一样了
var user_account='123456';
var user_password='****';


// 各个控件的 selector
var boxOfLogin='#form2';
var inputOfAccount='#username';
var inputOfPassword='#password';
var buttonOfLogin='#form2 > div:nth-child(9) > button.button2.btn_blue';
var buttonOfBack='#edit_body > div:nth-child(1) > div.edit_loginBox.ui-resizable-autohide > form > input';
// php注销
var buttonOfLogout='#top1 > button';
var buttonOfserve='#top1 > a > button';

var buttonOfout='body > div > b > b > div > section.content > div > div.row > div.col-lg-8.query-online > div > div.panel-heading > a'; //一键下线
var buttonOfYes = document.querySelector('button.btn.btn-warning');


function handleConfirmation() {
    if (window.location.href === 'http://192.168.2.231:8800/home') {
       window.setTimeout(function() {
            document.querySelector(buttonOfout).click();

            // 在点击后延迟 2 秒
            window.setTimeout(function() {
              var buttonOfYes = document.querySelector('.modal-footer .btn.btn-warning');
                if (buttonOfYes) {
                    buttonOfYes.click();
                }
                // 这里放置在点击后延迟 2 秒后执行的代码
                console.log("延迟 2 秒后执行的代码");
            }, 2000); // 2000 毫秒即 2 秒
        }, 1000); // 1000 毫秒即 1 秒


    }
}

(function() {
    'use strict';

        // 检查页面是否存在特定文本并停止脚本
       function checkTextAndStopScript() {
        // 找到包含特定文本的 p 元素
        var redTextElement = document.querySelector('p[style="color:red;text-align: center;margin-bottom: 5px;"]');
        if (redTextElement) {
            // 获取红色文本的内容
            var redTextContent = redTextElement.textContent.trim();
            // 如果文本内容不为空，暂停脚本
            if (redTextContent) {
                console.log("发现特定文本，停止脚本");
                return true; // 返回 true 表示停止脚本
            }
        }
        return false; // 返回 false 表示继续脚本
        }

            // 从本地存储获取账号和密码
        var storedAccount = localStorage.getItem('user_account');
        var storedPassword = localStorage.getItem('user_password');

              // 创建登录弹窗
        function showLoginDialog() {
            var account = prompt("请输入您的账号：", storedAccount);
            var password = prompt("请输入您的密码：", storedPassword);
            if (account && password) {
                // 记录账号和密码到本地存储
                localStorage.setItem('user_account', account);
                localStorage.setItem('user_password', password);
                // 执行登录操作
                login(account, password);
            } else {
                alert("账号和密码不能为空！");
            }
        }

        // 定义登录函数
        function login(account, password) {
            console.log("正在进行登录操作");
            // 自动填写账号密码到输入框
            document.querySelector(inputOfAccount).value = account;
            document.querySelector(inputOfPassword).value = password;
            // 自动点击登录按钮
            window.setTimeout(function() {
                document.querySelector(buttonOfLogin).click()
            }, 200);
        }

        function runScript() {
        // 如果当前页面是指定的页面，则运行脚本
        if (window.location.href === 'http://rz.muc.edu.cn/srun_portal_pc.php?ac_id=1&') {
            // 检查特定文本并停止脚本
            if (checkTextAndStopScript()) {
                return; // 如果需要停止脚本，直接返回
            }
            // 否则继续执行后续逻辑
            showLoginDialog();
          } else if (window.location.href === 'http://192.168.2.231:8800/home') {
                handleConfirmation(); // 检查当前页面是否是 http://192.168.2.231:8800/home，执行下线操作
            } else {
                // 查询已用流量元素
                var usedTrafficElement = document.querySelector('.color1');
                if (usedTrafficElement) {
                    // 获取已用流量的文本内容
                    var usedTrafficText = usedTrafficElement.textContent;
                    // 提取流量的数值部分
                    var usedTrafficValue = parseFloat(usedTrafficText.replace(/[^0-9.]/g, ''));
                    // 判断已用流量是否大于0
                    if (usedTrafficValue > 0) {
                        // 如果已用流量大于0，则进入自助服务
                        window.setTimeout(function() {
                            document.querySelector(buttonOfserve).click()
                        }, 1000);
                    } else {
                        // 否则进行注销
                        window.setTimeout(function() {
                            document.querySelector(buttonOfLogout).click()
                        }, 1000);
                    }
                } else {
                    console.log("找不到已用流量元素");
                }
            }
          }

          // 运行脚本
         runScript();



    }
)();
