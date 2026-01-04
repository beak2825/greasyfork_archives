// ==UserScript==
// @name         京东好评
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  京东一键好评
// @author       loloolooo
// @icon         httpshttps://greasyfork.org/vite/assets/blacklogo16.bc64b9f7.png
// @match        https://club.jd.com/*
// @grant        GM_addElement
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456373/%E4%BA%AC%E4%B8%9C%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/456373/%E4%BA%AC%E4%B8%9C%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addStyle(style) {
    GM_addStyle(style);
  }

  function addElement(
    { tagName, parentNodeSelector = 'body', attributes = {} },
    innerHTML,
    callbacks
  ) {
    const element = GM_addElement(
      document.querySelector(parentNodeSelector),
      tagName,
      attributes
    );

    element.innerHTML = innerHTML;

    if (Object.prototype.toString.call(callbacks) === '[object Object]') {
      for (const [eventType, callback] of Object.entries(callbacks)) {
        element[eventType] = callback;
      }
    }

    return element;
  }

  function initStyle() {
    const style = `
    .x-do-something {
      position: fixed;
      top: 10px;
      right: 18px;
      z-index: 99999;
      width: 14px;
      height: 14px;
      cursor: pointer;
      opacity: .6;      
      transition: all .2s linear;
    }

    body div.x-do-something { background-color: transparent !important; }

    .x-do-something:hover {
      opacity: 1;
    }

    .x-do-something svg {
      width: 100%;
      height: auto;
    }
    `;

    addStyle(style);
  }

  function initElement() {
    const innerHTML = `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6L4 41H44L24 6Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 32.25L34 41" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 14.75L14 41" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 23.5L24 41" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    addElement(
      {
        tagName: 'div',
        attributes: {
          class: 'x-do-something',
          title: '一键好评',
        },
      },
      innerHTML,
      {
        onclick: doSomething,
      }
    );
  }

  function doSomething() {
    [...document.querySelectorAll('.star.star5')].forEach((item) =>
      item.click()
    );

    [...document.querySelectorAll('.f-textarea textarea')].forEach(
      (item) =>
        (item.value = `质量非常好,与卖家描述的完全一致, 真的很喜欢,完全超出期望值,发货速 度非常快,包装非常仔细、严实,京东物流公司服务态度很好,运送速度很快,很满意的一次购物质量很好, 希望更多的朋友信赖京东. 客服态度特好, 我会再次光顾的，发货迅速，态度很好，很满意！很好很好！下次有机会再找你，客服人蛮好的，东东很不错,淘到心意的宝贝是一件让人很开心的事，比心。`)
    );

    document.querySelector('.btn-submit').click();
  }

  initStyle();
  initElement();
})();
