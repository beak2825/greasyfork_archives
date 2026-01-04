// ==UserScript==
// @name         笔果题库助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  笔果PC隐藏答案
// @description  try to take over the world!
// @author       danding
// @license      GPL License
// @match        *://*.biguotk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biguotk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443256/%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443256/%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let answer = document.getElementsByClassName("answer-info-1");
    let parentNode = answer[0].parentNode;
    let ac = answer[0];
    parentNode.removeChild(answer[0]);
    let confim = document.createElement('button');
    confim.appendChild(document.createTextNode("显示答案---------"));
    confim.addEventListener('click', function(){
      parentNode.appendChild(ac);
    });
    parentNode.appendChild(confim);

    let comment = document.getElementsByClassName("comment-cell-1");
    let commentNode = comment[0].parentNode;
    let co = comment[0];
    commentNode.removeChild(comment[0]);
    let commentConfim = document.createElement('button');
    commentConfim.appendChild(document.createTextNode("-----显示评论"));
    commentConfim.addEventListener('click', function(){
      commentNode.appendChild(co);
    });
    commentNode.appendChild(commentConfim)
})();