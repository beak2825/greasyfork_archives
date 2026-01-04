// ==UserScript==
// @name         Youtube Multiple Downloader dev
// @name:zh-CN   youtube油管多源下载
// @namespace    http://tampermonkey.net/
// @version      20250218
// @description  Open third-party websites directly to get YouTube.com video and audio download links
// @description:zh-cn 打开多个第三方网站下载YouTube音视频
// @author       gf2024
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://vget.xyz/dl*
// @icon         data:image/png;base64,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
// @grant		 GM_registerMenuCommand
// @grant		 GM_unregisterMenuCommand
// @grant		 GM_openInTab
// @grant        window.onurlchange
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504891/Youtube%20Multiple%20Downloader%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/504891/Youtube%20Multiple%20Downloader%20dev.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // this function is strict...
    let menu_command_id_v;
    let menu_command_id_a;
    let menu_command_id_none;

    function addMenu(){
        let w = 640;
        let h = window.innerHeight;
        let x = window.innerWidth/2 - w/2;
        let y = window.innerHeight/2 - h/2;

        let openWin = (d)=>{
            let url = document.location.href;
            url = url.replace('.youtube.com/', d);
            window.open(url,'ymd_w',`popup,left=${x},top=${y},width=${w},height=${h}`);
        };
        let openWinQuery = (u)=>{
            let url = document.location.href;
            url = u + '?url=' + encodeURIComponent(url);
            window.open(url,'ymd_w',`popup,left=${x},top=${y},width=${w},height=${h}`);
        };
        menu_command_id_a = GM_registerMenuCommand("addYoutube", function(e) {
            openWin('.addyoutube.com/');
        }, {id:'a',accessKey:'a',autoClose:true,title:'Open addYouTube.com to download'});

        menu_command_id_v = GM_registerMenuCommand("vGet", function(e) {
            openWinQuery('https://vget.xyz/dl');
        }, {id:'v',accessKey:'v',autoClose:true,title:'Open vget.xyz to download'});

        GM_unregisterMenuCommand(menu_command_id_none);

    }

    function isMenuUrl(){
        return /^\/watch|shorts/.test(location.pathname);
    }

    function removeMenu(){
        GM_unregisterMenuCommand(menu_command_id_a);
        GM_unregisterMenuCommand(menu_command_id_v);
    }

    function changeMenu(){
        if(isMenuUrl()){
            addMenu();
        }else{
            removeMenu();
        }

    }

    changeMenu();

    window.addEventListener('urlchange', (info) =>{
        changeMenu()
    });

    // vget页面提交表单
    function postVGetForm(){
        let vgetBegin = 'https://vget.xyz/dl?url=http';
        let matchUrl = location.href.indexOf(vgetBegin);
        if(matchUrl==0){
            let ytUrl = decodeURIComponent(location.search.substring('?url='.length));
            let form = document.forms[0];
            form.url.value = ytUrl;
            form.submit();
        }
    }

    postVGetForm();
}());


