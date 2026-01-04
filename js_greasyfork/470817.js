// ==UserScript==
// @name         屏蔽555电影网广告
// @namespace    www.555dianying.cc
// @version      1.2
// @description  屏蔽555电影网广告和福利成人入口，同时隐藏特定链接和元素，修改日期2023-07-14，仅供参考学习，请勿用于非法用途！
// @match        https://www.555dianying.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470817/%E5%B1%8F%E8%94%BD555%E7%94%B5%E5%BD%B1%E7%BD%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/470817/%E5%B1%8F%E8%94%BD555%E7%94%B5%E5%BD%B1%E7%BD%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 获取所有class为"links"的A标签，并隐藏目标链接
  var hideLinks = function() {
    const links = document.querySelectorAll('a.links');
    links.forEach(link => {
      if (link.getAttribute('href') === 'https://www.555hd4.com/vodtype/124.html') {
        link.style.display = 'none';
      }
    });
  }

  // 屏蔽class值为"is_pc"和"is_mb"的div元素
  var blockElements = function() {
    var elements = document.querySelectorAll('div.is_pc, div.is_mb');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.parentNode.removeChild(element);
    }
  }

  // 屏蔽包含有午夜福利字样的li元素
  var blockLiElements = function() {
    var liElements = document.querySelectorAll('li.swiper-slide.navbar-item');
    for (var i = 0; i < liElements.length; i++) {
      var liElement = liElements[i];
      var spanElement = liElement.querySelector('span');
      if (spanElement && spanElement.innerText === '午夜福利') {
        liElement.parentNode.removeChild(liElement);
      }
    }
  }

  // 等待页面加载完成后执行脚本
  window.addEventListener('load', function() {
    hideLinks();
    blockElements();
    blockLiElements();
  });
})();