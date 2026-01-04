// ==UserScript==
// @name         Another way to get bachngocsach vip text
// @namespace    Name cmn space
// @description  Another way to getbachngocsach vip text
// @version      0.1.0
// @author       You
// @match        https://*.bachngocsach.com/*
// @match        https://bachngocsach.vip/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/493002/Another%20way%20to%20get%20bachngocsach%20vip%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/493002/Another%20way%20to%20get%20bachngocsach%20vip%20text.meta.js
// ==/UserScript==

let observer;

document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
        console.table(gettextList(document.body));
        observer = new MutationObserver((mList)=>{ mList.forEach((el)=>{if(el) gettextList(el)})})
        observer.observe(document,{childList:true, subtree:true,characterData:true});
    },4000)
 });

function gettextList(el=document.body) {
    const textList=[];
    textList.toString=()=>{ return textList.reduce((s,n)=>s+=n.nodeValue,'') }
    const treeWalker= document.createTreeWalker(el,NodeFilter.SHOW_TEXT,(node)=>{
        if (['META','SCRIPT','NOSCRIPT','STYLE','AREA','BASE','CANVAS','CODE','EMBED','LINK','MAP','PARAM','SOURCE','VIDEO','IMG','PICTURE','INPUT','TEXTAREA'].includes(node.parentNode?.tagName))
            return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
    });
    let node;
    while (node = treeWalker.nextNode())
        textList.push(node);
    console.log(textList.toString());
    GM.setClipboard(textList.toString(), 'text/plain');
    return textList;
}