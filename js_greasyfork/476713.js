// ==UserScript==
// @name         font mono beta🔧
// @description  let english website display mono font
// @namespace    font_mono
// @author       Covenant
// @version      0.9.2
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      https://fonts.google.com/*
// @exclude      https://fonts.bunny.net/*
// @exclude      https://codepen.io/*
// @exclude      https://web.archive.org/*
// @exclude      https://www.programmingfonts.org/*
// @exclude      https://www.codingfont.com/*
// @exclude      https://fonts.adobe.com/*
// @exclude      file:///*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBhcmlhLWhpZGRlbj0idHJ1ZSIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxNiIgZGF0YS12aWV3LWNvbXBvbmVudD0idHJ1ZSIgY2xhc3M9Im9jdGljb24gb2N0aWNvbi1pbmZvIj4KICAgIDxwYXRoIGQ9Ik0wIDhhOCA4IDAgMSAxIDE2IDBBOCA4IDAgMCAxIDAgOFptOC02LjVhNi41IDYuNSAwIDEgMCAwIDEzIDYuNSA2LjUgMCAwIDAgMC0xM1pNNi41IDcuNzVBLjc1Ljc1IDAgMCAxIDcuMjUgN2gxYS43NS43NSAwIDAgMSAuNzUuNzV2Mi43NWguMjVhLjc1Ljc1IDAgMCAxIDAgMS41aC0yYS43NS43NSAwIDAgMSAwLTEuNWguMjV2LTJoLS4yNWEuNzUuNzUgMCAwIDEtLjc1LS43NVpNOCA2YTEgMSAwIDEgMSAwLTIgMSAxIDAgMCAxIDAgMloiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KPC9zdmc+
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/476713/font%20mono%20beta%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/476713/font%20mono%20beta%F0%9F%94%A7.meta.js
// ==/UserScript==
const ary_os_font=[["","'Consolas',","'Cascadia Mono',","'Noto Mono',","'Noto Sans Mono',","'Liberation Mono',","'DejaVu Sans Mono',","'DroidSans_Mono',"],["'Cutive Mono',","'Courier Prime',","'M PLUS 1 Code',","'Xanh Mono',","'New Tegomin',"]];
const ary_url=["https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap",
               "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
               "https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@100;200;300;400;500;600;700&display=swap",
               "https://fonts.googleapis.com/css2?family=Xanh+Mono:ital@0;1&display=swap",
               "https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap"];
var value=GM_getValue('value', [0,0]);
var web_font_name=GM_getValue('web_font_name', ary_os_font[value[0]][value[1]]);
var font_weight=GM_getValue('font_weight', 300);
var letter_spacing=web_font_name=="'Cutive Mono',"?"letter-spacing: -0.05em;":"";
var timeoutID_1;
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
const font_family_code="font-family: "+web_font_name+"'Noto Sans Mono','Noto Mono','Cascadia Code','Consolas','Liberation Mono','Monaco','Courier New','flag_patch','flag_white_patch','color_emoji','Noto Sans CJK JP','Meiryo','Yu Gothic','Microsoft JhengHei','symbol_sans','symbol2_sans','emoji_back',monospace;";
const font_face_default=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),/*url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),*/local('Noto Color Emoji'),local('Segoe UI Emoji'),local('Apple Color Emoji');}
@font-face{font-family: 'symbol_sans';src: local('Segoe UI Symbol'),local('NotoSansSymbols-Regular'),local('NotoSansSymbols-Regular-Subsetted'),local('Noto Sans Symbols')/*,local('Apple Symbols')*/;}
@font-face{font-family: 'symbol2_sans';src: local('NotoSansSymbols2-Regular'),local('NotoSansSymbols-Regular-Subsetted2'),local('Meiryo');}
@font-face{font-family: 'emoji_back';src: local('Noto Color Emoji'),local('Toss Face Font Web'),local('Segoe UI Emoji');}
@font-face{font-family: 'old_google';src: local('Noto Color Emoji'),local('NotoColorEmoji');}\n@font-face{font-family: 'old_samsung';src: local('SamsungColorEmoji');}
@font-face{font-family: 'DroidSans_Mono';src: local('DroidSansMono');}\n@font-face{font-family: 'Cutive_Mono';src: local('Cutive Mono');}
@font-face{font-family: 'Roboto_Regular';src: local('Roboto');}\n@font-face{font-family: 'Noto_Serif';src: local('NotoSerif');}
@font-face{font-family: 'Dancing_Script';src: local('DancingScript');}\n@font-face{font-family: 'Coming_Soon';src: local('ComingSoon');}\n@font-face{font-family: 'Carrois_GothicSC';src: local('CarroisGothicSC-Regular');}
\n`;
var style_font_face;
var style_user_css;
if(document.body!=null){
    style_font_face=create_style(font_face_default,"gm_font_face_font_monospace",["user_gm_font_face","css_font_monospace"]);
    style_user_css=create_style("","gm_user_css_font_monospace",["user_gm_css","css_font_monospace"]);
    style_user_css.textContent+=`
html:lang(en),body:lang(en),body:not(.fake_class) p:lang(en):not(.fake_class),body:lang(en):not(.fake_class) a:not(.fake_class),body:lang(en) li,body:lang(en) div:not(.emoji),body:lang(en) section,body:lang(en) blockquote
{`+font_family_code+`font-weight: `+font_weight+`;`+letter_spacing+`/*font-size: 0.99em;font-stretch: ultra-condensed;*/}
body:not(.fake_class) p:lang(en):not(.fake_class){font-size: 1rem;}
html:lang(en) a{font-stretch: ultra-condensed;}\n`;
}
function create_link_stylesheet(url,class_name,is_appendChild,node,refNode){
    let link_stylesheet=create_node("link",class_name,is_appendChild,node,refNode);
    link_stylesheet.rel="stylesheet";
    link_stylesheet.href=url;
    return link_stylesheet;
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
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("break");
function style_01(){
    if(style_user_css.parentNode==undefined){
        console.log("style_font_mono undefined");
        document.body.appendChild(style_font_face);
        document.body.appendChild(style_user_css);
        window.clearInterval(timeoutID_1);
    }
}
(function() {
    'use strict';
    if(document.body==null)return;
    let url=fn_url(document.location);
    timeoutID_1=window.setInterval(( () => style_01()), 1000);
    //window.setTimeout(( () => style_01() ), 10000);
    GM_registerMenuCommand("use os mono font"+(value[0]==0?"✔️":""), () => {
        if(value[0]==0){
            value[1]=(value[1]+1)%(ary_os_font[value[0]].length);
            value=GM_setValue('value', [value[0],value[1]]);
        }else if(value[0]==1){
            value=GM_setValue('value', [0,1]);
        }
    });
    GM_registerMenuCommand("use web font"+(value[0]==1?"✔️":""), () => {
        if(value[0]==1){
            value[1]=(value[1]+1)%(ary_os_font[value[0]].length);
            value=GM_setValue('value', [value[0],value[1]]);
        }else if(value[0]==0){
            value=GM_setValue('value', [1,0]);
        }
    });
    if(value[0]==1){
        if(url[0].host.search(new RegExp("github.com", "i"))!=0&&url[0].host.search(new RegExp("steamdb.info", "i"))!=0&&url[0].host.search(new RegExp("developer.mozilla.org", "i"))!=0){
            let link=create_link_stylesheet(ary_url[value[1]],"gm_font_face_font_monospace",true,document.head);
            GM_registerMenuCommand("rst, "+web_font_name, () => {
                value=GM_setValue('value', [0,0]);
            });
        }else{
            GM_registerMenuCommand("rst, load webfont css fail", () => {
                value=GM_setValue('value', [0,0]);
            });
        }
    }
    //console.log(style_user_css.parentNode);
})();