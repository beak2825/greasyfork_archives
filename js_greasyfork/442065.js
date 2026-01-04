// ==UserScript==
// @name         希悦窗口强制关闭
// @namespace    http://tampermonkey.net/
// @version      114.514
// @description  使用ESC一键关掉不让你关掉的希悦窗口（评教、通知）
// @author       ???
// @match        https://chalk-c3.seiue.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442065/%E5%B8%8C%E6%82%A6%E7%AA%97%E5%8F%A3%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/442065/%E5%B8%8C%E6%82%A6%E7%AA%97%E5%8F%A3%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function dfs(x){
        var list=x.childNodes;
        var f=x.getAttribute("data-test-id")==="close-modal"
        ||x.getAttribute("id")==="image-editor";
        for(var i=0;i<list.length;i++){
            if(list[i].nodeType===1){
                f=f||dfs(list[i]);
            }
        }
        return f;
    }
    function f(){
        var el=document.getElementsByClassName('ant-modal-root');
        var len=el.length;
        for(var i=0;i<len;i++){
            if(!dfs(el[i])){
                el[i].parentNode.removeChild(el[i]);
            }
        }
    }
    document.onkeydown=(e)=>{
        if(e.keyCode===27){
            f();
        }
    };
})();