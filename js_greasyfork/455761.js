// ==UserScript==
// @name         Bring My Color Back
// @namespace    https://greasyfork.org/zh-CN/scripts/455761-bring-my-color-back
// @license MIT
// @version      0.3
// @description  Remove grayscale filter enforced on ominous events. Be happy.
// @author       You
// @match        *://*/*
// @icon         https://images.unsplash.com/photo-1545231097-cbd796f1d95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFpbmJvd3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455761/Bring%20My%20Color%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/455761/Bring%20My%20Color%20Back.meta.js
// ==/UserScript==

'use strict';
let defaultTreatment = () => {
    document.getElementsByTagName("html")[0].style.cssText="-webkit-filter: grayscale(0%) !important; filter: grayscale(0%) !important; ";
}

let classRemover = ( className ) => {
    for (let [key, element] of Object.entries(document.getElementsByClassName(className))) {
         if(element != undefined){
             element.classList.remove(className);
         }
     }
}
if(window.location.href.includes("baidu")){
    classRemover("big-event-gray");
}else if(window.location.href.includes("iqiyi")){
    setTimeout(()=>{classRemover("gray")},1000);
}else if(window.location.href.includes("weibo")){
    classRemover("grayTheme");
}else if(window.location.href.includes("qq")){
    setTimeout(()=>{classRemover("gray-style-remembrance")},1000);
}else{
    defaultTreatment();
}