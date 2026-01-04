// ==UserScript==
// @name         UNITY手册列表显示类型
// @namespace    http://tampermonkey.net/
// @version      2024-01-27
// @description  在UNTIY手册中的列表里显示函数的返回值和变量的类型!
// @author       SolitaryAnimal
// @match        https://docs.unity.cn/*/*/ScriptReference/*
// @match        https://docs.unity3d.com/ScriptReference/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unity.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485829/UNITY%E6%89%8B%E5%86%8C%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E7%B1%BB%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485829/UNITY%E6%89%8B%E5%86%8C%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E7%B1%BB%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(let tr of document.querySelectorAll('tr')){
        let td = document.createElement('td');
        let target = tr.childNodes[0];
        if(target.querySelector('a') === null) continue;
        td.textContent = "LOADING...";
        tr.insertBefore(td, target);
        fetch(target.querySelector('a').href).then(r => r.text()).then(t=>{
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(t, 'text/html');
            let buf = htmlDoc.querySelector('.sig-block .sig-kw').previousSibling;
            if(buf.textContent === ' '){
                td.innerHTML = buf.previousSibling.outerHTML
            } else {
                let arrBuf = buf.textContent.split(' ');
                td.textContent = arrBuf[arrBuf.length - 2];
            }
            return htmlDoc;
        }).catch(()=>{
            console.error('返回类型获取失败', target);
            td.textContent = '';
        });
    }
})();