// ==UserScript==
// @name         LeetCode Problem Jumper
// @namespace    https://github.com/ipdor/LeetCodeProblemJumper
// @version      1.1
// @description  在 LeetCode 题目页面支持直接根据题号跳转到题目。Jump from one problem to another problem directly!
// @author       ipdor
// @match        https://leetcode.com/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513858/LeetCode%20Problem%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/513858/LeetCode%20Problem%20Jumper.meta.js
// ==/UserScript==

(function(){"use strict";function getElementByXPath(xpath){const result=document.evaluate(xpath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);return result.singleNodeValue}function addJumpButton(){const targetDiv=getElementByXPath("/html/body/div[1]/div[2]/div/div/div[3]/nav/div/div/div[1]");if(targetDiv){if(!document.getElementById('problem_no')){const newDiv=document.createElement('div');newDiv.innerHTML='<input id="problem_no" type="text" placeholder="输入题号"><button id="jump_to_problem">跳转</button>';targetDiv.insertAdjacentElement('beforeend',newDiv);document.getElementById('jump_to_problem').addEventListener('click',function(){const problemNo=document.getElementById('problem_no').value.trim();if(problemNo&&!isNaN(problemNo)){window.location.href=`https://lcid.cc/${problemNo}`}else{alert('请输入有效的题号！')}})}}else{console.error('未找到指定的 XPath 位置。')}}const observer=new MutationObserver(function(mutations){mutations.forEach(function(mutation){if(mutation.addedNodes.length>0){addJumpButton()}})});observer.observe(document.body,{childList:true,subtree:true});addJumpButton()})();
