// ==UserScript==
// @name         自动判超星作业为100分
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填充超星批改作业中的分值100，并提交下一份
// @author       pu
// @match        https://mooc1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397328/%E8%87%AA%E5%8A%A8%E5%88%A4%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E4%B8%BA100%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/397328/%E8%87%AA%E5%8A%A8%E5%88%A4%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E4%B8%BA100%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
  console.log('zhixingzhong....');
     //alert("123");
  //  $('#tmpscore').appendTo(123);
    var divA = document.getElementById("tmpscore");
    divA.value=100;
  //  document.getElementsByClassName("test");
    pigai(0);

    //divA.innerHTML = divA.innerHTML+'123';
    // Your code here...
})();