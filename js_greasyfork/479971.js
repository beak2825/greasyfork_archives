// ==UserScript==
// @name         flag cdn🔧
// @description  replace tofu emoji
// @namespace    emoji_cdn
// @author       Covenant
// @version      0.9.9
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      https://steamdb.info/*
// @exclude      https://github.com/*
// @exclude      https://*.github.com/*
// @exclude      https://www.google.com/search?*&tbm=isch*
// @exclude      https://developer.mozilla.org/*
// @icon         data:image/svg+xml,<svg width='24' height='24' stroke='%23023F7D' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><style>.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g class='spinner_V8m1'><circle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'></circle></g></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-head
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/479971/flag%20cdn%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/479971/flag%20cdn%F0%9F%94%A7.meta.js
// ==/UserScript==
var is_load_emoji_web=GM_getValue('is_load_emoji_web',true);
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
const u_r_kana="U+3041-3096,U+30A1-30FE,U+32D0-32FE,U+FF65-FF9F,U+3001-3002,U+3005-3006,U+3031-3035,U+3099-309F,U+31F0-31FF,U+3300-3357,U+FE11-FE12,U+FE45-FE46,U+FE51,U+FE61,U+FE64,U+1F200-1F202,U+1F213";
const u_r_bpmf="U+3105-3129,U+302D-302F,U+02C7,U+02C9-02CB,U+02D9,U+FF0C,U+3001-3002,U+FF0E,U+22EF,U+FF1A";
const u_r_flag="U+1F1E6-1F1FF,U+1F3F3-1F3F4,U+E0062-E0063,U+E0065,U+E0067,U+E006C,U+E006E,U+E0073-E0074,U+E0077,U+E007F";
const str_TwemojiMozilla_path="url('file:///C:/Program Files/Mozilla Firefox/fonts/TwemojiMozilla.ttf'),";
const str_TwemojiMozilla_url="url('https://cdn.jsdelivr.net/gh/the-emoji-guy/Emoji-Swap@main/fonts/TwemojiMozilla-Regular.woff2') format('woff2'),";
const str_Noto_COLR_url="url('https://cdn.jsdelivr.net/gh/the-emoji-guy/Emoji-Swap@main/fonts/Noto-COLRv1.ttf'),";
const str_BlobmojiCompat_url="url('https://cdn.jsdelivr.net/gh/the-emoji-guy/Emoji-Swap@main/fonts/BlobmojiCompat.ttf'),";
const str_TwemojiCountryFlags_url="url('https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1/dist/TwemojiCountryFlags.woff2') format('woff2'),";
const font_face_emoji=`
@font-face{font-family: 'color_emoji';src: local('Twemoji Mozilla'),`+(document.location.host==""?str_TwemojiMozilla_path:str_TwemojiMozilla_url)+`;}
@font-face{font-family: 'emoji_back';src: local('Noto Color Emoji'),`+str_Noto_COLR_url+str_BlobmojiCompat_url+`;}
@font-face{font-family: 'Twemoji Mozilla';src: local('Twemoji Mozilla'),`+str_TwemojiMozilla_url.replace("),", ')')+`;}
@font-face{font-family: 'emoji_patch';src: local('Twemoji Mozilla'),`+(document.location.host==""?str_TwemojiMozilla_path:str_TwemojiMozilla_url)+`local('Apple Color Emoji'),local('Noto Color Emoji');unicode-range: U+2660-2667,U+203C,U+2049,U+2139,U+25AA-25AB;}
\n`;
const font_face_unicode=`
@font-face{font-family: "emoji_patch";src: local('Twemoji Mozilla'),`+str_TwemojiMozilla_url.replace("),", ')')+`/*,`+str_Noto_COLR_url.replace("),", ')')+`*/;unicode-range: U+1F3F3;font-display: swap;}
@font-face{font-family: "emoji_patch";src: local('Twemoji Mozilla'),`+str_TwemojiMozilla_url.replace("),", ')')+`;unicode-range: `+u_r_flag+`;font-display: swap;}
@font-face{font-family: "emoji_patch";src: local('Twemoji Mozilla'),local('Apple Color Emoji'),local('Noto Color Emoji'),local('Toss Face Font Web');unicode-range: `+u_r_flag+`;font-display: swap;}
@font-face{font-family: 'code_ligature';src: local('Fira Code Light'),local('Fira Code'),local('JetBrains Mono'),local('Victor Mono'),local('Cascadia Code');unicode-range: U+0021,U+002F,U+003C-003E,U+002D;}
@font-face{font-family: 'NotoMono_Slim';src: local('Noto Sans Mono CJK JP'),local('NotoSansMonoCJKjp-Regular');unicode-range: U+0020-007E,U+00A0-02AF,U+0391-045F,U+1E00-1EFF;}
@font-face{font-family: 'manga_kana';src: local('Yu Mincho'),local('Yu Mincho Light'),local('MS Mincho'),local('NotoSerifCJKjp-Regular'),local('HiraMinProN-W3'),local('PMingLiU'),local('SimSun');unicode-range: `+u_r_kana+`;}
@font-face{font-family: 'sans_kana';src: local('Yu Gothic'),local('Yu Gothic Light'),local('MS Gothic'),local('NotoSansCJKjp-Regular'),local('HiraKakuProN-W3');unicode-range: `+u_r_kana+`;}
@font-face{font-family: 'kaiti_bpmf';src: local('PMingLiU'),local('NotoSerifCJKjp-Regular'),local('BiauKai'),local('LiSong Pro');unicode-range: `+u_r_bpmf+`;}\n`;
if(document.head!=null){
    let style_font_face=create_style("","gm_emoji_cdn",["user_gm_font_face","css_emoji_cdn_752e3"]);
    style_font_face.textContent+=`
@font-face{font-family: 'color_emoji';src: local('Segoe UI Emoji');}
@font-face{font-family: 'color_emoji';src: local('Noto Color Emoji');}
@font-face{font-family: 'color_emoji';src: local('Noto Color Emoji Compat');}
@font-face{font-family: 'color_emoji';src: local('Apple Color Emoji');}
@font-face{font-family: 'emoji_patch';src: local('Segoe UI Emoji');unicode-range: U+2660-2667,U+203C,U+2049,U+2139,U+25AA-25AB;}
@font-face{font-family: 'emoji_back';src: local('Toss Face Font Web');}
@font-face{font-family: 'emoji_back';src: local('SamsungColorEmoji');}
`;
    if(is_load_emoji_web){
        /*window.setTimeout(( () =>{
            let style=create_node("style",["user_gm_font_face","css_emoji_cdn"],true,document.head);
            style.type='text/css';
            style.id="gm_emoji_cdn_head";
            style.textContent=font_face_emoji;
        }), 5000);//*/
        window.addEventListener("load", (event)=>{
            window.setTimeout(( () =>{
                style_font_face.textContent+=font_face_emoji;
                style_font_face.textContent+=font_face_unicode;
                console.log("DOMContentLoaded emoji cdn");
            }), 3000);
        });
    }else{
        style_font_face.textContent+=font_face_unicode;
        style_font_face.textContent+="@font-face{font-family: 'emoji_patch';src: local('Segoe UI Emoji'),local('Noto Color Emoji'),local('Apple Color Emoji');unicode-range: U+2660-2667,U+203C,U+2049,U+2139,U+25AA-25AB;}";
    }
}
function create_style_iframes(textContent,id,class_name,node){
    let style=create_node("style",class_name,true,node);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
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
    return [obj_url,params];
}
//console.log("break");
(function() {
    'use strict';
    let url=fn_url(document.location);
    if(url[0].pathname=="/"){
        GM_registerMenuCommand("emoji cdn font override"+(is_load_emoji_web?"✔️":"❌"), () => {
            is_load_emoji_web=!is_load_emoji_web;
            GM_setValue('is_load_emoji', is_load_emoji_web);
        });
    }
})();