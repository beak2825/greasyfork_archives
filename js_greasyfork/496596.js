// ==UserScript==
// @name         微助教刷题助手
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  微助教助手,方便刷题
// @author       陈正山(一作),故一鸣(二作).
// @match        https://v18.teachermate.cn/wechat-pro-ssr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teachermate.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496596/%E5%BE%AE%E5%8A%A9%E6%95%99%E5%88%B7%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496596/%E5%BE%AE%E5%8A%A9%E6%95%99%E5%88%B7%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//# 说明
//由陈正山先生开发,故一鸣添加部分功能后包装发布 2024/05/30
(function() {
    // 创建一个按钮元素
    var button = document.createElement('button');
    button.innerHTML = '点这!点这';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 点击按钮时执行代码
    button.addEventListener('click', function() {
        const Super = function() {
            // 代码逻辑在这里
// 新建一个`<script>`标签
        var scriptTag = document.createElement('script');

        // 设置script标签的src属性为jQuery的CDN链接
        scriptTag.src = 'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js';

        // 将script标签添加到<head>中
        document.head.appendChild(scriptTag);

        // 确保jQuery加载完成后执行某些操作
        scriptTag.onload = function() {
            // jQuery已加载，这里可以写你的jQuery代码或者其他的初始化代码
            console.log("jQuery has been loaded.");

            // 隐藏正确两个字
            $('div._29QKfG9V63SUWvTm3lgpyN._3rkvj9myR5z12WNHzggGBP').addClass('display_before_right').hide();
            // 隐藏绿色框框
            $('button._29hpjgQIouRrKP_wrCQ_j4._3qrct44uFa3gR022CfhzmW').removeClass('_3qrct44uFa3gR022CfhzmW').addClass('right_button');
            // 隐藏绿色选项
            $('div._3SfXe4Pk9VIXxFGZ-UN2Pu._1nsM4ePtqsd3ODmCJ3xJAk').removeClass('_1nsM4ePtqsd3ODmCJ3xJAk').addClass('_3z4-DQQsb8C5SZC9S0xD4H right_option');
            //隐藏错误两个字
            $('div._29QKfG9V63SUWvTm3lgpyN.gFluL-l_XxqjVuJX_mxnn').addClass('display_before_right').hide();
            //隐藏红色框框
            $('button._29hpjgQIouRrKP_wrCQ_j4._1EE77L4zSfqKMxj47h9dUa').removeClass('_1EE77L4zSfqKMxj47h9dUa').addClass('right_button');
            //隐藏正确错误字段
            //$('div._1zWNB_N5SnaxIUxqoa5sgQ').removeClass('_1zWNB_N5SnaxIUxqoa5sgQ').addClass('display_before_right').hide();

            // 隐藏答案和解析等等
            $('div._1GQWsnyBYbY83qz0BeTKEv:contains("正确答案")').parent().addClass('display_before_right').hide();
            $('div._1GQWsnyBYbY83qz0BeTKEv:contains("正确答案")').parent().next().addClass('display_before_right').hide();
            $('div._1GQWsnyBYbY83qz0BeTKEv:contains("正确答案")').parent().next().next().addClass('display_before_right').hide();

            // 点击到正确答案就显示出来
            $('button').click(function() {
                if($(this).hasClass('right_button')) {
                    // que是一整道题的容器
                    let que = $(this).parent().parent();

                    // 显示绿色框框
                    $(this).addClass("_3qrct44uFa3gR022CfhzmW");
                    // 显示绿色选项
                    que.find(".right_option").removeClass("_3z4-DQQsb8C5SZC9S0xD4H").addClass("_1nsM4ePtqsd3ODmCJ3xJAk");

                    que.find('.display_before_right').show();
                } else {
                    // 如果div元素不含LLL类，这里的逻辑将会执行
                    $(this).attr("style", "background-color: rgba(255, 105, 105, 0.3)")
                }
                console.log("测试确定");
            });
            console.log("代码已触发");
        };
            console.log("代码已触发");
        };
        setTimeout(Super, 50);
    });
})();
