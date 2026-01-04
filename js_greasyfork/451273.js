// ==UserScript==
// @name         巴哈姆特 - 隱藏首頁的手游和網游新聞demo
// @description  RT
// @namespace    main_page_OL
// @author       Covenant
// @version      1.0.6
// @license      MIT
// @homepage
// @match        https://www.gamer.com.tw/
// @match        https://www.gamer.com.tw/index2.php*
// @match        https://gnn.gamer.com.tw/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451273/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E9%9A%B1%E8%97%8F%E9%A6%96%E9%A0%81%E7%9A%84%E6%89%8B%E6%B8%B8%E5%92%8C%E7%B6%B2%E6%B8%B8%E6%96%B0%E8%81%9Edemo.user.js
// @updateURL https://update.greasyfork.org/scripts/451273/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E9%9A%B1%E8%97%8F%E9%A6%96%E9%A0%81%E7%9A%84%E6%89%8B%E6%B8%B8%E5%92%8C%E7%B6%B2%E6%B8%B8%E6%96%B0%E8%81%9Edemo.meta.js
// ==/UserScript==
var baha_gm_show=GM_getValue('baha_gm_show', false);
const ary_keyword_casino=["網易","原神","崩壞3rd","崩壞 3rd","崩壞學園","星穹鐵道","絕區零","幻塔","MMO","手機遊戲","線上遊戲"];
function create_style(textContent,id,class_name){
    let style=document.createElement("style");
    style.type='text/css';
    style.id=id;
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){style.classList.add(class_name[i]);}
    }
    else if(typeof class_name==='string'){style.classList.add(class_name);}
    style.textContent=textContent;
    document.body.appendChild(style);
    return style;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }
    else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("break");
function main_01() {
    let card_headnews=document.querySelectorAll('a.bh-card');
    for(let i = 0; i < card_headnews.length; i++){//走訪每個新聞
        let label=card_headnews[i].querySelectorAll('div.label-type')[0].innerText;
        if(label.search("手機")!=-1||label.search(/olg/i)!=-1){
            if(baha_gm_show){
                card_headnews[i].querySelectorAll('div.gnn-text')[0].style.setProperty("text-decoration", "line-through");
                card_headnews[i].querySelectorAll('div.label-type')[0].style.setProperty("text-decoration", "line-through");
                card_headnews[i].querySelectorAll('div>img')[0].setAttribute('style', 'filter: grayscale(100%)!important;');
            }
            else{card_headnews[i].remove();}
        }
        else if(label.search("多平台")!=-1||label.search("PC")!=-1){
            let title=card_headnews[i].querySelectorAll('div.gnn-text')[0].innerText;
            for(let j = 0; j < ary_keyword_casino.length; j++){
                if(title.search("路由器")!=-1)break;
                if(title.search(new RegExp(ary_keyword_casino[j]))!=-1){
                    if(baha_gm_show){
                        card_headnews[i].querySelectorAll('div.gnn-text')[0].style.setProperty("text-decoration", "line-through");
                        card_headnews[i].querySelectorAll('div.label-type')[0].style.setProperty("text-decoration", "line-through");
                        card_headnews[i].querySelectorAll('div.label-type')[0].style.textDecorationStyle="double";
                        card_headnews[i].querySelectorAll('div>img')[0].setAttribute('style', 'filter: grayscale(100%)!important;');
                    }
                    else{card_headnews[i].remove();}
                    break;
                }
            }
        }
    }

}
(function() {
    'use strict';
    GM_registerMenuCommand("用文字刪除線標記手遊網遊"+(baha_gm_show?"✔️":"❌"), () => {
        GM_setValue('baha_gm_show',!baha_gm_show);
        location.reload();
    });
    let url=fn_url(document.location);
    if(url[0].host=="www.gamer.com.tw"&&(url[0].pathname=="/"||url[0].pathname=="/index2.php")){
        let timeoutID = window.setInterval(( () => main_01() ), 100);//模擬sleep+while用的
    }
    let platform_tag=document.querySelectorAll('ul.platform-tag>li');
    for(let i = 0; i < platform_tag.length; i++){//gnn detail
        if(platform_tag[i].classList.contains('platform-olg')||/*platform_tag[i].classList.contains('platform-ios')||*/platform_tag[i].classList.contains('platform-android')||platform_tag[i].classList.contains('platform-web')){
            document.querySelectorAll('h1')[0].style.setProperty("text-decoration", "line-through");
            break;
        }
    }
    if(url[0].host=="gnn.gamer.com.tw"&&url[0].pathname!="/detail.php"){//gnn列表
        let GN_lbox2B=document.querySelectorAll('div.GN-lbox2B');
        for(let i = 0; i < GN_lbox2B.length; i++){
            let tag_list=GN_lbox2B[i].querySelectorAll('div.platform-tag_list')[0];
            let h1_a=GN_lbox2B[i].querySelectorAll('h1>a')[0];
            if(tag_list.classList.contains('platform-olg')||tag_list.classList.contains('platform-mobile')||tag_list.classList.contains('platform-web')||tag_list.classList.contains('platform-android')/*||tag_list.classList.contains('platform-ios')*/){
                if(baha_gm_show){
                    h1_a.style.setProperty("text-decoration", "line-through");
                    GN_lbox2B[i].querySelectorAll('img')[0].setAttribute('style', 'filter: grayscale(100%)!important;');
                    GN_lbox2B[i].querySelectorAll('p')[0].style.textDecorationLine="line-through";
                    GN_lbox2B[i].querySelectorAll('p')[0].style.textDecorationThickness="0.25rem";
                    GN_lbox2B[i].querySelectorAll('p')[0].style.fontStretch="50%";
                }
                else{GN_lbox2B[i].remove();}
            }
            else if(tag_list.classList.contains('platform-cross')||tag_list.classList.contains('platform-pc')){
                for(let j = 0; j < ary_keyword_casino.length; j++){
                    if(GN_lbox2B[i].innerText.search("路由器")!=-1)break;
                    if(GN_lbox2B[i].innerText.search(new RegExp(ary_keyword_casino[j]))!=-1){
                        if(baha_gm_show){
                            h1_a.style.setProperty("text-decoration", "line-through");
                            h1_a.style.textDecorationStyle="double";
                            GN_lbox2B[i].querySelectorAll('img')[0].setAttribute('style', 'filter: grayscale(100%)!important;');
                            GN_lbox2B[i].querySelectorAll('p')[0].style.textDecorationLine="line-through";
                            GN_lbox2B[i].querySelectorAll('p')[0].style.textDecorationThickness="0.25rem";
                            GN_lbox2B[i].querySelectorAll('p')[0].style.fontStretch="50%";
                        }
                        else{GN_lbox2B[i].remove();}
                    }
                }
            }
        }
    }
})();