// ==UserScript==
// @name         ProcessOn-VIP
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  优雅地解锁ProcessOn
// @author       涛之雨
// @match        *://www.processon.com/*
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @icon         http://processon.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/506971/ProcessOn-VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/506971/ProcessOn-VIP.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    ajaxHooker.hook(request => {
        if (request.url.endsWith('/user/privilege')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                json.data.privilege.member=json.data.privilege.orgMember=true;
                res.responseText = JSON.stringify(json);
            };
        }
    });
    const id=setInterval(()=>{
        if(!window.$)return;
        const doms=window.$("li[tit='xmind'],li[tit='fmind'],li[tit='pdfHD'],li[type='pdfHD']");
        if(doms.length===0)return;
        doms.remove();
        clearInterval(id);
    },500);
    setTimeout(()=>clearInterval(id),100000);
    if(location.href.includes("diagraming")){
        const id=setInterval(()=>{
            if(!window.$)return;
            const doms=window.$(".po-watermark-input-container");
            if(doms.length===0)return;
            doms.remove();
            clearInterval(id);
        },500);
        setTimeout(()=>clearInterval(id),100000);
    }
})();