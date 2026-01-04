// ==UserScript==
// @license MIT
// @name         admin-panel platforms page filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  admin-panel platforms page filter desc
// @author       bo.zhao
// @include      *://dashboard.*.axinan.com/*
// @include      *://dashboard.axinan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=axinan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495230/admin-panel%20platforms%20page%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/495230/admin-panel%20platforms%20page%20filter.meta.js
// ==/UserScript==

(function () {

  function extractSubString(str) {
    var match = str.match(/\/([^\/]+)\.svg$/); // 匹配以 '/' 开头、以 '.svg' 结尾的子字符串
    if (match && match.length > 1) {
      return match[1]; // 返回匹配的结果（第一个捕获组）
    } else {
      return null; // 如果没有匹配到，返回 null
    }
  }
  function filter(keyword = '') {
    var wrap = document.querySelector('[class*="platforms"]');
    return Array.from(wrap.children)
      .filter(ele => {
        const iglooPlatformNameNode = ele.querySelector('.igloo-platform-name')
        const iglooImageNode = ele.querySelector('.ant-image-img')
        const name = iglooPlatformNameNode
          ? iglooPlatformNameNode.innerText
          : extractSubString(iglooImageNode.getAttribute('src'))

        const keywordLowercase = keyword.toLowerCase();
        const filtered = keywordLowercase && name.toLowerCase().includes(keywordLowercase);
        if (filtered) {
          ele.classList.add('platform-highlight');
        } else {
          ele.classList.remove('platform-highlight');
          ele.classList.remove('platform-highlight-focus');
        }
        return filtered;
      });
  }

  function insertCSS(cssProperties) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssProperties;
    document.head.appendChild(style);
  }

  function isPagePlatforms() {
    return location.pathname === '/platforms';
  }

  function focusDiv (divList, index) {
    const fDiv = divList[index];
    fDiv.classList.add('platform-highlight-focus');
    fDiv.scrollIntoView({
      behavior: 'smooth',
    });
    [...divList].forEach(d => {
      if (d !== fDiv) {
        d.classList.remove('platform-highlight-focus');
      }
    });
  }

  insertCSS(`
  .platform-highlight {
    border: 4px solid #ea9daa;
  }
  .platform-highlight-focus {
    border: 6px solid #c13d60;
  }
`)


  const div = document.createElement('div');
  Object.assign(div.style, {
    position: 'fixed',
    right: '0',
    top: '0',
    zIndex: 9999,
  });
  const input = document.createElement('input');
  div.appendChild(input);

  const span = document.createElement('span');
  div.appendChild(span);

  var keyword = '';

  window.addEventListener('keyup', (e) => {
    if (e.code.toLowerCase() === 'slash' && isPagePlatforms()) {
      document.body.appendChild(div)
      input.focus();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code.toLowerCase() === 'escape' && isPagePlatforms()) {
      input.value = '';
      div.remove();
      filter();
    }
  });

  input.addEventListener('input', (e) => {
    if (!isPagePlatforms()) return;
    keyword = e.target.value;
    const list = filter(keyword);
    if (list.length > 0) {
      focusDiv(list, 0);
      span.innerText = `1/${list.length}`;
    } else {
      span.innerText = `0`;
    }
  });

  input.addEventListener('keyup', e => {
    const isPressEnterKey = ['numpadenter', 'enter'].includes(e.code.toLowerCase());
    if (isPressEnterKey && isPagePlatforms()) {
      const list = document.querySelectorAll('.platform-highlight');
      if (list.length) {
        const index = Number(document.documentElement.dataset.focusIndex ?? 1);
        const maxIndex = list.length - 1;
        focusDiv(list, index);
        document.documentElement.dataset.focusIndex = index + 1 > maxIndex ? 0 : index + 1;
        span.innerText = `${index + 1}/${list.length}`;
      }
    }
  })
})();