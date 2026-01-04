// ==UserScript==
// @name         Translate Chinese Input to Camel Case
// @namespace    https://ops.iyunquna.com
// @version      0.3
// @description  契约驼峰转换
// @grant              GM_xmlhttpRequest
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM.xmlHttpRequest
// @grant              GM.getValue
// @grant              GM.setValue
// @icon         https://favicon.qqsuu.cn/work.yqn.com
// @license MIT
// @author       You
// @match        https://ops.iyunquna.com/63008*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/483157/Translate%20Chinese%20Input%20to%20Camel%20Case.user.js
// @updateURL https://update.greasyfork.org/scripts/483157/Translate%20Chinese%20Input%20to%20Camel%20Case.meta.js
// ==/UserScript==

(function () {
    'use strict';

     // 引入 MD5 库
    const script = document.createElement('script');
    script.src = 'https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js';
    document.head.appendChild(script);

    // 使用 MutationObserver 监听输入框的变化
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 处理新增的节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                translateAndConvertAllInputs();
            }
        });
    });

    // 配置 MutationObserver 监听子节点的变化
    const observerConfig = { childList: true, subtree: true };

    // 监听整个文档的变化
    observer.observe(document.body, observerConfig);

    function translateAndConvertAllInputs() {

        const inputElements = document.querySelectorAll('.ant-input-wrapper.ant-input-group .ant-input.ant-input-status-success[placeholder="请输入"]');
        if (inputElements.length > 0) {
            // 为每个输入框添加事件监听器
            inputElements.forEach((inputElement) => {
                inputElement.addEventListener('input', handleInput);
            });
        } else {
            console.log('Input elements not found');
        }
    }

   // 处理输入事件
   function handleInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value;

    // 只判断输入是否为中文，不进行翻译和转换
    if (/[\u4e00-\u9fa5]/.test(inputValue)) {
        try {
            // 百度翻译接口
            translateToEnglishSync(inputValue, (translatedValue) => {
                // 转换为驼峰格式（去掉空格）
                const camelCaseValue = toCamelCase(translatedValue);
                clickUpAndDown(inputElement, camelCaseValue);
            });
        } catch (error) {
            console.error('Error translating text:', error);
            // 谷歌翻译
            translateToEnglish(inputValue, (translatedValue) => {
                // 转换为驼峰格式（去掉空格）
                const camelCaseValue = toCamelCase(translatedValue);
                clickUpAndDown(inputElement, camelCaseValue);
            });
        }
    }
}

  // 同步调用翻译函数
  function translateToEnglish(chineseText, callback) {
    const googleTranslateUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + encodeURIComponent(chineseText);

    fetch(googleTranslateUrl)
        .then(response => response.json())
        .then(data => {
            // 提取翻译结果
            const translatedText = data[0][0][0];
            callback(translatedText);
        })
        .catch(error => {
            console.error('Error translating text:', error);
            callback(chineseText);
        });
}

    function translateToEnglishSync(chineseText, callback) {
        const baiduTranslateUrl = "https://api.fanyi.baidu.com/api/trans/vip/translate";
        const appId = "20231226001922003";
        const appKey = "7W2NsFbl7q18c6F1EO6X";
        const salt = Date.now().toString();

        // 构建签名
        const rawSign = appId + chineseText + salt + appKey;
        const sign = md5(rawSign);

        const url = baiduTranslateUrl;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: `q=${encodeURIComponent(chineseText)}&from=auto&to=en&appid=${appId}&salt=${salt}&sign=${sign}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                // 提取翻译结果
                const translatedText = data.trans_result[0].dst;
                callback(translatedText);
            },
            onerror: function (error) {
                console.error('Error translating text:', error);
                callback(chineseText);
            }
        });
    }

    // 将字符串转换为首字母小写的驼峰格式（去掉空格）
    function toCamelCase(str) {
        // 去掉空格，并将每个单词的首字母转换为大写，但只保留第一个单词的首字母小写
        return str.replace(/\s+(.)/g, function (match, group1) {
            return group1.toUpperCase();
        }).replace(/^\w/, function (firstChar) {
            return firstChar.toLowerCase();
        });
    }

    function clickUpAndDown(inputElement, keyChar) {
        let lastValue = inputElement.value;
        inputElement.value = keyChar;
        let event = new Event("input", { bubbles: true });
        //  React15
        event.simulated = true;
        //  React16 内部定义了descriptor拦截value，此处重置状态
        let tracker = inputElement._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElement.dispatchEvent(event);
    }

})();
