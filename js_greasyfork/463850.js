// ==UserScript==
// @name         baidu.com 美化
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  用来美化 baidu.com
// @author       poeticalcode
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/463850/baiducom%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463850/baiducom%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
 .c-group-wrapper{
    box-shadow:none;
    }

    #content_left{
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
        display: flex;
    flex-direction: column;
        padding: 8px 18px !important;
       margin: 0 !important;
           background: #2D333B !important;
           -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);

    }


       div,a{
background: #2D333B !important;
       }

       div[tpl=short_video],div[tpl=recommend_list]{
display:none;
       }

       *{
           color: #adbac7 !important;
       }

       body{
           background: #22272E !important;
       }

       .cr-content.new-pmd.display_eTioD{
display:none !important;
       }
    `);
})();