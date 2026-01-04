// ==UserScript==
// @name         ARK油猴脚本工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alert inner text of clicked el-table__cell element
// @author       YourName
// @match        https://uat-fbg-main.eminxing.com/**
// @match        https://test-fbg-main.eminxing.com/**
// @match        https://test1-fbg-main.eminxing.com/**
// @match        https://uat-fbg-main.eminxing.com/**
// @match        *://ark.goodcang.com//*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513646/ARK%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/513646/ARK%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const buttonList = [];
    let currentDom = null;
    let oldStyle = '';

    let lastTextContent = '';
    let isSelectEd = false;

    document.addEventListener('mouseup', function(event) {
        if (isSelectEd) {
            return;
        }
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            event.stopPropagation();
            console.log(selectedText, 111);
            isSelectEd = true;
            showBtn(selectedText);
        }
    });

    document.addEventListener('click', function(event) {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            event.stopPropagation();
            return;
        }

        if (currentDom) {
            currentDom.style.border = oldStyle;
            currentDom = null;
        }

        if (
            event.target.classList.contains('el-table__cell')
            // 点击的上一级是单元格，并且不属于表头和操作列
            || (event.target.parentElement.classList.contains('el-table__cell') && !event.target.parentElement.classList.contains('is-leaf') && !event.target.parentElement.classList.contains('fbg-dynamic-fixed-right'))
        ) {
            isSelectEd = true;
            if (event.target.classList.contains('el-table__cell')) {
                currentDom = event.target;
            } else {
                currentDom = event.target.parentElement;
            }
        }

        if (!currentDom) {
            const element = event.target;
            let depth = 0;
            while (currentDom) {
                if (depth > 5) {
                    currentDom = null;
                    break;
                }

                if (element.classList.contains('el-table__cell')) {
                    currentDom = element;
                    // existing logic
                    break;
                }
                element = element.parentElement;
                depth++;
            }
        }

        event.stopPropagation();
        if (!currentDom){
            isSelectEd = false;
            removeButton();
        } else {
            let textContent = currentDom.textContent.trim();
            showBtn(textContent);
        }
    }, false);

    function removeButton() {
        console.log('删除按钮');
        buttonList.forEach(button => {
            if (document.body.contains(button)) {
                document.body.removeChild(button);
            }
        })
    }

    function showBtn(lastTextContent) {
        const copyCall = event => {
                event.stopPropagation();
                navigator.clipboard.writeText(lastTextContent).then(function() {
                    showLog('复制成功:' + lastTextContent);
                    removeButton();
                }, function(err) {
                    console.error('无法复制内容: ', err);
                });
                isSelectEd = false;
            };
        const buttons = [{
            name: '复制',
            click: event => copyCall(event)
        }, {
            name: '入',
            click: event => {
                copyCall(event);
                window.BUS.$emit('goTo', `/cis/godownEntry/manageDetail?data=%7B"inbound_code"%3A"${lastTextContent}"%7D&type=3`)
                // window.BUS.$emit('goTo', '/ods/documentCenter/deliveryOrder', {searchData: JSON.stringify({ order: lastTextContent })})
            },
        }, {
            name: '出',
            click: event => {
                copyCall(event);
                window.BUS.$emit('goTo', `/ods/documentCenter/deliveryOrderDetail?order_code=${lastTextContent}&type=deliveryOrder`)
            },
        }, {
            name: '商',
            click: event => {
                copyCall(event);
                window.BUS.$emit('goTo', `/bms/goods/goodsDataDetail?data=%7B%22product_barcode%22%3A%22${lastTextContent}%22%7D&type=view&from=compliance`)
            },
        }];
        removeButton();
        console.log('显示按钮: ' + lastTextContent);

        if (currentDom) {
            oldStyle = currentDom.style.border;
            currentDom.style.border = '1px solid #bababa';
        }

        createFloatingButtons(buttons, event.pageX - 50, event.pageY - 80)
    }

    function createFloatingButtons(buttons, x, y) {
        let wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = y + 'px';
        wrapper.style.left = x + 'px';
        wrapper.style.zIndex = 1000;
        wrapper.style.padding = '5px';
        wrapper.style.backgroundColor = '#fff';
        wrapper.style.border = '1px solid #ccc';
        wrapper.style.borderRadius = '5px';
        wrapper.style.fontSize = '12px';
        wrapper.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

        buttons.forEach(button => {
            let btn = document.createElement('button');
            btn.textContent = button.name;
            btn.style.margin = '5px';
            btn.style.padding = '5px 10px';
            btn.style.backgroundColor = '#007bff';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '5px';
            btn.style.fontSize = '12px';
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', button.click);

            wrapper.appendChild(btn);
        });

        document.body.appendChild(wrapper);
        buttonList.push(wrapper);

        setTimeout(function() {
            if (document.body.contains(wrapper)) {
                document.body.removeChild(wrapper);
            }
        }, 5000); // Remove the wrapper after 5 seconds
    }

    function showLog(...args) {
        const time = new Date();
        console.log(time.toLocaleString(), ...args);
        const message = args[0];
        const logElement = document.createElement('div');
        logElement.style.position = 'fixed';
        logElement.style.top = '0';
        logElement.style.left = '0';
        logElement.style.width = '100%';
        logElement.style.height = '30px';
        logElement.style.backgroundColor = '#f4f4f4';
        logElement.style.fontSize = '14px';
        logElement.style.textAlign = 'center';
        logElement.style.lineHeight = '30px';
        logElement.style.zIndex = 10000;
        logElement.innerText = message;

        const existingLogElement = document.getElementById('log-element');
        if (existingLogElement) {
            existingLogElement.replaceWith(logElement);
        } else {
            logElement.id = 'log-element';
            document.body.appendChild(logElement);
        }

        setTimeout(() => {
            logElement.remove();
        }, 1000);
    }
})();