// ==UserScript==
// @name         Disable specific sites
// @name:zh-CN   禁用网页
// @name:zh-TW   禁用網頁
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A script to ban a user from opening some specific sites
// @description:zh-CN  禁止用户打开某些网页
// @description:zh-TW  禁止用戶打開某些網頁
// @author       You
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438279/Disable%20specific%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/438279/Disable%20specific%20sites.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var disableStatus = false
 
    function init(){
        reloadDisableStatus()
        stopLoadingPageIfInDisableList()
    }
 
    function showDisableGmBtns(){
        let menu = GM_registerMenuCommand("Disable This Site", ()=>{
            toggleDisableStatus()
            document.body.innerHTML = ""
            GM_unregisterMenuCommand(menu)
 
        })
    }
 
    function showEnableGmBtns(){
        let menu = GM_registerMenuCommand("Enable This Site", ()=>{
            toggleDisableStatus()
            GM_unregisterMenuCommand(menu)
            location.reload()
        })
    }
 
    /* function isInDisableList(){
        return localStorage.DisableSpecificSites?true:false
    } */
 
    function reloadDisableStatus(){
        disableStatus = localStorage.DisableSpecificSites=="true"?true:false
    }
 
    function stopLoadingPageIfInDisableList(){
        if(disableStatus == true){
            //console.log(disableStatus)
            //showErrorPage()
            // window.stop()
            var intv = setInterval(()=>{
                document.body.remove()
                if (document.body == void 0) clearInterval(intv)
            }, 10)
            showEnableGmBtns()
        }else {
            showDisableGmBtns()
        }
 
    }
 
    function toggleDisableStatus(){
        if(disableStatus){
            disableStatus = false
            localStorage.DisableSpecificSites = false
            showDisableGmBtns()
        }
        else{
            disableStatus = true
            localStorage.DisableSpecificSites = true
            showEnableGmBtns()
        }
    }
 
    function showErrorPage(){
        const HTMLcode = `
        <div style="text-align: center; margin-top: 30%">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="currentColor" class="bi bi-slash-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
        </svg>
        <div style='margin-top: 20px; font-size: 24px;font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'>
            This Webpage is disabled.
        </div>
        </div>
        `
 
        document.write(HTMLcode)
    }
 
    init()
 
 
})();