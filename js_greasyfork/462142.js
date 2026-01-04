// ==UserScript==
// @name        oxygen
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     0.6.1.6
// @author      Sal R.
// @description 19/03/2023 19:08:35
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462142/oxygen.user.js
// @updateURL https://update.greasyfork.org/scripts/462142/oxygen.meta.js
// ==/UserScript==
// oxygen.user.js


var ox=document.createElement("div");
ox.text="ok";
document.prepend(ox);







var ox;
if(document.location.hash=="#547"){
    ox=document.location.hash;
}
else{
    ox="#000";
}
if(ox=="#547"){
    const oxygen=document.createElement('div');
    oxygen.style.top='7px';
    oxygen.style.left='7px';
    oxygen.style.position='fixed';
    oxygen.style.background='black';
    oxygen.style.borderRadius='3.5px';
    oxygen.style.width='7px';
    oxygen.style.height='7px';
    oxygen.style.zIndex='1000';
    document.body.append(oxygen);
    document.body.onclick=function(){
        oxygen.style.background="#fff";
    };
}
else{
    const oxygen=document.createElement('script');
    //oxygen.async=true;
    oxygen.src='https://update.greasyfork.org/scripts/462142/oxygen.user.js';
    //oxygen.type='module';
    document.head.append(oxygen);
    document.location.hash="#547";
}