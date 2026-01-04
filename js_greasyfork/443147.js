// ==UserScript==
// @name         笔果题库PC隐藏答案
// @description  隐藏笔果题库的显示答案
// @version      0.3
// @author       Nyu
// @grant        none
// @match      *://*.biguotk.com/*
// @namespace https://greasyfork.org/users/900488
// @downloadURL https://update.greasyfork.org/scripts/443147/%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93PC%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/443147/%E7%AC%94%E6%9E%9C%E9%A2%98%E5%BA%93PC%E9%9A%90%E8%97%8F%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cssCode = `
      .btn-button{
        margin-top:10px;
        padding:10px;
        border-radius:5px;
        background-color:#0099cc;
        color:   #ff9900;
      }
    `;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style .appendChild(document.createTextNode(cssCode));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);

    //隐藏答案
    let answer = document.getElementsByClassName("answer-info-1");
    let parentNode = answer[0].parentNode;
    let ac = answer[0];
    parentNode.removeChild(answer[0]);
    let confim = document.createElement('button');
    confim.className = "btn-button"
    confim.appendChild(document.createTextNode("显示答案"));
    confim.addEventListener('click', function(){
      parentNode.appendChild(ac);
    });

    parentNode.appendChild(confim);

   //隐藏评论
    let comment_cell = document.getElementsByClassName("comment-cell");
    comment_cell[0].parentNode.removeChild(comment_cell[0]);
    //隐藏相似题目
    let same_question = document.getElementsByClassName("same-question");
    same_question[0].parentNode.removeChild(same_question[0]);
})();