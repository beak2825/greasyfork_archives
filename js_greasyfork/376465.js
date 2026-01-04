// ==UserScript==
// @name        增强黎明版
// @description 增强黎明版的一些交互
// @namespace   no1xsyzy
// @match       http://www.nmbxd1.com/*
// @match       https://www.nmbxd1.com/*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @license     Apache License, Version 2.0 (Apache-2.0); https://opensource.org/licenses/Apache-2.0
// @version     0.6.0
// @author      no1xsyzy
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/376465/%E5%A2%9E%E5%BC%BA%E9%BB%8E%E6%98%8E%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/376465/%E5%A2%9E%E5%BC%BA%E9%BB%8E%E6%98%8E%E7%89%88.meta.js
// ==/UserScript==
(function ($) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  var 正文框 = document.querySelector('textarea.h-post-form-textarea');

  const search = window.location.search;
  const 搜索参数 = {};
  search.replace(/^\?/, '').split('&').forEach(kev => {
    const [k, v] = kev.split('=', 2);
    搜索参数[k] = v;
  });

  const 路径 = window.location.pathname;
  const 路径分块 = 路径.split('/').splice(1);

  /* global GM_deleteValue, GM_getValue, GM_setValue */

  function 清空编辑 () {
    if (document.getElementsByClassName('success')[0].textContent.includes('回复成功')) {
      const 主串路径 = /https?:\/\/[^/]+(\/t\/\d+)/.exec(document.getElementById('href').href)[1];
      GM_deleteValue(主串路径);
    }
  }

  function 载入编辑 () {
    正文框.value = GM_getValue(window.location.pathname, 搜索参数.r ? `>>No.${搜索参数.r}\n` : '');
  }

  function 注册自动保存编辑 () {
    正文框.addEventListener('change', 保存编辑);
  }

  function 保存编辑 () {
    GM_setValue(window.location.pathname, 正文框.value);
  }

  function 注册追记引用串号 () {
    $__default['default']('body').on('click', 'a.h-threads-info-id', e => {
      if (正文框.value.length > 0 && !正文框.value.endsWith('\n')) {
        正文框.value += '\n';
      }
      正文框.value += `>>${e.target.textContent}\n`;
      保存编辑();
      e.preventDefault();
    });
  }

  function 注册粘贴图片 () {
    window.addEventListener('paste', e => {
      const files = (e.clipboardData || e.originalEvent.clipboardData).files;
      if (files.length) { document.querySelector('input[type="file"][name="image"]').files = files; }
    });
  }

  function 自动标题 () {
    const 页码 = 路径分块[0] === 'Forum' ? 路径分块[5]?.replace(/\.html$/, '') || 1 : 搜索参数.page || 1;
    const 标题 = 选择标题();
    document.querySelector('title').textContent = `${标题} - page. ${页码} - A岛匿名版`;
  }

  function visit (root, cb) {
    if (cb(root) === '停止') {
      return
    }

    for (const child of root.children) {
      visit(child, cb);
    }
  }

  function 选择标题 () {
    const title = document.querySelector('.h-threads-list .h-threads-item-main .h-threads-info .h-threads-info-title').textContent.trim();
    if (title !== '无标题') {
      return title
    }

    const mainContent = document.querySelector('.h-threads-list .h-threads-item-main .h-threads-content');
    const redTexts = [];
    visit(mainContent, el => {
      if (window.getComputedStyle(el).color === 'rgb(255, 0, 0)') {
        const redSegment = el.textContent.replace(/^[=\s+]+|[=\s+]+$/, '');
        if (redSegment !== '') {
          redTexts.push(redSegment);
        }
        return '停止'
      }
    });
    const red = redTexts.join('');
    if (red !== '') {
      return red
    }

    const lines = document.querySelector('.h-threads-list .h-threads-item-main .h-threads-content').innerText.split('\n');
    for (let line of lines) {
      if ((line = line.trim()) !== '') {
        return line
      }
    }
  }

  function 串 () {
    载入编辑();
    注册追记引用串号();
    注册自动保存编辑();
    注册粘贴图片();
    自动标题();
  }

  function 串只看po () {
    自动标题();
  }

  function 版块 () {
    注册粘贴图片();
  }

  function 回复成功 () {
    清空编辑();
    注册粘贴图片();
  }

  function 未知 () {
    注册粘贴图片();
  }

  switch (路径分块[0]) {
    case 't':
      串();
      break
    case 'f':
      版块();
      break
    case 'Forum':
      if (路径分块[1] === 'po' && 路径分块[2] === 'id') { 串只看po(); } else { 未知(); }
      break
    case 'Home':
      if (路径 === '/Home/Forum/doReplyThread.html') { 回复成功(); } else { 未知(); }
      break
    default:
      未知();
  }

}($));
