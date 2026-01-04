// ==UserScript==
// @name         aliAutoLogin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿里云RAM账号自动登录
// @author       Ziker
// @match        https://signin.aliyun.com/*login.htm*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://favicon.qqsuu.cn/www.aliyun.com
// @grant unsafeWindow
// @run-at       document-body
// @noframes
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/483158/aliAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/483158/aliAutoLogin.meta.js
// ==/UserScript==

window.jq = $.noConflict(true);

(function (window) {
    window.pageHelper = {
        // 等待元素可见
        waitElementVisible(visibleTag, index, fun) {
            let node = jq(visibleTag)
            if (node === null || node[index] === null || node[index] === undefined) {
                setTimeout(() => {
                    pageHelper.waitElementVisible(visibleTag, index, fun)
                }, 500)
            } else {
                fun()
            }
        },
        sleep(duration) {
            return new Promise(resolve => {
                setTimeout(resolve, duration)
            })
        }
    }
})(window);


(function () {
    'use strict';
    const userName = '登录账号，请到脚本内修改代码'
    const passWord = '登录密码，请到脚本内修改代码'
    jq(document).ready(function () {
        waitObserve("[id='--aliyun-xconsole-app']", () => {
            const fromTable = document.querySelector(".next-form.next-large");
            if (isNull(fromTable)) {
                return;
            }
            const button = document.querySelector(".next-btn.next-large.next-btn-primary");
            if (isNull(button)) {
                return
            }
            if (button.innerText === '下一步' && document.querySelector(".custom-flag-next") === null) {
                appendFlagNode(document.body, "custom-flag-next")
                keyboardInput(document.querySelector("#loginName"), userName)
                button.click()
            }
            if (button.innerText === '登录' && document.querySelector(".custom-flag-login") === null) {
                appendFlagNode(document.body, "custom-flag-login")
                window.pageHelper.sleep(200)
                    .then(() => {
                        keyboardInput(document.querySelector("#loginPassword"), passWord)
                        button.click()
                    })
            }
            if (button.innerText === '提交验证' && document.querySelector(".custom-flag-submit") === null) {
                if (button.disabled === true) {
                    return;
                }
                appendFlagNode(document.body, "custom-flag-submit")
                button.click()
            }
        })
    })


    function nonNull(o) {
        return o !== null && o !== undefined
    }

    function isNull(o) {
        return o === null || o === undefined
    }

    function keyboardInput(inputElement, keyChar) {
        let lastValue = inputElement.value;
        inputElement.value = keyChar;
        let event = new Event("input", {bubbles: true});
        //  React15
        event.simulated = true;
        //  React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = inputElement._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElement.dispatchEvent(event);
    }


    // 追加标记节点
    function appendFlagNode(node, flag) {
        const divFlag = document.createElement("div")
        node.appendChild(divFlag)
        divFlag.className = flag
        divFlag.style.display = "none"
    }

    // 等待出现并监听变化
    function waitObserve(visibleTag, fun, attributes = true) {
        window.pageHelper.waitElementVisible(visibleTag, 0, () => {
            new MutationObserver(function () {
                fun()
            }).observe(document.querySelector(visibleTag), {
                attributes: attributes,
                childList: true,
                subtree: true,
                characterData: true
            })
        })
    }
})();

