// ==UserScript==
// @name         EA跳转到忘记密码页面
// @namespace    http://tampermonkey.net/
// @version      2024-04-30
// @description  这是一个帮助同事帮忙加快效率的东西
// @author       Kinjaz
// @match        https://www.ea.com/zh-cn
// @match        https://signin.ea.com/p/juno/login*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493496/EA%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%BF%98%E8%AE%B0%E5%AF%86%E7%A0%81%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/493496/EA%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%BF%98%E8%AE%B0%E5%AF%86%E7%A0%81%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义一个函数，用于尝试查找元素的方法
    function findElementWithDelay(selector, maxAttempts, interval) {
        var attempts = 0;
        // 定义一个定时器
        var timer = setInterval(function() {
            attempts++;
            console.log("第几次:"+attempts);
            // 尝试查找元素
            var element = document.querySelector(selector);
            // 如果找到了元素，停止定时器并输出元素
            if (element) {
                // 这里可以执行你想要的操作
                var showNavElement = document.querySelector('.show-nav');
                if (showNavElement) {
                    var shadowRoot = showNavElement.shadowRoot;
                    if (shadowRoot) {
                        // 在 Shadow DOM 中查找元素
                        var elementInsideShadowDOM = shadowRoot.querySelector('.eapl-network-nav__menu-item-button')
                        if (elementInsideShadowDOM) {
                            // 找到了元素，可以进行操作
                            console.log(elementInsideShadowDOM);
                            // 找到元素并点击页面
                            elementInsideShadowDOM.click()
                            // 找到登录页面,并点击跳转
                            var eaGlobalNavLinkImage = shadowRoot.querySelector('.eaGlobalNav_linkImage')
                            // 找到登录页面点击，没找到则继续循环
                            if(eaGlobalNavLinkImage){
                                console.log(eaGlobalNavLinkImage)
                                clearInterval(timer);
                                console.log("找到元素:", eaGlobalNavLinkImage);
                                eaGlobalNavLinkImage.click()
                            }
                        } else {
                            console.log('未找到在 Shadow DOM 中的元素。');
                        }
                    } else {
                        console.log('该元素没有 Shadow DOM。');
                    }
                } else {
                    console.log('未找到具有 .show-nav 类的元素。');
                }
            }
            // 如果超过最大尝试次数仍然没有找到元素，停止定时器并输出错误信息
            if (attempts >= maxAttempts) {
                clearInterval(timer);
                console.log("超过最大尝试次数，未找到元素:", selector);
            }
        }, interval);
    }

    window.addEventListener('load', function() {
        // 在页面加载完成后执行的操作
        // 获取当前页面的 URL
        var currentURL = window.location.href;

        // 定义 @match 中的匹配模式
        var matchPatterns = [
            'https://signin.ea.com/p/juno/login*',
        ];

        var matchLogin = [
            'https://www.ea.com/zh-cn',
        ]

        // 检查当前页面是否匹配了任何一个模式
        var isMatched = matchPatterns.some(function(pattern) {
            return currentURL.startsWith(pattern.replace('*', ''));
        });

        var isLogin = matchLogin.some(function(pattern) {
            return currentURL.startsWith(pattern.replace('*', ''));
        });
        // 登录页面判断执行函数
        if(isLogin){
            // 调用函数进行查找，传入选择器、最大尝试次数和间隔时间
            findElementWithDelay('.show-nav', 10, 400); // 尝试每秒查找一次，最多尝试10次
        }
        if (isMatched) {
            console.log("当前页面匹配了 @match 中定义的网址模式。");
            // 匹配
            // 检查会话存储中是否存在标记
            var visited = sessionStorage.getItem('EA');
            // 如果标记不存在，表示是第一次访问，进行跳转并设置标记
            if (!visited) {
                // 设置访问标记为 true
                sessionStorage.setItem('EA', 'true');
                console.log('哥们是第一次访问EA');
                // 第一次进入页面时,点击我忘记密码元素
                if($('#forget-password')){
                    $('#forget-password').click()
                }
            }else{
                console.log('哥们这地方已经来过了!');
            }
        } else {
            console.log("当前页面不匹配 @match 中定义的网址模式。");
        }


        console.log('页面加载完成！');
    });

})();