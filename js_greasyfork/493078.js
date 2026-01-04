// ==UserScript==
// @name         Auto Click Button on OKX
// @version      1.0.6
// @namespace    https://github.com/aboutmydreams
// @homepage     https://github.com/aboutmydreams
// @author       Diven
// @grant        none
// @license      MPL-2.0
// @description  Automatically selects and clicks a button on OKX website
// @match        https://www.okx.com/zh-hans/web3/marketplace/runes/token/SATOSHI%E2%80%A2NAKAMOTO/840000:22
// @downloadURL https://update.greasyfork.org/scripts/493078/Auto%20Click%20Button%20on%20OKX.user.js
// @updateURL https://update.greasyfork.org/scripts/493078/Auto%20Click%20Button%20on%20OKX.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义一个函数来自动点击按钮
    function autoClickButton() {
        // 使用 XPath 选择器选择元素
        const elements = document.evaluate(
            "/html/body/div[1]/div/div/div/div[3]/div/div[2]/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[1]/div",
            document,
            null,
            XPathResult.ANY_TYPE,
            null
        );

        let textContent = '';
        let element = elements.iterateNext();

        // 遍历所有匹配的元素，并获取它们的文字内容
        while (element) {
            textContent += element.textContent.trim() + '\n';
            element = elements.iterateNext();
        }

        console.log(textContent);

        // 获取元素的textContent


        // 匹配 floor_price 的正则表达式
        const floorPriceRegex = /\$([\d.]+)立即购买/;
        const match = textContent.match(floorPriceRegex);

        // 如果匹配成功，则提取 floor_price 并转换为小数
        let floorPrice = null;
        if (match && match.length > 1) {
            floorPrice = parseFloat(match[1]);
            console.log("Floor Price:", floorPrice);
        }

        console.log(textContent.includes('100 丰'))

        // 检查 textContent 是否包含 '100 丰' 并且 floor_price 小于 50
        if (textContent.includes('100 丰') && floorPrice && floorPrice < 5000) {
            // 点击指定 XPath 的按钮
            const button = document.evaluate(
                "/html/body/div[1]/div/div/div/div[3]/div/div[2]/div/div[2]/div[1]/div/div/div/div[2]/div/div/div[1]/div/div[6]/div/div[1]/button",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (button) {
                button.click();
                console.log("First Buy Button clicked!");
            }


            setTimeout(() => {
                const customPriceButton = document.evaluate(
                    "/html/body/div[6]/div/div[2]/div/div/div[2]/div[2]/div/div[2]/div[1]/div[4]/div",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (customPriceButton) {
                    customPriceButton.click()
                    console.log("customPriceButton clicked!");
                }
            }, 1200);

            setTimeout(() => {
                const customPriceUpButtun = document.evaluate(
                    "/html/body/div[6]/div/div[2]/div/div/div[2]/div[2]/div/div[2]/div[2]/div[2]/div/div/div[2]/div[1]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (customPriceUpButtun) {
                    customPriceUpButtun.click();
                    setTimeout(() => { customPriceUpButtun.click(); }, 1);
                    setTimeout(() => { customPriceUpButtun.click(); }, 1);
                    setTimeout(() => { customPriceUpButtun.click(); }, 1);
                    console.log("customPriceButtun clicked!");
                }
            }, 1500);

            setTimeout(() => {
                const clickBuyButtun = document.evaluate(
                    "/html/body/div[6]/div/div[3]/div/button[2]",
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (clickBuyButtun) {
                    clickBuyButtun.click();
                    console.log("clickBuyButtun clicked!");
                }
            }, 1700);
        }

    }

    // 拦截 fetch API
    var originalFetch = window.fetch;
    window.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : input.url;
        var method = init && init.method ? init.method : 'GET';

        // 检查是否是目标 API 请求
        if (url === 'https://www.okx.com/priapi/v1/nft/inscription/rc20/detail/items' && method === 'GET') {
            // 调用原始 fetch 方法
            return originalFetch.apply(this, arguments)
                .then(function (response) {
                    // 请求完成后延迟 0.5 秒执行 autoClickButton 函数
                    setTimeout(autoClickButton, 500);
                    return response;
                })
                .catch(function (error) {
                    console.error('Fetch error:', error);
                    throw error;
                });
        } else {
            // 对于非目标 API 请求，直接调用原始 fetch 方法
            return originalFetch.apply(this, arguments);
        }
    };
})();
