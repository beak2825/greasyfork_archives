// ==UserScript==
// @name         一键获取luogu blog源代码
// @namespace    https://www.luogu.com.cn/blog/Rainwangpupil/copy-markdown-luogu-blog
// @license      MIT
// @version      0.1
// @description  在他人洛谷博客页面使用 Ctrl + Alt + C 快捷键，一键复制博客源代码！
// @author       Luogu Username: 2044_space_elevator
// @match        https://www.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469453/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96luogu%20blog%E6%BA%90%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/469453/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96luogu%20blog%E6%BA%90%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    async function clickBotton_blog(){
        fetch('/api/blog/detail/' + BlogGlobals.blogID).then(res => res.json()).then(res => navigator.clipboard.writeText(res.data.Content));
            // console.log(f);
            // navigator.clipboard.writeText(res.data.content)
    };
    if (url.includes("blog"))
    {
        document.onkeydown = function(e)
        {
            if (e.keyCode == 67 && e.ctrlKey && e.altKey)
            {
                clickBotton_blog();
                alert("复制成功！");
            }
        }
    }


})();