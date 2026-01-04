// ==UserScript==
// @name         stackoverflowToCN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将英文版的stackoverflow跳转到中文版stackoom！
// @author       岳华
// @match        https://stackoverflow.com/questions/*
// @namespace    https://greasyfork.org/zh-CN/users/660626-lagrange-doggy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406171/stackoverflowToCN.user.js
// @updateURL https://update.greasyfork.org/scripts/406171/stackoverflowToCN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addLink(fragment, text, href){
    //let a = imdblink.cloneNode(true);//let作用：a只在所在的代码块内有效！

    fragment.textContent = text;//克隆写结点后做文本的替换
    fragment.href = href;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    return newNode;
}


let title = document.title;//python - How to using @roles required in flask? - Stack Overflow
let start = title.indexOf("-");
let end = title.lastIndexOf("-");
title=title.substring(start+2, end-1);
var links =  document.querySelectorAll (
    ".grid.fw-wrap.pb8.mb16.bb.bc-black-2 > div"//#info标签下的a标签
);//结点的集合
let scanf = document.createElement("scanf");
scanf.textContent="  🚩";
insertAfter(scanf, links[2]);

links = document.querySelectorAll (
    ".grid.fw-wrap.pb8.mb16.bb.bc-black-2 > div"
)

let dev = links[0].cloneNode(false);


let a = document.createElement("a");
a.setAttribute("target", "blank");

dev.appendChild(a);

addLink(a, "  中文stackoverflow ", 'https://stackoom.com/search?q=' + title);

insertAfter(dev, scanf);
})();