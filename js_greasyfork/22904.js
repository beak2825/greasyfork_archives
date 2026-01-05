// ==UserScript==
// @name         Acfun自动5蕉原生版
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/scripts/22904
// @version      0.0.4
// @description  Acfun自动投5蕉，使用模拟点击的原生方法送香蕉
// @author       me
// @match        http://www.acfun.tv/v/*
// @match        http://www.acfun.tv/a/*
// @match        http://www.aixifan.com/v/*
// @match        http://www.aixifan.com/a/*
// @grant        none
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22904/Acfun%E8%87%AA%E5%8A%A85%E8%95%89%E5%8E%9F%E7%94%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/22904/Acfun%E8%87%AA%E5%8A%A85%E8%95%89%E5%8E%9F%E7%94%9F%E7%89%88.meta.js
// ==/UserScript==

/*
window.setTimeout(function(){

},5000);
*/

(function(){
    if(system.type=='video'){
        $("#btn-banana-toolbar").find("div.panel").find("div.bn")[4].click();
    }else if(system.type=='article'){
        $(".txt-pushbanana2").click();
    }
}());
