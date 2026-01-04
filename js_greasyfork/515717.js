// ==UserScript==
// @name         PDF复制翻译自动去掉换行符
// @namespace    https://github.com/Wijipedia
// @version      1.0
// @description  移除换行符
// @author       Wijipedia
// @match        https://www.deepl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515717/PDF%E5%A4%8D%E5%88%B6%E7%BF%BB%E8%AF%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89%E6%8D%A2%E8%A1%8C%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/515717/PDF%E5%A4%8D%E5%88%B6%E7%BF%BB%E8%AF%91%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89%E6%8D%A2%E8%A1%8C%E7%AC%A6.meta.js
// ==/UserScript==

function new_version(){
    var url = window.location.href
    
    if(url.includes("deepl.com")){
        var a = document.querySelector("#textareasContainer > div > section > div > div > d-textarea > div");
    }

    a.addEventListener("paste",function(event){

        let paste = (event.clipboardData || window.clipboardData).getData('text');

        paste = paste.replaceAll("\n"," ")
        paste = paste.replaceAll("\r"," ")

        document.execCommand("insertText",false,paste)
        event.preventDefault();
    })
}


(function() {
   'use strict';
   new_version();
})();