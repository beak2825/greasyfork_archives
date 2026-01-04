// ==UserScript==
// @name         Skip WeCom Email Safe Alert
// @namespace    https://work.weixin.qq.com/
// @version      2025-06-05.02
// @description  try to skip WeCom Email Safe Alert
// @author       Bevis
// @match        https://open.work.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538403/Skip%20WeCom%20Email%20Safe%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/538403/Skip%20WeCom%20Email%20Safe%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.host !== 'open.work.weixin.qq.com') {
        return;
    }

    function getAndDecodeUriParameter() {
        let finalUrl = "错误：未能获取或解码 'uri' 参数。";

        try {
            // 1. 获取当前页面的完整 URL
            const pageUrlString = window.location.href;

            // 2. 创建 URL 对象以方便地访问查询参数
            const url = new URL(pageUrlString);

            // 3. 获取 'uri' 参数的值
            const uriParamValue = url.searchParams.get('uri');

            if (uriParamValue) {
                // 4. 对 'uri' 参数的值进行第一次 URL 解码
                // 示例原始 uriParamValue: "https%3A%2F%2Ftracker.com%2FCL0%2Fhttps%3A%252F%252Ftarget.com..."
                // 解码后 (firstDecodedUri): "https://tracker.com/CL0/https%3A%2F%2Ftarget.com..."
                const firstDecodedUri = decodeURIComponent(uriParamValue);

                let secondEncodedPart = null;

                // 5. 从第一次解码后的字符串中，提取出那个被再次编码的最终目标网址部分。
                //    这部分通常以 "http%3A%2F%2F" 或 "https%3A%2F%2F" 开头，
                //    并且不是 firstDecodedUri 自身的协议头。
                const httpsMarker = "https%3A%2F%2F";
                const httpMarker = "http%3A%2F%2F";

                let searchStartIndex = 0;
                // 确定开始搜索内嵌编码URL的起始位置，通常是在跟踪URL的域名和第一个路径段之后
                const schemeEndIndex = firstDecodedUri.indexOf("://");
                if (schemeEndIndex !== -1) {
                    // 找到域名后的第一个 '/'
                    const domainAndPathPrefixEnd = firstDecodedUri.indexOf("/", schemeEndIndex + 3);
                    if (domainAndPathPrefixEnd !== -1) {
                        searchStartIndex = domainAndPathPrefixEnd + 1; // 从 "domain.com/" 之后开始搜索
                    } else {
                        // 如果URL类似于 "https://domain.com" (没有路径)，则不太可能包含嵌套的编码URL
                        searchStartIndex = firstDecodedUri.length;
                    }
                }

                // 在 firstDecodedUri 的 searchStartIndex 之后查找 "https%3A%2F%2F"
                const indexHttps = firstDecodedUri.indexOf(httpsMarker, searchStartIndex);
                // 在 firstDecodedUri 的 searchStartIndex 之后查找 "http%3A%2F%2F"
                const indexHttp = firstDecodedUri.indexOf(httpMarker, searchStartIndex);

                if (indexHttps !== -1 && (indexHttp === -1 || indexHttps < indexHttp)) {
                    // 如果找到了 "https%3A%2F%2F"，并且它在 "http%3A%2F%2F" 之前 (或者 "http%3A%2F%2F" 未找到)
                    secondEncodedPart = firstDecodedUri.substring(indexHttps);
                } else if (indexHttp !== -1) {
                    // 否则，如果找到了 "http%3A%2F%2F"
                    secondEncodedPart = firstDecodedUri.substring(indexHttp);
                }

                if (secondEncodedPart) {
                    // 6. 对提取出的这部分进行第二次 URL 解码
                    // 示例 secondEncodedPart: "https%3A%2F%2Ftarget.com..."
                    // 解码后 (finalUrl): "https://target.com..."
                    try {
                        finalUrl = decodeURIComponent(secondEncodedPart);
                    } catch (e) {
                        finalUrl = "错误：解码提取出的 URL 部分时出错: " + e.message + ". 提取的部分是: " + secondEncodedPart;
                    }
                } else {
                    console.log("错误：在 'uri' 参数第一次解码后，未能找到预期的双重编码 URL 模式 (例如 '.../http%3A%2F%2F...')。第一次解码的结果是: " + firstDecodedUri);
                    finalUrl = firstDecodedUri;
                    // 这种情况可能意味着 'uri' 参数的结构与预期不同，或者它只被编码了一层。
                    // 如果 'firstDecodedUri' 已经是您期望的“正常网址”，您可以直接使用它。
                    // 但根据您的示例，目标网址是嵌套且再次编码的。
                }
            } else {
                finalUrl = "错误：URL 中未找到 'uri' 参数，或其值为空。";
            }
        } catch (e) {
            finalUrl = "处理 URL 时发生 JavaScript 错误: " + e.message;
        }

        return finalUrl;
    }

    // --- 使用示例 ---
    // 假设当前页面的 URL 就是您提供的那个:
    // "https://open.work.weixin.qq.com/wwopen/uriconfirm?uri=https%3A%2F%2F52bb7ac08e78da0781cace19b1a1acee.us-east-1.resend-links.com%2FCL0%2Fhttps%3A%252F%252Fdoc.rti-tek.fr%252Fdoc%252F6zmn6zuo5oq6yas5yqf6io95lyy5yyw6k05pio-dRc9GgA8t2%2F1%2F010001973f118aee-4bc2f0e0-4368-47ce-9e20-a902e9676516-000000%2FXLmT9olksc8mRFnul6GIYhXCatnxgBxV4Nlux9Kzzy8%3D408&desc=7_0&err_type=high_risk_forbid&ts"

    const restoredUrl = getAndDecodeUriParameter();
    console.log("还原后的网址是:", restoredUrl);

    // 添加电子符箓
    if (document.getElementsByClassName('spam_title')[0]) {
        document.getElementsByClassName('spam_title')[0].textContent = '祝开发此屏蔽功能的工作人员工作顺利！';
        document.getElementsByClassName('spam_title')[0].style.textAlign = 'center';
    }
    if (document.getElementsByClassName('spam_desc')[0]) {
        document.getElementsByClassName('spam_desc')[0].textContent = '正在加载所谓的 “不安全网址”';
    }

    const rectElement = document.querySelector('.stage_result > svg.comm_infoAttention72_Red > rect');

    if (rectElement) {
        // Change the fill attribute to 'green'
        rectElement.style.setProperty('fill', 'green', 'important');
        console.log('The <rect> element background has been changed to green.');
    } else {
        console.error('Could not find the target <rect> element to change its color.');
    }

    if (restoredUrl && /^https:\/\//.test(restoredUrl)) {
        window.location.href = restoredUrl;
    }
})();