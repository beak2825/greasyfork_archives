// ==UserScript==
// @name         youtube channel video fliter/search demo
// @description  Simpler to find songs and singing videos in the vtuber streaming channel.
// @namespace    ytb_channel_video_fliter
// @author       Covenant
// @version      1.0.5
// @license      MIT
// @homepage
// @match        https://www.youtube.com/channel/*/videos*
// @match        https://www.youtube.com/channel/*/streams*
// @match        https://www.youtube.com/c/*/videos*
// @match        https://www.youtube.com/c/*/streams*
// @match        https://www.youtube.com/@*/videos*
// @match        https://www.youtube.com/@*/streams*
// @match        https://www.youtube.com/user/*/videos*
// @match        https://www.youtube.com/user/*/streams*
// @match        https://www.youtube.com/feed/subscriptions*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8AEiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//8SI///EyP//xIj//8SI///EiP//xIj//////8AEiP//wAc7v8AHO7/AB3v/wAc7v8AHO7/ABzu/wAc7v8AHO7/ABzu/wAd7/8AHe//ABzu/wAc7/8AHe//EiP//xIj//8SI////////09V//+6uv////////////9PVf//z87///////+ysv//EiP//5ub////////0tH//xIj//8SI///EiP///////9PVf///////xIj////////T1X///////8SI////////5qZ////////EiP//xIj//8TI///EiP//xIj////////T1X///////8TI////////09V////////EiP///////+amf/////////////S0f//EiP//xIj//8SI////////09V////////EiL///////9PVf////////////+6uv//EiP//7q6///v8P//0tH//xIj//8SI///EyP///////8SI///EiP//xIj//8SI///EiP///////8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//////////////////xIj//8SI///EiP//xMj////////EiP//xIj//8SI///EiP//xIj//8SI///EiP//9nZ//8SI///EiP//xMj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiP//xIj//8SI///EiL//9na//////////////////////////////////////////////////////////////////////////////////////////////////+r5/b/AAAA//372P//////R5K5/wAAAP/IiWb//////26v1f8AAAD/rGZE////////////////////////////qub1/wAAAP/+/Nj/qub2/wAAAP//////AAAA//782P8TcJ3//vzY/wAAAP///////////////////////////6rm9f8AAAD//vzY/6rm9v8AAAD//////wAAAP/+/Nj/AAAA//////8AAAD///////////////////////////9ur9b/AAAA/+PFov//////R5K6/wAAAP/JiWb//////wAAAP//////AAAA////////////////////////////AAAA//+p7/8AAAD/////////////////////////////////////////////////////////////////bq7V/wxKf///////rGZE/+PFov//////////////////////////////////////////////////////gAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452328/youtube%20channel%20video%20flitersearch%20demo.user.js
// @updateURL https://update.greasyfork.org/scripts/452328/youtube%20channel%20video%20flitersearch%20demo.meta.js
// ==/UserScript==
var div_fixed;
var btn_print;
var input_sec;
var input_word;
var p_console_log;
var panel_ytb=GM_getValue('panel_ytb',true);
var is_enable=GM_getValue('is_enable',true);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_panel_important="font-family: 'Noto Sans Mono','Noto Mono','Cascadia Mono','Consolas','DroidSans_Mono','Courier New','symbol_emoji','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif !important;";
const font_family_default="font-family: 'Noto Sans','Segoe UI','Roboto_2','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','old_emoji',sans-serif;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');
@font-face{font-family: 'symbol_emoji';src: local('Segoe UI Symbol');}\n@font-face{font-family: 'old_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono');}
@font-face{font-family: 'Roboto_2';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}\n@font-face{font-family: 'Dancing_Script';src: local('DancingScript');}\n`;
var style_font_face=create_style(font_face_default,"gm_font_face_ytb_channel_video_fliter_demo",["user_gm_font_face","css_ytb_channel_video_fliter_demo"]);
var style_user_css=create_style(".user_input_fixed,.user_btn_panel_fixed,.p_console_log{"+font_family_panel_important+"font-weight: 300;}\n","gm_user_css_ytb_channel_video_fliter_demo",["user_gm_css","css_ytb_channel_video_fliter_demo"]);
style_user_css.textContent+=`input.user_input_fixed{width: auto;max-width: 95%;border-radius: 0.5rem;padding: 0.25em;}
.user_input_fixed,.user_btn_panel_fixed{font-size: 120%;}
.input_font_family{min-width: 90%;}\ndiv.div_br{width: 100%;}
.user_div_fixed_ytb{position:fixed !important;z-index: 65535;top: 30%;right: 0px;font-size: 1.5rem;}
.user_div_fixed_ytb{background: #00000033;display: flex;justify-content: flex-end;flex-wrap: wrap;min-width: 32rem;}\ndiv.div_br{width: 100%;}
.user_btn_margin{margin-right: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;padding-left: 5px;padding-right: 5px;}
.user_btn_panel_fixed{min-width: 5em;min-height: 1em;max-height: 2em;}
.display_none,#gm_css.display_none{display: none !important;}\n.display_none_fixed_ytb{display: none;}\n`;
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
function create_input(placeholder,class_name,is_num,is_appendChild,node,refNode){
    let input=create_node("Input",class_name,is_appendChild,node,refNode);
    input.placeholder=placeholder;
    input.type="text";
    input.title=placeholder;
    if(is_num)input.size="15";
    if(is_num)input.setAttribute("maxlength", "10");
    if(is_num)input.setAttribute("oninput","this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*?)\\..*/g, '$1');");
    return input;
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
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
function console_log_tmp(text,bool){
    let div_log=p_console_log;
    div_log.innerHTML+=text+" ";
    if(bool){div_log.innerHTML=text;}
}
//console.log("break");
function fn_btn_print(){//press button
    try{
        var video=document.querySelectorAll('ytd-rich-item-renderer');
        var results=0;
        for(let i = 0; i < video.length; i++){
            let is_overlay_exist=true;
            let ytd_overlay_time=video[i].querySelectorAll('ytd-thumbnail-overlay-time-status-renderer');
            if(ytd_overlay_time.length>0){
                if(ytd_overlay_time[0].getAttribute("overlay-style").search(new RegExp("LIVE", "i"))!=-1){
                    continue;//配信中（feed/subscriptions）
                }
            }else{/**/
                is_overlay_exist=false;
            }
            var ary_time=is_overlay_exist?video[i].querySelectorAll('span#text')[0].innerText.split(':'):["NaN"];
            var video_name=video[i].querySelectorAll('a>#video-title')[0].innerText;
            var time=0;
            var max_len;
            if(ary_time.length==1){//NaN
                //console_log_tmp("NaN",false);
                video[i].classList.remove("display_none");//配信予定, ytb_shorts
            }else if(ary_time.length==3){//hour
                time=time+parseInt(ary_time[0])*3600+parseInt(ary_time[1])*60+parseInt(ary_time[2]);
            }else{
                time=time+parseInt(ary_time[0])*60+parseInt(ary_time[1]);
            }
            //btn_print.innerHTML=btn_print.innerHTML+time+" ";
            if(input_sec.value==''){max_len=86400;}else{max_len=parseInt(input_sec.value)*60;}
            //
            if(is_enable)video[i].id="gm_css";//dev
            if(time<max_len&&video_name.search(new RegExp(input_word.value, "i"))!=-1){
                video[i].classList.remove("display_none");
                results++;
            }else{
                video[i].classList.add("display_none");
            }
        }
        btn_print.innerText="検索（"+results+"本の動画）";
    }catch(e){
        console_log_tmp(e.message,true);
    }finally{}

}
function fn_check_ui(){
    if(document.querySelectorAll('ytd-rich-item-renderer').length==0){//UI check
        btn_print.innerHTML="Exception";
    }
}

(function() {
    'use strict';
    div_fixed=create_div(["user_div_fixed_ytb"],false,document.body,document.body.firstChild);
    if(panel_ytb){div_fixed.classList.remove("display_none_fixed_ytb");}else{div_fixed.classList.add("display_none_fixed_ytb");}
    GM_registerMenuCommand('💬show input;', () => {
        panel_ytb=!panel_ytb;
        GM_setValue('panel_ytb', panel_ytb);
        if(panel_ytb){div_fixed.classList.remove("display_none_fixed_ytb");}else{div_fixed.classList.add("display_none_fixed_ytb");}
    });
    GM_registerMenuCommand("enable #css"+(is_enable?"✔️":"❌"), () => {
        is_enable=!is_enable;
        GM_setValue('is_enable', is_enable);
    });
    //
    input_sec=create_input("最大映像時間（分）/Maximum video time (minutes)",["user_input_fixed",'user_tool'],true,true,div_fixed);
    btn_print=create_btn("検索",["user_btn_panel_fixed","user_btn_margin",'user_tool'],true,div_fixed);
    create_div("div_br",true,div_fixed);
    p_console_log=create_node("p","p_console_log",true,div_fixed);
    input_word=create_input("抽出条件の指定",["user_input_fixed",'user_tool'],false,true,div_fixed);
    btn_print.addEventListener('click',() => {
        fn_btn_print();
    });
    //
    window.setTimeout(( () => fn_check_ui() ), 3000);////UI check need delay
})();
/*20221031
video=document.querySelectorAll('#items>ytd-grid-video-renderer');
video[i].querySelectorAll('div.badge-style-type-live-now-alternate')
video[i].querySelectorAll('span#text')
video[i].querySelectorAll('a#video-title')
//
document.querySelectorAll('#items>ytd-grid-video-renderer')
*/