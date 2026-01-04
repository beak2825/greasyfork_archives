// ==UserScript==
// @name         spring文档目录优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这是一个目录高亮
// @author       土豆
// @match        https://docs.spring.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443690/spring%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443690/spring%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
var arry=null;

(function() {
    'use strict';
    if(document.querySelector("#tocbot > ol")!=null){

        for(var i=0;i<document.querySelector("#tocbot > ol").childNodes.length;i++){
            document.querySelector("#tocbot > ol").childNodes[i].addEventListener('click',run,false);
        }
       
    }

    // Your code here...
})();

function run(e){


    if(arry!=null){
        arry.style.backgroundColor = '';
        arry=e.currentTarget;
        e.currentTarget.style.backgroundColor = '#bbe0e3';
    }
    else{
        arry=e.currentTarget;
        e.currentTarget.style.backgroundColor = '##bbe0e3';
    }
    

}