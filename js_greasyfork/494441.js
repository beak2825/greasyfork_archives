// ==UserScript==
// @name         YT storyboard another
// @description  view YT storyboard
// @namespace    ytb_storyboard_another_demo
// @author       Covenant
// @version      0.9
// @license      MIT
// @homepage
// @match        https://www.youtube.com/watch?v=*
// @match        https://i.ytimg.com/sb/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8AEiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//////8AEiP//wAc7v8AHO7/AB3v/wAc7v8AHO7/ABzu/wAc7v8AHO7/ABzu/wAd7/8AHe//ABzu/wAc7/8AHe//EiP//xIj//8SI////////09V//+6uv////////////9PVf//z87///////+ysv//EiP//5ub////////0tH//xIj//8SI///EiP///////9PVf///////xIj////////T1X///////8SI////////5qZ////////EiP//xIj//8TI///EiP//xIj////////T1X///////8TI////////09V////////EiP///////+amf/////////////S0f//EiP//xIj//8SI////////09V////////EiL///////9PVf////////////+6uv//EiP//7q6///v8P//0tH//xIj//8SI///EyP///////8SI///EiP//xIj//8SI///EiP///////8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//////////////////xIj//8SI///EiP//xMj////////EiP//xIj//8SI///EiP//xIj//8SI///EiP//9nZ//8SI///EiP//xMj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiL//9na//////////////////////////////////////////////////////////////////////////////////////////////////+r5/b/AAAA//372P//////R5K5/wAAAP/IiWb//////26v1f8AAAD/rGZE////////////////////////////qub1/wAAAP/+/Nj/qub2/wAAAP//////AAAA//782P8TcJ3//vzY/wAAAP///////////////////////////6rm9f8AAAD//vzY/6rm9v8AAAD//////wAAAP/+/Nj/AAAA//////8AAAD///////////////////////////9ur9b/AAAA/+PFov//////R5K6/wAAAP/JiWb//////wAAAP//////AAAA////////////////////////////AAAA//+p7/8AAAD/////////////////////////////////////////////////////////////////bq7V/wxKf///////rGZE/+PFov//////////////////////////////////////////////////////gAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_listValues
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494441/YT%20storyboard%20another.user.js
// @updateURL https://update.greasyfork.org/scripts/494441/YT%20storyboard%20another.meta.js
// ==/UserScript==
const str_font_console_monoserif="'Cutive Mono','FreeMono','Courier New','Liberation Mono',";
const str_font_console_emoji="'Twemoji Mozilla','Apple Color Emoji','Noto Color Emoji','Segoe UI Emoji',";
const str_font_console_sans_ja="'IBM Plex Sans JP','Hiragino Kaku Gothic ProN',ui-monospace,'Noto Sans CJK JP','Meiryo','Yu Gothic','IBM Plex Sans TC','Microsoft JhengHei',";
const css__monoserif="font-family: "+str_font_console_monoserif+str_font_console_emoji+str_font_console_sans_ja+"sans-serif;font-weight: 100;";
const css_font_size_14px="font-size: 14px;",css_font_size_20px="font-size: 20px;";
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
//console.log("%cbreak",css__mono_std);
(function() {
    'use strict';
    let url_local=fn_url(document.location);
    //let search_v_sqp_sigh=GM_getValue('search_'+url[0].search,[]);
    let ary_pathname=url_local[0].pathname.split("/");
    if(url_local[0].pathname.search(new RegExp("/watch", "i"))!=-1){
        let script_ytb=document.querySelectorAll('body>script');
        script_ytb.forEach((script_fe_ytb,i) =>{
            if(script_fe_ytb.innerText.search(new RegExp("\"storyboards\"", "i"))==-1)return;
            let ary_str=script_fe_ytb.innerText.split("https://i.ytimg.com/sb/");
            let str_storyboard3_L="https://i.ytimg.com/sb/"+ary_str[1].split("\"")[0];
            console.log("%c"+str_storyboard3_L,css__monoserif+css_font_size_20px);
            let ary_storyboard3_L=str_storyboard3_L.split("|");
            let ary_sigh_L3=ary_storyboard3_L[ary_storyboard3_L.length-1].split("#");
            let str_search_sigh_value=ary_sigh_L3[ary_sigh_L3.indexOf("M$M")+1];
            let str_M0=ary_storyboard3_L[0]+"&sigh="+str_search_sigh_value;
            GM_registerMenuCommand("storyboard3_L3/M0.jpg", ()=>{
                GM_openInTab(str_M0.replaceAll("rs$A","rs%24A").replaceAll("$L","3").replaceAll("$N","M0"));
            });
            let url_M0=fn_url(str_M0.replaceAll("rs$A","rs%24A").replaceAll("$L","3").replaceAll("$N","M0"));
            GM_setValue('search_'+url_local[1].get('v'),[url_local[1].get('v'),url_M0[1].get('sqp'),str_search_sigh_value.replaceAll("rs$A","rs%24A")]);
            console.log("%c"+GM_getValue('search_'+url_local[1].get('v')),css__monoserif+css_font_size_20px);
        });
    }else if(url_local[0].pathname.search(new RegExp("/sb/", "i"))==0){
        let ary_img_pathname=url_local[0].pathname.split("/");
        let str_search_v=ary_img_pathname[2];
        let ary_M0_data=GM_getValue('search_'+str_search_v);
        let str_storyboard_idx=parseInt(ary_img_pathname.pop().replaceAll(".jpg","").replaceAll("M",""),10);
        if(str_storyboard_idx>0){
            GM_registerMenuCommand("M"+(str_storyboard_idx-1)+".jpg", ()=>{
                GM_openInTab("https://i.ytimg.com/sb/"+ary_M0_data[0]+"/storyboard3_L3/M"+(str_storyboard_idx-1)+".jpg?sqp="+ary_M0_data[1]+"&sigh="+ary_M0_data[2]);
            });
        }
        GM_registerMenuCommand("M"+(str_storyboard_idx+1)+".jpg", ()=>{
            GM_openInTab("https://i.ytimg.com/sb/"+ary_M0_data[0]+"/storyboard3_L3/M"+(str_storyboard_idx+1)+".jpg?sqp="+ary_M0_data[1]+"&sigh="+ary_M0_data[2]);
        });
        GM_registerMenuCommand(str_search_v, ()=>{
            GM_openInTab("https://youtu.be/"+str_search_v);
        });
        console.log("%c"+GM_listValues(),css__monoserif+css_font_size_14px);
    }
})();