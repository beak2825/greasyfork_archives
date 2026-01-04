// ==UserScript==
// @name         微信读书阅读微调
// @version      0.01
// @license MIT
// @description  微信读书阅读样式,fork from: https://greasyfork.org/zh-CN/scripts/395641-微信读书阅读样式
// @author       By Claud
// @match        *://weread.qq.com/web/reader/*
// @grant    GM_addStyle
// @namespace shinemoon-weixin-reader-enhance
// @supportURL   https://github.com/shinemoon
// @downloadURL https://update.greasyfork.org/scripts/514791/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E5%BE%AE%E8%B0%83.user.js
// @updateURL https://update.greasyfork.org/scripts/514791/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E5%BE%AE%E8%B0%83.meta.js
// ==/UserScript==

//GM_addStyle(".readerControls_fontSize,.readerControls_item{background-color: #3e5b94ba !important;}");
GM_addStyle(".download{display:none !important;}");
GM_addStyle(".renderTargetContainer{padding:0 0px !important;}");
GM_addStyle(".readerControls{margin-left: calc(50% - 60px) !important;}");
GM_addStyle(".app_content{width:80%;max-width:80% !important;padding-top:0;}");
GM_addStyle(".readerTopBar{width:100%;max-width:100% !important;left:0;}");
GM_addStyle(".readerNotePanel,.readerCatalog{left:20%;width:60% !important;margin:0 auto;}");
GM_addStyle(".renderTargetContainer .wr_selection {background: #2bfc005c !important;}");
GM_addStyle(".renderTargetContainer .wr_underline.s0{border-bottom: 2px solid #7ec307ed;background-image: none !important;}");
GM_addStyle(".readerChapterContent .s-pic,.preRenderContainer .preRenderContent img, .renderTargetContainer .renderTargetContent img {opacity: 1 !important;transform:scale(1,1.1);filter:drop-shadow( 1px 0);margin-top:-.2em !important;margin-left:-0.05em !important;}");
GM_addStyle(".renderTargetContainer .wr_selection {background: #2bfc005c !important;}");
GM_addStyle(".navBar_border{opacity:0.2 !important;}");
GM_addStyle(".readerTopBar{position:sticky!important;top:0px!important;left:0px!important;}");
//GM_addStyle(".readerContent{filter: invert(100%) brightness(70%)!important;}");





var z;
(function(){
    'use strict';
    z=document.body.style.zoom||1;
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
    window.onkeydown=function (e) {
        console.log(e.key);
        zoomBody(e.key);
    }

	document.documentElement.style.filter = "invert(5%) brightness(90%)";
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

function zoomBody(tag)
{
    if(tag=='-'&& z>0.5)
    {
        z=z-0.1;
    }
    if(tag=='=' && z<2)
    {
        z=z+0.1;
    }
    if(tag=='0')
    {
        z=1;
    }
	console.log("scale("+z+")");
	document.body.style.transform = "scale("+z+")";
    try{
        var ev = document.createEvent('Event');ev.initEvent('resize', true, true);window.dispatchEvent(ev);
    }catch (e) {
    }
}

