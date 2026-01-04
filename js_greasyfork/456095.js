// ==UserScript==
// @name         获取当前页面的前端应用资源id
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于测试脚本引用
// @author       You
// @match        https://*.kujiale.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=umx.art
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // test.testJS();
    let elements = document.getElementsByTagName("script");
    for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    let a = element.getAttribute("type");
    if(a !== null){
        if (a === "pub-meta"){
            console.log("应用: " + element.getAttribute("pn"));
            console.log("版本: " + element.getAttribute("pv") + " 资源id: "+ element.getAttribute("ps"));
        }
    }
}

})();