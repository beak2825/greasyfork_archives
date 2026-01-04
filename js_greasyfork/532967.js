// ==UserScript==
// @name         网站自动登录脚本
// @run-at      document-end
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  TK 网站自动登录脚本
// @author       shen chen
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532967/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532967/%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const backUrl = "http://47.98.114.76:81/verification-code";
// 点击登录按钮等待时间 (不包含验证码)
const clickOnlyBtnTime = 1000
// 点击登录按钮等待时间 (包含验证码)
const clickBtnTime = 2000
/**
 * url - 登录页面的URL 必填
 * imageXpath - 验证码图片的XPath 如果不填, 则不处理验证码
 * valueXpath - 验证码输入框的XPath
 * loginNameXpath - 登录名输入框的XPath
 * pwdXpath - 密码输入框的XPath
 * valueXpath - 验证码输入框的XPath
 * submitXpath - 提交按钮的XPath 不配置则不会点击登录按钮
 * username - 登录名
 * password - 密码
 * onlySubmit - 是否只处理提交按钮 不处理 用户名/密码/验证码 (不填, 默认 false)
 * unSubmit - 是否不需要登录 (不填, 默认 false)
 *
 * 1. 如果只需要点击登录按钮, 则 onlySubmit 为 true, 并只需要填写 url 就可以 比如
 *     {
 *         url: "http://121.41.222.11:9082/user/login",
 *         onlySubmit: false
 *     }
 * 2. 也可以只填写验证码
 *     {
 *         url: "https://hhly.chinabeston.com:4443/login/#/login/iev",
 *         imageXpath: "//div[@class='el-col el-col-8']//img[1]",
 *         valueXpath: "//input[@placeholder='请输入验证码']"
 *     },
 *  3. 以及所有都需要填写 (用户名/密码/验证码)
 *      {
 *         url: "http://10.30.10.77:9080/user/login",
 *         imageXpath: "//div[@class='ant-col ant-col-8']//img[1]",
 *         loginNameXpath: "//input[@placeholder='请输入帐户名']",
 *         pwdXpath: "//input[@placeholder='密码']",
 *         valueXpath: "(//input[@class='ant-input ant-input-lg'])[3]",
 *         submitXpath: "//button[@type='submit']",
 *         username: "xxxx",
 *         password: "xxxxx",
 *         onlySubmit: false
 *     }
 *
 */


const siteList = [
    {
        url: "http://121.41.222.11:9082/user/login",
        onlySubmit: false
    },
    {
        url: "http://47.99.117.136/login",
        unSubmit: true
    },
    {
        url: "https://hhly.chinabeston.com:4443/login/#/login/iev",
        imageXpath: "//div[@class='el-col el-col-8']//img[1]",
        valueXpath: "//input[@placeholder='请输入验证码']"
    },
    {
        url: "http://10.30.10.77:9080/user/login",
        imageXpath: "//div[@class='ant-col ant-col-8']//img[1]",
        loginNameXpath: "//input[@placeholder='请输入帐户名']",
        pwdXpath: "//input[@placeholder='密码']",
        valueXpath: "(//input[@class='ant-input ant-input-lg'])[3]",
        submitXpath: "//button[@type='submit']",
        username: "xxxx",
        password: "xxxxx",
        onlySubmit: false
    }
]

(function () {
    'use strict';
    const currentUrl = window.location.href;
    const siteConfig = siteList.find(site => currentUrl.includes(site.url));
    console.log(`当前页面:${currentUrl}`)
    if (!siteConfig) return

    console.log("匹配到目标网站:", siteConfig.url);
    // 使用DOMContentLoaded事件而不是load事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => handler(siteConfig));
    } else {
        handler(siteConfig);
    }

})();

/**
 * 主处理函数
 */
function handler(siteConfig) {
    console.log('handler')

    // 使用MutationObserver确保DOM完全加载
    const observer = new MutationObserver((mutations, obs) => {
        console.log('DOM完全加载')
        if (siteConfig.onlySubmit) {
            console.log('只处理提交按钮')
            obs.disconnect(); // 停止观察
            setTimeout(() => {
                clickSubmitBtn(siteConfig);
            }, clickOnlyBtnTime)
            return;
        }

        if (siteConfig.loginNameXpath) {
            const loginNameInput = getElementByXpath(siteConfig.loginNameXpath);
            if (!(loginNameInput)) {
                console.log('元素未找到，停止观察')
                obs.disconnect(); // 停止观察
                return;
            }
            obs.disconnect(); // 停止观察
            console.log('处理用户名输入');
            inputInput(loginNameInput, siteConfig.username)
        }

        if (siteConfig.pwdXpath) {
            console.log('处理密码输入')
            const pwdInput = getElementByXpath(siteConfig.pwdXpath);
            inputInput(pwdInput, siteConfig.password)
        }

        if (siteConfig.imageXpath) {
            console.log('处理验证码输入')
            const captchaImg = getElementByXpath(siteConfig.imageXpath);
            if (!captchaImg) {
                console.log('元素未找到，停止观察')
                obs.disconnect(); // 停止观察
                return
            }
            handlerCaptcha(siteConfig, captchaImg);
        }
        if(siteConfig.unSubmit) {
            console.log('无需登录, 退出')
            obs.disconnect(); // 停止观察
            return;
        }
        setTimeout(() => {
            console.log('处理提交按钮')
            clickSubmitBtn(siteConfig);
        }, clickBtnTime)

    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

/**
 * 根据XPath获取DOM元素
 * @param {string} xpath - XPath表达式
 * @returns {HTMLElement|null} - 匹配到的元素或null
 */
function getElementByXpath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

/**
 * 将图片元素转换为Base64编码
 * @param {HTMLImageElement} img - 图片元素
 * @param {function} callback - 回调函数，返回Base64字符串
 */
function getCaptchaImageAsBase64(img, callback) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 120;
    canvas.height = img.height || 40;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    callback(dataURL);
}

/**
 * 发送验证码图片到后端接口并填充解析结果
 * @param {string} base64Image - 验证码图片的URL
 * @param {string} valueXpath - 验证码输入框的XPath
 */
function sendCaptchaToBackend(base64Image, valueXpath) {
    GM_xmlhttpRequest({
        method: "POST",
        url: backUrl,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({image_base64: base64Image}),
        onload: function (response) {
            const data = JSON.parse(response.responseText);
            if (data.captcha_value) {
                const captchaInput = getElementByXpath(valueXpath);
                inputInput(captchaInput, data.captcha_value)
            }
        }
    });
}

function inputInput(element, value) {
    // focus->input->blur
    if (!element) {
        console.log('元素未找到,返回')
        return
    }
    // console.log(`value: ${value}`);
    var focusEvent = new Event('focus');
    element.dispatchEvent(focusEvent);
    element.value = value;

    var inputEvent = new Event('input');
    element.dispatchEvent(inputEvent);

    var blurEvent = new Event('blur');
    element.dispatchEvent(blurEvent);
}

function handlerCaptcha(siteConfig, captchaImg) {

    const valueInput = getElementByXpath(siteConfig.valueXpath);
    if (valueInput) valueInput.click();

    // 确保图片已加载
    setTimeout(() => {
        if (captchaImg.complete) {
            getCaptchaImageAsBase64(captchaImg, (base64) => {
                if (base64) sendCaptchaToBackend(base64, siteConfig.valueXpath);
            });
        } else {
            captchaImg.onload = () => {
                getCaptchaImageAsBase64(captchaImg, (base64) => {
                    if (base64) sendCaptchaToBackend(base64, siteConfig.valueXpath);
                });
            };
        }
    }, 300)
}

function clickSubmitBtn(siteConfig) {
    const submitBtn = getElementByXpath(siteConfig.submitXpath);
    if (!submitBtn) return
    submitBtn.click();
}



