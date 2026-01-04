// ==UserScript==
// @name         知乎视频页面 优化
// @version      0.1
// @description  知乎的视频页面样式不好看，做了简单优化
// @author       写代码的猫叔
// @match        https://www.zhihu.com/people/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/825126
// @downloadURL https://update.greasyfork.org/scripts/435196/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435196/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #Profile-zvideos .List-item{
            width:300px;
            display:inline-block;
        }
        #Profile-zvideos .ContentItem-meta,#Profile-zvideos .RichContent-inner{
            display:none;
        }

        #Profile-zvideos .ContentItem-actions{
            flex-wrap:wrap;
            width: 100%;
        }

        #Profile-zvideos .ContentItem-title{
            font-size:15px;
            margin-bottom: 10px;
        }

        #Profile-zvideos .RichContent-cover{
            width: 300px;    height: 184px;
        }
    `)
})();