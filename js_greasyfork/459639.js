// ==UserScript==
// @name     NitasToolBox2
// @version  1.0
// @namespace NitasToolBox_plugin
// @match https://www.wolai.com/*
// @description NitaToolBox浏览器插件
// @author Nita
// @downloadURL https://update.greasyfork.org/scripts/459639/NitasToolBox2.user.js
// @updateURL https://update.greasyfork.org/scripts/459639/NitasToolBox2.meta.js
// ==/UserScript==

(function() {
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