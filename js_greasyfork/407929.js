// ==UserScript==
// @name         有道詞典自動發音
// @name:zh-CN   有道词典自动发音
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  讓有道詞典自動發音
// @description:zh-cn 让有道词典自动发音
// @author       You
// @match        *://dict.youdao.com/w/*
// @match        *://dict.youdao.com/search*
// @match        *youdao.com/w/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407929/%E6%9C%89%E9%81%93%E8%A9%9E%E5%85%B8%E8%87%AA%E5%8B%95%E7%99%BC%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/407929/%E6%9C%89%E9%81%93%E8%A9%9E%E5%85%B8%E8%87%AA%E5%8B%95%E7%99%BC%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nav = document.getElementById("nav");
    var action;

    var noPronounce = document.createElement("input")
    noPronounce.type = "radio";
    noPronounce.name = "radio";
    noPronounce.id = "nopronounce";
    noPronounce.onclick = function(){
        action = 0;
        localStorage.setItem("Action", 0);
    };
    nav.insertBefore(noPronounce,nav.childNodes[-1]);

    var noPronounceLabel = document.createElement("label")
    noPronounceLabel.innerHTML = "不發音";
    nav.insertBefore(noPronounceLabel,nav.childNodes[-1]);


    var BritishPronounce = document.createElement("input")
    BritishPronounce.type = "radio";
    BritishPronounce.name = "radio";
    BritishPronounce.id = "british";
    BritishPronounce.onclick = function(){
        action = 1;
        localStorage.setItem("Action", 1);
    };
    nav.insertBefore(BritishPronounce,nav.childNodes[-1]);

    var BritishPronounceLabel = document.createElement("label")
    BritishPronounceLabel.innerHTML = "發英音";
    nav.insertBefore(BritishPronounceLabel,nav.childNodes[-1]);


    var AmericanPronounce = document.createElement("input")
    AmericanPronounce.type = "radio";
    AmericanPronounce.name = "radio";
    AmericanPronounce.id = "american";
    AmericanPronounce.onclick = function(){
        action = 2;
        localStorage.setItem("Action", 2);
    };
    nav.insertBefore(AmericanPronounce,nav.childNodes[-1]);

    var AmericanPronounceLabel = document.createElement("label")
    AmericanPronounceLabel.innerHTML = "發英音";
    nav.insertBefore(AmericanPronounceLabel,nav.childNodes[-1]);

    var voice233 = document.getElementsByClassName('sp dictvoice voice-js log-js');

    var nopronounce = document.getElementById("nopronounce");
    var british = document.getElementById("british");
    var american = document.getElementById("american");

    var newItem=document.createElement("audio");
    var demo = document.getElementsByClassName("s-btn")[0];
    demo.insertBefore(newItem,demo.childNodes[0]);


    for(let i=0; i<=voice233.length-1; i++){
        voice233[i].onclick = function(){
            document.getElementsByTagName('audio')[0].src = 'http://dict.youdao.com/dictvoice?audio=' + voice233[i].dataset.rel;
            document.getElementsByTagName('audio')[0].currentTime = 0;
            document.getElementsByTagName('audio')[0].play();
        }
    }



    if(localStorage.getItem("Action")){
        action = localStorage.getItem("Action");
        console.log(action);
        if(action == 1){
            british.checked = true;
            voice233[0].onclick();

        }
        else if(action == 0){
            nopronounce.checked = true;
        }
        else if(action == 2){
            american.checked = true;
            voice233[1].onclick();
        }

    }else{
        action = 0;
        nopronounce.checked = true;
    }





})();