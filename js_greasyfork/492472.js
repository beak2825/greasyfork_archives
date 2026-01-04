// ==UserScript==
// @name         HTML introduction
// @namespace    http://tampermonkey.net/
// @version      v1.0.7
// @description  Display HTML from luogu paste
// @author       limesarine
// @match        https://luogu.com/user/*
// @match        https://luogu.com.cn/user/*
// @match        https://*.luogu.com/user/*
// @match        https://*.luogu.com.cn/user/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492472/HTML%20introduction.user.js
// @updateURL https://update.greasyfork.org/scripts/492472/HTML%20introduction.meta.js
// ==/UserScript==

function deal(pre,id) {
    fetch('/paste/'+id+'?_contentOnly').then(d=>d.text()).then(t=>{
        let data=JSON.parse(t).currentData.paste.data;
        let e=document.getElementsByClassName('introduction marked')[0];
        e.innerHTML=e.innerHTML.replaceAll(pre+id,data);
    });
}
function deal_float(pre,id) {
    fetch('/paste/'+id+'?_contentOnly').then(d=>d.text()).then(t=>{
        let data=JSON.parse(t).currentData.paste.data;
        let e=document.getElementsByClassName('introduction marked')[0];
        data=`<div style=" position: fixed; left: 50%; transform: translateX(-50%); text-align: center; bottom: 0; background-color: rgba(0,0,0,0);">${data}</div>`;
        e.innerHTML=e.innerHTML.replaceAll(pre+id,data);
    });
}
function ddd(reg,pre,f)
{
    let matches=document.getElementsByClassName('introduction marked')[0].innerHTML.match(reg);
    if(matches)
        for(let i=0;i<matches.length;i++)
        {
            let x=matches[i];
            if(x.startsWith(pre) && x.slice(pre.length).length==8)
                f(pre,x.slice(pre.length));
        }
}
(function(){
    'use strict';
    let local=location.href.includes('luogu.com.cn')
    const observer=new MutationObserver(()=>{
        const introduction=document.getElementsByClassName("introduction marked")[0];
        if(introduction)
        {
            if(local)
            {
                let e=document.getElementsByClassName("introduction marked")[0];
                if(e.getAttribute('marked')){}
                else
                    e.innerHTML+=`<div style="border: 0; border-radius: 10px; position: fixed; left: 50%; transform: translateX(-50%); text-align: center; bottom: 0; background-color: #ccf"><p style="margin: 3px;">您现在在洛谷国内站，所以无法显示剪贴板中的HTML</p></div>`;
                e.setAttribute('marked',true);
            }
            else
            {
    			ddd(/LS\.PASTE\.(........)/g,'LS.PASTE.',deal);
    			ddd(/LS\.FLOAT\.PASTE\.(........)/g,'LS.FLOAT.PASTE.',deal_float);
            }
        }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
})();