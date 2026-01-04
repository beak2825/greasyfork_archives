// ==UserScript==
// @name secluded kukuku for Scholar
// @namespace http://tampermonkey.net/
// @version 0.1
// @description fuck scholar
// @author You
// @match https://kukuku.fun/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/474692/secluded%20kukuku%20for%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/474692/secluded%20kukuku%20for%20Scholar.meta.js
// ==/UserScript==
 
 (function() {
 'use strict';
 var id;
 // 屏蔽词
 var wordList = ["恋物癖", "谋士", "红贵", "本学者", "注意我", "不理我", "多考虑", "有教养", "战绩", "pua", "感受到", "为什么不", "唯一活人用户","作恶"]
 // 过滤所有主题内容含屏蔽词的串（包括其回复）
 var threads = document.getElementsByClassName("thread");
 for (let i = 0; i < threads.length; i++) {
 var t = threads[i];
 for (const j in wordList) {
 if(t.children[1].innerText.indexOf(wordList[j]) != -1){
 id = t.id;
 document.getElementById(id).className = "hidden";
 i-=1;
 break;
 }
 }
 
 }
 //过滤所有内容含屏蔽词的回复
 var replies = document.getElementsByClassName("post reply");
 for (let i = 0; i < replies.length; i++) {
 var r = replies[i];
 for (const j in wordList) {
 if(r.innerText.indexOf(wordList[j]) != -1){
 id = r.id;
 document.getElementById(id).className = "hidden";
 i-=1;
 break;
 }
 }
 }
 // Your code here…
 })();
