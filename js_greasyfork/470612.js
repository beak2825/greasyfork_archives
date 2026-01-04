// ==UserScript==
// @name        chagpt - safari 中文输入法回车键修复
// @description  ChatGPT 网页版在使用自带中文输入法输入英文时，按下回车键并不会选择候选的英文词汇，而是直接发送消息。根据这个[PR](https://github.com/lencx/ChatGPT/pull/389)，修复了这个问题，使中文输入法下按下回车键会选择候选词汇，再按回车键才会发送消息。
// @match       https://chat.openai.com/*
// @version 1.0
// @license MIT
// @namespace https://greasyfork.org/users/1124224
// @downloadURL https://update.greasyfork.org/scripts/470612/chagpt%20-%20safari%20%E4%B8%AD%E6%96%87%E8%BE%93%E5%85%A5%E6%B3%95%E5%9B%9E%E8%BD%A6%E9%94%AE%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/470612/chagpt%20-%20safari%20%E4%B8%AD%E6%96%87%E8%BE%93%E5%85%A5%E6%B3%95%E5%9B%9E%E8%BD%A6%E9%94%AE%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
  
document.addEventListener("keydown", (e) => {
    if(e.keyCode == 229) e.stopPropagation();
}, true)