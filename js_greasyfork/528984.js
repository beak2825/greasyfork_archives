    // ==UserScript==
    // @name         屏蔽V2EX无聊的AI讨论
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  屏蔽V2EX无聊的AI讨论内容
    // @author       DebuggerX
    // @match        https://www.v2ex.com/*
    // @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528984/%E5%B1%8F%E8%94%BDV2EX%E6%97%A0%E8%81%8A%E7%9A%84AI%E8%AE%A8%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528984/%E5%B1%8F%E8%94%BDV2EX%E6%97%A0%E8%81%8A%E7%9A%84AI%E8%AE%A8%E8%AE%BA.meta.js
    // ==/UserScript==
    
    // https://greasyfork.org/en/scripts/460348-%E5%B1%8F%E8%94%BDv2ex%E6%97%A0%E8%81%8A%E7%9A%84ai%E8%AE%A8%E8%AE%BA/code?locale_override=1
     
    (function () {
      'use strict';
      const defaultKeywords = ['openai', 'chatgpt'];
      let keywords = localStorage.getItem('key_ai_keywords');
      if (!!keywords) {
        keywords = JSON.parse(keywords);
      }
      else {
        localStorage.setItem('key_ai_keywords', JSON.stringify(defaultKeywords));
        keywords = defaultKeywords;
      }
     
      let count = 0;
     
      document.querySelectorAll('.cell.item').forEach((post) => {
        let content = post.querySelector('.item_title').innerHTML.toLowerCase();
        for (const keyword of keywords) {
          if (content.includes(keyword)) {
            post.style.display = 'none';
            count++;
            break;
          }
        }
      });
     
      const comment = document.createElement('span');
      comment.className = 'fade';
      comment.innerText = `${count} 条已屏蔽`;
      comment.style.marginRight = '16px';
      comment.style.cursor = 'pointer';
      comment.addEventListener('click', () => {
        document.querySelectorAll('.cell.item').forEach((post) => {
          post.style.display = '';
        });
        comment.innerText = '0 条已屏蔽';
      });
      document.querySelector('#SecondaryTabs').prepend(comment);
    })();

