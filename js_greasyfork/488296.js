// ==UserScript==
// @name         京东自动评价（OpenAI GPT-3.5版，带五星好评）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用OpenAI GPT-3.5生成评价，并自动给予五星好评
// @author       oscar
// @match        https://club.jd.com/myJdcomments/orderVoucher*
// @require      http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/488296/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%EF%BC%88OpenAI%20GPT-35%E7%89%88%EF%BC%8C%E5%B8%A6%E4%BA%94%E6%98%9F%E5%A5%BD%E8%AF%84%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488296/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%EF%BC%88OpenAI%20GPT-35%E7%89%88%EF%BC%8C%E5%B8%A6%E4%BA%94%E6%98%9F%E5%A5%BD%E8%AF%84%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OPENAI_API_KEY = 'sk-'; // 更换为您实际的API密钥

    function getProductName() {
        return $('.p-name a').text().trim();
    }

    // 定义使用OpenAI GPT-3.5 API生成评价的函数
    function generateProductReview(productName, callback) {
        console.log('开始生成评价，发送给OpenAI的信息:', productName);
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/chat/completions",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            data: JSON.stringify({
                model: "gpt-3.5-turbo", // 根据实际使用的模型进行调整
                messages: [
                    {
                        role: "system",
                        content: "生成一个简短的京东商品评价，中文字符200个字，注意换行输出，我会给你商品的名称"
                    },
                    {
                        role: "user",
                        content: productName
                    }
                ]
            }),
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.error) {
                    console.error('OpenAI API 请求错误:', result.error.message);
                    return;
                }
                const review = result.choices && result.choices.length > 0 ? result.choices[0].message.content : "";
                callback(review.trim());
            },
            onerror: function(error) {
                console.error('请求OpenAI GPT-3 API时发生错误:', error);
            }
        });
    }

    // 填充评价并自动选择五星好评
    function fillAndRate(review) {
        $('.f-textarea textarea').val(review);
        console.log("评价已填写.");

        $('.star5').click(); // 自动选择五星好评
        console.log("已自动选择五星好评！");
    }

    $(document).ready(function() {
        var productName = getProductName();
        if (productName) {
            generateProductReview(productName, fillAndRate);
        }
    });
})();