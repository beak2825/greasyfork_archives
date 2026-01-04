// ==UserScript==
// @name         Translate Helper
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  翻译去换行
// @author       o1hy
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @match        https://www.deepl.com/*
// @match        https://fanyi.sogou.com/*
// @match        http://fanyi.youdao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411317/Translate%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411317/Translate%20Helper.meta.js
// ==/UserScript==

function new_version(){
    var url = window.location.href

    if(url.includes("deepl.com")){
        var a = document.querySelector("#dl_translator > div > div > div > div > div > textarea");
    }else if(url.includes("translate.google")){
        var a = document.querySelector("body > c-wiz > div > div > c-wiz > div > c-wiz > div > div > div > c-wiz > span > span > div > textarea");
    }else if(url.includes("sogou.com")){
        var a = document.querySelector("#trans-input");
    }else if(url.includes("fanyi.youdao.com")){
        var a = document.querySelector("#inputOriginal");
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