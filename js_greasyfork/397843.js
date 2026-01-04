// ==UserScript==
// @name         jira快速复制分支名，编号+标题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提供在 jira 下快速复制自定义分支名与编号+标题格式的快捷操作
// @author       ydythebs
// @include      https://jira.*.me/browse/*
// @require
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397843/jira%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%88%86%E6%94%AF%E5%90%8D%EF%BC%8C%E7%BC%96%E5%8F%B7%2B%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/397843/jira%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E5%88%86%E6%94%AF%E5%90%8D%EF%BC%8C%E7%BC%96%E5%8F%B7%2B%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  // common

  const formatStyle = (style) => {
    const keys = Object.keys(style);
    const formatKey = (key) => {
      const reg = /[A-Z]/g;
      const result = key
        .split('')
        .map((char) => (reg.test(char) ? `-${char.toLowerCase()}` : char));
      return result.join('');
    };
    let result = '';
    keys.map((key) => {
      const val = style[key];
      const label = formatKey(key);
      result += `${label}:${val};`;
    });
    return result;
  };
  const createElement = (tagName, opts = {}) => {
    const node = document.createElement(tagName);
    const { className, text, style, children } = opts;
    className && (node.className = className);
    text && (node.innerText = text);
    style && (node.style = formatStyle(style));
    if (children && children.length) {
      for (let i in children) {
        node.appendChild(children[i]);
      }
    }
    return node;
  };

  const copyContext = (text) => {
    const body = document.querySelector('body');
    const input = document.createElement('input');
    input.value = text;
    body.appendChild(input);
    input.select();
    document.execCommand('copy');
    body.removeChild(input);
  };
  const addBtnState = (node, activeClassName) => {
    node.classList.add(activeClassName);
    setTimeout(() => {
      node.classList.remove(activeClassName);
    }, 300);
  };
  // common end

  const branchNameBtn = createElement('button', {
    className: 'aui-button',
    text: '复制默认branch name',
  });
  const titleBtn = createElement('button', {
    className: 'aui-button',
    text: '复制标题',
  });

  branchNameBtn.addEventListener('click', () => {
    const numberNode = document.querySelector(
      '.aui-nav-breadcrumbs .issue-link'
    );
    const versionNode = document.querySelector('#versions-val');
    const version = versionNode.innerText;
    const text = `feature/${version && version.substr(1)}/${
      numberNode.innerText
    }`;
    copyContext(text);
    addBtnState(branchNameBtn, 'active');
  });
  titleBtn.addEventListener('click', () => {
    const numberNode = document.querySelector(
      '.aui-nav-breadcrumbs .issue-link'
    );
    const title = document.querySelector('#summary-val');
    const text = numberNode.innerText + title.innerText;
    copyContext(text);
    addBtnState(titleBtn, 'active');
  });

  const headerToolBar = document.querySelector('.saved-search-selector');
  const customWrapper = createElement('div', {
    children: [branchNameBtn, titleBtn],
    style: {
      margin: '14px 14px',
    },
  });

  headerToolBar.appendChild(customWrapper);
})();
