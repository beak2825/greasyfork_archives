// ==UserScript==
// @name         巴哈姆特 - 在暗黑模式擴展中移除奇怪的背景
// @description  都2023年了連切換闇黑模式都做不到全域覆蓋也是醉了
// @namespace    baha_no_img_bg
// @author       Covenant
// @version      1.0.9
// @license      MIT
// @homepage
// @match        https://*.gamer.com.tw/*
// @exclude      https://www.gamer.com.tw/
// @exclude      https://home.gamer.com.tw/homeindex.php*
// @exclude      https://home.gamer.com.tw/creation.php*
// @exclude      https://home.gamer.com.tw/creationDetail.php?sn=*
// @exclude      https://home.gamer.com.tw/creationNew1.php*
// @exclude      https://home.gamer.com.tw/creationCategory.php*
// @exclude      https://home.gamer.com.tw/folder1.php*
// @exclude      https://home.gamer.com.tw/creationNewReply.php*
// @exclude      https://home.gamer.com.tw/creationPreview.php*
// @exclude      https://home.gamer.com.tw/bookmark*.php*
// @exclude      https://home.gamer.com.tw/acgbox.php*
// @exclude      https://home.gamer.com.tw/joinGuild.php*
// @exclude      https://home.gamer.com.tw/friendMore.php*
// @exclude      https://home.gamer.com.tw/subscribe_creation.php*
// @exclude      https://home.gamer.com.tw/notifylist.php*
// @exclude      https://home.gamer.com.tw/editSignWeb.php*
// @exclude      https://home.gamer.com.tw/creationEdit1.php*
// @exclude      https://home.gamer.com.tw/setBlock1.php*
// @exclude      https://home.gamer.com.tw/truthList.php*
// @exclude      https://home.gamer.com.tw/donate_give.php*
// @exclude      https://avatar1.gamer.com.tw/photogallery.php*
// @exclude      https://home.gamer.com.tw/homeCssCustom1.php*
// @exclude      https://home.gamer.com.tw/homeWallpaperPreview.php*
// @exclude      https://home.gamer.com.tw/homeCssSampleA.php?*
// @exclude      https://home.gamer.com.tw/homeCssSampleB.php?wsn=*&from=upload
// @exclude      https://home.gamer.com.tw/profile/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458352/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%9C%A8%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E6%93%B4%E5%B1%95%E4%B8%AD%E7%A7%BB%E9%99%A4%E5%A5%87%E6%80%AA%E7%9A%84%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/458352/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%9C%A8%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E6%93%B4%E5%B1%95%E4%B8%AD%E7%A7%BB%E9%99%A4%E5%A5%87%E6%80%AA%E7%9A%84%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==
var baha_gm_use_dark=GM_getValue('baha_gm_use_dark', false);
var timeoutID;
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
var style_user_css=create_style("","gm_user_css_baha_no_img_bg",["user_gm_css","css_baha_no_img_bg"]);
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("break");
function main_01(){
    var backgroundImage=getComputedStyle(document.body).backgroundImage;
    if(backgroundImage.search("data:image/svg\\+xml;base64,PHN2Zy")==5||backgroundImage.search("html_bg.gif")!=-1){
        console.log("remove "+backgroundImage);
        document.body.style.backgroundImage='none';
        window.clearInterval(timeoutID);
    }
}
(function() {
    'use strict';
    document.body.style.backgroundImage='none';
    //
    let url=fn_url(document.location);
    //timeoutID = window.setInterval(( () => main_01()), 10);
    //window.setTimeout(( () => {window.clearInterval(timeoutID);} ), 7000);
    if(url[0].host=="home.gamer.com.tw"){
        if(url[0].pathname.search(new RegExp("/artwork.php", "i"))==0){
            GM_registerMenuCommand("在home子域名用黑暗模式(beta)"+(baha_gm_use_dark?"✔️":""), () => {
                GM_setValue('baha_gm_use_dark',!baha_gm_use_dark);
                window.location.reload();
            });
        }
        else{
            if(baha_gm_use_dark){
                style_user_css.textContent+=`
body{background-color: #000000;color: #FFFFFF;}
div#BH-menu-path{background-color: #181818;}
div#BH-menu-path li>a{color: #FFFFFF;}
div#BH-menu-path a.now{color: #117096;}
div.BH-lbox{background-color: #0F0F0F;}
div.HOME-mainbox1:nth-of-type(odd){background-color: #101010;}
div.HOME-mainbox1:nth-of-type(even){background-color: #181818;}
div.HOME-mainbox1 h1>a,div.HOME-mainbox2>a{color: #D6DAD6;}
.ST1>a{color: #117096;}
ul.BH-master_tag1>li:nth-of-type(odd){background-color: #303030;}
ul.BH-master_tag1>li:nth-of-type(even){background-color: #3F3F3F;}
ul.BH-master_tag1 a{background-color: inherit;color: #FFFFFF;}
div.BH-rbox{background-color: #181818;}
p#BH-talkmain2{background-color: #181818;}
p>span>a,p.themeboxB>a{color: #D6DAD6;}
div.frame>p{color: #000000;}
div.themebox>h1{background-color: #303030;}
div.themeboxA{background-color: #303030;border-color: #707070;}
button,input:is([type=text]),select{background-color: #303030;color: #FFFFFF;}
\n`;
            }
        }
    }
})();