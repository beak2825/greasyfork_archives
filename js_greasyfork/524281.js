// ==UserScript==
// @name         显示 SerenityWay 的真实实力
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @description  没有
// @author       PriorityStack
// @match        https://www.luogu.com.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524281/%E6%98%BE%E7%A4%BA%20SerenityWay%20%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%AE%9E%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/524281/%E6%98%BE%E7%A4%BA%20SerenityWay%20%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%AE%9E%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("SW AK IOI");
    setInterval(function(){
    var benbens=document.getElementsByClassName("feed-username");
    benbens.forEach((x)=>{
        var m=x.children[0];
        if(m.innerHTML==="SerenityWay"){
            x.outerHTML="<span class=\"feed-username\"><a class=\"lg-fg-purple lg-bold\" href=\"/user/1048165\" target=\"_blank\">SerenityWay</a>&nbsp;<a data-v-0640126c=\"\" href=\"/discuss/142324\" target=\"_blank\" colorscheme=\"none\" class=\"color-none\"><svg data-v-0640126c=\"\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fad\" data-icon=\"badge-check\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"svg-inline--fa fa-badge-check\" style=\"--fa-primary-color: #fff; --fa-secondary-color: #ffc116; --fa-secondary-opacity: 1;\"><g data-v-0640126c=\"\" class=\"fa-duotone-group\"><path data-v-0640126c=\"\" fill=\"currentColor\" d=\"M256 0c36.8 0 68.8 20.7 84.9 51.1C373.8 41 411 49 437 75s34 63.3 23.9 96.1C491.3 187.2 512 219.2 512 256s-20.7 68.8-51.1 84.9C471 373.8 463 411 437 437s-63.3 34-96.1 23.9C324.8 491.3 292.8 512 256 512s-68.8-20.7-84.9-51.1C138.2 471 101 463 75 437s-34-63.3-23.9-96.1C20.7 324.8 0 292.8 0 256s20.7-68.8 51.1-84.9C41 138.2 49 101 75 75s63.3-34 96.1-23.9C187.2 20.7 219.2 0 256 0zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z\" class=\"fa-secondary\"></path><path data-v-0640126c=\"\" fill=\"currentColor\" d=\"M369 175c9.4 9.4 9.4 24.6 0 33.9L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0z\" class=\"fa-primary\"></path></g></svg></a>&nbsp;<span class=\"am-badge am-radius lg-bg-purple\">AK IOI</span></span>";
        }
    });
    },250)
    // Your code here...
})();