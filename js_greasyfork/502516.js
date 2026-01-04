// ==UserScript==
// @name         百度身谷歌壳
// @namespace    https://ez118.github.io/
// @version      0.1
// @description  让百度变成谷歌的外观
// @author       ZZY_WISU
// @match        https://www.baidu.com/*
// @match        http://www.baidu.com/*
// @match        https://baidu.com/*
// @license      GNU GPLv3
// @icon         https://cn.bing.com/sa/simg/favicon-white-bg-gra-mg.ico
// @run-at document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/502516/%E7%99%BE%E5%BA%A6%E8%BA%AB%E8%B0%B7%E6%AD%8C%E5%A3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/502516/%E7%99%BE%E5%BA%A6%E8%BA%AB%E8%B0%B7%E6%AD%8C%E5%A3%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var url = window.location.href;
    if (url.includes("baidu.com") && !url.includes("baidu.com/s?")) {
        /* 如果是百度首页 */
        GM_addStyle(`
            body { overflow-x:hidden; min-width:100px!important; }
            #s_main { margin-top: calc(53vh + 50px); }  /* 新闻 */
            #s_main > .san-card[tpl='feed-ad'] { display: none; visibility: hidden; }
            #bottom_layer { visibility: hidden; display: none; }  /* 页脚 */
            #s_form_wrapper { margin-top: 20vh; }

            .s-top-img-wrapper { border:none!important; top:-2px!important; }
            .s-top-img-wrapper img { width:30px!important; height:30px!important; }

            #s_top_wrap { display: none; visibility: hidden; } /* 顶栏 */
            .s-weather-wrapper { display: none; visibility: hidden; }
            #s-top-username > .user-name { display: none; }
            .s-top-right { padding-left:0px; }
            #s-top-left { right:100px; left:unset; }
            #s_side_wrapper { display: none; visibility: hidden; }
            #aging-tools-pc { display: none; visibility: hidden; }
            #s-top-more { padding:15px; border-radius:28px; }
            #s-top-more > .s-top-tomore { margin-top:18px; left:22px; }
            .s_ipt_wr { border-radius:28px !important; box-shadow:0px 0px 8px #3047a4 !important;  }
            #kw { border-radius:28px !important; right:0;left:0;  }
            #su { content:''; width:44px!important; border-radius:28px!important; margin-left:13px; box-shadow:0px 0px 10px #3047a4 !important; }
            #form { right:0;left:0; }
            .bdsug { border-radius:5px 0px 20px 20px!important; overflow:hidden; box-shadow:0px 3px 5px #3047a4 !important; }
            .bdsug>ul { border-radius:10px!important; }
        `);

        setTimeout(() => {
            document.getElementById("su").value = " ▶";
        },300)
    } else if(url.includes("baidu.com/s?")){
        /* 如果是搜索详情页 */
        GM_addStyle(`
            body { overflow-x:hidden; min-width:100px!important; }
            #ai-talk-container { display: none; visibility: hidden; }

            .s-top-img-wrapper { border:none!important; top:-2px!important; }
            .s-top-img-wrapper img { width:30px!important; height:30px!important; }

            #s_top_wrap { display: none; visibility: hidden; } /* 顶栏 */
            .s-weather-wrapper { display: none; visibility: hidden; }
            .s-top-username { display: none; visibility: hidden; }
            #user { width:40px }

            #s_side_wrapper { display: none; visibility: hidden; }
            #aging-tools-pc { display: none; visibility: hidden; }

            #s_kw_wrap {box-shadow:0px 0px 8px #3047a4 !important; border-radius:28px !important;}
            #kw { border-radius:28px !important; right:0;left:0;  }
            #su {  width:40px!important; border-radius:28px!important; margin-left:13px; box-shadow:0px 0px 10px #3047a4 !important; }
            #form { right:0;left:0; }
            .bdsug { border-radius:5px 0px 20px 20px!important; overflow:hidden; box-shadow:0px 3px 5px #3047a4 !important; }
            .bdsug>ul { border-radius:10px!important; }
        `);
        setTimeout(() => {
            document.getElementById("su").value = " ▶";
        },200)
    }
    // Your code here...
})();