// ==UserScript==
// @name         feishu content toggle
// @namespace    http://tampermonkey.net/
// @version      24oct30-2027
// @description  content toggle
// @author       onionycs
// @license      MIT
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502863/feishu%20content%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/502863/feishu%20content%20toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */

    // Your code here...
    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        // 检查按下的键是否是数字0（注意：这里不区分大小写，但数字键通常没有大小写）
        if (event.key === '['||event.key === '【') {
            let viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let elem =$('.docx-width-mode')[0];
            document.getElementsByClassName("catalogue__pin-wrapper")[0].click();
            //false目录为开
            setTimeout(function(){
                console.error("调整窗口");
                if($('.catalogue__pin-wrapper').attr('data-pin')=='false'){
                    console.error("居中文字");
                    let a1=viewportWidth*0.6;
                    let a2=viewportWidth*0.3;
                    let a3=viewportWidth*0.1;
                    //document.getElementsByClassName("editor")[0].style.width=a1+"px";
                    //document.getElementsByClassName("editor")[0].style.maxWidth=a1+"px";
                    //document.getElementsByClassName("editor")[0].style.marginLeft=a2+"px";
                    //document.getElementsByClassName("editor")[0].style.marginRight=a3+"px";
                    //elem.style.maxWidth = a2 + 'px';
                     //$('.catalogue__item-title').css({
                     //    'overflow': 'visible'
                     //});
                } else {
                    //console.error("文字居左");
                    //let a1=viewportWidth*0.8;
                    //let a2=viewportWidth*0.3;
                    //let a3=viewportWidth*0.1;
                    //document.getElementsByClassName("editor")[0].style.width=a1+"px";
                    //document.getElementsByClassName("editor")[0].style.maxWidth=a1+"px";
                    //document.getElementsByClassName("editor")[0].style.marginLeft=a3+"px";
                }
            },300);
        }
        //move to collapse content
        //if (event.key === ']'||event.key === '】') {
        //    document.getElementsByClassName('doc-comment-v2-close-btn')[0].click();
        //}
    });
})();