// ==UserScript==
// @name         杨卫民语录
// @version      0.1
// @description  将搜索内容自动修改为杨卫民语录
// @author       You
// @match        https://cn.bing.com/search?*
// @match        https://www.baidu.com/s?*
// @icon         https://cn.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @namespace https://greasyfork.org/users/995328
// @downloadURL https://update.greasyfork.org/scripts/456371/%E6%9D%A8%E5%8D%AB%E6%B0%91%E8%AF%AD%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/456371/%E6%9D%A8%E5%8D%AB%E6%B0%91%E8%AF%AD%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let text_arr = ["我们是做产品，不是搞研究！",
                    "做人要有故事可讲！",
                    "我就是上帝！",
                    "对对对，你要这句话我给你好了！",
                    "绝对是国内领先，国际先进！",
                    "这个搞好了，够你博士毕业了！",
                    "那这样的话，直接别干了，解散好了！",
                    "等会，等会，等会，等会...",
                    "得，得，得，得，得...",
                    "不对，不对，不对，你慢点，你慢点..."];

    let randnum = Math.floor(Math.random() * text_arr.length);

    try{
        document.querySelector("#sb_form_q").value = text_arr[randnum];
    }catch(err){
    }
    try{
        document.querySelector("#kw").value = text_arr[randnum];
    }catch(err){
    }
})();