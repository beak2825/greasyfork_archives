// ==UserScript==
// @name         YT Forced Videos from the same channel demo
// @description  a private tool
// @namespace    ytb_yoshika_forever_demo
// @author       Covenant
// @version      1.0.0.1
// @license      MIT
// @homepage
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/channel/*/videos*
// @match        https://www.youtube.com/channel/*/streams*
// @match        https://www.youtube.com/c/*/videos*
// @match        https://www.youtube.com/c/*/streams*
// @match        https://www.youtube.com/@*/videos*
// @match        https://www.youtube.com/@*/streams*
// @match        https://www.youtube.com/user/*/videos*
// @match        https://www.youtube.com/user/*/streams*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8AEiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//////8AEiP//wAc7v8AHO7/AB3v/wAc7v8AHO7/ABzu/wAc7v8AHO7/ABzu/wAd7/8AHe//ABzu/wAc7/8AHe//EiP//xIj//8SI////////09V//+6uv////////////9PVf//z87///////+ysv//EiP//5ub////////0tH//xIj//8SI///EiP///////9PVf///////xIj////////T1X///////8SI////////5qZ////////EiP//xIj//8TI///EiP//xIj////////T1X///////8TI////////09V////////EiP///////+amf/////////////S0f//EiP//xIj//8SI////////09V////////EiL///////9PVf////////////+6uv//EiP//7q6///v8P//0tH//xIj//8SI///EyP///////8SI///EiP//xIj//8SI///EiP///////8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//////////////////xIj//8SI///EiP//xMj////////EiP//xIj//8SI///EiP//xIj//8SI///EiP//9nZ//8SI///EiP//xMj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiL//9na//////////////////////////////////////////////////////////////////////////////////////////////////+r5/b/AAAA//372P//////R5K5/wAAAP/IiWb//////26v1f8AAAD/rGZE////////////////////////////qub1/wAAAP/+/Nj/qub2/wAAAP//////AAAA//782P8TcJ3//vzY/wAAAP///////////////////////////6rm9f8AAAD//vzY/6rm9v8AAAD//////wAAAP/+/Nj/AAAA//////8AAAD///////////////////////////9ur9b/AAAA/+PFov//////R5K6/wAAAP/JiWb//////wAAAP//////AAAA////////////////////////////AAAA//+p7/8AAAD/////////////////////////////////////////////////////////////////bq7V/wxKf///////rGZE/+PFov//////////////////////////////////////////////////////gAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/468609/YT%20Forced%20Videos%20from%20the%20same%20channel%20demo.user.js
// @updateURL https://update.greasyfork.org/scripts/468609/YT%20Forced%20Videos%20from%20the%20same%20channel%20demo.meta.js
// ==/UserScript==
var is_enable=GM_getValue('is_enable',false);
var obj_ytb_channel=GM_getValue('obj_ytb_channel',"");
var is_fallback=GM_getValue('is_fallback',false);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_panel="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','DroidSans_Mono','Courier New','symbol_emoji','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif;";
const font_family_default="font-family: 'Noto Sans','Segoe UI','Roboto_2','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');
@font-face{font-family: 'symbol_emoji';src: local('Segoe UI Symbol');}\n@font-face{font-family: 'old_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono');}
@font-face{font-family: 'Roboto_2';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}\n@font-face{font-family: 'Dancing_Script';src: local('DancingScript');}\n`;
var style_font_face=create_style(font_face_default,"gm_font_face_ytb_yoshika_forever_demo",["user_gm_font_face","css_ytb_yoshika_forever_demo"]);
var style_user_css=create_style(".user_btn_panel_1_5rem{"+font_family_panel+"}\n","gm_user_css_ytb_yoshika_forever_demo",["user_gm_css","css_ytb_yoshika_forever_demo"]);
style_user_css.textContent+=`
.user_btn_panel_1_5rem{font-weight: 100;color: #FFFFFF;background: #303030;border-color: #707070;border-width: 0.15rem;border-radius: 4px;border-style: outset;}
.user_btn_panel_1_5rem{min-height: 1em;line-height: 1.5em;padding: 0.1rem 0.5rem;margin-top: 1px;margin-bottom: 1px;}
.user_btn_panel_1_5rem{padding-left: 5px;padding-right: 5px;margin-right: 2px;margin-left: 3px;}
.user_btn_panel_1_5rem{font-size: 1.5rem;}
.user_btn_panel_1_5rem{min-width: 7em;}
.user_btn_panel_1_5rem:active{border-style: inset;}\n`;
function create_btn(innerText,class_name,is_appendChild,node,refNode){
    let btn=create_node_text("button",innerText,class_name,is_appendChild,node,refNode);
    return btn;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
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
function main_01(){
    let url=fn_url(document.location);
    let div_inner_header_container_buttons=document.querySelectorAll('#inner-header-container>div#buttons')[0];
    let btn_channel=create_btn("this channel"+(obj_ytb_channel==url[0].href?"✔️":""),["user_btn_panel_1_5rem"],false,div_inner_header_container_buttons,div_inner_header_container_buttons.firstChild);
    btn_channel.addEventListener('click',() => {
        GM_setValue('obj_ytb_channel',url[0].href);
    });
    console.log("main_01");
    if(is_fallback){
        GM_setValue('is_fallback',false);
        let video=document.querySelectorAll('ytd-rich-item-renderer');
        if(video.length>0){
            let random=Math.floor(Math.random()*(video.length-4)+4);
            let link=video[random].querySelectorAll('a#video-title-link')[0].href;
            window.location.assign(link);
        }
    }
}
function main_02(){
    if(obj_ytb_channel=="")return;
    let ytd_channel_name_a=document.querySelectorAll('.ytd-channel-name>a')[0];
    let video_channel_url=ytd_channel_name_a.href;
    if(obj_ytb_channel.search(video_channel_url)==0){
        //console.log(video_channel_url);
    }else{
        GM_setValue('is_fallback',true);
        window.location.assign(obj_ytb_channel);
    }
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    GM_registerMenuCommand("enable script"+(is_enable?"✔️":"❌"), () => {
        is_enable=!is_enable;
        GM_setValue('is_enable', is_enable);
    });
    if(is_enable){
        if(url[0].pathname.search(/\/.+\/streams/i)==0){
            window.setTimeout(( () => {main_01();}), 3000);
        }else if(url[0].pathname.search(new RegExp("/watch", "i"))==0){
            window.setTimeout(( () => main_02() ), 10000);
            let timeoutID = window.setInterval(( () => main_02() ), 60000);
        }
    }
})();