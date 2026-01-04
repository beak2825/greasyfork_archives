// ==UserScript==
// @name         判断验证码是否填充-雨夜
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动检测验证码长度并点击按钮
// @author       雨夜
// @match        *://mall.jd.com/showLicence-*.html
// @match        *://search.jd.com/Search*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516199/%E5%88%A4%E6%96%AD%E9%AA%8C%E8%AF%81%E7%A0%81%E6%98%AF%E5%90%A6%E5%A1%AB%E5%85%85-%E9%9B%A8%E5%A4%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516199/%E5%88%A4%E6%96%AD%E9%AA%8C%E8%AF%81%E7%A0%81%E6%98%AF%E5%90%A6%E5%A1%AB%E5%85%85-%E9%9B%A8%E5%A4%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 初始化默认值
    let switchA = GM_getValue('switchA', true); // 开关A默认开启
    let switchB = GM_getValue('switchB', true); // 开关B默认开启

    // 添加菜单选项，用于切换开关A和开关B
    GM_registerMenuCommand(`自动确认验证码 (当前状态: ${switchA ? '开启' : '关闭'})`, function() {
        switchA = !switchA;
        GM_setValue('switchA', switchA);
        alert(`自动确认验证码现在是: ${switchA ? '开启' : '关闭'}`);
    });

    GM_registerMenuCommand(`自动跳转 (当前状态: ${switchB ? '开启' : '关闭'})`, function() {
        switchB = !switchB;
        GM_setValue('switchB', switchB);
        alert(`自动跳转现在是: ${switchB ? '开启' : '关闭'}`);
    });

    // 获取当前页面的URL
    const currentURL = window.location.href;

    // 定义一个函数用于检测验证码的值
    function checkAndClick() {
        if (currentURL.includes("showLicence") && switchA) {
            // 获取验证码输入框和按钮元素
            const verifyCodeInput = document.querySelector("#verifyCode");
            const submitButton = document.querySelector("#wrap > div > div.jRatingMore > div > form > ul > li:nth-child(5) > button");

            // 检查输入框和按钮是否存在
            if (verifyCodeInput && submitButton) {
                // 每隔500毫秒检查一次验证码长度
                const intervalId = setInterval(() => {
                    // 如果验证码长度为4，点击按钮并停止循环
                    if (verifyCodeInput.value.length === 4) {
                        submitButton.click();
                        clearInterval(intervalId); // 停止循环
                    }
                }, 500);
            }
        }else if (currentURL.includes("Search") && switchB) {
            // 京东文字策略
            if (currentURL.includes("Search")) {
                for (var c = 1; c < 61; c++) {
                    var btnjd =document.querySelector("#J_goodsList > ul > li:nth-child("+ c +") > div > div.p-shop > span > a")
                    //如果btnjd为空则切换规则
                    if(btnjd == null){
                        console.log("未找到指定的元素"+btnjd)
                        btnjd =document.querySelector("#J_goodsList > ul > li:nth-child("+ c +") > div > div.p-shopnum > a")
                    }

                    const urlParams = new URLSearchParams(window.location.search);
                    const keyword = urlParams.get('keyword');
                    var 局_京东搜索词 = keyword
                    if(btnjd.innerText == 局_京东搜索词) {
                        // 确认元素存在并获取 exparams 属性的值
                        if (btnjd) {
                            var 局_京东店铺id = btnjd.getAttribute('href');

                            // 使用正则表达式提取出 atp_isdpp= 后面的值
                            var match = 局_京东店铺id.match(/index-(\w+)\.html\?/);

                            if (match && match[1]) {
                                var 局_店铺id = decodeURIComponent(match[1]); // 解码 URL 编码的值
                                console.log("提取的值是: ", 局_店铺id);
                                window.open("https://mall.jd.com/showLicence-"+局_店铺id+".html");
                                break;
                            } else {
                                console.log("未找到符合的值");
                            }
                        } else {
                            console.log("未找到指定的元素");
                        }
                    }}

            }// 京东策略结束
        }

    }

    // 页面加载后执行检测
    window.addEventListener('load', checkAndClick);
})();
