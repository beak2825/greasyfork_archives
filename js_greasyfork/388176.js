// ==UserScript==
// @name         Luogu 首页置顶助手
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.3.1
// @description  Luogu 首页顶部置顶任意链接（1个）
// @author       zz07
// @match        https://www.luogu.org
// @match        https://www.luogu.com.cn
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/388176/Luogu%20%E9%A6%96%E9%A1%B5%E7%BD%AE%E9%A1%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388176/Luogu%20%E9%A6%96%E9%A1%B5%E7%BD%AE%E9%A1%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    $(function(){
        function setLink()
        {
            var link = prompt("请输入链接地址（点按取消以不变）");
            if (link == undefined)
                { return; }
            var text = prompt("请输入链接文字");
            GM_setValue("user_link", link);
            GM_setValue("user_link_text", text);
            location.reload();
        }
        var title = $(".link-container");
        var prelink = GM_getValue("user_link");
        var pretext = GM_getValue("user_link_text")
        var link = '<a data-v-44f42e53="" data-v-02d4dc3d="" href="' + prelink + '" target="_blank" class="header-link color-none"><span data-v-02d4dc3d="" data-v-44f42e53="" style="color: rgb(38, 38, 38);">' + pretext + '</span></a>';
        var button = document.createElement("button");
        button.innerText = '编辑';
        button.className = 'am-btn am-btn-sm am-btn-primary'
        button.addEventListener('click', setLink);
        var helper = '<span data-v-86f2b1fc data-v-5b9d45a0 class="helper"></span>';
        console.log(button);
        if (pretext != undefined)
        {
            title.append(link, helper);
        }
        title.append(button, helper);
    });
})();