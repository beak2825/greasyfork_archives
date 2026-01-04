// ==UserScript==
// @name         Steam.red 页面美化
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  优化 Steam.red 页面的样式，改善视觉效果
// @author       zhyunze
// @match        https://steam.red
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539529/Steamred%20%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539529/Steamred%20%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* 全局样式优化 */
        body {
            font-family: "Motiva Sans", "Twemoji", "Noto Sans", Helvetica, sans-serif;
            line-height: 1.6;
            color: #e0e0e0;
        }

        /* 主要内容区域 */
        .content {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .mid{
            padding-top:0px;
        }

        /* 导航栏优化 */
        .navbar {
            background-color: #1b2838;
            border-radius: 8px;
            padding: 0 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .navbar a {
            padding: 15px 20px;
            margin: 0 5px;
            transition: all 0.3s ease;
            border-radius: 4px;
        }

        .navbar a:hover {
            background-color: rgba(26, 159, 255, 0.2);
        }

        .navbar a.active {
            color: #1a9fff;
            font-weight: bold;
            background-color: rgba(26, 159, 255, 0.1);
        }

        .hover-line {
            height: 3px;
            bottom: -1px;
            background: linear-gradient(90deg, #1a9fff, #4dabf7);
        }

        /* 内容区域卡片样式 */
        .area-section {
            background-color: #171d25;
            border-radius: 8px;
            padding: 25px !important;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #2a3a4d;
        }

        /* 输入框样式 */
        input[type="text"] {
            background-color: #2a3a4d;
            border: 1px solid #3d4f63;
            color: #ffffff;
            padding: 12px 15px;
            border-radius: 6px;
            font-size: 16px;
            transition: all 0.3s;
            margin-bottom: 15px;
        }

        input[type="text"]:focus {
            border-color: #1a9fff;
            box-shadow: 0 0 0 2px rgba(26, 159, 255, 0.2);
            outline: none;
        }

        /* 用户信息卡片 */
        #userinfo {
            background-color: #2a3a4d;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid #3d4f63;
        }

        .avatar {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .username {
            font-size: 20px;
            margin-bottom: 8px;
            color: #ffffff;
        }

        .username a {
            color: #1a9fff;
            text-decoration: none;
        }

        .details {
            color: #b8c6d1;
            font-size: 14px;
            line-height: 1.5;
        }

        /* 游戏列表样式 */
        #searchgamelist a {
            background-color: #2a3a4d;
            border-radius: 6px;
            padding: 10px 15px;
            margin: 8px 0;
            display: block;
            transition: all 0.2s;
            border: 1px solid transparent;
        }

        #searchgamelist a:hover {
            background-color: #1a9fff;
            border-color: #1a9fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(26, 159, 255, 0.3);
        }

        /* 游戏版本项 */
        .version-item {
            background-color: #2a3a4d;
            border-radius: 6px;
            padding: 15px;
            margin: 10px 0;
            position: relative;
            border: 1px solid #3d4f63;
            transition: all 0.2s;
            flex-flow: row nowrap;
            align-items: center;
        }

        .version-item:hover {
            background-color: #314358;
            border-color: #1a9fff;
        }

        .match_img {
            border-radius: 4px;
            overflow: hidden;
            margin-right: 15px;
        }

        .match_name {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            position:unset;
            display:flex;
            align-items:center;
        }

        .match_price {
            color: #1a9fff;
            font-weight: bold;
            font-size: 18px;
            padding-right:55px;
        }

        .freetojump{
            font-size: 30px;
            padding-right:15px;
        }

        .addtocart, .remove-from-cart {
            font-size: 30px;
            cursor: pointer;
            transition: all 0.2s;
            padding-right:15px;
        }

        .addtocart:hover {
            color: #1a9fff;
            transform: scale(1.2);
        }

        .remove-from-cart:hover {
            color: #ff4757;
            transform: scale(1.2);
        }

        /* 购物车样式 */
        #cartList {
            background-color: #2a3a4d;
            border-radius: 8px;
            padding: 15px;
            width:575px;
            border: 1px solid #3d4f63;
        }

        .empty-cart {
            color: #b8c6d1;
            text-align: center;
            padding: 20px;
            font-style: italic;
        }

        /* 支付表单样式 */
        #paymentForm {
            background-color: #2a3a4d;
            border-radius: 8px;
            width:575px;
            padding: 15px;
            border: 1px solid #3d4f63;
            height:unset;
        }

        .total-amount, .discount-amount {
            font-size: 16px;
            margin-bottom: 10px;
            color: #b8c6d1;
        }

        .total-amount span, .discount-amount span {
            color: #ffffff;
            font-weight: bold;
        }

        .buy-off {
            background-color: rgba(26, 159, 255, 0.1);
            border-radius: 6px;
            padding: 10px 15px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid rgba(26, 159, 255, 0.3);
        }

        .buy-off span {
            color: #1a9fff;
            font-weight: bold;
        }

        /* 按钮样式 */
        .payment-buttons button {
            background-color: #1a9fff;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            margin: 10px 5px;
            flex: 1;
        }

        .payment-buttons button:hover {
            background-color: #1486d4;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(26, 159, 255, 0.3);
        }

        /* 表格样式 */
        #navbot_title span, #navorder_title span {
            padding: 10px;
            font-weight: bold;
        }

        #navbot_content > div, #navorder_content > div {
            margin: 5px 0;
            border-radius: 6px;
            overflow: hidden;
        }

        #navbot_content span, #navorder_content span {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
            .content {
                padding: 10px;
            }

            .navbar a {
                padding: 10px 8px;
                font-size: 14px;
            }

            .area-section {
                padding: 15px !important;
                height:fit-content;
            }

            .right{
                height:fit-content !important;
            }

            .payment-buttons button {
                width: 100%;
                margin: 5px 0;
            }
        }

        /* 滚动条美化 */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #2a3a4d;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: #1a9fff;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #1486d4;
        }

        /* 提示框美化 */
        .buy-off-tip-icon {
            background-color: #1a9fff;
            color: white;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            margin-left: 5px;
            cursor: help;
        }

        .buy-off-tip-content {
            background-color: #ffffff;
            color: #333;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid #e0e0e0;
            max-width: 300px;
            line-height: 1.5;
            bottom: 45px;
            left: -1px;
        }

        /* 开关样式优化 */
        .switch {
            width: 50px;
            height: 26px;
        }

        .slider {
            background-color: #3d4f63;
        }

        .slider:before {
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
        }

        input:checked + .slider {
            background-color: #1a9fff;
        }

        /* 分隔线美化 */
        .separator {
            background: linear-gradient(to bottom, transparent, #3d4f63, transparent);
            width: 1px;
            margin: 0 20px;
        }

        /* 更进修改 */
        
        .discount-amount span{
            font-size:30px;
        }        

        .navbar a {
            line-height: 30px;
        }
        .area-section {
                padding: 15px !important;
                height:fit-content;
            }

            .right{
                height:fit-content !important;
            }
        #searchgamelist a div:nth-child(1){
            top: 18px;
            left: 145px;
        }

        #searchgamelist a div:nth-child(3), #searchgamelist a div:nth-child(4){
            left: 148px;
        }

        #priceChart{
            width:575px;
            border-radius: 8px;
            padding: 15px;
        }

        #navorder_title{
            width:1260px;
        }

        //支付按钮颜色
        .payment-buttons button:nth-child(1){
            background:#1673F6;
        }

        .payment-buttons button:nth-child(2){
            background:#1AAD1A;
        }

        .payment-buttons button:nth-child(3){
            background:#FF8704;
        }
    `);

    // 添加一些交互效果
    document.addEventListener('DOMContentLoaded', function() {
        // 为所有按钮添加点击效果
        const buttons = document.querySelectorAll('button, .nav-link, .addtocart, .remove-from-cart');
        buttons.forEach(button => {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(1px)';
            });
            button.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // 为输入框添加聚焦效果
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = '';
            });
        });
    });
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取导航栏中所有a标签
        const navLinks = document.querySelectorAll('.navbar a');

        // 检查是否有链接
        if (navLinks.length > 0) {
            // 获取最后一个a标签
            const lastLink = navLinks[navLinks.length - 1];

            // 添加a-steam类
            lastLink.classList.add('a-steam');

            // 可选：添加一些特殊样式
            const style = document.createElement('style');
            style.textContent = `
                .navbar .a-steam {
                    margin-left: auto; /* 靠右对齐 */
                    background-color: rgba(0, 116, 228, 0.1); /* Steam蓝色背景 */
                    border: 1px solid rgba(0, 116, 228, 0.3);
                    border-radius: 4px;
                    padding: 8px 15px !important;
                    transition: all 0.3s ease;
                }

                .navbar .a-steam:hover {
                    background-color: rgba(0, 116, 228, 0.2);
                }

                .navbar .a-steam .steam-login-img {
                    height: 45px;
                    transition: transform 0.3s ease;
                }

                .navbar .a-steam:hover .steam-login-img {
                    transform: scale(1.25);
                }
            `;
            document.head.appendChild(style);
        }
    });
    window.addEventListener('load', function() {
        const hoverLine = document.querySelector('.hover-line');
        if (hoverLine) {
            hoverLine.style.transform = 'translateX(25px)';
            hoverLine.style.width = '104px';
        }
    });
})();