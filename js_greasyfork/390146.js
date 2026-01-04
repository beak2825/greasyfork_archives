// ==UserScript==
// @name         豆瓣手机网页去App
// @description  为豆瓣手机网页添加登录和个人主页按钮；无需打开App即可在手机网页中查看豆瓣书影音的全部短评、评论和讨论等内容。
// @author       juby
// @version      0.0.4
// @namespace    juby
// @match        *://m.douban.com/*
// @downloadURL https://update.greasyfork.org/scripts/390146/%E8%B1%86%E7%93%A3%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E5%8E%BBApp.user.js
// @updateURL https://update.greasyfork.org/scripts/390146/%E8%B1%86%E7%93%A3%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E5%8E%BBApp.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';

    if (window.location.href === 'https://m.douban.com/') {
      let splash = document.querySelector('.splash-btn');
      splash.href = 'https://accounts.douban.com/passport/login';
      splash.innerText = '登录豆瓣';
    }

    // let headnav = document.querySelector('#TalionNav');
    // headnav.style.display = 'none';

    let info = document.querySelector('.info');
    let btngreen = info.nextElementSibling;
    btngreen.style.display = 'none';
    let primary = document.querySelector('.TalionNav-primary');
    let greenbtn = document.createElement('a');
    greenbtn.innerText = '个人主页';
    greenbtn.href = 'https://m.douban.com/mine/';
    greenbtn.classList.add('green');
    greenbtn.classList.add('btn');
    if (window.location.href === 'https://m.douban.com/home_guide') {
      primary.appendChild(greenbtn);
    } else {
      primary.insertBefore(greenbtn, btngreen);
    }

    let links = document.querySelectorAll('.oia-btn');
    for (let i = 0; i < links.length; i++) {
      let btn = links[i];

      switch (btn.innerText) {
        case '打开App，看更多热门影评':
          btn.href = 'reviews';
          btn.innerText = "点击查看更多热门影评";
          break;
        case '打开App，看全部书评':
          btn.href = 'reviews';
          btn.innerText = "点击查看全部书评";
          break;
        case '打开App查看更多热门乐评':
          btn.href = 'reviews';
          btn.innerText = "点击查看更多热门乐评";
          break;
        case '打开App，看更多热门短评':
          btn.href = 'comments';
          btn.innerText = "点击查看更多热门短评";
          break;
        case '打开App，看全部讨论':
          btn.href = 'discussion';
          btn.innerText = "点击查看全部讨论";
          break;
        case '打开App，看更多读书笔记':
          btn.href = 'annotation';
          btn.innerText = "点击查看更多读书笔记";
          break;
        case '打开App，查看更多热门讨论':
          btn.href = 'group/explore';
          btn.innerText = '点击查看更多热门讨论';
      }
    }
})();