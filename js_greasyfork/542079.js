// ==UserScript==
// @name         Bangumi 追番点格子纯享
// @namespace    http://tampermonkey.net/
// @version      2.0
// @note         2.0 拉宽首页左栏，加快页面加载，屏蔽人物详情页评论，屏蔽章节页面评论
// @description  隐藏首页右栏，同时隐藏番剧页/人物页/章节页的评论等模块，保持纯净界面~
// @author       Bokoblink
// @include      *://bangumi.tv/*
// @include      *://bgm.tv/*
// @include      *://chii.in/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/542079/Bangumi%20%E8%BF%BD%E7%95%AA%E7%82%B9%E6%A0%BC%E5%AD%90%E7%BA%AF%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/542079/Bangumi%20%E8%BF%BD%E7%95%AA%E7%82%B9%E6%A0%BC%E5%AD%90%E7%BA%AF%E4%BA%AB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const path = location.pathname;

  // 加速执行
  function onReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      requestIdleCallback(fn);
    } else {
      document.addEventListener('DOMContentLoaded', () => requestIdleCallback(fn));
    }
  }

  // 首页：隐藏右栏，拉宽左栏
  function handleHomePage() {
    const left = document.getElementById('columnHomeA');
    const right = document.getElementById('columnHomeB');
    if (left) {
      left.style.width = '100%';
      console.log('首页左栏已拉宽');
    }
    if (right) {
      right.style.display = 'none';
      console.log('隐藏首页右栏 columnHomeB');
    }
  }

  // 番剧页隐藏评论/讨论版/吐槽箱/推荐本条目的目录/谁看这部动画
  function handleSubjectPage() {
    // 遍历所有 .subject_section，根据 h2/h3 判断标题
    const keywordsToHide = ['吐槽箱', '讨论版', '评论'];
    const sections = document.querySelectorAll('.subject_section');
    sections.forEach(section => {
      const heading = section.querySelector('h2,h3');
      if (heading) {
        const text = heading.innerText.trim();
        if (keywordsToHide.some(kw => text.includes(kw))) {
          section.style.display = 'none';
          console.log(`隐藏模块（匹配标题）：${text}`);
        }
      }
    });
    // 直接隐藏指定 id 模块(推荐本条目的目录/谁看这部动画)
    const hideIds = ['subjectPanelIndex', 'subjectPanelCollect'];
    hideIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        console.log(`隐藏模块（按 ID）：${id}`);
      }
    });
  }

  // 人物页：隐藏评论模块
  function handleCharacterPage() {
    const el = document.querySelector('#columnCrtB > div.crtCommentList');
    if (el) {
      el.style.display = 'none';
      console.log('已隐藏人物页评论');
    }
  }

  // 章节页：隐藏评论模块
  function handleEpisodePage() {
    const el = document.querySelector('#columnEpA > div.singleCommentList');
    if (el) {
      el.style.display = 'none';
      console.log('已隐藏章节页评论');
    }
  }

  // 页面分发器
  onReady(() => {
    if (path === '/' || path === '/index') {
      handleHomePage();
    } else if (path.startsWith('/subject/')) {
      handleSubjectPage();
    } else if (path.startsWith('/character/')) {
      handleCharacterPage();
    } else if (path.startsWith('/ep/')) {
      handleEpisodePage();
    }
  });
})();
