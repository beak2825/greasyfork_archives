// ==UserScript==
// @name         OpenAI教导我们
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  来自D版带着AI
// @author       You
// @match        https://www.4d4y.com/forum/viewthread.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460055/OpenAI%E6%95%99%E5%AF%BC%E6%88%91%E4%BB%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460055/OpenAI%E6%95%99%E5%AF%BC%E6%88%91%E4%BB%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const sign = 'gpt-3';
    let threadtitle = document.querySelector("#threadtitle").textContent.trim()
    let fastpostmessage = document.querySelector('#fastpostmessage');
 
    // 使用XMLHttpRequest对象发送一个POST请求
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.openai.com/v1/completions");
 
    // 设置请求头
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer 换成你的api key");
 
    // 设置请求体
    var data = {
        "model": "text-davinci-003",
        "prompt": threadtitle,
        "temperature": 0,
        // "top_p": 0.9,
        "max_tokens": 888,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
    };
 
    // 发送请求
    xhr.send(JSON.stringify(data));
 
    // 处理响应
    xhr.onload = function() {
        if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            fastpostmessage.value = response.choices[0].text.trim() + `   [url=https://greasyfork.org/en/scripts/460055-openai%E6%95%99%E5%AF%BC%E6%88%91%E4%BB%AC][size=1]userscript[/size][/url] [url=https://platform.openai.com/docs/models/gpt-3][size=1]${sign}[/size][/url]`;
            console.log(response.choices[0].text.trim())
        } else if (xhr.status == 429) {
            fastpostmessage.value = "哎呀,脑子不够用了" + `   [url=https://greasyfork.org/en/scripts/460055-openai%E6%95%99%E5%AF%BC%E6%88%91%E4%BB%AC][size=1]userscript[/size][/url] [url=https://platform.openai.com/docs/models/gpt-3][size=1]${sign}[/size][/url]`;
        }
    };
})();