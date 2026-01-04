// ==UserScript==
// @name         FineUI图标检索增强
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  FineUI图标检索增强，使用 jQuery 调用 FastGPT API
// @author       没想好
// @match        https://core.fineui.com/config/IconFontsFA
// @match        https://core.fineui.com/config/IconFonts
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/528326/FineUI%E5%9B%BE%E6%A0%87%E6%A3%80%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528326/FineUI%E5%9B%BE%E6%A0%87%E6%A3%80%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';

    const apiUrl = 'https://dify.shizhuoran.top/api/v1/chat/completions';
    const apiKey = 'fastgpt-mcRoSnlp7JtOJ1Nuc0hYeHR7yWO9PAkClhoV8sr0s1MpSO3KyUN1euuT5eTTp'; // 替换成你自己的 API 密钥
    const appid = '67c11f07f493f0b69717f50d';


    function removeQuotes(str) {
        return str.replace(/^['"]|['"]$/g, '');
    }

    function getAPI(key) {
        console.log(key)
        const data = {
            "chatId": appid,
            "stream": false,
            "detail": false,
            "messages": [{
                "role": "user",
                "content": key
            }]
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function (response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    console.log('API 响应:', jsonResponse.choices[0].message.content);
                    // 在这里处理 API 的响应数据
                    let res = jsonResponse.choices[0].message.content;
                    if (res) {
                        let keywordss = res.split(',').slice(0, 8);
                        $('ul.icons li').each(function () {
                            let cnode = $(this);
                            let title = cnode.find('.title').text().toLowerCase().trim();
                            let shouldShow = false;
                            for (let i = 0; i < keywordss.length; i++) {
                                let keyword = removeQuotes(keywordss[i]).toLowerCase().trim();
                                if (title.includes(keyword)) {
                                    shouldShow = true;
                                    break; // 一旦匹配到任何一个关键词，就跳出循环
                                }
                            }

                            if (shouldShow) {
                                cnode.show();
                            } else {
                                // 考虑隐藏不匹配的元素，如果需要的话
                                // cnode.hide();
                            }
                        });
                    }

                } catch (error) {
                    console.error('JSON 解析错误:', error);
                    console.error('原始响应文本:', response.responseText);
                }
            },
            onerror: function (error) {
                console.error('API 错误:', error);
            }
        });
    }
    var iconslist;
    setTimeout(function () {
        iconslist = $('ul.icons li');
        F.ui.tbxSearch.off('change', onSearchBoxChange);
        F.ui.tbxSearch.on('change', function (e) {
            var keyword = this.getValue().toLowerCase();

            $('ul.icons li').each(function () {
                var cnode = $(this),
                    title = cnode.find('.title').text().toLowerCase();

                if (title.indexOf(keyword) >= 0) {
                    cnode.show();
                } else {
                    cnode.hide();
                }
            });
            getAPI(keyword);
        })
    }, 500);
})();