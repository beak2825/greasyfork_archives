// ==UserScript==
// @name         验证码自动识别填充（更新版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  使用百度API自动识别并填充北京交通大学CAS登录验证码
// @author       You
// @match        https://cas.bjtu.edu.cn/auth/login/*
// @grant        GM_xmlhttpRequest
// @license ZYZ
// @downloadURL https://update.greasyfork.org/scripts/492052/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%EF%BC%88%E6%9B%B4%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/492052/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E5%A1%AB%E5%85%85%EF%BC%88%E6%9B%B4%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "etWKoanr0eIDRvmYsmPZhjz3";
    const SECRET_KEY = "XLH92sqGuqTYt1maN6CgYzv0Rqoe1QGB";

    // 获取access_token
    function getAccessToken(callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://aip.baidubce.com/oauth/2.0/token",
            data: "grant_type=client_credentials&client_id=" + API_KEY + "&client_secret=" + SECRET_KEY,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                const accessToken = result.access_token;
                callback(accessToken);
            }
        });
    }

    // 使用access_token调用百度OCR API识别验证码
    function recognizeCaptcha(imageData, accessToken) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=" + accessToken,
            data: "image=" + encodeURIComponent(imageData) + "&detect_direction=false&paragraph=false&probability=false",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.words_result && result.words_result.length > 0) {
                    const captcha = result.words_result[0].words;
                    const captchaStr = calculateCaptcha(captcha);
                    fillCaptcha(captchaStr);
                }
            }
        });
    }

    // 填充识别到的验证码
    function fillCaptcha(captcha) {
        const captchaInput = document.querySelector('#id_captcha_1');
        if (captchaInput) {
            captchaInput.value = captcha;
        }
    }

    // 示例代码，显示如何将上述函数结合起来使用
    function processCaptcha() {
        const captchaImage = document.querySelector('div.yzm > span > img.captcha');
        if (captchaImage) {
            // 这里需要实现将验证码图片转换为Base64编码的字符串
            // 假设getImageData函数已经实现，可以将图片转换为Base64
            getImageData(captchaImage.src, function(imageData) {
                getAccessToken(function(accessToken) {
                    recognizeCaptcha(imageData, accessToken);
                });
            });
        }
    }

    // 实现获取图片Base64编码的示例代码（需根据实际情况调整）
    function getImageData(imageUrl, callback) {
        // 注意：这里可能需要处理跨域问题或直接在服务器端处理图片编码
        GM_xmlhttpRequest({
            method: "GET",
            url: imageUrl,
            responseType: 'blob',
            onload: function(response) {
                const reader = new FileReader();
                reader.onload = function() {
                    const imageData = reader.result.replace(/^data:.+;base64,/, '');
                    callback(imageData);
                };
                reader.readAsDataURL(response.response);
            }
        });
    }
    function calculateCaptcha(captchaString) {
        console.log(captchaString);
        // 使用正则表达式匹配所有数字和符号
        const matches = captchaString.match(/(\d+)([+\-×÷.xX])(\d+)/);
        if (!matches) return null; // 如果没有匹配到，返回null

        const num1 = parseInt(matches[1], 10);
        let operation = matches[2];
        if(operation==='.')operation='-';
        if(operation==='x'||operation==='X')operation='×';
        const num2 = parseInt(matches[3], 10);
        let result;

        switch (operation) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '×':
                result = num1 * num2;
                break;
            case '÷':
                result = num1 / num2;
                break;
            default:
                return null; // 如果运算符不是预期之一，返回null
        }

        return result; // 返回计算结果
    }


    // 示例，如何在页面加载完成后自动执行
    window.onload = function() {
        processCaptcha();
    };
})();
