// ==UserScript==
// @icon         http://dl.pinyin.sogou.com/index/zt/wordhero2017/share/reco2.jpg
// @name         Sougou Dati
// @description  适用于用识词英雄闯关，提示答案
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       gradfly
// @require      http://code.jquery.com/jquery-1.8.2.js
// @match        *://pinyin.sogou.com/zt/wordhero2017/*
// @include      *://pinyin.sogou.com/zt/wordhero2017/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373592/Sougou%20Dati.user.js
// @updateURL https://update.greasyfork.org/scripts/373592/Sougou%20Dati.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //$("#exam-words").bind('DOMNodeInserted', function() {
    //alert('!!!');});
    //$("#pinyin_wrap").bind('DOMNodeInserted', function() {

    function answer(){
    var opt = [];
    var obj = document.getElementsByTagName("span");
        for(var i=0;i<obj.childElementCount;i++){
            if(obj[i].className == "wh word_mgn"||obj[i].className == "wh")
                break;
        }

        if(document.getElementById("optA").className == "option right_ans")
            opt = document.getElementById("optA");
        else
            opt = document.getElementById("optB");

        document.body.childNodes[14].childNodes[5].children[3].childNodes[i-22].innerHTML = document.body.childNodes[14].childNodes[5].children[3].childNodes[i-22].innerHTML.replace("?", opt.innerHTML);
    }
    document.getElementById("pinyin_wrap").addEventListener("mouseover", answer);
})();