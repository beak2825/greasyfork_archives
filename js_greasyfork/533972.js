// ==UserScript==
// @name         copy all img link from catbox
// @description  copy all image link
// @namespace    nekohako_img
// @author       Covenant
// @version      0.9
// @license      MIT
// @homepage
// @match        https://catbox.moe
// @match        https://catbox.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catbox.moe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533972/copy%20all%20img%20link%20from%20catbox.user.js
// @updateURL https://update.greasyfork.org/scripts/533972/copy%20all%20img%20link%20from%20catbox.meta.js
// ==/UserScript==
function main_01(str_format){
    let a_link_list=document.querySelectorAll('div.responseText>span');
    let str_img_links="";
    let str_img_html_code="";
    if(a_link_list.length==0){GM_setClipboard(a_link_list.length);}
    else{
        a_link_list.forEach((fe_link_list,i) =>{
            str_img_links=str_img_links+fe_link_list.textContent+"\n";
            str_img_html_code=str_img_html_code+"<img class=\"tmp\" src=\""+fe_link_list.textContent+"\"/>\n";
        });
        if(str_format=="html"){
            GM_setClipboard(str_img_html_code);
        }else{
             GM_setClipboard(str_img_links);
        }
    }
}
(function() {
    'use strict';
    GM_registerMenuCommand("copy link", () =>{
        main_01();
    });
    GM_registerMenuCommand("copy link(html format)", () =>{
        main_01("html");
    });
})();