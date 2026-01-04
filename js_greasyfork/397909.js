// ==UserScript==
// @name         过滤知乎推荐答案 (fuck-zhihu-answer)
// @namespace    https://github.com/dyingsunlight/tampermonkey
// @supportURL   https://github.com/dyingsunlight/tampermonkey/issues
// @homepage     https://github.com/dyingsunlight/tampermonkey
// @source       https://github.com/dyingsunlight/tampermonkey/raw/master/scripts/fuck-zhihu-yanxuan.js
// @version      0.2
// @description  过滤问题回答页面的所有付费，训练营类的回答
// @author       Dogfish
// @include      https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397909/%E8%BF%87%E6%BB%A4%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E7%AD%94%E6%A1%88%20%28fuck-zhihu-answer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397909/%E8%BF%87%E6%BB%A4%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E7%AD%94%E6%A1%88%20%28fuck-zhihu-answer%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //
  //
  let matchedCount = 0
  const styles = document.createElement('style')
  styles.innerHTML = `.hidden { display: none }; `;
  document.body.appendChild(styles);
  //
  //
  (new MutationObserver(mutations => mutations.forEach(blockExecutor))).observe(document, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false
  });
  const checkedMarkClass = 'answer-checked'
  function blockExecutor() {
    const elements = document.querySelectorAll(`section.IntroCard.AnswerItem-IntroCard:not(.${checkedMarkClass})`)
    for (let element of elements) {
      const extraParsedData = JSON.parse(element.getAttribute('data-za-extra-module') || '{}')
      const isAPieceOfShit = extraParsedData.card
        && Array.isArray(extraParsedData.card.content)
        && extraParsedData.card.content.some(item => {
          return item.type && (
            item.type === 'PaidColumn' ||
            item.type === 'Training'
          )
        })
      element.classList.add(checkedMarkClass)
      const cardElement = findParentElementUntilMeetClass(element, 'List-item')
      if (!cardElement) {
        console.log('cardElement not found',  cardElement, element)
        continue
      }
      if (isAPieceOfShit) {
        console.log('Block Yanxuan Amount: ', ++matchedCount)
        cardElement.classList.add('hidden')
      }
    }
  }
  // Utils
  function findParentElementUntilMeetClass(element, classes) {
    
    const classList = typeof classes === 'string' ? classes.split(' ') : classes
    if (!Array.isArray(classList)) {
      throw new Error('Classes Must be an array or string!')
    }
    
    let next = element
    while (next) {
      if (classList.some(val => next.classList.contains(val))) {
        return next
      }
      if (next.parentElement) {
        next = next.parentElement
      } else {
        return
      }
    }
  }
  
})();
