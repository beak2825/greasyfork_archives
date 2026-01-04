// ==UserScript==
// @name         狐蒂云双11抢购脚本（优化版）
// @namespace    http://tampermonkey.net/
// @version      v1.0.7
// @description  狐蒂云自动化抢购流程脚本
// @author       StarMi
// @match        https://www.szhdy.com/*
// @match        https://www.hbhdy.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAMAAAD+iNU2AAAAOVBMVEVHcEzWWhreXRzeXhzeXRzdXRzdXRzbXBvRWBrXWhrdXRzeXRzeXRzeXhzcXBvbXBvcXBveXRzfXhx0pw3NAAAAEnRSTlMAH7PzuYaYPRQppcbZ4nNOYc/ImzItAAAAiklEQVQImUWPRxbEIAxDRe9N9z9s7CF5o41AmC8ARMnS1Z3x6tAl/NU41EoYVDdRrZINU+/unfahaBY9rlN5IYToHQUzrISr2iUExwL+IMiHJsA32Yevhh0NnSw3EOTKiHwDIwNVIFoV5a09VnrJvQZcZyBflEkp504fza3CtENHbPp+uKyj80aXDyC0BppnKUBnAAAAAElFTkSuQmCC
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513353/%E7%8B%90%E8%92%82%E4%BA%91%E5%8F%8C11%E6%8A%A2%E8%B4%AD%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513353/%E7%8B%90%E8%92%82%E4%BA%91%E5%8F%8C11%E6%8A%A2%E8%B4%AD%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 主函数，执行抢购逻辑
const doIt = () => {
    // 检查当前页面是否为活动页面
    const isActivityPage = location.href.includes("activities/default.html?method=activity");
    // 检查当前页面是否为配置产品页面
    const isConfigureProductPage = location.href.includes("action=configureproduct");
    // 检查当前页面是否为购物车页面
    const isViewCartPage = location.href.includes("action=viewcart");

    // 如果在活动页面
    if (isActivityPage) {
        handleActivityPage(); // 调用处理活动页面的函数
    }
    // 如果在配置产品页面
    else if (isConfigureProductPage) {
        handleConfigureProductPage(); // 调用处理配置产品页面的函数
    }
    // 如果在购物车页面
    else if (isViewCartPage) {
        handleViewCartPage(); // 调用处理购物车页面的函数
    }
};

// 处理活动页面的逻辑
const handleActivityPage = () => {
    // 获取美国云主机的商品卡片
    const serviceCard = document.querySelector("[data-id='230']");
    // 获取提交按钮
    const submitButton = serviceCard?.querySelector(".form-footer-butt");

    // 检查提交按钮是否存在
    if (submitButton) {
        // 如果商品已售罄，提交按钮会有 onclick 属性
        if (submitButton.hasAttribute("onclick")) {
            location.reload(); // 刷新页面以尝试重新获取商品
        } else {
            submitButton.click(); // 点击提交按钮进入购物车页面
        }
    }
};

// 处理配置产品页面的逻辑
const handleConfigureProductPage = () => {
    // 获取“加入购物车”按钮
    const addToCartButton = document.querySelector(".btn-buyNow");
    addToCartButton?.click(); // 点击加入购物车按钮
};

// 处理购物车页面的逻辑
const handleViewCartPage = () => {
    // 获取确认支付按钮
    const nextStepButton = document.querySelector(".nextStep");
    nextStepButton?.click(); // 点击确认支付按钮

    // 勾选同意服务条款的复选框
    const paymentCheckbox = document.querySelector(".payment-checkbox");
    const termsCheckbox = document.querySelector(".sky-viewcart-terms-checkbox");
    if (paymentCheckbox) paymentCheckbox.checked = true; // 勾选支付复选框
    if (termsCheckbox) termsCheckbox.checked = true; // 勾选服务条款复选框

    // 获取“立即结账”按钮
    const submitButton = document.querySelector(".submit-btn");
    submitButton?.click(); // 点击立即结账按钮
};

// 等待网页完成加载后执行主函数
window.addEventListener("load", doIt, false);
