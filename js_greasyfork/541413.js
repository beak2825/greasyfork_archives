// ==UserScript==
// @name         更符合直觉的百度网盘提取码输入交互
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  该脚本解决的问题：百度网盘输入提取码的页面，当用户点击“提取文件”按钮后，会将输入框内元素的值替换成等位数的“*”，导致用户无法对密码进行部分修改（如正确密码为1234，若错输为1235并提交表单，input的value会被替换成****，此时如果仅修正最后一位并重新提交表单，提交的实际上是***4，提取码依然错误）
// @author       Kum
// @match        https://pan.baidu.com/s/*
// @match        https://pan.baidu.com/share/init*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541413/%E6%9B%B4%E7%AC%A6%E5%90%88%E7%9B%B4%E8%A7%89%E7%9A%84%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E7%A0%81%E8%BE%93%E5%85%A5%E4%BA%A4%E4%BA%92.user.js
// @updateURL https://update.greasyfork.org/scripts/541413/%E6%9B%B4%E7%AC%A6%E5%90%88%E7%9B%B4%E8%A7%89%E7%9A%84%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%8F%90%E5%8F%96%E7%A0%81%E8%BE%93%E5%85%A5%E4%BA%A4%E4%BA%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastPwd = '';

    function getPwdInput() {
        const input = document.querySelector('input[type="text"]');
        if (input) {
            console.log('[Tampermonkey] 找到提取码输入框:', input);
        } else {
            console.log('[Tampermonkey] 未找到提取码输入框');
        }
        return input;
    }
    function getExtractBtn() {
        const btn = document.querySelector('div[id="submitBtn"]');
        if (btn) {
            console.log('[Tampermonkey] 找到提取文件按钮:', btn);
        } else {
            console.log('[Tampermonkey] 未找到提取文件按钮');
        }
        return btn;
    }

    function bindBtn() {
        const btn = getExtractBtn();
        const input = getPwdInput();
        if (btn && input && !btn._binded) {
            btn.addEventListener('click', function() {
                lastPwd = input.value;
                console.log('[Tampermonkey] 保存提取码:', lastPwd);
            }, true);
            btn._binded = true;
            console.log('[Tampermonkey] 已绑定按钮点击事件');
        }
    }

    // 监听DOM变化，动态绑定
    const observer = new MutationObserver(function(mutations) {
        console.log('[Tampermonkey] DOM发生变化，尝试绑定按钮');
        bindBtn();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    bindBtn();

    // 劫持fetch
    const originFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('[Tampermonkey] fetch拦截:', args[0]);
        return originFetch.apply(this, args).then(async res => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('/share/verify')) {
                const clone = res.clone();
                try {
                    const data = await clone.json();
                    console.log('[Tampermonkey] fetch接口返回:', data);
                    if (data.errno === -9) {
                        const input = getPwdInput();
                        if (input && lastPwd) {
                            input.value = lastPwd;
                            console.log('[Tampermonkey] 提取码错误，已还原输入框:', lastPwd);
                        }
                    }
                } catch (e) {
                    console.error('[Tampermonkey] fetch解析返回异常:', e);
                }
            }
            return res;
        });
    };

    // 劫持XMLHttpRequest
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        this._isTarget = args[1] && args[1].includes('/share/verify');
        if (this._isTarget) {
            console.log('[Tampermonkey] XHR拦截到目标接口:', args[1]);
        }
        return originOpen.apply(this, args);
    };
    const originSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        if (this._isTarget) {
            this.addEventListener('load', function() {
                try {
                    const data = JSON.parse(this.responseText);
                    console.log('[Tampermonkey] XHR接口返回:', data);
                    if (data.errno === -9) {
                        const input = getPwdInput();
                        if (input && lastPwd) {
                            input.value = lastPwd;
                            console.log('[Tampermonkey] XHR提取码错误，已还原输入框:', lastPwd);
                        }
                    }
                } catch (e) {
                    console.error('[Tampermonkey] XHR解析返回异常:', e);
                }
            });
        }
        return originSend.apply(this, args);
    };
})();