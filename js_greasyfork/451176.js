// ==UserScript==
// @name         寶拉文警告
// @description  我不想再看到寶拉文了
// @namespace    baola
// @author       Covenant
// @version      1.0.9
// @license      MIT
// @homepage
// @match        https://forum.gamer.com.tw/B.php?*
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEACACoCAAAJgAAABAQAAABAAgAaAUAAM4IAAAoAAAAIAAAAEAAAAABAAgAAAAAAIAEAAAAAAAAAAAAAAABAAAAAAAA////APb29gDw8PAA4+PjAN3d3ADMzMwAxsbGALu7uwCysrIAqqqqAKOjowCZmZkAiIiIAHh4dgBvb28AZmZmAFhYWABSUlEASkpKAEFBQQAzMzMAJycoAAUFBQAAAAAAAgH+AFpNLABwaT8AkIAtAK6aLwCzokkAoJZjAMGzZQDPxpYA49y3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcMDBMMBxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIERAIFxcXBBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBERFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQDxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXEBIIFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBASFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcIEBAXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFwgQEAkXFxcXFxcXFxcEFxcXFxcXFxcXFxcXFxcXFxcXFxAQDBcXFxcXFxcXFwwXFxcXFxcXFxcXFxcXFxcXFxcXCA4QCBcXFxcXFwkOFxcXFxcXFxcXFxcXFxcXFxcXFxcXCA8SEAwXFwwODBcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXCBISEw4MDwgXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFw4QFxcXFxcXFxcXFxcXChEREQoXFxcJCQ4OEhIRERMXFw4QEQkXFxcXFxcXFxcXFxcKEREREREREwkXCQkJERAQCgoREBcXFxcXFxcXFxcXFxcXChcKFwoXFxcXFxcJChERERERDBcMCRcMEhcXFxcXFxcXFxcXFxcXFxcRFxcXCQoRERERDBMSEhEcFxcXFxcXFxcXFxcXFxcXFwoRCRcXAwoREREREBocFxcXFxcXFxcXFxcXCRECFxcXChMTEREREBERHBERCRcXFxcXFxcXFxcXFxcXChEJCQkREREREREREREcAgsPCRIXFxcXFxcXFxcXFxcXChERERERERERERERExwXFwwSCRIXFxcXFxcXFxcXFxcNERERERERERERERERHBcKEgoSFxcXFxcXFxcXFxcXChEREREREREREREREREUERcXFxcXFxcXFxcXFxcXCg0NERERERERERERERERDQ0cCBIXFxcXFxcXFwoKDRERERERERERERERERENDQ0cHBwdIRcXFwoTEhEQERESEhINDQ0NDQ0NDQ0NDQ0cHBwdFxcXFxcXFxcXFxcXFxchHBwcHBweHh4eHBwcHBwhFxcXFxcXFxcXFxcXFxchHBwcHBwcHBwcHBwcHCEXFxcXFxcXFxcXFx8fHhwcHBwcHBwcHBweHyEhFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf////////wf///w7///4////8f////H////j////4////+P////h/3//8f9///D8///4Mf///AP///8//BwBh/+AIAf/6vwCT//3AA//8YA//HAAf/4AAB//AAMP/wACH/4AAf/4AAB/gAAAcAAAA//wAA//wAB/8AAH///////ygAAAAQAAAAIAAAAAEACAAAAAAAQAEAAAAAAAAAAAAAAAEAAAAAAAD///8A////APDw8ADj4+MA3d3cAMzMzADGxsYAu7u7ALKysgCqqqoAo6OjAJmZmQCIiIgAeHh2AG9vbwBmZmYAWFhYAFJSUQBKSkoAQUFBADMzMwAnJygABQUFAAAAAAACAf4AWk0sAHBpPwCQgC0ArpovALOiSQCglmMAwbNlAM/GlgDj3LcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxcXFxcXFxcGDAgIFxcXFxcXFxcXFxcEERcXFwgXFxcXFxcXFxcEEAUXFxcXFxcXFxcXFxcXCBAXFxcXFxcXFxcXFxcXFwgQFxcXFxcGFxcXFxcXFxcEEAwXFxcMFxcXFxcXFxcXFwgSDA8OBBcXFwwXFxcXFxcXCBAPFxcXBhcXCgwLDA0NDQoIEQ8IBQ0XFxcGFwkXFw0PDxEREwwXFxcXFxcXFwwKFw8RHBEJFxcXFxcXDAkXDxEREREXEgcSFxcXFxcMEREREREPFwgSFwYODRERERERDxwcHBwPFxcXFyEfHxwcHBwcICEXFxcXIRwcHBwcHCAhFxcXFxcXF/8P///+d////H////z////8+////Hf///4H//9/Hf//gAH//9YD///8g///8gj///gJ//8AA///wA///wB///8=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451176/%E5%AF%B6%E6%8B%89%E6%96%87%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/451176/%E5%AF%B6%E6%8B%89%E6%96%87%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
var style_user_css=create_style(".gensh_t{opacity: 0.66;}","gm_user_css_c_post_title_alert",["user_gm_css","css_c_post_title_alert"]);
style_user_css.textContent+=`
.gensh_t::before{content: "🎰💸🐴⚰️🍚🥢";}\n.gensh_t::after{content: "🤛🚚";}
td>a.gensh_t.gensh_t,p.gensh_t.gensh_t{text-decoration-line: underline overline;text-underline-offset: 3px;text-decoration-skip-ink: all;}
.gensh_t.fishing::before{content: "🎣🎰💸🐴⚰️🍚🥢";}
.box_shadow_006AA6{box-shadow: #006AA6 0rem 0rem 3rem,#006AA6 0rem 0rem 3rem;}
`;
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
//console.log("break");
(function() {
    'use strict';
    let list=document.querySelectorAll('tr.b-list__row>td>a.b-list__main__title,p.b-list__main__title');
    for(let i=0; i<list.length; i++){
        if(list[i].innerText.search("【寶拉】")!=-1){
            list[i].style.setProperty("text-decoration", "line-through");
        }
        if(list[i].innerText.search("原神")!=-1){
            list[i].classList.add("gensh_t");
            if(list[i].innerText.search("問題")!=-1||list[i].innerText.search("？")!=-1||list[i].innerText.search(/\?/)!=-1||list[i].innerText.search("嗎")!=-1)list[i].classList.add("fishing");
            //list[i].style.fontWeight='900';
            //list[i].style.textDecorationColor='blue';
        }
    }
    let title=document.querySelectorAll('div>h1.c-post__header__title,h1.title');
    for(let i=0; i<title.length; i++){
        if(title[i].innerText.search("【寶拉】")!=-1){
            title[i].style.setProperty("text-decoration", "line-through");
            //title[0].style.getPropertyValue("text-decoration")
        }
        if(title[i].innerText.search("原神")!=-1){
            title[i].classList.add("gensh_t");
            if(title[i].innerText.search("問題")!=-1||title[i].innerText.search("？")!=-1||title[i].innerText.search(/\?/)!=-1||title[i].innerText.search("嗎")!=-1)title[i].classList.add("fishing");
        }
    }
    let div_c_article__content=document.querySelectorAll('div.c-article__content');
    div_c_article__content.forEach((fe_c_article__content,i) =>{
        if(i>0)return;//只檢測1樓
        let div_p=fe_c_article__content.querySelectorAll('div');
        div_p.forEach((fe_p,j) =>{
            if(fe_p.innerText.search(/dcard/i)!=-1){
                fe_p.classList.add("box_shadow_006AA6");
            }
        });
    });
})();