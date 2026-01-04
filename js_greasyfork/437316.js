// ==UserScript==
// @name         微信读书阅读样式 - 改
// @version      0.1
// @description  微信读书阅读样式 自定义-Extend
// @author       By Jackie http://csdn.admans.cn/ - extended for own usage style, Claud Xiao
// @match        *://weread.qq.com/web/reader/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/164689
// @supportURL   https://github.com/JackieZheng/WeReadStyle/issues
// @downloadURL https://update.greasyfork.org/scripts/437316/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F%20-%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/437316/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F%20-%20%E6%94%B9.meta.js
// ==/UserScript==

GM_addStyle(".readerControls_fontSize,.readerControls_item{background-color: #3e5b94ba !important;}");
GM_addStyle(".renderTargetContainer{padding:0 40px !important;}");
GM_addStyle(".readerControls{margin-left: calc(50% - 60px) !important;}");
GM_addStyle(".app_content{width:100%;max-width:80% !important;padding-top:0;}");
//GM_addStyle(".app_content{width:100%;max-width:80% !important;padding-top:0;font-family:'宋体'!important;}");
GM_addStyle(".readerTopBar{width:100%;max-width:100% !important;left:0;}");
GM_addStyle(".readerNotePanel,.readerCatalog{left:20%;width:60% !important;margin:0 auto;}");
GM_addStyle(".readerChapterContent.navBarOffset{padding-top:20px !important;}");
GM_addStyle(".readerChapterContent.navBarOffset{padding-top:20px !important;}");
GM_addStyle(".renderTargetContainer .wr_selection {background: #2bfc005c !important;}");
GM_addStyle(".renderTargetContainer .wr_underline.s0{border-bottom: 2px solid #7ec307ed;background-image: none !important;}");
//GM_addStyle(".renderTargetContainer img{display: none !important;}");

(function(){
        'use strict'; 
        document.onclick=function(event){
            console.log(event.target);
            if(event.target&&hasClassName(event.target,"icon"))
            {
              return false;
            }
            if(document.getElementsByClassName("readerTopBar")[0].style.display=='none')
            {
                document.getElementsByClassName("readerTopBar")[0].style.display='flex';
                document.getElementsByClassName("readerControls")[0].style.display='flex';            
            }
            else
            {
                document.getElementsByClassName("readerTopBar")[0].style.display='none';
                document.getElementsByClassName("readerControls")[0].style.display='none';    
            }
        }       



})();

function hasClassName(obj,name){
    let tmpName = obj.className;
    let tmpReg = new RegExp(name,'g');
    if(tmpReg.test(tmpName)){
        return true;
    }else{
        return false;
    }
}

