// ==UserScript==
// @name         去 知乎 Advertisement EBook LiveItem
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  广告 电子书相关 包含价格相关  信息屏蔽
// @author       jackdizhu
// @match        *://www.zhihu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/368760/%E5%8E%BB%20%E7%9F%A5%E4%B9%8E%20Advertisement%20EBook%20LiveItem.user.js
// @updateURL https://update.greasyfork.org/scripts/368760/%E5%8E%BB%20%E7%9F%A5%E4%B9%8E%20Advertisement%20EBook%20LiveItem.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var time = null;
  var addEventListener = document.body.addEventListener
  // 清除相关信息

  function remove (el) {
    if (el) {
      if (el.style.visibility === 'hidden') {
        return false
      }
      el.style = `
      position: absolute;
      z-index: -100;
      visibility: hidden;
      `
      document.body.appendChild(el)
    }
  }

  function setHtmlStyle () {
    let $html = document.documentElement
    if ($html.style.overflow === 'hidden') {
      document.documentElement.style = `
      margin: 0;
      `
    }
    window.requestAnimationFrame(setHtmlStyle);
  }
  window.requestAnimationFrame(setHtmlStyle);
  
  let classArr = [
    '.Popover.TopstoryItem-rightButton',
    '.EBookItem',
    '.LiveItem',
    '.Pc-feedAd-container',
    '.Modal-wrapper',
    '.Pc-word-card'
  ]
  function removeAll (str) {
    var el1 = document.querySelectorAll(str);
    for (let i = 0; i < el1.length; i++) {
      const item = el1[i];
      remove(item.parentNode);
    }
  }
  var init = () => {
    for (let i = 0; i < classArr.length; i++) {
      const str = classArr[i];
      removeAll(str);
    }
  }
  var fn = function () {
      window.requestAnimationFrame(init)
  }

  addEventListener("scroll", fn, false);
  // addEventListener('click', fn, false);
})();