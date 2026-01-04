// ==UserScript==
// @name         Nga编辑功能优化
// @namespace    https://greasyfork.org/users/325815
// @version      1.0
// @description  优化NGA的编辑器UI,并提供一部分额外功能
// @author       monat151
// @match        http*://bbs.nga.cn/post.php?action=new*
// @match        http*://bbs.nga.cn/post.php?action=modify*
// @match        http*://ngabbs.com/post.php?action=new*
// @match        http*://ngabbs.com/post.php?action=modify*
// @match        http*://nga.178.com/post.php?action=new*
// @match        http*://nga.178.com/post.php?action=modify*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/462674/Nga%E7%BC%96%E8%BE%91%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/462674/Nga%E7%BC%96%E8%BE%91%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const maoInfo = '[size=0%]MAO[/size]';
    const editiorFonts = "'Courier New', '思源宋体', '思源宋体 CN'"

    setTimeout(function(){
        // 修改编辑器字体
        document.getElementsByName('post_content')[0].style.fontFamily = editiorFonts;
        document.getElementsByName('post_subject')[0].style.fontFamily = editiorFonts;

        // 增加定位锚按钮
        const btns = document.querySelectorAll("button");
        var lastBtn;
        for(var i=0;i<btns.length;i++){
            if(btns[i].innerHTML == '长度'){
                lastBtn = btns[i];
            }
        }
        if(lastBtn){
                const new_button = document.createElement('button');
                new_button.id = `maobtn`;
                new_button.innerHTML = `复制定位锚`;
                new_button.type = `button`;
                new_button.title = '将可供定位和检索的信息复制到剪贴板\n复制后使用Ctrl + F组合键查询';
                new_button.addEventListener('click', (e) => {
                    GM_setClipboard(maoInfo)
                    document.getElementById('maobtn').innerHTML = '复制成功'
                });
                lastBtn.after(new_button);
        }
    },200);
})();