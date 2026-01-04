// ==UserScript==
// @name     Luogu No More Difficulties
// @description 把洛谷所有题目页上的难度标签改成入门
// @version  1
// @match    *://www.luogu.org/problem/*
// @grant    none
// @run-at   document-idle
// @namespace https://greasyfork.org/users/396032
// @downloadURL https://update.greasyfork.org/scripts/392135/Luogu%20No%20More%20Difficulties.user.js
// @updateURL https://update.greasyfork.org/scripts/392135/Luogu%20No%20More%20Difficulties.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(() => {

let a = setInterval(() =>{
	let dom = document.querySelector('div.flex-lr:nth-child(2) > a:nth-child(2) > span:nth-child(1)');
  dom.style = 'color:rgb(231,76,60)'
  dom.innerHTML = "入门"
},5)

setTimeout(() => clearInterval(a),2000);
  
})();