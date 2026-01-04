// ==UserScript==
// @name         Steam游戏库保存器
// @namespace    https://qinlili.bid
// @version      0.1
// @description  保存Steam拥有的游戏，用于验证
// @author       琴梨梨
// @match        https://steamcommunity.com/id/*/games/*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// @require      https://lib.baomitu.com/pako/2.0.4/pako.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/446847/Steam%E6%B8%B8%E6%88%8F%E5%BA%93%E4%BF%9D%E5%AD%98%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446847/Steam%E6%B8%B8%E6%88%8F%E5%BA%93%E4%BF%9D%E5%AD%98%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getVideoCardInfo() {
        const gl = document.createElement('canvas').getContext('webgl');
        if (!gl) {
            return false;
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo ? {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        } : false;
    }
    if(document.querySelector("#account_pulldown").innerText.trim()==document.querySelector("#responsive_page_template_content > div.pagecontent.no_header > div.profile_small_header_bg > div > div > span.profile_small_header_name > a").innerText.trim()){
        let dumpBtn=document.createElement("a");
        dumpBtn.innerText="保存游戏清单";
        document.querySelector("#gameslist_sort_options").insertAdjacentElement("afterbegin",dumpBtn);
        dumpBtn.addEventListener("click",async ()=>{
            let toSave={};
            toSave.username=document.querySelector("#account_pulldown").innerText.trim();
            toSave.userid=g_steamID;
            toSave.games=rgGames;
            toSave.GPUinfo = getVideoCardInfo();
            toSave.time=Date.now();
            let userAgent=await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness', 'mobile', 'platform', 'platformVersion', 'uaFullVersion', 'wow64'])
            delete userAgent.brands;
            toSave.browser=userAgent;
            let toSaveJson=JSON.stringify(toSave);
            console.log(toSave);
            let eleLink = document.createElement('a');
            eleLink.download = g_steamID+".svk";
            eleLink.style.display = 'none';
            eleLink.href = URL.createObjectURL(new Blob([pako.gzip(toSaveJson)]));
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        })
    }else{
        console.log("Not owner!")
    }
})();