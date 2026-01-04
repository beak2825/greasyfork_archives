// ==UserScript==
// @name         Hide pics
// @namespace    https://greasyfork.org/
// @version      1.0.2
// @description  Hide pics so that don't be seen by leaders. Refactor version.
// @author       JMRY
// @include      *://*
// @exclude      *://*.google.*
// @exclude      *://*.conoha.*
// @exclude      *://*.alipay.*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/409858/Hide%20pics.user.js
// @updateURL https://update.greasyfork.org/scripts/409858/Hide%20pics.meta.js
// ==/UserScript==
/*
1.0.2 20240513
- 优化脚本注入速度，提升刷新后的隐藏图片响应速度。

1.0.1 20240425
- 加入页面减淡的开关。

1.0 20240425
- 重构自Hide Pics 0.3.
- 加入background-image的处理。
- 加入网站级别的图片显示/隐藏网站记忆功能。
*/

let show=getShow();
if(show==undefined || show==null){
    show=true;
    setShow(show);
}

let lighter=getLighter();
if(lighter==undefined || lighter==null){
    lighter=true;
    setLighter(lighter);
}


const buttonStyle=`
.toggleImg{
	position:fixed;left:0px;bottom:0px;z-index:999999;opacity:0;
}
.toggleImg:hover{
	opacity:1;
}
.toggleImg:active{
	opacity:1;
}
`;

const hideStyle=`
img, video, .VideoCard{
    opacity:0.05 !important;
}
body{
    ${lighter==true?`opacity:0.75 !important;`:``}
}
*{
    background-image:none !important;
    ${lighter==true?`font-weight:lighter !important;`:``}
}
`;


function getShow(){
    return JSON.parse(localStorage.getItem(`hidePicBool`));
}
function setShow(bool){
    return localStorage.setItem(`hidePicBool`,JSON.stringify(bool));
}
function getLighter(){
    return JSON.parse(localStorage.getItem(`hidePicLighter`));
}
function setLighter(bool){
    return localStorage.setItem(`hidePicLighter`,JSON.stringify(bool));
}

function applyNoPic(){
    setShow(show);
    let noPicStyle=document.getElementById(`hideStyleEl`);
    let toggleBu=document.getElementById(`toggleImg`);
    if(noPicStyle){
        if(show==true){
            noPicStyle.innerHTML=``;
            toggleBu.innerHTML=`☑PIC ↑+\``;
            toggleBu.style='';
        }else{
            noPicStyle.innerHTML=hideStyle;
            toggleBu.innerHTML=`☒PIC ↑+\``;
            toggleBu.style='opacity:1;';
        }
    }
    return show;
}

function toggleShowImg(){
    show=!show;
    applyNoPic();
}

function insertNoPic(){
    let hideStyleEl=document.createElement('style');
    hideStyleEl.id=`hideStyleEl`;
    hideStyleEl.innerHTML=``;
    document.head.appendChild(hideStyleEl);

    let buttonStyleEl=document.createElement('style');
    buttonStyleEl.id=`buttonStyleEl`;
    buttonStyleEl.innerHTML=buttonStyle;
    document.head.appendChild(buttonStyleEl);

    let toggleBu=document.createElement('button');
	toggleBu.id='toggleImg';
    toggleBu.classList.add('toggleImg');
	toggleBu.onclick=function(){
		toggleShowImg();
	};
    window.onkeypress=function(e){
        if (e.shiftKey==true && e.code=='Backquote'){
            toggleShowImg();
        }
    }
	document.body.appendChild(toggleBu);
}


(function() {
    'use strict';
    insertNoPic();
    applyNoPic();
})();