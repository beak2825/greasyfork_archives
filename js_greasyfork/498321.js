// ==UserScript==
// @name         作业帮注册
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  点击指定元素后设置两个XPath输入框的值为abc，并将其类型从password改为text
// @author       Your Name
// @match        https://www.zybang.com/saasplat/general_plat/mlogin.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498321/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/498321/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 在加载完成后暂停1秒
        setTimeout(function() {
            // 定义一个函数来点击元素
            function clickElement(xpath) {
                var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    element.click();
                    console.log('Clicked element successfully for XPath:', xpath);

                    // 点击后设置两个XPath的输入框值为'abc'，并将其类型改为text
                    setInputValuesAndChangeType();
                } else {
                    console.warn('XPath not found:', xpath);
                }
            }

            // 定义一个函数来设置输入框的值并改变类型
            function setInputValuesAndChangeType() {
                var inputs = [
                    {
                        xpath: '//*[@id="zyb_login"]/div[5]/div[2]/label[4]/input',
                        value: 'lzlz123456'
                    },
                    {
                        xpath: '//*[@id="zyb_login"]/div[5]/div[2]/label[6]/input',
                        value: 'lzlz123456'
                    }
                ];

                inputs.forEach(function(input) {
                    var element = document.evaluate(input.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) {
                        // 设置输入框的值为'abc'
                        element.value = input.value;
                        console.log('Set value successfully for XPath:', input.xpath);

                        // 将输入框的类型从password改为text
                        element.type = 'text';
                        console.log('Changed input type to text for XPath:', input.xpath);
                    } else {
                        console.warn('XPath not found:', input.xpath);
                    }
                });
            }

            // 点击页面上指定XPath的元素
            var xpathToClick = '//*[@id="zyb_login"]/div[1]/div[3]/div[2]/span[2]';
            clickElement(xpathToClick);
        }, 1000); // 暂停1秒
    });
})();
