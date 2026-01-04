// ==UserScript==
// @name         百度云增强：屏蔽云管家直接下载与阻止WAP版跳转PC版（支持Chrome）
// @namespace    http://TouHou.DieMoe.net/
// @version      1.2
// @description  明明是我先强制WAP版的，改地址栏也好，换UA也好……为什么要跳转到PC版呢……
// @author       DieMoe
// @run-at       document-start
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @grant          unsafeWindow
// @grant          GM_setValue
// @grant          GM_getValue
// @compatible firefox
// @compatible chrome
// @compatible edge
// @downloadURL https://update.greasyfork.org/scripts/411321/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%A2%9E%E5%BC%BA%EF%BC%9A%E5%B1%8F%E8%94%BD%E4%BA%91%E7%AE%A1%E5%AE%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%98%BB%E6%AD%A2WAP%E7%89%88%E8%B7%B3%E8%BD%ACPC%E7%89%88%EF%BC%88%E6%94%AF%E6%8C%81Chrome%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/411321/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%A2%9E%E5%BC%BA%EF%BC%9A%E5%B1%8F%E8%94%BD%E4%BA%91%E7%AE%A1%E5%AE%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%98%BB%E6%AD%A2WAP%E7%89%88%E8%B7%B3%E8%BD%ACPC%E7%89%88%EF%BC%88%E6%94%AF%E6%8C%81Chrome%EF%BC%89.meta.js
// ==/UserScript==
/* ChangeLog:
    1.2:
        修改启动提示描述。
    1.1:
        加了新的css过滤。
        加了首次启动提示。
    1.0:
        Fix :提高浏览器兼容性。
    0.9:
       你看啥，这只是修改了名字而已（不）
    0.8:
        修正由于CSS屏蔽部分div导致拖拽上传不正确的现象。
    0.7:
        修正了由于sicon屏蔽后导致的css错误
        增加分享页面的文件md5获取并显示（如果文件支持）[未实装/冗余代码]
        显示分享的文件位于当前用户的详细存储地址（无卵用）[未实装/冗余代码]
*/

(function() {
    'use strict';
    var errmsg_1='百度云增强：屏蔽云管家直接下载与阻止WAP版跳转PC版（支持Chrome）发生了一个错误[规格内]:浏览器navigator属性修改失败，自动尝试方案2。';
    var errmsg_2='百度云增强：屏蔽云管家直接下载与阻止WAP版跳转PC版（支持Chrome）发生了一个错误[预期外]:无法修改浏览器navigator，这将影响大文件下载时云管家屏蔽功能。';
    if(!GM_getValue('pcs_tip_1')){
        if(confirm("百度云增强：屏蔽云管家直接下载：\n\n由于百度云文件策略修改，如果出现无法下载单文件的问题，请尝试分享后从分享页面点击下载。\n\n百度云 - 最弱智的云.zsbd\n\n单击“确认”按钮将不再提醒")){
            GM_setValue("pcs_tip_1", true);
        }
    }
    var inscript = window.document.createElement("script");
          inscript.innerHTML ="return false;";
          inscript.setAttribute("id","platform");
    window.document.head.appendChild(inscript);
    try{Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});}catch(e){}
    checkNav();
    clearPage();

    function checkNav(){
        if(navigator.platform!='Android'){//
            console.log(errmsg_1);
            try{navigator.__defineGetter__('platform',function(){return 'Android';});}catch(e){}
            if(navigator.platform!='Android'){
                console.log(errmsg_2);
            }
        }
    }

    function clearPage(){
        var clearcss = window.document.createElement("style");
        clearcss.innerHTML = ".feNMdtb,.JS-user-level,.KQcHyA,.gOIbzPb,.appDownload,.no-result-file-twocode,.banner-active,.welcome-mask,.welcome-box,.user-level,.side-lalldownload,.vip-notice,.vip-privilege,.app-center,.app-download,.coupon-banner-active,#web-right-view,.ad-platform-tips,.union-hot,.sicon>em{display:none !important;width:0px;height:0px;}";  //清理广告或其他无意义按钮的css
        clearcss.innerHTML += ".share-person-username{height:17px !important;}"; //css修正补丁
        window.document.head.appendChild(clearcss);
    }

    // 以下内容工事中
    //unsafeWindow.onload=initEditElement();
    //window.setTimeout(initEditElement,4000);
    //initEditElement();

    function initEditElement(){
        var inscript = window.document.createElement("script");
        inscript.innerHTML ="var pathname = window.location.pathname;window.onload=setTimeout(EditElement(),6000);function EditElement(){if((pathname.indexOf('/s/')>-1||pathname.indexOf('/share/')>-1)&&yunData.FILEINFO){var ret='';if(yunData.FILEINFO[0].md5){ret+='md5: '+yunData.FILEINFO[0].md5}else{console.log('阻止百度网盘WAP版自动跳转至PC版（支持Chrome）发生了一个错误[规格内]:无法获取分享文件的md5')}$('.file-name').html(ret)}else{console.log('阻止百度网盘WAP版自动跳转至PC版（支持Chrome）发生了一个错误[规格内]:无法获取分享文件的info')}}";
        window.document.head.appendChild(inscript);
        return false;
        window.onload=EditElement();
        function EditElement(){
            if((pathname.indexOf('/s/')>-1||pathname.indexOf('/share/')>-1)&&window.yunData.FILEINFO){
                var $ = $ || unsafeWindow.$;
                var ret='';
                if(window.yunData.FILEINFO[0].md5){
                    ret+='md5: '+yunData.FILEINFO[0].md5;
                }else{
                    console.log('阻止百度网盘WAP版自动跳转至PC版（支持Chrome）发生了一个错误[规格内]:无法获取分享文件的md5');
                }
                $('.file-name').html(ret);
            }else{
                console.log('阻止百度网盘WAP版自动跳转至PC版（支持Chrome）发生了一个错误[规格内]:无法获取分享文件的info');
            }
        }
    }
})();