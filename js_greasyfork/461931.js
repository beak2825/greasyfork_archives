// ==UserScript==
// @name         Itab优化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  提供一些itab的小优化，目前包括字体、图标悬浮动画~
// @author       wqhui
// @license      MIT
// @match        https://go.itab.link/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itab.link
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461931/Itab%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461931/Itab%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ID = 'itab-custom-style'
    if(!isExistCustomStyleSheet(ID)){
        //增加itab自定义样式
        const styleSheet = document.createElement('style')
        styleSheet.type = 'text/css'
        styleSheet.setAttribute('id', ID)
        styleSheet.innerHTML = `
         html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video,button {font-family: system-ui;}
        .app-item .app-item-icon{top: 0;transition: top .2s;transition-timing-function: cubic-bezier(.37,1.08,.7,.95);}
        .app-item:hover .app-item-icon{top: -5px;}
        .app-item .app-item-title {pointer-events: none;}
        `
        document.getElementsByTagName("head").item(0).appendChild(styleSheet)
    }
    function isExistCustomStyleSheet(id){
       return !!document.querySelector(`#${id}`)
    }
})();
