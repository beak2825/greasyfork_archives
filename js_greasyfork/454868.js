// ==UserScript==
// @name         easyjob
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  I am iron man!
// @author       Tony
// @match        *://server:81/*
// @match        *://192.168.1.5:81/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.server
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454868/easyjob.user.js
// @updateURL https://update.greasyfork.org/scripts/454868/easyjob.meta.js
// ==/UserScript==

(function() {
    'use strict';
let div = document.createElement('div');
let arrName = ['一键重启','一键停止','一键上线','一键下线']
let arrColor = ['#267be2','#289cd4','#16af1e','#f58e15'];
for (let i = 0; i < arrName.length; i++) {
    let btn = document.createElement('button');
    btn = styleButton(btn,arrName[i],arrColor[i]);
    btn.type = 'button'
    btn.onclick = function () {
        clickAll(i)
    }
    div.appendChild(btn);
}
document.getElementsByClassName('list')[0].before(div);

function styleButton(element,name,color) {
    element.style.border = 0;
    element.style.background = color;
    element.style.lineHeight = '28px';
    element.style.padding = '0 20px';
    element.style.borderRadius = '3px';
    element.innerHTML = name;
    element.style.fontSize = '16px'
    element.style.color = '#fff'
    element.style.cursor = 'pointer'
    element.style.marginRight = '10px'
    element.style.lineHeight = '40px'
    return element;
}

function clickAll(index) {
    for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        switch (index) {
            case 0:
                reload(ele.name)
                break;
            case 1:
                stop(ele.name)
                break;
            case 2:
                up(ele.name)
                break;
            case 3:
                down(ele.name)
                break;
        }
    }
}
    // Your code here...
})();