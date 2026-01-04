// ==UserScript==
// @name         all site open new tab demo🔧
// @description  for surface
// @namespace    open_new_tab
// @author       Covenant
// @version      1.0.8
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      file:///*
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjg2MiA0LjgyNTAxTDIuMjc0NDggMjIuNUMyLjA1NjE5IDIyLjg3OCAxLjk0MDY5IDIzLjMwNjYgMS45Mzk0NiAyMy43NDMyQzEuOTM4MjQgMjQuMTc5NyAyLjA1MTM0IDI0LjYwODkgMi4yNjc1MSAyNC45ODgyQzIuNDgzNjggMjUuMzY3NCAyLjc5NTM4IDI1LjY4MzQgMy4xNzE2MSAyNS45MDQ4QzMuNTQ3ODQgMjYuMTI2MiAzLjk3NTQ4IDI2LjI0NTIgNC40MTE5OCAyNi4yNUgyNS41ODdDMjYuMDIzNSAyNi4yNDUyIDI2LjQ1MTEgMjYuMTI2MiAyNi44MjczIDI1LjkwNDhDMjcuMjAzNiAyNS42ODM0IDI3LjUxNTMgMjUuMzY3NCAyNy43MzE0IDI0Ljk4ODJDMjcuOTQ3NiAyNC42MDg5IDI4LjA2MDcgMjQuMTc5NyAyOC4wNTk1IDIzLjc0MzJDMjguMDU4MyAyMy4zMDY2IDI3Ljk0MjggMjIuODc4IDI3LjcyNDUgMjIuNUwxNy4xMzcgNC44MjUwMUMxNi45MTQxIDQuNDU3NjQgMTYuNjAwNCA0LjE1MzkxIDE2LjIyNiAzLjk0MzEyQzE1Ljg1MTYgMy43MzIzMiAxNS40MjkxIDMuNjIxNTggMTQuOTk5NSAzLjYyMTU4QzE0LjU2OTggMy42MjE1OCAxNC4xNDc0IDMuNzMyMzIgMTMuNzczIDMuOTQzMTJDMTMuMzk4NiA0LjE1MzkxIDEzLjA4NDggNC40NTc2NCAxMi44NjIgNC44MjUwMVY0LjgyNTAxWiIgc3Ryb2tlPSIjRTAzMjMyIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNSAxMS4yNVYxNi4yNSIgc3Ryb2tlPSIjRTAzMjMyIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNSAyMS4yNUgxNS4wMTI1IiBzdHJva2U9IiNFMDMyMzIiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460439/all%20site%20open%20new%20tab%20demo%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/460439/all%20site%20open%20new%20tab%20demo%F0%9F%94%A7.meta.js
// ==/UserScript==
var is_open_new_tab=GM_getValue('is_open_new_tab',true);
const css__mono_lite="font-family: ui-monospace,'Menlo','Cascadia Mono','Noto Sans Mono CJK JP','FreeMono','Consolas','Liberation Mono','Hiragino Kaku Gothic ProN','Yu Gothic',monospace;font-weight: 100;";
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(node==undefined){node=document.body;}
    if(is_appendChild){node.appendChild(element);}
    else{
        if(refNode==undefined){node.insertBefore(element,node.firstChild);}else{node.insertBefore(element,refNode);}
    }return element;
}
function create_node_text(tagname,innerText,class_name,is_appendChild,node,refNode){
    let element=create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("%cbreak",css__mono_lite);
function main_01(){
    let str_url=document.location.host+document.location.pathname+document.location.search+document.location.hash;
    let ary_url=document.querySelectorAll('a');
    for(let n = 0; n < ary_url.length; n++){
        if(ary_url[n].href.search(new RegExp("javascript:", "i"))==-1){//not javascript
            let href=ary_url[n].getAttribute('href');
            if(href!=null&&href.search("#")!=0){//not #javascript
                ary_url[n].target="_blank";
            }
        }
    }
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    GM_registerMenuCommand("open_new_tab"+(is_open_new_tab?"✔️":"❌"), () => {
        is_open_new_tab=!is_open_new_tab;
        GM_setValue('is_open_new_tab', is_open_new_tab);
    });
    if(document.body==null)return;
    if(is_open_new_tab){
        main_01();
        let timeoutID = window.setInterval(( () => main_01() ), 5000);
        if(url[0].host.search(new RegExp("www.youtube.com", "i"))==0){
            let btn_ytb_scroll_down=create_btn("⇩",["btn_ytb_fixed_std","btn_ytb_fixed_scroll_down"]);
            btn_ytb_scroll_down.addEventListener("click",function(event){
                window.scrollTo(0,window.scrollY+window.innerHeight);//questions/55400703
            });
            let style_user_css=create_style("","gm_user_css_open_new_tab",["user_gm_css","css_open_new_tab"]);
            style_user_css.textContent=`.btn_ytb_fixed_std{position:fixed;z-index: 65535;}
.btn_ytb_fixed_scroll_down{bottom: 98px;right: 32px;font-size: 4rem;max-height: 4.5rem;}
button{font-family: ui-monospace,'Menlo','Noto Sans Mono CJK JP','Droid Sans Mono','Consolas','Liberation Mono',monospace;}`
        }
    }
})();