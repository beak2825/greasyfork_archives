// ==UserScript==
// @name         知乎回答时间前置
// @namespace    http://tampermonkey.net/
// @version      2024-02-27
// @description  把知乎回答时间前置显示，方便甄别过时回答
// @author       Jiny3213
// @match        https://www.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488396/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%97%B6%E9%97%B4%E5%89%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/488396/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E6%97%B6%E9%97%B4%E5%89%8D%E7%BD%AE.meta.js
// ==/UserScript==

// 调整回答时间位置
function exchangeTimeDom() {
  console.log('do it')
  const answers = document.querySelectorAll('.AnswerItem')
  for(let answer of answers) {
    const content = answer.querySelector('.RichContent')
    const time = answer.querySelector('.ContentItem-time')
    answer.insertBefore(time, content)
  }
}

// 劫持fetch方法来自 https://cloud.tencent.com/developer/article/2123940
(function () {
  const originFetch = fetch;
  window.unsafeWindow.fetch = (url, options) => {
      return originFetch(url, options).then(async (response) => {
          if(url.match(/\/feeds\?/)){
              exchangeTimeDom()
              return response;
          }else{
              return response;

          }
      });
  };
})();

window.unsafeWindow.document.addEventListener("DOMContentLoaded", exchangeTimeDom)
window.unsafeWindow.onload = exchangeTimeDom;