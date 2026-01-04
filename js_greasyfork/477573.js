// ==UserScript==
// @name         限制圖片寬度 beta📖
// @description  我的螢幕是電腦，不是手機
// @namespace    manga_max_width
// @author       Covenant
// @version      0.9
// @license      MIT
// @homepage
// @match        *://*/*
// @icon         data:image/svg+xml,<svg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><style>.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D<%2Fstyle><g class='spinner_V8m1'><circle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'><%2Fcircle><%2Fg><%2Fsvg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/477573/%E9%99%90%E5%88%B6%E5%9C%96%E7%89%87%E5%AF%AC%E5%BA%A6%20beta%F0%9F%93%96.user.js
// @updateURL https://update.greasyfork.org/scripts/477573/%E9%99%90%E5%88%B6%E5%9C%96%E7%89%87%E5%AF%AC%E5%BA%A6%20beta%F0%9F%93%96.meta.js
// ==/UserScript==
var img_max_width=GM_getValue('max_width',"50vw");
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
var style_user_css;
if(document.body!=null){
    let element_id="max_width";
    if(document.body.id==""){document.body.id=element_id;}
    else{element_id=document.body.id;}
    style_user_css=create_style("body#"+element_id+" img{max-width: "+img_max_width+" !important;}","gm_user_css_manga_max_width",["user_gm_css","css_manga_max_width"]);
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
(function() {
    'use strict';
    GM_registerMenuCommand("50vw"+(img_max_width=="50vw"?"✔️":""), () => {
        GM_setValue('max_width',"50vw");
    });
    GM_registerMenuCommand("20vw"+(img_max_width=="20vw"?"✔️":""), () => {
        GM_setValue('max_width',"20vw");
    });
    GM_registerMenuCommand("33vw"+(img_max_width=="33vw"?"✔️":""), () => {
        GM_setValue('max_width',"33vw");
    });
    GM_registerMenuCommand("75vw"+(img_max_width=="75vw"?"✔️":""), () => {
        GM_setValue('max_width',"75vw");
    });
})();