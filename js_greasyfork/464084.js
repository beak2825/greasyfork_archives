// ==UserScript==
// @name         温馨遗言
// @namespace    wenxinyiyan.taozhiyu.gitee.io
// @version      0.1
// @description  文心一言去水印，支持自定义|失效不一定修
// @author       涛之雨
// @match        https://yiyan.baidu.com/
// @icon         https://nlp-eb.cdn.bcebos.com/logo/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/464084/%E6%B8%A9%E9%A6%A8%E9%81%97%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/464084/%E6%B8%A9%E9%A6%A8%E9%81%97%E8%A8%80.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    const wm=GM_getValue("watermark"," ");
    const rid="apply"+Math.random().toString(36).slice(2);
    Function[rid]=Function.apply;
    Function.apply=function($this,args){
        return Function[rid]($this,args.map(a=>a.replace(/debugger/ig,"")));
    };
    ajaxHooker.hook(request => {
        if (request.url.endsWith('user/info')){
            request.response = res => {
                res.json.content.watermark=wm;
            };
        }else if(request.url.endsWith('chat/query') || request.url.endsWith('chat/history')){
            request.response = res => {
                res.json=JSON.parse(JSON.stringify(res.json).replace(/x-bce-process/g,"?&"));
            };
        }
    });
    const id=setInterval(()=>{
        if(!document.querySelector('.ant-menu-submenu-title img'))return;
        clearInterval(id);
        document.querySelector('.ant-menu-submenu-title img').ondblclick=function(){
            const inp=prompt("请输入自定义水印内容：",""+wm.slice(1));
            if(inp===null)return;
            GM_setValue("watermark",` ${inp}`);
            confirm("设置成功，刷新后生效。\n是否立即刷新？")&&location.reload();
        };
    },200);
})();