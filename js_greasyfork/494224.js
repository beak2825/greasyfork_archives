// ==UserScript==
// @name         YT image cover switch
// @description  view other default image cover
// @namespace    ytb_default_cover_demo
// @author       Covenant
// @version      1.0
// @license      MIT
// @homepage
// @match        https://i.ytimg.com/vi/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8AEiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//////8AEiP//wAc7v8AHO7/AB3v/wAc7v8AHO7/ABzu/wAc7v8AHO7/ABzu/wAd7/8AHe//ABzu/wAc7/8AHe//EiP//xIj//8SI////////09V//+6uv////////////9PVf//z87///////+ysv//EiP//5ub////////0tH//xIj//8SI///EiP///////9PVf///////xIj////////T1X///////8SI////////5qZ////////EiP//xIj//8TI///EiP//xIj////////T1X///////8TI////////09V////////EiP///////+amf/////////////S0f//EiP//xIj//8SI////////09V////////EiL///////9PVf////////////+6uv//EiP//7q6///v8P//0tH//xIj//8SI///EyP///////8SI///EiP//xIj//8SI///EiP///////8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//////////////////xIj//8SI///EiP//xMj////////EiP//xIj//8SI///EiP//xIj//8SI///EiP//9nZ//8SI///EiP//xMj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiL//9na//////////////////////////////////////////////////////////////////////////////////////////////////+r5/b/AAAA//372P//////R5K5/wAAAP/IiWb//////26v1f8AAAD/rGZE////////////////////////////qub1/wAAAP/+/Nj/qub2/wAAAP//////AAAA//782P8TcJ3//vzY/wAAAP///////////////////////////6rm9f8AAAD//vzY/6rm9v8AAAD//////wAAAP/+/Nj/AAAA//////8AAAD///////////////////////////9ur9b/AAAA/+PFov//////R5K6/wAAAP/JiWb//////wAAAP//////AAAA////////////////////////////AAAA//+p7/8AAAD/////////////////////////////////////////////////////////////////bq7V/wxKf///////rGZE/+PFov//////////////////////////////////////////////////////gAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @connect
// @run-at       document-head
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494224/YT%20image%20cover%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/494224/YT%20image%20cover%20switch.meta.js
// ==/UserScript==
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    return [obj_url,params];
}
//console.log("%cbreak",css__mono_std);
(function() {
    'use strict';
    let url=fn_url(document.location);
    if(url[0].pathname.search(new RegExp("/vi/", "i"))!=0)return;
    /*if(url[0].pathname.search(new RegExp("default.jpg", "i"))!=-1){
        for(let i=1;i<4;i++){
            GM_registerMenuCommand(i+".jpg", ()=>{
                GM_openInTab(document.location.protocol+"//"+document.location.host+document.location.pathname.replaceAll("default.jpg",i+".jpg")+document.location.search);
            });
        }
    }else*/{
        let ary_pathname=url[0].pathname.split("/");
        let ary_img_name=["default.jpg","1.jpg","2.jpg","3.jpg"];
        let str_ytimg="";
        for(let i=0;i<ary_img_name.length;i++){
            if(ary_pathname[ary_img_name.length-1].search(new RegExp(ary_img_name[i],"i"))!=-1){
                str_ytimg=ary_pathname[ary_img_name.length-1].replaceAll(ary_img_name[i],"");
                ary_pathname=ary_pathname.filter((value)=>value!=str_ytimg+ary_img_name[i]);//5767325
                ary_img_name=ary_img_name.filter((value)=>value!=ary_img_name[i]);
                break;
            }
        }
        let str_url=document.location.protocol+"//"+document.location.host+ary_pathname.join("/")+document.location.search;
        for(let i=0;i<ary_img_name.length;i++){
            GM_registerMenuCommand(ary_img_name[i], ()=>{
                GM_openInTab(str_url+"/"+str_ytimg+ary_img_name[i]);
            });
        }
        GM_registerMenuCommand(ary_pathname[2], ()=>{
            GM_openInTab("https://youtu.be/"+ary_pathname[2]);
        });
    }
})();