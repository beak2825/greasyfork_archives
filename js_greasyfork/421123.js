// ==UserScript==
// @name         解除慕课网不能复制!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除慕课网文档页不能复制!
// @author       You
// @match        https://class.imooc.com/lesson/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421123/%E8%A7%A3%E9%99%A4%E6%85%95%E8%AF%BE%E7%BD%91%E4%B8%8D%E8%83%BD%E5%A4%8D%E5%88%B6%21.user.js
// @updateURL https://update.greasyfork.org/scripts/421123/%E8%A7%A3%E9%99%A4%E6%85%95%E8%AF%BE%E7%BD%91%E4%B8%8D%E8%83%BD%E5%A4%8D%E5%88%B6%21.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var x = document.getElementById("cont-pannel");
    //removeListeners(x, 'selectstart')
    document
  .querySelectorAll("*")
  .forEach(node =>
    node.addEventListener(
      "selectstart",
      event => event.stopImmediatePropagation(),
      true
    )
  );
   console.log("解除慕课网不能复制!")
    // Your code here...
})();