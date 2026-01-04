// ==UserScript==
// @name         微信读书自动滚动翻页
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为微信阅读pc版添加自动滚动和翻页功能
// @author       DearCyan
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread-1258476243.file.myqcloud.com/web/wrwebnjlogic/image/reader_top_home.37ef15b1.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/453638/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/453638/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

window.onload = function () {
    let dick
    let speed = 10
    let span = createDot()

    document.addEventListener('keyup', (e) => {
        if (e.key == '-') {
            if (speed < 20) {
                speed++
            }
            autoScroll(speed)
        }
        if (e.key == '+') {
            if (speed > 1) {
                speed--
            }
            autoScroll(speed)
        }
        if (e.key == 'Enter' || speed <= 0) {
            autoScroll(0)
            speed = 10
            span.innerText = 'stop'
        } else {
            span.innerText = 21 - speed
        }
    })

    function autoScroll(val) {
        span.innerText = speed
        if (val !== 0) {
            clearInterval(dick)
            dick = setInterval(
                () => {
                    window.scroll(0, window.scrollY + 1);
                    if (getHeight()) {
                        debounce(nextPage, 7000)()    //防抖，防止事件多次触发
                        clearInterval(dick)
                    }
                }, val
            )
        } else {
            clearInterval(dick)
        }
    }
    function nextPage() {
        if (getHeight()) {
            span.innerText = '>>'
            fireKeyEvent(document, "keydown", 39)
            debounce(autoScroll, 15000)(speed)
            debounce(checkRetryButton, 7000)()
        }
    }

    function checkRetryButton() {
        const button = document.querySelector('.retry')
        if (button) {
            button.click()
        }
    }

    function debounce(fn, delay) {
        let timeout = null;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn.apply(this, arguments);
            }, delay);
        };
    }

    function getHeight() {
        let scrollHeight = document.body.scrollHeight - document.body.offsetHeight - 1
        return window.scrollY >= scrollHeight
    }
}

function createDot() {
    const span = document.createElement('span')
    span.innerText = 'start'
    span.style.color = '#d8d8d9'

    const btn = document.createElement('button')
    btn.className = 'readerControls_item note'
    btn.append(span)

    const controls = document.querySelector('.readerControls')
    controls.prepend(btn)

    return span
}

function fireKeyEvent(el, evtType, keyCode) {
    let evtObj;
    if (document.createEvent) {
        if (window.KeyEvent) {//firefox 浏览器下模拟事件
            evtObj = document.createEvent('KeyEvents');
            evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
        }
        else {//chrome 浏览器下模拟事件
            evtObj = document.createEvent('UIEvents');
            evtObj.initUIEvent(evtType, true, true, window, 1);

            delete evtObj.keyCode;
            if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
            }
            else {
                evtObj.key = String.fromCharCode(keyCode);
            }

            if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                Object.defineProperty(evtObj, "ctrlKey", { value: true });
            }
            else {
                evtObj.ctrlKey = true;
            }
        }
        el.dispatchEvent(evtObj);

    }
    else if (document.createEventObject) {//IE 浏览器下模拟事件
        evtObj = document.createEventObject();
        evtObj.keyCode = keyCode
        el.fireEvent('on' + evtType, evtObj);
    }
}