// ==UserScript==
// @name         ChatGPT iOS Legacy Scroll + Auto-Scroll Fix
// @namespace    korboy
// @version      1.0
// @description  Fixes broken scrolling and adds auto-scroll to latest message on ChatGPT website for older iOS versions.
// @author       korboy
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525194/ChatGPT%20iOS%20Legacy%20Scroll%20%2B%20Auto-Scroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/525194/ChatGPT%20iOS%20Legacy%20Scroll%20%2B%20Auto-Scroll%20Fix.meta.js
// ==/UserScript==

(function() {
   'use strict';
   
   function fixChatGPTScrollIssue() {
       if (!window.location.hostname.includes('chatgpt.com')) {
           return;
       }
       const styleElement = document.createElement('style');
       
       styleElement.textContent = `
           .composer-parent > .flex-1 > div > div > div {
               height: 100% !important;
               max-height: none !important;
               overflow-y: auto !important;
           }
       `;
       document.head.appendChild(styleElement);
   }

   fixChatGPTScrollIssue();

   if (document.readyState === 'complete') {
       fixChatGPTScrollIssue();
   } else {
       window.addEventListener('load', fixChatGPTScrollIssue);
   }
})();