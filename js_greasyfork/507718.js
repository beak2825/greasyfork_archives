// ==UserScript==
// @name         智能修改工具
// @namespace    http://tampermonkey.net/
// @version      2.25
// @description  尝试在发送特定URL的POST请求时修改请求体中的参数
// @author       隆回县卫健局
// @match        https://hnjf.jfns.shop/*
// @grant        none
// @license      隆回县卫健局(heshenglong313@163.com)
// @downloadURL https://update.greasyfork.org/scripts/507718/%E6%99%BA%E8%83%BD%E4%BF%AE%E6%94%B9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/507718/%E6%99%BA%E8%83%BD%E4%BF%AE%E6%94%B9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要修改参数的特定URL
    var targetURL = "https://hnjf.jfns.shop/Ygsp/findAllzb.action";

    // 保存原始的XMLHttpRequest.send方法
    var originalSend = XMLHttpRequest.prototype.send;

    // 重写send方法
    XMLHttpRequest.prototype.send = function(body) {
        // 检查是否是POST请求且URL匹配
        console.log('targetURL:', targetURL);
        console.log('targetURL_indexof',this.url.indexOf(targetURL));
        if(this.url.indexOf(targetURL) > -1)
        {
            if (this.method.toUpperCase() === 'POST' ) {
                console.log('Original POST data:', body);
    
                // 修改请求体中的参数
                var modifiedBody = modifyPostData(body);
    
                // 调用原始的send方法，但是使用修改后的请求体
                originalSend.call(this, modifiedBody);
            } else {
                // 对于非POST请求或URL不匹配的情况，调用原始的send方法
                originalSend.call(this, body);
            }
        }
    };

    // 定义modifyPostData函数来修改POST数据
    function modifyPostData(originalBody) {
        // 这里根据需要修改originalBody
        // 例如，你可以解析originalBody（如果它是JSON或表单数据），修改它，然后返回修改后的版本
        // 下面是一个简单的示例，将所有POST数据中的某个特定参数值修改

        // 假设originalBody是一个URL编码的表单数据
        var pairs = originalBody.split('&');
        var modifiedPairs = pairs.map(function(pair) {
            console.log('Original POST data part:', part);
            
            
            // var parts = pair.split('=');
            // if (parts[0] === 'year') {
            //     // 修改参数值
            //     return parts[0] + '=' + '2024';
            // }
            
            var parts = pair.split('&');
            for (const part of parts) {
                var subParts = part.split('=');
                
                console.log('Original POST data part:', part.toString());
                if (subParts.length === 2) {  // 确保键值对完整
                    console.log("Key:", subParts[0], "Value:", subParts[1]);
                } else {
                    console.log("Incomplete pair:", part);
                }
            }
            
            return pair;
        });

        // 将修改后的参数重新组合成字符串
        return modifiedPairs.join('&');
    }
})();