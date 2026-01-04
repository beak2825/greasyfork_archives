// ==UserScript==
// @name         美元转人民币
// @namespace    http://your.namespace/
// @version      1.6
// @description  在网页中识别美元金额，并在后面添加相应的人民币金额
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482844/%E7%BE%8E%E5%85%83%E8%BD%AC%E4%BA%BA%E6%B0%91%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482844/%E7%BE%8E%E5%85%83%E8%BD%AC%E4%BA%BA%E6%B0%91%E5%B8%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取用户自定义的汇率比例，如果没有设置，则使用默认值
    let userExchangeRate = GM_getValue('userExchangeRate', null);

    // 如果用户没有保存汇率，则使用默认值
    if (userExchangeRate === null) {
        userExchangeRate = 7.14;
    }

    // 创建按钮
    const exchangeRateButton = document.createElement('button');
    exchangeRateButton.id = 'exchangeRateButton';
    // exchangeRateButton.innerText = `设置汇率 当前:${userExchangeRate}`;
    exchangeRateButton.innerHTML = `汇率:<span style="color: red;">${userExchangeRate}</span>`;

    document.body.appendChild(exchangeRateButton);

    // 默认不显示
    exchangeRateButton.style.display = 'none';

    // 样式调整
    GM_addStyle(`
            #exchangeRateButton {
                position: fixed;
                top: 50%;
                left: 10px;
                z-index: 1000;
                cursor: pointer;
                padding: 5px;
                font-size: 14px;
                border: 1px solid #ccc;
                border-radius: 3px;
            }
            #exchangeRateButton:hover {
                background-color: #f0f0f0;
            }
        `);

    // 添加点击事件，显示悬浮输入框
    exchangeRateButton.addEventListener('click', showFloatingInput);

    function showFloatingInput() {
        // 移除按钮
        exchangeRateButton.style.display = 'none';

        // 创建悬浮输入框的容器
        const floatingInputContainer = document.createElement('div');
        floatingInputContainer.id = 'floatingInputContainer';

        // 创建悬浮输入框
        const floatingInput = document.createElement('div');
        floatingInput.innerHTML = `
                <label for="exchangeRateInput" style="color: red;">汇率比例：</label>
                <input type="number" id="exchangeRateInput" step="0.01" placeholder="请输入汇率比例">
                <button id="saveExchangeRate">保存</button>
            `;
        floatingInputContainer.appendChild(floatingInput);
        document.body.appendChild(floatingInputContainer);

        // 设置默认值
        document.getElementById('exchangeRateInput').value = userExchangeRate;

        // 样式调整
        GM_addStyle(`
                #exchangeRateInput {
                    margin-right: 5px;
                    padding: 5px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                }
                #saveExchangeRate {
                    cursor: pointer;
                    padding: 5px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                }
                #saveExchangeRate:hover {
                    background-color: #f0f0f0;
                }
                #exchangeRateInput, #saveExchangeRate {
                    box-sizing: border-box;
                }
                #floatingInputContainer {
                    position: fixed;
                    top: 50%;
                    left: 10px;
                    z-index: 1000;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                }
                label {
                    margin-right: 5px;
                    font-size: 14px;
                }
            `);

        // 添加点击事件，保存用户自定义的汇率比例
        document.getElementById('saveExchangeRate').addEventListener('click', function () {
            const exchangeRateInput = document.getElementById('exchangeRateInput');
            const exchangeRate = parseFloat(exchangeRateInput.value);
            if (!isNaN(exchangeRate)) {
                GM_setValue('userExchangeRate', exchangeRate);
                location.reload(); // 刷新页面
                //alert('汇率比例已保存');
            } else {
                alert('请输入有效的汇率比例');
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 在这里添加你的处理逻辑
            convertUSDToCNY(mutation.target);
        });
    });

    const observerConfig = { childList: true, subtree: true };

    observer.observe(document.body, observerConfig);

    const usdRegex1 = /\$\s?(\d+(\.\d{1,2})?)/g;
    const usdRegex2 = /\b(\d+(\.\d{1,2})?)\s?(\$|USD)\b/g;

    function convertUSDToCNY(targetNode) {
        if (targetNode.nodeType === Node.TEXT_NODE) {
            handleTextNode(targetNode);
        } else {
            const textNodes = getTextNodes(targetNode);
            textNodes.forEach(handleTextNode);
        }
    }

    function handleTextNode(textNode) {
        if (!textNode._processed) {
            let matches;

            matches = textNode.nodeValue.match(usdRegex1);
            if (matches) {
                exchangeRateButton.style.display = 'block';
                matches.forEach(match => {
                    const usdAmount = parseFloat(match.replace(/\$/, '').replace(',', ''));
                    const cnyAmount = (usdAmount * userExchangeRate).toFixed(2);
                    textNode.nodeValue = textNode.nodeValue.replace(match, `${match}（约¥${cnyAmount}）`);
                });
            }

            matches = textNode.nodeValue.match(usdRegex2);
            if (matches) {
                exchangeRateButton.style.display = 'block';
                matches.forEach(match => {
                    const usdAmount = parseFloat(match.replace(/\s?\$|USD|美元/g, '').replace(',', ''));
                    const cnyAmount = (usdAmount * userExchangeRate).toFixed(2);
                    textNode.nodeValue = textNode.nodeValue.replace(match, `${match}（约¥${cnyAmount}）`);
                });
            }

            textNode._processed = true;
        }
    }

    function getTextNodes(node) {
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            { acceptNode: function (node) { return NodeFilter.FILTER_ACCEPT; } },
            false
        );

        const textNodes = [];
        let currentNode = walker.nextNode();
        while (currentNode) {
            textNodes.push(currentNode);
            currentNode = walker.nextNode();
        }

        return textNodes;
    }
    document.body.appendChild(exchangeRateButton);
})();
