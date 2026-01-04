// ==UserScript==
// @name         替换《一天世界》错用的人称代词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  替换《一天世界》错用的人称代词，replaceAll('她', '他').replaceAll('妳', '你')
// @author       You
// @match        https://blog.yitianshijie.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yitianshijie.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450325/%E6%9B%BF%E6%8D%A2%E3%80%8A%E4%B8%80%E5%A4%A9%E4%B8%96%E7%95%8C%E3%80%8B%E9%94%99%E7%94%A8%E7%9A%84%E4%BA%BA%E7%A7%B0%E4%BB%A3%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/450325/%E6%9B%BF%E6%8D%A2%E3%80%8A%E4%B8%80%E5%A4%A9%E4%B8%96%E7%95%8C%E3%80%8B%E9%94%99%E7%94%A8%E7%9A%84%E4%BA%BA%E7%A7%B0%E4%BB%A3%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replace_word(){
        let doms=document.querySelectorAll('a,p');
        for (let i=0; i < doms.length; i++){
            // if (doms[i].childElementCount != 0 || !doms[i].innerHTML){
            if (!doms[i].innerHTML){
                continue;
            }
            doms[i].innerHTML = doms[i].innerHTML.replaceAll('她', '他').replaceAll('妳', '你');
        }
    }
    setInterval(replace_word, 2000);

    // Your code here...
})();