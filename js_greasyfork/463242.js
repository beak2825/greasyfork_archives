// ==UserScript==
// @name         Remove Login 去除登录弹窗👻
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world! 删除烦人的登录弹窗
// @author       tanzz
// @match        *://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463242/Remove%20Login%20%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%F0%9F%91%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/463242/Remove%20Login%20%E5%8E%BB%E9%99%A4%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%F0%9F%91%BB.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    // remove login popup
    common(1, 10);
    log("运行完成");
})();

/**
 * common function
 * @param {int} type Type of processing
 * @param {int} times Number of processing
 */
function common(type, times) {
    let interval = setInterval(function () {
        if (times <= 0) {
            clearInterval(interval);
        }

        if (type === 1) {
            // [zhihu] close login popup
            let loginPopup = document.querySelector(
                "body > div:nth-child(40) > div > div > div > div.Modal.Modal--default.signFlowModal > button"
            );
            if (loginPopup) {
                loginPopup.click();
            }

            let list = [
                ".css-1ynzxqw", // [zhihu] close login popup on the right bottom corner
            ];
            for (var k = 0; k < list.length; k++) {
                var elements = document.querySelectorAll(list[k]);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].parentNode.removeChild(elements[i]);
                }
            }

            const zhihuLoginHtml =
                '<a class="Button Button--primary Button--blue css-jmxm1g" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>';

            // [zhihu] delete login button hover event listener //*[@id="root"]/div/div[2]/header/div[2]/div[2]/div[2]/div/button
            const loginBtn = document.querySelector(
                "#root > div > div:nth-child(2) > header > div.AppHeader-inner.css-l2ygoj > div.AppHeader-userInfo > div.AppHeader-profile"
            );
            if (loginBtn) {
                loginBtn.innerHTML = zhihuLoginHtml;
            }

            // [zhihu-zhuanlan] delete login popup in the page of zhuanlan
            execWithXPath("/html/body/div[4]/div/div/div/div[2]/button", "click");
            // [zhihu-zhuanlan] login button
            execWithXPath('//*[@id="root"]/div/main/div/div[1]/div/div/div[2]', "innerHTML", zhihuLoginHtml);
            // [zhihu-zhuanlan] login button popup
            execWithXPath('//div[contains(@class, "css-ysn1om")]', "remove");
            // [zhihu-zhuanlan] close login popup on the right bottom corner
            execWithXPath("/html/body/div[5]/div/div", "remove");
        }

        times--;
    }, 100);
}

function log(msg) {
    console.log("[REMOVE_LOGIN] " + msg);
}

/**
 * get element by xpath
 * @param {String} XPath xpath
 */
function getElement(XPath, contextNode = document, resultType = XPathResult.FIRST_ORDERED_NODE_TYPE) {
    // reference: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/evaluate
    try {
        const result = document.evaluate(XPath, contextNode, null, resultType, null);
        return result.singleNodeValue;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * execute operation with xpath
 * @param {String} XPath xpath expression
 * @param {String} type operation type
 * @param  {...any} args
 */
function execWithXPath(XPath, type, ...args) {
    const element = getElement(XPath);
    if (element) {
        if (type === "click") {
            element.click();
        } else if (type === "remove") {
            element.parentNode.removeChild(element);
        } else if (type === "innerHTML") {
            element.innerHTML = args[0];
        }
    }
}
