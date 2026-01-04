// ==UserScript==
// @name         微信读书阅读样式
// @version      1.01
// @license MIT
// @description  微信读书阅读样式 自定义
// @author       By Jackie http://csdn.admans.cn/
// @match        *://weread.qq.com/web/reader/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/164689
// @supportURL   https://github.com/JackieZheng/WeReadStyle/issues
// @downloadURL https://update.greasyfork.org/scripts/395641/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/395641/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==
GM_addStyle("button,.readerControls .icon{cursor: pointer !important;}");
GM_addStyle(".readerControls_fontSize,.readerControls_item{background-color: #3e5b94ba !important;}");
GM_addStyle(".download{display:none !important;}");
GM_addStyle(".renderTargetContainer{padding:0 0px !important;}");
GM_addStyle(".readerControls{margin-left: calc(50% - 60px) !important;}");
GM_addStyle(".app_content{width:100%;max-width:100% !important;padding-top:0;}");
GM_addStyle(".readerTopBar{width:100%;max-width:100% !important;left:0;}");
GM_addStyle(".readerNotePanel,.readerCatalog{left:20%;width:60% !important;margin:0 auto;}");
GM_addStyle(".readerChapterContent.navBarOffset{padding-top:20px !important;}");
GM_addStyle(".readerChapterContent.navBarOffset{padding-top:20px !important;}");
GM_addStyle(".renderTargetContainer .wr_selection {background: #2bfc005c !important;}");
GM_addStyle(".renderTargetContainer .wr_underline.s0{border-bottom: 2px solid #7ec307ed;background-image: none !important;}");
GM_addStyle(".readerChapterContent .s-pic,.preRenderContainer .preRenderContent img, .renderTargetContainer .renderTargetContent img {opacity: 1 !important;transform:scale(1,1.1);filter:drop-shadow(0.05em 0);;margin-top:-.15em !important;margin-left:-.02em !important;}");
// GM_addStyle(".readerChapterContent span[class*= ccn-]{color:#c6efd33b !important}");
GM_addStyle(".reader_float_search_panel_wrapper .search_panel[data-v-5e8b3228] {width: 60vw; !important}");
GM_addStyle(".font-panel-content-arrow{display:none !important;}");


GM_addStyle(".readerTopBar,.readerNoteList,.readerTopBar_title_chapter,.readerTopBar_title_link,.bookInfo_title,.readerCatalog_list{font-family: SourceHanSerifCN-Bold !important;}");


GM_addStyle(".readerWriteReviewPanel{height:60% !important;}");

GM_addStyle(".readding{border: darkgreen 2px solid !important;box-sizing: border-box; }");
GM_addStyle(".freshing{border: darkorange 2px solid !important;box-sizing: border-box; }");
GM_addStyle(".rounding{animation: myRotate 60s linear infinite;}");
GM_addStyle(".wr_avatar_img{border: darkorange 2px solid;box-sizing: border-box;}");
GM_addStyle("@keyframes myRotate{0%{transform: rotate(0);}100%{transform: rotate(360deg);}}");

// 浅色
GM_addStyle(".wr_whiteTheme .readerContent .app_content {background-color: #C7EDCC;}");
GM_addStyle(".wr_whiteTheme .readerControls_fontSize, .wr_whiteTheme .readerControls_item{background-color: #4caf5040 !important;}");

GM_addStyle(".wr_whiteTheme .readerTopBar {border-bottom-color: rgba(33,40,50,.1);background-color: #C7EDCC;}");

// GM_addStyle("span[class^='wr_absolute ccn'] {color: #c6efd326 !important;font: 22px / 22px 汉仪楷体, 'ETrump KaiTi', 方正仿宋, FZFSJW--GB1-0, 'PingFang SC', -apple-system, 'SF UI Text', 'Lucida Grande', STheiti, 'Microsoft YaHei', sans-serif;}");

// 双面显示
GM_addStyle(".wr_horizontalReader_app_content .readerChapterContent_container .readerChapterContent {width:calc(100% - 20px) !important;height: calc(100% - 90px);}");
GM_addStyle(".wr_horizontalReader .readerControls{z-index: 999 !important; right:15px !important;}");

var z;
var hidden, state, visibilityChange,allowAutoFresh;
(function(){
    'use strict';
    z=document.body.style.zoom||1;
    allowAutoFresh=true;
    document.onclick=function(event){
        // console.log(event.target);
        if(event.target && hasClassName(event.target,"icon"))
        {
            return false;
        }
        if(document.getElementsByClassName("readerTopBar")[0].style.display=='none')
        {
            document.getElementsByClassName("readerTopBar")[0].style.display='flex';
            document.getElementsByClassName("readerControls")[0].style.display='flex';
            if(document.getElementsByClassName("wr_horizontalReader").length>0){
                document.getElementsByClassName("wr_horizontalReader")[0].getElementsByClassName("readerChapterContent")[0].style.marginTop='72px';
                document.getElementsByClassName("wr_horizontalReader")[0].getElementsByClassName("readerChapterContent")[0].style.height='calc(100% - 90px)';
            }
        }
        else
        {
            document.getElementsByClassName("readerTopBar")[0].style.display='none';
            document.getElementsByClassName("readerControls")[0].style.display='none';
            if(document.getElementsByClassName("wr_horizontalReader").length>0){
                document.getElementsByClassName("wr_horizontalReader")[0].getElementsByClassName("readerChapterContent")[0].style.marginTop='12px';
                document.getElementsByClassName("wr_horizontalReader")[0].getElementsByClassName("readerChapterContent")[0].style.height='calc(100% - 30px)';
            }
        }
    }


    window.onkeydown=function (e) {
        console.log(e.key);
        zoomBody(e.key);
        ShowReadding();
        CheckVisable();
    }
    window.onclick=function (e) {
        ShowReadding();
        CheckVisable();
    }


    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    // 添加监听器,监听当前是否活动页面
    document.addEventListener(visibilityChange, (e)=> {
        CheckVisable();
    }, false);

    // 添加监听器,监听鼠标进入页面
    document.addEventListener('mouseenter', (e)=> {
        // console.log('mouseenter');
        StopAutoRefresh();
        ReSize();
    }, false);

    // 添加监听器,监听鼠标离开页面
    document.addEventListener('mouseleave', (e)=> {
        // console.log('mouseleave');
        if(allowAutoFresh){
            StartAutoRefresh();
        }
    }, false);

    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    avatar.addEventListener('click', (e)=> {
        if(avatar.classList.contains('rounding')){
            NoRounding();
            allowAutoFresh=false;
            StopAutoRefresh();
        }
        else{
            AddRounding();
            allowAutoFresh=true;
        }
    }, false);

    CheckVisable();

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
    document.body.style.zoom=z;
    try{
        var ev = document.createEvent('Event');ev.initEvent('resize', true, true);window.dispatchEvent(ev);
    }catch (e) {
    }
}

var AutoReFresh=null;
function CheckVisable(){
    let stt=document[state];
    // console.log('visibilityChange',stt)
    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    if(allowAutoFresh){
        AddRounding();
    }
    if(stt!=='visible'|| avatar.classList.contains('readding')===false)
    {
        if(allowAutoFresh){
            AutoReFresh= StartAutoRefresh();
        }
    }
    else{
        StopAutoRefresh();
    }
}

function StartAutoRefresh(){
    // console.log('StartAutoReFresh '+(new Date()).toString(),AutoReFresh);
    ShowFreshing();
    let AutoReFresh=setInterval(()=>{
        let avatar =document.getElementsByClassName("wr_avatar_img")[0];
        let stt=document[state];
        if((stt!=='visible'||!avatar.classList.contains('readding'))&&allowAutoFresh){
            // window.location.reload();
            clearInterval(AutoReFresh);
            AutoReFresh=null
            window.location.replace(window.location.href);
            // console.log('AutoReFresh-Interval '+(new Date()).toString(),AutoReFresh);
        }

    },61*1000);
    return AutoReFresh
}

function StopAutoRefresh(){
    if(AutoReFresh)
    {
        clearInterval(AutoReFresh);
        AutoReFresh=null
        // console.log('StopAutoReFresh '+(new Date()).toString(),AutoReFresh);
        ShowReadding();
    }
}

function ShowReadding(){
    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    if(!avatar.classList.contains('readding')){
        avatar.classList.add('readding');
    }
    if(avatar.classList.contains('freshing')){
        avatar.classList.remove('freshing');
    }
}

function ShowFreshing(){
    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    if(!avatar.classList.contains('freshing')){
        avatar.classList.add('freshing');
    }
    if(avatar.classList.contains('readding')){
        avatar.classList.remove('readding');
    }
}

function NoRounding(){
    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    if(avatar.classList.contains('rounding')){
        avatar.classList.remove('rounding');
    }
}
function AddRounding(){
    let avatar =document.getElementsByClassName("wr_avatar_img")[0];
    if(!avatar.classList.contains('rounding')){
        avatar.classList.add('rounding');
    }
}

function ReSize(){
    var ReSize = new Event('resize');
    window.dispatchEvent(ReSize);
    // console.log('resize');
}
