// ==UserScript==
// @name         BoCai
// @namespace    http://wait.net/
// @version      0.2
// @description  BoCai-1.0
// @author       wait
// @match        https://hg8786.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      AGPL -3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450891/BoCai.user.js
// @updateURL https://update.greasyfork.org/scripts/450891/BoCai.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let div=document.createElement("div");
    div.innerHTML='<span id="span-1">span1</span><span class="sp">span class</span>';
    div.onclick=function(event){
    if(event.target.id=="span-1"){
        alert("span-1被点击了");
    }else if(event.target.className=="sp"){
        alert("sp这一类被点了");
    }
};
document.body.append(div);
    // Your code here...
})();