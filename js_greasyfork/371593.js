// ==UserScript==
// @name         第四城装饰公司名称缩写替换
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.4c.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371593/%E7%AC%AC%E5%9B%9B%E5%9F%8E%E8%A3%85%E9%A5%B0%E5%85%AC%E5%8F%B8%E5%90%8D%E7%A7%B0%E7%BC%A9%E5%86%99%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/371593/%E7%AC%AC%E5%9B%9B%E5%9F%8E%E8%A3%85%E9%A5%B0%E5%85%AC%E5%8F%B8%E5%90%8D%E7%A7%B0%E7%BC%A9%E5%86%99%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let data = [
        {reg: new RegExp('LMZS', 'ig'), value: '良美装饰'},
        {reg: new RegExp('LM', 'ig'), value: '良美装饰'},
        {reg: new RegExp('HGZS', 'ig'), value: '鸿阁装饰'},
        {reg: new RegExp('HG', 'ig'), value: '鸿阁装饰'},
        {reg: new RegExp('JYHLZS', 'ig'), value: '锦燕互联装饰'},
        {reg: new RegExp('JYHL', 'ig'), value: '锦燕互联装饰'},
        {reg: new RegExp('JY', 'ig'), value: '锦燕互联装饰'},
    ]

    for(let v of data) {
        document.body.innerHTML = document.body.innerHTML.replace(v.reg, ` ${v.value} ` )
    }
    // Your code here...
})();