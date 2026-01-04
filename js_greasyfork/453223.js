// ==UserScript==
// @name         定位锚
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  -
// @author       InfSein
// @match        http*://bbs.nga.cn/post.php?action=new*
// @match        http*://bbs.nga.cn/post.php?action=modify*
// @match        http*://nga.178.com/post.php?action=new*
// @match        http*://nga.178.com/post.php?action=modify*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/453223/%E5%AE%9A%E4%BD%8D%E9%94%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/453223/%E5%AE%9A%E4%BD%8D%E9%94%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const maoInfo = '[size=0%]MAO[/size]';

    // Your code here...
    setTimeout(function(){
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
                new_button.title = `‘将可供定位和检索的信息复制到剪贴板`;
                new_button.addEventListener('click', (e) => {
                    GM_setClipboard(maoInfo)
                    document.getElementById('maobtn').innerHTML = '复制成功'
                });
                lastBtn.after(new_button);
        }
    },200);
})();