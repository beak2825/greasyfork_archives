// ==UserScript==
// @name         琉璃神社链接转换
// @namespace    www.llss.tv
// @version      1.0.0
// @description  try to take over the world!
// @author       Yuansu
// @match        *://www.llss.pw/*
// @match        *://www.liuli.pw/*
// @ico          http://www.llss.pw/favicon.ico
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/38950/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/38950/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg = /[0-9A-Za-z]{32,40}/g ;

    var tags = ['pre','p','td'];
    for(let t of tags){
        let s = document.querySelectorAll(t);
        for(let i of s)
        {
            let result;
            while((result= reg.exec(i.innerText))!==null){
                i.innerHTML = i.innerHTML.replace(result[0],`<a href="magnet:?xt=urn:btih:${result[0]}">${result[0]}</a>`);
            }
        }
    }


})();