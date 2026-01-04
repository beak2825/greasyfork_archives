// ==UserScript==
// @name         哔哩哔哩专栏纯净复制
// @namespace    https://greasyfork.org/zh-CN/scripts/428024-哔哩哔哩专栏纯净复制
// @version      0.2
// @description  哔哩哔哩专栏纯净复制，去除作者、链接和出处
// @author       beibeibeibei
// @match        *.bilibili.com/read/*
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428024/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E7%BA%AF%E5%87%80%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/428024/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E7%BA%AF%E5%87%80%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).keyup(function(event){
        if(event.ctrlKey && event.keyCode==67){
            let text = window.getSelection().toString();
            //按太快了不好使，Alert提示一下
            alert("复制成功 - 来自油猴脚本哔哩哔哩专栏纯净复制的消息\n" + text);
            GM_setClipboard(text);
        }
    });
})();
