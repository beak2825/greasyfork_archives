// ==UserScript==
// @name         自动识别验证码
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  网站验证码自动识别
// @author       GoatZee
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=33.194
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/531694/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/531694/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 访问地址
    // 使用 TrWebOCR 实现
    let origin = 'http://10.0.10.23:8089';

    console.log("【自动识别验证码】正在运行...");
    setTimeout(() => {
        findCode();
        let observer = new MutationObserver(findCode);
        observer.observe(document.body, {attributes: false, childList: true, subtree: true})
    }, 1000);

    // 寻找验证码
    function findCode() {
        for (let element of document.querySelectorAll('img')) {
            if (isCode(element)) {
                let src = element.src;
                if (src.includes('data:image')) {
                    resolve(src);
                } else {
                    let image = new Image();
                    image.src = src;
                    image.onload = () => {
                        let canvas = document.createElement('canvas');
                        canvas.width = element.width;
                        canvas.height = element.height;
                        canvas.getContext('2d').drawImage(element, 0, 0);
                        resolve(canvas.toDataURL());
                    };
                }
            }
        }
    }

    // 判断是否为验证码
    function isCode(element) {
        let attrs = ['id', 'className', 'title', 'src', 'alt'];
        let texts = ['code', 'captcha', '验证码', '看不清', '换一张'];
        for (let attr of attrs) {
            for (let text of texts) {
                if (element[attr].includes(text)) {
                    return true;
                }
            }
        }
        return element.src.includes('data:image');
    }

    // 解析验证码
    function resolve(base64) {
        let data = new FormData();
        data.append('img', base64.replace(/^(.*)base64,/, ''));

        GM_xmlhttpRequest({
            url: `${origin}/api/tr-run/`,
            method: 'post',
            data: data,
            responseType: 'json',
            onload: (response) => {
                if (response.status == 200) {
                    let result = '';
                    for (let raw of response.response.data.raw_out) {
                        result = result + raw[1];
                    }
                    result = result.replace(/\s+/g, '');
                    result = result.replace(/[^a-zA-Z0-9_]+/g, '');

                    if (result.length >= 4) {
                        console.log("识别结果：" + result);
                        writeIn(result);
                    }
                } else {
                    console.log("识别失败");
                }
            }
        });
    }

    // 写入验证码输入框
    function writeIn(text) {
        for (let element of document.querySelectorAll('input')) {
            if (isInput(element)) {
                element.value = text;
                if (typeof (InputEvent) !== "undefined") {
                    element.value = text;
                    element.dispatchEvent(new InputEvent('input'));
                    let events = ['input', 'change', 'focus', 'keypress', 'keyup', 'keydown', 'select'];
                    for (let event of events) {
                        let e = document.createEvent('HTMLEvents');
                        e.initEvent(event, true, true);
                        element.dispatchEvent(e);
                    }
                    element.value = text;
                } else if (KeyboardEvent) {
                    element.dispatchEvent(new KeyboardEvent('input'));
                }
            }
        }
    }

    // 判断是否为验证码输入框
    function isInput(element) {
        let attrs = ['id', 'className', 'title', 'placeholder', 'alt'];
        let texts = ['code', 'captcha', '验证码', '看不清', '换一张'];
        for (let attr of attrs) {
            for (let text of texts) {
                if (element[attr].includes(text)) {
                    return true;
                }
            }
        }

        // 查找父级
        element = element.parentNode;
        for (let text of texts) {
            if (element.textContent.includes(text)) {
                return true;
            }
        }
        return false;
    }
})();