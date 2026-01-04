// ==UserScript==
// @name         font-family noto android test
// @description  test only
// @namespace    font_android_test
// @author       Covenant
// @version      1.0.3.7
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      https://fonts.google.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxNnYxNkgweiIvPjxwYXRoIGZpbGw9IiNGMjk5MDAiIGQ9Ik0xMy41IDJIOEwxIDEzaDUuNXoiLz48cGF0aCBmaWxsPSIjMUE3M0U4IiBkPSJNOCAyaDV2MTFIOHoiLz48Y2lyY2xlIGZpbGw9IiNFQTQzMzUiIGN4PSIzLjI1IiBjeT0iNC4yNSIgcj0iMi4yNSIvPjxwYXRoIGZpbGw9IiMwRDY1MkQiIGQ9Ik0xMy4zMyAxMEwxMyAxM2MtMS42NiAwLTMtMS4zNC0zLTNzMS4zNC0zIDMtM2wuMzMgM3oiLz48cGF0aCBmaWxsPSIjMTc0RUE2IiBkPSJNMTAuNSA0LjVBMi41IDIuNSAwIDAxMTMgMmwuNDUgMi41TDEzIDdhMi41IDIuNSAwIDAxLTIuNS0yLjV6Ii8+PHBhdGggZmlsbD0iIzFBNzNFOCIgZD0iTTEzIDJhMi41IDIuNSAwIDAxMCA1Ii8+PHBhdGggZmlsbD0iIzM0QTg1MyIgZD0iTTEzIDdjMS42NiAwIDMgMS4zNCAzIDNzLTEuMzQgMy0zIDMiLz48L3N2Zz4K
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457404/font-family%20noto%20android%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/457404/font-family%20noto%20android%20test.meta.js
// ==/UserScript==
var style;
var ary_noto_test=[["sans-serif","sans-serif"],
                   ["serif","serif"],
                   ["monospace","monospace"],
                   ["serif-monospace","serif-monospace"],
                   ["sans-serif,serif,'old_emoji'","sans-serif,serif,'old_emoji'"],
                   ["serif,'old_emoji'","serif,'old_emoji'"],
                   ["monospace,serif,'old_emoji'","monospace,serif,'old_emoji'"],
                   ["serif-monospace,serif,'old_emoji'","serif-monospace,serif,'old_emoji'"],
                   /*["VT323 N","'VT323','Noto Color Emoji','Noto Sans Symbols 2','NotDef'"],
                   ["Yomogi N","'Yomogi','Noto Color Emoji','Noto Sans Symbols 2','NotDef'"]*/];
function create_style(innerText,class_name){
    var style=document.createElement("style");
    if(typeof class_name==='string'){style.classList.add(class_name);}
    else{
        for(let i=0; i<class_name.length; i++){style.classList.add(class_name[i]);}
    }
    style.textContent=innerText;
    document.body.appendChild(style);
    return style;
}
function css_update(fontFamily){
    console.log(style);
    style.textContent='.user_font_test{font-family: '+fontFamily+';font-weight: 400;}';
}
function font(apply_all){
    var node=document.body.querySelectorAll('*');
    for(let n = 0; n < node.length; n++){
        if(!node[n].classList.contains('user-panel-font')&&node[n].tagName!='style'){
            if(apply_all||node[n].style.fontFamily==''){
                node[n].classList.add("user_font_test");
            }
        }
    }
    console.log("font "+apply_all);
}
function main_01(){
}
(function() {
    'use strict';
    for(let i = 0; i < ary_noto_test.length; i++){
        GM_registerMenuCommand('▶'+ary_noto_test[i][0], () => {
            css_update(ary_noto_test[i][1]);
            font(false);
            window.setTimeout(( () => alert(ary_noto_test[i][0]) ), 1000);
        });
    }
    style=create_style(".user_font_test{font-family: ;font-weight: 100;}",'user_css_font_noto_test');
    var style_font_face=create_style("@font-face{font-family: 'NotDef';src: url('https://raw.githubusercontent.com/adobe-fonts/adobe-notdef/master/AND-Regular.otf');}\n",'user_css_font_face');
    style_font_face.textContent+="@font-face{font-family: 'old_emoji';src: local('Noto Color Emoji');}\n";
    //window.setTimeout(( () => main_01() ), 1000);
})();