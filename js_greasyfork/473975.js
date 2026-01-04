// ==UserScript==
// @name 2017 Twitter Mobile
// @namespace legosavant
// @version 1.0
// @description Twitter if it was less ugly
// @author legosavant
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include https://twitter.com*/*
// @include https://x.com*/*
// @downloadURL https://update.greasyfork.org/scripts/473975/2017%20Twitter%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/473975/2017%20Twitter%20Mobile.meta.js
// ==/UserScript==

(function() {
let css = `
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@300&display=swap');
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    src: local('Roboto Regular'), local('Roboto-Regular'), url(//fonts.gstatic.com/s/roboto/v15/CWB0XYA8bzo0kSThX0UTuA.woff2)format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    src: local('Roboto Medium'), local('Roboto-Medium'), url(//fonts.gstatic.com/s/roboto/v15/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2)format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}

@font-face{font-family:"rosettaicons";src:url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.eot");src:url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.eot#iefix") format("embedded-opentype"),url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.woff") format("woff"),url("https://abs.twimg.com/a/1486487005/font/rosetta-icons-Regular.ttf") format("truetype");font-style:normal;font-weight:normal}.Icon{background:transparent;display:inline-block;font-style:normal;vertical-align:baseline;position:relative}

[data-testid] .r-1h0z5md > .r-xoduu5:not(.r-1udh08x):before {
    font-family:"Rosettaicons";
    color:#aab8c2;
    content:"\\f148";
    display:inline-block;
    font-size:16px;
    line-height:18px;
}
.r-1qd0xha, .r-1-37j5jr, .r-37j5jr { /*font*/
    font-family: "Roboto", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
}
.r-sdzlij { /*pfp*/
    border-radius:5px;
}
.r-1867qdf { /*post*/
    border-radius:3px
}
[data-testid="UserAvatar-Container-unknown"] div { /*self*/
    border-radius:50%
}
main[role="main"] {
    background:#eee
}
/******************************nav/*******************************/
nav[role="navigation"][aria-label] a > div > div:before {
    content:"\\f052";
    font-family:"Rosettaicons";
    font-size:24px;
    color:#647785
}
nav[role="navigation"][aria-label] a > div > div svg {
    display:none
}
    /*touch feedback*/
nav[role="navigation"][aria-label] a > div {
    background:none
}
nav[role="navigation"][aria-label] a > div {
    margin:0;
    padding-left:24px;
    padding-right:24px;
    border-radius:999px
}
nav[role="navigation"][aria-label] a > div.r-h9yrwi {
    background:rgba(200,200,200,.2);
}
nav[role="navigation"][aria-label] a > div.r-1ydqjzz {
    background:none
}
nav[role="navigation"][aria-label] a {
    border:0
}
nav[role="navigation"][aria-label] a:has(.r-1ydqjzz) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
    /*home*/
nav[role="navigation"][aria-label] a > div > div:has([d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"]):before {
    content:"\\f053"
}
    /*home click*/
nav[role="navigation"][aria-label] a > div > div:has([d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"]):before {
    content:"\\f053";
    color:#1FA0F2
}
nav[role="navigation"][aria-label] a:has([d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"]) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
    /*search*/
nav[role="navigation"][aria-label] a > div > div:has([d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"]):before {
    content:"\\f058"
}
    /*search click*/
nav[role="navigation"][aria-label] a > div > div:has([d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"]):before {
    content:"\\f058";
    color:#1FA0F2
}
nav[role="navigation"][aria-label] a:has([d="M10.25 4.25c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.971 0-9-4.029-9-9z"]) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
    /*notifs*/
nav[role="navigation"][aria-label] a > div > div:has([d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"]):before {
    content:"\\f055"
}
    /*notif click*/
nav[role="navigation"][aria-label] a > div > div:has([d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"]):before {
    content:"\\f055";
    color:#1FA0F2
}
nav[role="navigation"][aria-label] a:has([d="M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z"]) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
    /*mail*/
nav[role="navigation"][aria-label] a > div > div:has([d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"]):before {
    content:"\\f054"
}
    /*mail click*/
nav[role="navigation"][aria-label] a > div > div:has([d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"]):before {
    content:"\\f054";
    color:#1FA0F2
}
nav[role="navigation"][aria-label] a:has([d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"]) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
/*compose*/
[href^="https://twitter.com/compose/tweet"] {
    border-radius:50%;
    padding:0
}
[href^="https://twitter.com/compose/tweet"] > div:before {
    content:"\\f029";
    font-family:"Rosettaicons";
    font-size:24px;
    color:#fff;
    font-weight:400;
    margin-top:-2px
}
[href^="https://twitter.com/compose/tweet"] > div svg, [href^="https://twitter.com/compose/tweet"] > div svg ~ span {
    display:none
}
/*underlines*/
.r-cpa5s6:has([aria-selected="true"]) {
    box-shadow:inset 0 -4px 0 0 #1FA0F2;
}
.r-sdzlij.r-1kihuf0 {
    display:none
}
.r-cpa5s6 > a {
    background:none
}
nav[role="navigation"][aria-label] .r-cpa5s6 a > div > div:before {
    content:none
}
.r-6026j { /*ugly blur*/
    background:transparent
}
.r-1e5uvyk {
    backdrop-filter:none;
    background:#fff
}
nav[aria-live="polite"][role="navigation"].r-j5o65s { /*header shadow*/
    border:0;
    /*box-shadow:0px 2px 5px rgba(100,100,100,.2)*/
}

.r-1h3ijdo {
    height:42px;
    /*box-shadow:0px 2px 3px rgba(200,200,200,.2)   */
}
[style="height: 106px;"] {
    height:85px!important
}
/******************************guide/*******************************/
.r-6bdqna { /*bar*/
    width:100%;
}
.r-6bdqna > div {
    background:#ccc
}
.r-18kxxzh[aria-label="Account"] {
    background:url("https://abs.twimg.com/images/themes/theme1/bg.png") center;
}
.r-18kxxzh[aria-label="Account"] * {
    color:#fff;
    text-shadow:0 1px rgba(15,15,15,.3);
    font-weight:400;
    line-height:normal
}
.r-1hslgdd .r-adyw6z {
    font-size:13px;
    font-weight:600
}
.r-1472mwg {
    height:20px;
    width:20px;
}
div.r-ymttw5.r-1yzf0co, div.r-1j3t67a.r-9qu9m4 {
    padding:10px 12px
}
div.r-ymttw5.r-1yzf0co:before, div.r-1j3t67a.r-9qu9m4:before {
    font-family:"Rosettaicons";
    color:#687684;
    content:"\\f148";
    display:inline-block;
    font-size:18px;
    width:20px;
    text-align:center
}
div.r-ymttw5.r-1yzf0co svg, div.r-1j3t67a.r-9qu9m4 svg {
    width:0
}
    /*verified*/
div.r-ymttw5.r-1yzf0co:has([d="M8.52 3.59c.8-1.1 2.04-1.84 3.48-1.84s2.68.74 3.49 1.84c1.34-.21 2.74.14 3.76 1.16s1.37 2.42 1.16 3.77c1.1.8 1.84 2.04 1.84 3.48s-.74 2.68-1.84 3.48c.21 1.34-.14 2.75-1.16 3.77s-2.42 1.37-3.76 1.16c-.8 1.1-2.05 1.84-3.49 1.84s-2.68-.74-3.48-1.84c-1.34.21-2.75-.14-3.77-1.16-1.01-1.02-1.37-2.42-1.16-3.77-1.09-.8-1.84-2.04-1.84-3.48s.75-2.68 1.84-3.48c-.21-1.35.14-2.75 1.16-3.77s2.43-1.37 3.77-1.16zm3.48.16c-.85 0-1.66.53-2.12 1.43l-.38.77-.82-.27c-.96-.32-1.91-.12-2.51.49-.6.6-.8 1.54-.49 2.51l.27.81-.77.39c-.9.46-1.43 1.27-1.43 2.12s.53 1.66 1.43 2.12l.77.39-.27.81c-.31.97-.11 1.91.49 2.51.6.61 1.55.81 2.51.49l.82-.27.38.77c.46.9 1.27 1.43 2.12 1.43s1.66-.53 2.12-1.43l.39-.77.82.27c.96.32 1.9.12 2.51-.49.6-.6.8-1.55.48-2.51l-.26-.81.76-.39c.91-.46 1.43-1.27 1.43-2.12s-.52-1.66-1.43-2.12l-.77-.39.27-.81c.32-.97.12-1.91-.48-2.51-.61-.61-1.55-.81-2.51-.49l-.82.27-.39-.77c-.46-.9-1.27-1.43-2.12-1.43zm4.74 5.68l-6.2 6.77-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"]):before, div.r-1j3t67a.r-9qu9m4:has([d="M8.52 3.59c.8-1.1 2.04-1.84 3.48-1.84s2.68.74 3.49 1.84c1.34-.21 2.74.14 3.76 1.16s1.37 2.42 1.16 3.77c1.1.8 1.84 2.04 1.84 3.48s-.74 2.68-1.84 3.48c.21 1.34-.14 2.75-1.16 3.77s-2.42 1.37-3.76 1.16c-.8 1.1-2.05 1.84-3.49 1.84s-2.68-.74-3.48-1.84c-1.34.21-2.75-.14-3.77-1.16-1.01-1.02-1.37-2.42-1.16-3.77-1.09-.8-1.84-2.04-1.84-3.48s.75-2.68 1.84-3.48c-.21-1.35.14-2.75 1.16-3.77s2.43-1.37 3.77-1.16zm3.48.16c-.85 0-1.66.53-2.12 1.43l-.38.77-.82-.27c-.96-.32-1.91-.12-2.51.49-.6.6-.8 1.54-.49 2.51l.27.81-.77.39c-.9.46-1.43 1.27-1.43 2.12s.53 1.66 1.43 2.12l.77.39-.27.81c-.31.97-.11 1.91.49 2.51.6.61 1.55.81 2.51.49l.82-.27.38.77c.46.9 1.27 1.43 2.12 1.43s1.66-.53 2.12-1.43l.39-.77.82.27c.96.32 1.9.12 2.51-.49.6-.6.8-1.55.48-2.51l-.26-.81.76-.39c.91-.46 1.43-1.27 1.43-2.12s-.52-1.66-1.43-2.12l-.77-.39.27-.81c.32-.97.12-1.91-.48-2.51-.61-.61-1.55-.81-2.51-.49l-.82.27-.39-.77c-.46-.9-1.27-1.43-2.12-1.43zm4.74 5.68l-6.2 6.77-3.74-3.74 1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"]):before {
    content:"\\f099";
}
    /*lists*/
div.r-ymttw5.r-1yzf0co:has([d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"]):before, div.r-1j3t67a.r-9qu9m4:has([d="M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z"]):before {
    content:"\\f094";
}
    /*bookmarks*/
div.r-ymttw5.r-1yzf0co:has([d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"]):before, div.r-1j3t67a.r-9qu9m4:has([d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"]):before {
    content:"\\f056";
}
    /*communities*/
div.r-ymttw5.r-1yzf0co:has([d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"]):before, div.r-1j3t67a.r-9qu9m4:has([d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"]):before {
    content:"\\f178";
}
    /*monetization*/
div.r-ymttw5.r-1yzf0co:has([d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"]):before, div.r-1j3t67a.r-9qu9m4:has([d="M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z"]):before {
    content:"\\f200";
}
section > a[href].r-xyw6el svg {
    display:none
}
section > a[href].r-xyw6el svg ~ div, [href="https://twitter.com/i/display?newtwitter=true"] > div {
    font-size:13px;
    line-height:normal;
    color:#000;
    font-weight:600
}
/******************************home tab/*******************************/
/*
.css-1dbjc4n:has(>nav[aria-live="polite"]) {
    position:absolute;
    right:0;
    top:0
}
.r-cpa5s6:has(.r-l5o3uw) { /*hide other tab*//*
    display:none
}
.r-cpa5s6 > a {
    height:50px;
    min-width:0;
    padding:0 8px
}
.css-1dbjc4n>nav[aria-live="polite"] {
    border:0
}
*/
.r-xoduu5 svg {
    display:none
}
.r-xoduu5 .r-n6v787 { /*reaction icons*/
    color:#aab8c2;
    font-size:11px;
    font-weight:300
}
[data-testid="reply"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f151";
    font-size:13px;
    margin-right:3px
}
[data-testid="retweet"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f152";
    font-size:13px;
    margin-right:3px
}
[data-testid="like"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f148";
    font-size:13px;
    margin-right:3px
}
[data-testid="bookmark"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f093";
    font-size:13px;
    margin-right:3px
}
[data-testid="caret"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAlElEQVR4AZXQAQYCQBSE4YeQREJAxwiACBBCCAoIdIJOFAGEQEKBKIEE6QoJolQ7/WhZ64XwDcyw69nueJ5ij7ok89BVscbCiBOEA2rOuIwNhIsRDVwhbFFJxkUsIdzRikUTNwgrlFDADMITHbFNn27jAWGOCYQ3+nGX/7eHF/QVMEo33kWGCBDGef/rjF0MvI7QXz6coEsB8jCstAAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC");
}
a.r-1loqt21[href*="analytics"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f200";
    font-size:13px;
    margin-right:3px
}
[aria-label="Share post"] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    content:"\\f150";
    font-size:13px;
    margin-right:3px
}
/*post container: margin top 12px class*/
.r-1s2bzr4 {
    margin-top:6px
}
/*post container: padding bottom 12px class*/
.r-kzbkwu {
    padding-bottom:6px
}
.r-kzbkwu > .r-zl2h9q:nth-child(2) .r-14j79pv {
    font-weight:300;
    font-size:14px
}
/*standard pfp*/
.r-1aockid, [data-testid="Tweet-User-Avatar"] > div > div > div[style], .r-1aockid, [data-testid="Tweet-User-Avatar"] > div > div[style] > div {
    width:47px!important;
    height:47px!important
}
.r-onrtq4, .r-a2axhi {
    flex-basis:50px
}
/*tweet body text*/
[data-testid="tweet"] [data-testid="User-Name"] .r-a023e6 { /*name*/
    font-size:14.2px;
    letter-spacing:-0.3px
}
.r-13hce6t .r-a023e6 { /*@ and date*/
    font-size:12px;
    color:#6a7885;
    font-weight:300;
}
[data-testid="tweetText"] {
    font-weight:300;
    color:#000;
    font-size:14px;
    line-height:19px
}
/*new posts warning*/
.r-1wyyakw.r-18jm5s1[style="transform: translate3d(0px, 0px, 0px) translateY(106px);"] {
    transform: translate3d(0px, 0px, 0px) translateY(80px)!important
}
.r-1r5su4o.r-6czh2s {
    margin:0
}
/*pinned*/
[data-testid="socialContext"] {
    font-weight:300;
    font-size:12px;
}
[data-testid="tweet"] .r-15zivkp { /*general margin bottom 4*/
    margin-bottom:0
}
/*who to follow*/
[data-testid="UserCell"] .r-dnmrzs .r-1wvb978 { /*@*/
    line-height:14px;
    font-weight:300;
    color:#687684;
    font-size:12px;
}
[data-testid="UserCell"] .r-dnmrzs .r-a023e6 {
    line-height:normal;
}
[data-testid="UserCell"] .r-1jeg54m { /*desc*/
    font-weight:300;
    font-size:12px;
    line-height:15px;
    color:#000;
}
/******************************search tab/*******************************/
.r-7q8q6z {
    display:none
}
input[placeholder="Search"] {
    font-weight:700;
    box-shadow:none;
    padding:6px 8px
}
.r-1sw30gj:has(input[placeholder="Search"]) {
    background:rgb(231,236,239);
    border:1px solid rgb(206,214,220);
    border-radius:3px
}
/*trends*/
[data-testid="cellInnerDiv"]:not(:last-child) .r-ymttw5.r-1f1sjgu {
    border-bottom:1px solid rgb(206,214,220)
}
/******************************focus post/*******************************/
.r-1r5su4o { /*margin top and bottom 16*/
    margin:8px 0
}
.r-1dgieki { /*border top color silver*/
    border-top-color:rgb(206,214,220)
}
[data-testid="tweet"] .r-1yzf0co, [data-testid="tweet"] .r-9qu9m4 { /*focus post*/
    padding:8px 0;
    text-transform:uppercase;
    font-size:12px
}
.r-1yzf0co a > span, .r-9qu9m4 a > span {
    font-size:11px;
    font-weight:400
}
.r-1yzf0co a > div > span > span, .r-9qu9m4 a > div > span > span {
    font-size:13px;
    font-weight:700;
    color:#000;
}
.r-1dgieki div[role] > div[dir] > div:first-of-type:not(.r-1udh08x):before { /*focus icon*/
    font-size:20px;
    color:#687684
}
article[data-testid="tweet"][aria-labelledby] ~ div { /*tweet your reply*/
    display:none
}
.r-i023vh.r-1qhn6m8 { /*padding left and right 16px*/
    padding:0 8px
}
.r-1b7u577 { /*margin right 12px*/
    margin-right:6px
}
[data-testid="app-bar-back"] svg {
    color:#1FA0F2
}
/*share link discover death*/
[aria-label="Timeline: Conversation"] [data-testid="cellInnerDiv"]:has(.r-1f1sjgu h2), [aria-label="Timeline: Conversation"] [data-testid="cellInnerDiv"]:has(.r-1f1sjgu h2) ~ div {
    display:none
}

/******************************3 dots / mail icon/*******************************/
.r-1qk6wnv {
    border-radius:0
}
/******************************profile/*******************************/
.r-ymttw5 { /*padding left and right 16px*/
    padding-left:8px;
    padding-right:8px;
}
.r-1v6e3re.r-1xce0ei { /*pfp*/
    width:20%;
    margin-top:-12%;
    margin-bottom:0
}
.r-1h0z5md.r-obd0qt > div, .r-1h0z5md > div > div { /*profile buttons*/
    margin-bottom:0;
    height:auto
}
.r-1h0z5md.r-obd0qt .r-sdzlij.r-1ets6dv {
    border-color:#4d9eeb;
    min-height:32px;
    min-width:40px
}
.r-1h0z5md.r-obd0qt .r-sdzlij.r-1ets6dv .r-18jsvk2 {
    color:#4d9eeb
}
[data-testid*="-unfollow"] {
    background:#4d9eeb;
    color:#fff;
    border-color:#4d9eeb
}
[data-testid*="-unfollow"] > div > span {
    color:#fff
}
[data-testid="UserName"] {
    margin-bottom:6px;
    font-weight:300
}
[data-testid="UserName"] .r-adyw6z { /*name*/
    font-size:16px;
    font-weight:700
}
[data-testid="UserName"] .r-1wvb978 { /*@*/
    font-size:12px;
    color:#687684;
    font-weight:300;
    line-height:15px
}
[data-testid="UserName"] ~ div [data-testid="UserDescription"] { /*bio*/
    font-weight:300;
    font-size:14px;
    line-height:18px
}
[data-testid="UserName"] ~ div .r-1mf7evn { /*followings*/
    margin-right:40px
}
[data-testid="UserName"] ~ div .r-1mf7evn a > span:last-child, [data-testid="UserName"] ~ div .r-1mf7evn ~ div a > span:last-child {
    font-weight:300;
    color:#687684
}
[data-testid="UserName"] ~ div .r-1mf7evn a > span:first-child, [data-testid="UserName"] ~ div .r-1mf7evn ~ div a > span:first-child {
    font-weight:700;
}
nav[role="navigation"][aria-label] [data-testid="ScrollSnap-SwipeableList"]  a > div {
    padding:0;
}
nav[role="navigation"][aria-label] [data-testid="ScrollSnap-SwipeableList"] .r-cpa5s6:has([aria-selected])  a div {
    text-transform:uppercase;
    font-size:12px;
    font-weight:bold;
    color:#687684
}
nav[role="navigation"][aria-label] [data-testid="ScrollSnap-SwipeableList"] .r-cpa5s6:has([aria-selected="true"]) {
    box-shadow:inset 0 -3px 0 0 #4d9eeb;
}
nav[role="navigation"][aria-label] [data-testid="ScrollSnap-SwipeableList"] .r-cpa5s6:has([aria-selected="true"])  a div {
    color:#4d9eeb;
}
nav[aria-live="polite"][role="navigation"].r-j5o65s[aria-label="Profile timelines"] {
    border-top:6px solid #eee;
    border-bottom:1px solid #eee
}
/*top bar fix*/

.r-12vffkv:has([href*="header_photo"]) [data-testid="TopNavBar"] {
    background:linear-gradient(rgba(0,0,0,.5),transparent);
}
.r-12vffkv:has([href*="header_photo"]) header[role] {
    height:0
}
.r-12vffkv:has([href*="header_photo"]) [data-testid="TopNavBar"] h2 span, .r-12vffkv:has([href*="header_photo"]) [data-testid="TopNavBar"] h2 ~ div, .r-12vffkv:has([href*="header_photo"]) [data-testid="app-bar-back"] svg {
    color:#fff;
    text-shadow:0 1px rgba(15,15,15,.3);
}
/*photos tab*/
h1 ~ div[aria-label*="’s Photos"] .r-onrtq4, h1 ~ div[aria-label*="’s Photos"] .r-a2axhi {
    flex-basis:0;
    width:0;
    visibility:hidden;
    margin:0
}
/******************************various follow buttons/*******************************/
[data-testid="placementTracking"] [data-testid*="-follow"][aria-label], [data-testid="placementTracking"] [data-testid*="-unfollow"][aria-label] {
    min-height:32px
}
/*who to follow*/
[data-testid*="-follow"][style] {
    background:transparent!important;
    border-color:#4d9eeb;
    color:#4d9eeb;
    min-height:28px
}
[data-testid*="-follow"][style] span {
    color:#4d9eeb;
    font-weight:bold;
    font-size:16px;
    min-height:0
}
[data-testid*="-follow"][style] span > span:before {
    content: "\\f175";
    margin-right: 7px;
    vertical-align: text-bottom;
    font: 17px "Rosettaicons";
}
[data-testid*="-unfollow"][style] {
    border-color:#4d9eeb;
    min-height:28px;
    font-weight:bold;
    font-size:16px;
}
/******************************random modal/*******************************/
[data-testid="confirmationSheetConfirm"] {
    background:#4d9eeb!important
}
/******************************video player/*******************************/
.r-1ocf4r9 {
    overflow-y:hidden!important
}
.r-1ocf4r9 [data-testid] > div.r-1h0z5md > div:first-of-type:not(.r-1udh08x):before {
    font-size:24px
}
.r-1ocf4r9 [data-testid] > div.r-1h0z5md > div span {
    font-size:16px
}
.r-1ocf4r9 .r-1habvwh { /*profildata*/
    display:none
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
