// ==UserScript==
// @name         直接跳转文本链接（支持异步加载和 Shadow DOM）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  自动识别文本中的 URL 并将其转为可点击的链接，支持异步加载和 Shadow DOM
// @author       cunshao
// @match        *://*/*
// @exclude      https://greasyfork.org/*
// @grant        none
// @license No License
// @downloadURL https://update.greasyfork.org/scripts/510090/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%EF%BC%88%E6%94%AF%E6%8C%81%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BD%E5%92%8C%20Shadow%20DOM%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510090/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%EF%BC%88%E6%94%AF%E6%8C%81%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BD%E5%92%8C%20Shadow%20DOM%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 你的原始逻辑保持不变
  function removeDuplicates(arr) {
    return arr.filter((item, index, self) => self.indexOf(item) === index);
  }

  function traverseArrayBackward(arr, callback) {
    for (let i = arr.length - 1; i >= 0; i--) {
      callback(arr[i], i, i === 0);
    }
  }

  function getTextLinks(text) {
    const linkRegex = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
    const links = text.match(linkRegex);
    return links || [];
  }

  function getTextLinksList(text) {
    const linkRegex = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
    const hostRegex = /\b(?!\/\/)((?:www\.)?[a-zA-Z0-9_.-]+(?:\.[a-zA-Z0-9_.-]+)*\.[a-zA-Z]{2,})\b/g;
    let newText = text;

    function matchFunc(reg, type) {
      const matches = newText.matchAll(reg);
      const matchArr = [];
      for (const match of matches) {
        const matchStr = match[0];
        const len = matchStr.length;
        newText = newText.replace(matchStr, ' '.repeat(len));
        match.type = type;
        matchArr.push(match);
      }
      return matchArr;
    }
    return [...matchFunc(linkRegex, 'url'), ...matchFunc(hostRegex, 'host')];
  }

  function splitText(text, arr) {
    if (!arr.length) return [{ text, type: 'text' }];

    let lastIndex = 0;
    let returnArr = [];

    arr.forEach((item, i) => {
      const link = item[0];
      const textObj = { text: text.slice(lastIndex, item.index), type: 'text' };
      const linkObj = { text: link, type: 'link' };

      returnArr.push(textObj, linkObj);
      lastIndex = item.index + link.length;

      if (i === arr.length - 1 && lastIndex < text.length) {
        returnArr.push({ text: text.slice(lastIndex), type: 'text' });
      }
    });
    return returnArr;
  }

  function createLink(link) {
    const a = document.createElement("a");
    a.href = link.startsWith('http') ? link : 'https://' + link;
    a.textContent = link;
    a.target = "_blank";
    a.rel = 'noopener noreferrer nofollow';
    return a;
  }

  function createTextNode(text) {
    const textNode = document.createTextNode(text);
    return textNode;
  }

  function createNode(type, text) {
    switch (type) {
      case 'link':
        return createLink(text);
      case 'text':
        return createTextNode(text);
      default:
        throw new Error('Invalid type');
    }
  }

  const excludeList = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'];

  function createTextNodeTree(matchObj = {}, node, parent) {
    if (node.nodeType === 3 && !excludeList.includes(parent.nodeName)) {
      const textContent = node.textContent;
      let matches = getTextLinks(textContent);
      matches.forEach((match) => {
        if (matchObj[match] && matchObj[match].length > 0) {
          matchObj[match].push(node);
        } else {
          matchObj[match] = [node];
        }
      });
    }

    if (node.shadowRoot) {
      const shadowRoot = node.shadowRoot;
      for (const shadowRootChild of shadowRoot.childNodes) {
        createTextNodeTree(matchObj, shadowRootChild, shadowRoot);
      }
    }
    for (let child of node.childNodes) {
      createTextNodeTree(matchObj, child, node);
    }

    return matchObj;
  }

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  function callback() {
    const matchObj = createTextNodeTree({}, document.body, null);
    for (const match in matchObj) {
      if (Object.hasOwnProperty.call(matchObj, match)) {
        const nodeList = removeDuplicates(matchObj[match]);
        nodeList.forEach((node) => {
          const generateNodeList = splitText(node.textContent, getTextLinksList(node.textContent));
          traverseArrayBackward(generateNodeList, ({ type, text }, i, isLast) => {
            try {
              const newNode = createNode(type, text);
              if (isLast) {
                node.parentNode.replaceChild(newNode, node);
              } else if (node.nextSibling) {
                node.parentNode.insertBefore(newNode, node.nextSibling);
              } else {
                node.parentNode.appendChild(newNode);
              }
            } catch (error) {
              console.error(error);
            }
          });
        });
      }
    }
  }

  // 保证页面加载后尽快执行
  function runWhenReady() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      callback();
    } else {
      window.addEventListener('DOMContentLoaded', callback);
    }

    // 确保异步加载的内容也会被处理
    let observer = new MutationObserver(debounce(callback, 300));
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });
  }

  // 尽早执行脚本
  runWhenReady();
})();
