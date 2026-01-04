// ==UserScript==
// @name         SMTH终端模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  精简水木社区界面，适配 hash 路由
// @author       skape
// @match        *://*.mysmth.net/*
// @match        *://*.newsmth.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542694/SMTH%E7%BB%88%E7%AB%AF%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542694/SMTH%E7%BB%88%E7%AB%AF%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectors = [
    'div.a-u-img', 'dl.a-u-info', 'header#top_head',
    'tr.a-bottom', 'div#botadv_slider', 'section#left_adv', 'footer#bot_foot',
    'samp'
  ];

  const patterns = [
    /发信人:[^<]*<br>/g,
    /标&nbsp;&nbsp;题:[^<]*<br>/g,
    /发信站:[^<]*<br>/g,
    /&nbsp;&nbsp;<br>/g,
    /<font class="[^"]*">※ 来源:·水木社区 <a[^>]*mysmth\.net[^>]*>.*?<\/a>·\[FROM: .*?\]<\/font>/g,
    /<font class="[^"]*">\s*<br>\s*<\/font>/g,
    /<br>\s*--\s*<br>/g,
    /<font class="[^"]*">\s*:?(&nbsp;|\u00A0){2}\s*<\/font>/g,
    /<font class="[^"]*">\s*<\/font>/g
  ];

  function removeSenderInfo() {
    document.querySelectorAll('td.a-content').forEach(td => {
      let html = td.innerHTML;
      patterns.forEach(p => html = html.replace(p, ''));
      td.innerHTML = html;
    });
  }

  function removeElements() {
    selectors.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));

    removeSenderInfo();

    const setBg = (el, color = 'black') => { if (el) el.style.background = color; };
    const setColor = (el, color = '#598ede') => { if (el) el.style.color = color; };

    document.body.style.background = 'black';
    setColor(document.body);
    setBg(document.getElementById('main'));
    setBg(document.getElementById('notice'));
    setBg(document.querySelector('.b-head'));

    document.querySelectorAll('.article td').forEach(td => {
      td.style.backgroundColor = 'black';
    });

    document.querySelectorAll('[class*="button"]').forEach(el => el.classList.remove('button'));

    setBg(document.getElementById('u_login'));
    document.querySelectorAll('.page-normal a').forEach(a => setBg(a));
    document.querySelectorAll('.page-select a').forEach(a => setBg(a, 'gray'));

    const bContent = document.querySelector('.b-content');
    if (bContent) {
      bContent.style.background = 'black';
      bContent.style.border = '0px dashed white';
    }

    setTimeout(() => {
      document.querySelectorAll('a').forEach(a => (a.style.color = '#e5e5e5'));
    }, 500);

    document.querySelectorAll('[class^="f"]').forEach(el => {
      if (/\bf\d{3}\b/.test(el.className)) {
        el.style.transition = 'color 1s ease';
        setTimeout(() => el.style.color = 'white', 100);
      }
    });

    document.querySelectorAll('.toggler').forEach(el => {
      el.style.backgroundColor = 'gray';
      el.style.backgroundImage = 'url(../img/ico.gif)';
    });
  }

  // 运行一次
  window.onload = removeElements;

  // 监听路由变化（适配 hash 路由）
  window.addEventListener('urlchange', removeElements);
  history.pushState = new Proxy(history.pushState, {
    apply: (target, thisArg, args) => {
      target.apply(thisArg, args);
      window.dispatchEvent(new Event('urlchange'));
    }
  });

})();
