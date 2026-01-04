// ==UserScript==
// @name         display all anime image banner
// @description  load all image banner
// @namespace    gamer_ad_img
// @author       Covenant
// @version      1.0.3
// @license      MIT
// @homepage
// @match        https://www.gamer.com.tw/index_legacy.php
// @match        https://www.gamer.com.tw/index_legacy.php?ad=N
// @match        https://gamer.com.tw
// @match        https://web.archive.org/web/*/*www.gamer.com.tw
// @match        https://web.archive.org/web/*/*www.gamer.com.tw/
// @match        https://web.archive.org/web/*/*www.gamer.com.tw/index2.php
// @match        https://web.archive.org/web/*/*www.gamer.com.tw/index2.php?ad=N
// @match        https://web.archive.org/web/*/*www.gamer.com.tw/index_legacy.php
// @match        https://web.archive.org/web/*/https://gamer.com.tw
// @match        https://web.archive.org/web/*/https://gamer.com.tw/
// @match        https://web.archive.org/web/*/https://gamer.com.tw/index_legacy.php
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/477941/display%20all%20anime%20image%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/477941/display%20all%20anime%20image%20banner.meta.js
// ==/UserScript==
function create_div(class_name,is_appendChild,node,refNode){
    let div=create_node("div",class_name,is_appendChild,node,refNode);
    div.style.backgroundSize='contain';
    div.style.backgroundRepeat='no-repeat';
    div.lang='ja';
    return div;
}
function create_img(url,title,class_name,is_appendChild,node,refNode){
    let img=create_node("img",class_name,is_appendChild,node,refNode);
    img.src=url;
    img.title=title;
    img.alt=title;
    img.style.setProperty('max-width',"128px");
    img.style.setProperty('max-height',"256px");
    return img;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
function create_node_text(tagname,innerText,class_name,is_appendChild,node,refNode){
    let element = create_node(tagname,class_name,is_appendChild,node,refNode);
    element.innerText=innerText;
    element.lang='ja';
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
//console.log("break");
(function(){
    'use strict';
    let url=fn_url(document.location);
    if(url[0].host.search(new RegExp("web.archive.org", "i"))==0){
        if(url[0].pathname.search(/\/web\/\d+\*\//i)==0){
            console.log("return Calendar");
            return;
        }
    }
    let div_flyRightBox=document.querySelectorAll('div#flyRightBox');
    if(div_flyRightBox.length==1){
        div_flyRightBox=div_flyRightBox.length==1?div_flyRightBox[0]:div_flyRightBox;
        let div_BA_main=document.querySelectorAll('div.BA-main')[0];
        let fake_div=create_div(["BA-right","mono"],true,div_BA_main);
        fake_div.style.setProperty('height',div_flyRightBox.clientHeight*1.2+"px");
        let div_BA_right=create_div(["BA-right","mono"],true,div_BA_main);
        let output=create_div(["BA-rbox1","bh-card","mono"],true,div_BA_right);
        create_node_text("h1","\uF1D1動漫image\uF1D0",["BA-ltitle","mono"],true,output);//FontAwesome
        let ary_script=div_flyRightBox.querySelectorAll('script');//image url array
        let str_script_code=ary_script[0].textContent;
        let ary_str=str_script_code.split("src=\\\"");
        for(let i = 0; i < ary_str.length; i++){
            if(ary_str[i].search(new RegExp("https:", "i"))==0){
                let indexof=ary_str[i].indexOf("\\\">");
                let url_img=ary_str[i].slice(0,indexof).replaceAll("\\\\/","/");
                url_img=url_img.replaceAll("\\/","/");//巴哈js裡字串格式不知道哪一天出現更改，導致讀取到的圖片網址出現\/，雖然詭異的一樣可以顯示圖片，但會影響複製圖片網址，新分頁看圖網址出現//S//2KU//
                create_img(url_img,"",[],true,output);
            }else{continue;}
        }
    }
})();