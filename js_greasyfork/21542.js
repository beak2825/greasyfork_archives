// ==UserScript==
// @name        Dark Facebook Theme
// @namespace   ishygddt.xyz/DarkFacebook
// @description A modified version of Black Facebook Theme that includes Facebook chat
// @match	*://www.facebook.com/*
// @version     1.2.1
// @grant       GM_addStyle
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAzUlEQVRIx+3VMQqDQBAFUM8hLlmHcSxCihxDr5CrBLxG6hwlB0iX1iqsFwi2P0XWBQVhRwkYyJ/KYh8u88Uk2UTSKnMGuslcWgXAOAIrh2BcAAiCUjkCQgBYfbxECY4H9mjwQI8XWtxw9e8bDRxwxziFBhA0mIZ1wH0dwOj9sTMIBgZWCwwRDG2RZcC0LWqAdT0QzKWNuwLPApe4HswDp7XAMfYK1n/5Qz5Pu9g1it95HoB81ILvr/EP/BxAbglAXQBszZ0WKJ623saP+Q0OX/df9nCdGQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/21542/Dark%20Facebook%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/21542/Dark%20Facebook%20Theme.meta.js
// ==/UserScript==

GM_addStyle( "\
._2s1x ._2s1y { \
   background-color: rgb(51, 51, 51); \
   border-bottom-color: rgb(47,47,47); \
} \
a { \
   color: #222; \
} \
.uiSideHeader a,.nameText,a.uiHeaderActions { \
   color: #222 !important; \
} \
._58cn ._58cl { \
   color: inherit !important; \
} \
._585- { \
   border-color: rgb(152,152,152) !important; \
} \
._4jy1 { \
   border-color: #555 !important; \
   background-color: #484848 !important; \
} \
._3__- ._1nc6 ._d97 { \
   background-color: rgb(100, 100, 100) !important; \
} \
._4jy0:focus { \
    box-shadow: 0px 0px 1px 2px rgba(144, 144, 144, 0.75), 0px 1px 1px rgba(0, 0, 0, 0.15) !important; \
} \
._3__-._20fw ._50mz:active .fbNubFlyoutTitlebar, \
._3__-._20fw ._50mz.focusedTab .fbNubFlyoutTitlebar, \
._3__-._20fw ._50mz.highlightTitle .fbNubFlyoutTitlebar:hover, \
._3__-._20fw ._50mz .menuOpened .fbNubFlyoutTitlebar, \
._3__-._20fw ._50mz .menuOpened .fbNubFlyoutTitlebar:hover, \
._3__- ._50mz.highlightTitle .fbNubFlyoutTitlebar { \
    background-color: currentColor; \
    color: #222 !important; \
} \
._9-- { \
   background-image: url(\"//i.imgur.com/fAfDjSL.png\") !important; \
} \
.sp_vNQ_bybdqzO { \
   background-image: url(\"//i.imgur.com/P3MFMKI.png\") !important; \
} \
._9-_ { \
   background-image: url(\"//i.imgur.com/T3NTCvn.png\") !important; \
} \
.sp_PEv9prle0I5 { \
   background-image: url(\"//i.imgur.com/O4JAxMW.png\") !important; \
} \
.sp_wxW49iDBWOT { \
   background-image: url(\"//i.imgur.com/DePzAVq.png\") !important; \
} \
.sp_843e1e { \
   background-image: url(\"//i.imgur.com/UOAtUzx.png\") !important; \
} \
.sp_RVk3Mj3loUs { \
   background-image: url(\"//i.imgur.com/7MvAFiH.png\") !important; \
} \
.sp_8SutNL8F-Uq { \
   background-image: url(\"//i.imgur.com/itcbKrr.png\") !important; \
} \
img[src$=\"TRMghG3PMeA.png\"],img[src$=\"2GiEy4K76Xe.png\"] { \
   filter: url(\"data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.15 0.15 0.15 0 0 0.15 0.15 0.15 0 0 0.15 0.15 0.15 0 0 0 0 0 1 0\'/></filter></svg>#grayscale\"); \
} \
._1lc2._1lc4 ._1lc5 { \
    background: #333333; \
} \
._20fw ._50mz.highlightTab .fbNubButton, ._20fw .fbNubFlyoutTitlebar { \
   background-color: #333333; \
   border-color: #333333; \
} \
._3__-._20fw .fbNubFlyoutTitlebar, ._3__-._20fw ._50mz.highlightTab .fbNubButton, ._3__-._20fw .fbNubButton { \
    background: #333333; \
} \
._3__-._20fw .fbNubFlyoutTitlebar._1m34:hover, ._3__-._20fw .highlightTab.highlightTitle .fbNubButton { \
    background-image: linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0)); \
} \
._3__- ._50mz .titlebar .titlebarText, ._3__- ._50mz.highlightTab .fbNubButton .name, ._3__- ._50mz.highlightTab .fbNubButton, ._3__- ._50mz.focusedTab .fbNubButton .name { \
    color: #ffffff; \
} \
._3__-._20fw .fbNubButton:hover, ._3__-._20fw .fbNubFlyoutTitlebar:hover, ._3__-._20fw ._50mz.highlightTitle .fbNubFlyoutTitlebar:hover { \
    background: #000000; \
} \
._3__-._20fw ._50mz.highlightTab .fbNubButton, ._3__-._20fw .fbNubButton { \
    border: 1px solid #000000; \
} \
._50mz .fbChatTab .name { \
    color: #ffffff; \
} \
._3__-._4mq3 .fbNubFlyoutTitlebar { \
    background: #333333; \
    border: 1px solid #333333; \
} \
._3__-._4mq3 .fbNubFlyoutTitlebar:hover { \
    background: #000000; \
} \
");


var favicon_link_html = document.createElement('link');
favicon_link_html.rel = 'icon';
favicon_link_html.href = 'http://ix.io/12UD';
favicon_link_html.type = 'image/x-icon';
try {
   document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
}
catch(e) { }