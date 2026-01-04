// ==UserScript==
// @name         自动识别验证码
// @description  图片验证码自动识别
// @version      1.1.1
// @author       LiK4vin
// @icon         data:image/png;base64,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
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/539954/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/539954/%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 访问地址
    // 使用 TrWebOCR 实现
    let origin = 'http://127.0.0.1:8089';

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

                    if (result.length >= 4 && result.length <= 8) {
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