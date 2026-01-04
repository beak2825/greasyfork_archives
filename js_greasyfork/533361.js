// ==UserScript==
// @name         copy img from repository host link
// @description  copy image link
// @namespace    github_Pic10_img
// @author       Covenant
// @version      0.9.1
// @license      MIT
// @homepage
// @match        https://github.com/*/tree/master
// @match        https://github.com/*/tree/master/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533361/copy%20img%20from%20repository%20host%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/533361/copy%20img%20from%20repository%20host%20link.meta.js
// ==/UserScript==
function main_01(){
    let url=fn_url(document.location);
    let ary_img_web_type=["png","jpg","jpeg","gif","ico","bmp","svg","webp","avif","avifs","cur"];
    let a_link_list=document.querySelectorAll('td.react-directory-row-name-cell-large-screen a.Link--primary');
    let ary_img_href=[];
    for(let i=0;i<a_link_list.length;i++){//filter link
        let ary_split=a_link_list[i].textContent.split(".");
        if(ary_split.length>1){
            if(ary_img_web_type.includes(ary_split.pop())){
                //ary_img_href.push(a_link_list[i].textContent);
                ary_img_href.push(decodeURIComponent(a_link_list[i].href.replaceAll("/blob/","/raw/")).replaceAll(" ","%20"));
            }
        }
    }
    if(ary_img_href.length>0){
        let str_img_links="";
        let str_img_html_code="";
        for(let i=0;i<ary_img_href.length;i++){
            //str_img_links=str_img_links+"https://"+url[0].host+url[0].pathname.replaceAll("/tree/","/raw/")+"/"+ary_img_href[i]+"\n";
            str_img_links=str_img_links+ary_img_href[i]+"\n";
            str_img_html_code=str_img_html_code+"<img src=\""+ary_img_href[i]+"\"/>\n";
        }
        GM_registerMenuCommand("copy link("+ary_img_href.length+" img)", () =>{
            GM_setClipboard(str_img_links);
        });
        GM_registerMenuCommand("copy link(html format)", () =>{
            GM_setClipboard(str_img_html_code);
        });
        /*GM_registerMenuCommand("copy link(BBcode format)", () =>{
        });*/
    }else{return ary_img_href.length;}
}
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
(function() {
    'use strict';
    let int_check=main_01();
    if(int_check==0){
        window.setTimeout(( () => main_01() ), 5000);
    }
})();