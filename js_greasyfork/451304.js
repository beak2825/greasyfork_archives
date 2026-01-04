// ==UserScript==
// @name         巴哈姆特 - 在回覆區底下放置常用的回文圖片demo
// @description  RT
// @namespace    local_album_baha
// @author       Covenant
// @version      1.0.9
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/*
// @match        https://haha.gamer.com.tw/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451304/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%9C%A8%E5%9B%9E%E8%A6%86%E5%8D%80%E5%BA%95%E4%B8%8B%E6%94%BE%E7%BD%AE%E5%B8%B8%E7%94%A8%E7%9A%84%E5%9B%9E%E6%96%87%E5%9C%96%E7%89%87demo.user.js
// @updateURL https://update.greasyfork.org/scripts/451304/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%9C%A8%E5%9B%9E%E8%A6%86%E5%8D%80%E5%BA%95%E4%B8%8B%E6%94%BE%E7%BD%AE%E5%B8%B8%E7%94%A8%E7%9A%84%E5%9B%9E%E6%96%87%E5%9C%96%E7%89%87demo.meta.js
// ==/UserScript==
var ary_str=['星爆氣流斬',
             '來試試？',
             ''];
var ary_img=[['','gura'],
             ['','mikeneko'],
             ];
var ary_sticker=[[25,12,"小苗"],
                 [261,16,"iACG 遊戲社 - 金髮莉莉"],
                 [276,8,"iACG 遊戲社 - 金髮莉莉 第二彈"],
                 [555,16,"《胡桃日記》就要瀨在你身邊！"],
                 [323,8,"公主連結 無字"],
                 [324,8,"公主連結 有字"]];
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_panel="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','DroidSans_Mono','Courier New','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','color_emoji','emoji_back',monospace;";
const font_family_default="font-family: 'Noto Sans','Segoe UI','Roboto_Regular','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','Noto Sans Symbols','Noto Sans Symbols2','symbol_emoji','emoji_back',sans-serif;";
var style_user_css=create_style(".user_a{"+font_family_panel+"font-weight: 100;}\n","gm_user_css_local_album_baha",["user_gm_css","css_local_album_baha"]);
style_user_css.textContent+=`div.ary_str,div.ary_img,.ary_sticker{`+font_family_default+`font-weight: 100;text-align: left;font-size: 1rem;line-height: 1.2rem;padding-inline-start: 20px;padding-inline-end: 20px;padding-block-end: 5px;}
img.user_album{max-width:64px;}\nimg.user_thumbnail{max-width:32px;}\nimg.user_sticker{max-width:90px;}
.option{position:relative;}\n`;
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_a(innerText,url,class_name,is_appendChild,node,refNode){
    let anchor=create_node_text("a",innerText,class_name,is_appendChild,node,refNode);
    anchor.href=url;
    anchor.title=innerText;
    anchor.target="_blank";
    return anchor;
}
function create_img(url,title,class_name,is_appendChild,node,refNode){
    let img=create_node("img",class_name,is_appendChild,node,refNode);
    img.src=url;
    img.title=title;
    img.alt=title;
    return img;
}
function create_img_copy(url,title,class_name,is_appendChild,node,refNode){
    let img=create_img(url,title,class_name,is_appendChild,node,refNode);
    img.addEventListener('click',() => {fn_clipboard_w(url);});
    return img;
}
function create_details(summary,class_name,is_appendChild,node,refNode){
    let details=create_node("details",class_name,is_appendChild,node,refNode);
    let node_summ=create_node_text("summary",summary,[],true,details);
    return [details,node_summ];
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    /*if(Array.isArray(tagname)){
        element=document.createElement(tagname[0]);
        element.id=tagname[1];
    }else if(typeof tagname==='string'){element=document.createElement(tagname);}//*/
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
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
async function fn_clipboard_w(str){
    try{
        await navigator.clipboard.writeText(str);
    }catch(e){alert(e.message);}
    finally{}
}
//console.log("break");
(function(){
    'use strict';
    let url=fn_url(document.location);
    if(url[0].pathname.search(new RegExp("/C.php", "i"))==0||url[0].pathname.search(new RegExp("/Co.php", "i"))==0||url[0].pathname.search(new RegExp("/post1.php", "i"))==0){
        let zone_c=document.querySelectorAll('div.c-editor__input')[0];
        let zone_post=document.querySelectorAll('div>div>div.c-post__body')[0];
        let div_output;
        if(zone_c!=undefined){
            div_output=zone_c;
        }else if(zone_post!=undefined){
            div_output=zone_post;
        }else{
            console.log("找不到回覆框，無法放置回文圖片集");
            return;
        }
        let btn_tmp=create_btn("加載圖片："+ary_img.length+"張",["user_btn_panel"],true,div_output);
        btn_tmp.addEventListener('click',() => {
            btn_tmp.remove();
            const im_sticker="https://im.bahamut.com.tw/sticker/";
            const sticker_shop_detail="https://haha.gamer.com.tw/?sticker_shop_detail=";
            //div_str
            let div_str=create_div("ary_str",true,div_output);
            if(url[0].pathname.search(new RegExp("/Co.php", "i"))==0){
                create_node_text("p","/Co.php",[],true,div_str);
            }
            //details_str
            let details_str=create_details("String",["user_details"],true,div_str);
            for(let i = 0; i < ary_str.length; i++){
                let str_tmp=create_node_text("p",ary_str[i],[],true,details_str[0]);
            }
            //div_img
            let div_img=create_div("ary_img",true,div_output);
            for(let i = 0; i < ary_img.length; i++){
                let img_tmp=create_img_copy(ary_img[i][0],ary_img[i][1],"user_album",true,div_img);
            }
            let div_sticker=create_div("ary_sticker",true,div_output);
            for(let i = 0; i < ary_sticker.length; i++){
                let details_sticker=create_details(ary_sticker[i][2],["user_details"],true,div_sticker);
                let img_thumbnail=create_img(im_sticker+ary_sticker[i][0]+"/sticker_"+ary_sticker[i][0]+".png",ary_sticker[i][2],"user_thumbnail",true,details_sticker[1]);
                for(let j = 0; j < ary_sticker[i][1]; j++){
                    let img_tmp=create_img_copy(im_sticker+ary_sticker[i][0]+"/"+((j+1)<10?"0":"")+(j+1)+".png",ary_sticker[i][2],"user_sticker",true,details_sticker[0]);
                }
                create_a("sticker_shop_detail",sticker_shop_detail+ary_sticker[i][0],"user_a",true,details_sticker[0]);
            }
        });
    }
})();