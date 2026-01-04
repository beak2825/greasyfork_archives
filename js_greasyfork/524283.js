// ==UserScript==
// @name         显示 PriorityStack 的真实实力
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @description  没有
// @author       PriorityStack
// @match        https://www.luogu.com.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524283/%E6%98%BE%E7%A4%BA%20PriorityStack%20%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%AE%9E%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/524283/%E6%98%BE%E7%A4%BA%20PriorityStack%20%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%AE%9E%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("SW AK IOI");
    setInterval(function(){
    var benbens=document.getElementsByClassName("feed-username");
    benbens.forEach((x)=>{
        var m=x.children[0];
        if(m.innerHTML==="PriorityStack"){
            x.outerHTML="<span class=\"feed-username\"><a class=\"lg-fg-bluelight\" href=\"/user/785736\" target=\"_blank\">PriorityStack</a>&nbsp;<span class=\"am-badge am-radius lg-bg-bluelight\">乐子</span></span>";}
    });
    },250)
    // Your code here...
})();