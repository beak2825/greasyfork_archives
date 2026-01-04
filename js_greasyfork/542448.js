// ==UserScript==
// @name         Bing 必应 搜索双击空格自动拼接 ` site:cnblogs.com`
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  拒绝劣币驱逐良币，博客园yyds
// @author       Enlin
// @match        *://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542448/Bing%20%E5%BF%85%E5%BA%94%20%E6%90%9C%E7%B4%A2%E5%8F%8C%E5%87%BB%E7%A9%BA%E6%A0%BC%E8%87%AA%E5%8A%A8%E6%8B%BC%E6%8E%A5%20%60%20site%3Acnblogscom%60.user.js
// @updateURL https://update.greasyfork.org/scripts/542448/Bing%20%E5%BF%85%E5%BA%94%20%E6%90%9C%E7%B4%A2%E5%8F%8C%E5%87%BB%E7%A9%BA%E6%A0%BC%E8%87%AA%E5%8A%A8%E6%8B%BC%E6%8E%A5%20%60%20site%3Acnblogscom%60.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const query_input = document.getElementById('sb_form_q');
    query_input.addEventListener("input", () => {
        console.log(`搜索框触发input事件`)
        // console.log(query_input);
        let temp_input_val = query_input.value
        if (temp_input_val.substr(temp_input_val.length-2,2) == '  '){
            query_input.value = temp_input_val.replace(/(.*) /, `$1site:cnblogs.com`)
        }
    })

    /**
        str = str.replace(/(.*)p/, '$1div')
        正则表达式 /(.*)p/ 会找到字符串中第一次出现的 p 之前的所有字符
        然后用 $1div 进行替换，其中 $1 是保留 p 前面匹配到的所有字符，而 p 会被替换为 div。
    */
})();