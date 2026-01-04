// ==UserScript==
// @name          VV吃到爆
// @namespace     https://github.com/Spartan859
// @version       0.1
// @description   登录vv网站，在商品页面按下 alt+数字1 即可，完成一轮购买后会回到商品页面，再次按下 alt+数字1 重复此操作
// @copyright     2024, Spartan859 (https://github.com/Spartan859)
// @license       MIT
// @author        异步
// @match         *://vvstore.jp/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/521227/VV%E5%90%83%E5%88%B0%E7%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/521227/VV%E5%90%83%E5%88%B0%E7%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 监听键盘事件
    document.addEventListener('keydown', function (event) {
        // 如果按下的是'1'键
        if (event.altKey && event.key === '1' && window.location.href.includes('/products/detail/')) {
            // 保存当前网址到 localStorage
            localStorage.setItem('redTo', window.location.href);

            // 查找<select>元素
            const selectElement = document.querySelector('select#quantity[name="quantity"]');

            // 如果找到了这个<select>元素
            if (selectElement) {
                // 获取 <select> 中所有的 <option> 元素
                const options = Array.from(selectElement.options);

                // 找到最大值
                const maxValue = options.reduce((max, option) => {
                    const value = parseInt(option.value, 10);
                    return isNaN(value) ? max : Math.max(max, value);
                }, 0);

                // 设置选中值为最大值
                selectElement.value = maxValue.toString();
                // 查找并点击按钮
                const submitButton = document.querySelector('button[type="submit"].add-cart');

                if (submitButton) {
                    submitButton.click(); // 点击按钮
                    // 等待页面跳转并加载完成
                    setTimeout(() => {
                        // 跳转到购物车页面
                        window.location.href = 'https://vvstore.jp/cart';
                    }, 100); // 延迟100ms等待跳转
                }
            }
        }
    });

    // 监听页面加载完成
    window.addEventListener('load', function () {
        if (window.location.href === 'https://vvstore.jp/cart') {
            // 查找并点击含有"レジに進む"字样的链接
            const cartLink = Array.from(document.querySelectorAll('a'))
                .find(link => link.textContent.includes('レジに進む'));

            if (cartLink) {
                cartLink.click(); // 点击该链接
            }
        }

        if (window.location.href === 'https://vvstore.jp/shopping') {
            // 查找包含"コンビニ先払い"字样的div
            const paymentDiv = Array.from(document.querySelectorAll('.payment-radio'))
                .find(div => div.textContent.includes('コンビニ先払い'));

            if (paymentDiv) {
                // 查找对应的input
                const paymentInput = paymentDiv.querySelector('input[type="radio"]');

                // 如果input还未选中则选中它
                if (paymentInput && !paymentInput.checked) {
                    paymentInput.click(); // 模拟点击以选中
                    console.log("payment clicked");
                } else {
                    console.log("payment ok");
                    // 如果已经选中了，则继续查找"ファミリーマート"选项
                    const convenienceDiv = Array.from(document.querySelectorAll('.cvs_form_image'))
                        .find(div => div.textContent.includes('ファミリーマート'));

                    if (convenienceDiv) {
                        // 查找对应的input
                        const convenienceInput = convenienceDiv.querySelector('input[type="radio"]');
                        console.log(convenienceInput);
                        // 如果input还未选中则选中它
                        if (convenienceInput) {
                            convenienceInput.click(); // 模拟点击以选中
                            console.log("convenience clicked");
                        }
                        // 如果已经选中，则点击确认按钮
                        const confirmButton = Array.from(document.querySelectorAll('button'))
                            .find(button => button.textContent.includes('確認する'));

                        if (confirmButton) {
                            confirmButton.click(); // 点击确认按钮
                            console.log("confirm clicked");
                        }
                    }
                }
            }
        }

        // 如果页面是 https://vvstore.jp/shopping/confirm
        if (window.location.href === 'https://vvstore.jp/shopping/confirm') {
            // 查找并点击包含"注文する"字样的按钮
            const orderButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('注文する'));

            if (orderButton) {
                orderButton.click(); // 点击"注文する"按钮
                console.log(orderButton);
            }
        }

        // 如果页面是 https://vvstore.jp/shopping/complete
        if (window.location.href === 'https://vvstore.jp/shopping/complete') {
            // 从 localStorage 获取 redTo 地址并跳转
            const redTo = localStorage.getItem('redTo');
            if (redTo) {
                window.location.href = redTo; // 跳转到 redTo
            }
        }
    });
})();