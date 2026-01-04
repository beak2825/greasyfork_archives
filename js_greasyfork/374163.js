// ==UserScript==
// @name         Hi, Google Translate, don't translate here (*)
// @name:zh-CN   Hi, 谷歌翻译，不要翻译代码块 (*)
// @namespace    https://github.com/xianghongai/Tampermonkey-UserScript
// @version      1.0.2
// @description  Google Translate, don't translate code
// @description:zh-CN   谷歌翻译不翻译代码块
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        http*://*/*
// @exclude      *://localhost:*
// @exclude      *://127.0.0.1:*
// @exclude      *://10.*
// @exclude      *://172.*
// @exclude      *://192.*
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/374163/Hi%2C%20Google%20Translate%2C%20don%27t%20translate%20here%20%28%2A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/374163/Hi%2C%20Google%20Translate%2C%20don%27t%20translate%20here%20%28%2A%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // disable in iframe
  if (window.top !== window) {
    return;
  }

  const ignoreSites = [];
  const ignorePages = []; // https://foo.bar/qux/*

  function notranslate() {
    const preEles = [
      ...document.querySelectorAll('pre'),
      ...document.querySelectorAll('code'),
      // https://formatjs.io
      ...document.querySelectorAll('.prism-code'),
      // https://nodejs.org
      ...document.querySelectorAll('a.type'),
      // https://www.wolframalpha.com/
      ...document.querySelectorAll('.example-wrap'),
      // https://www.typescriptlang.org/
      ...document.querySelectorAll(
        '#handbook-content h2, .handbook-toc, #sidebar'
      ),
      // ... 您懂得
    ];

    preEles.forEach((tiem) => {
      tiem.classList.add('notranslate');
      tiem.setAttribute('translate', 'no');
    });
  }

  function createStyleSheet() {
    const style = `
        .google-translate__no {
          position: fixed;
          right: 10px;
          bottom: 10px;
          z-index: 999;
          cursor: pointer;
          margin: 0;
          padding: 0;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
        }
        .google-translate__no svg {
          width: 18px;
          height: 18px;
        }
        `;

    // DEPRECATED!
    // const headEle = document.head || document.getElementsByTagName('head')[0];
    // const styleEle = document.createElement('style');
    // styleEle.type = 'text/css';
    // if (styleEle.styleSheet) {
    //     styleEle.styleSheet.cssText = style;
    // } else {
    //     styleEle.appendChild(document.createTextNode(style));
    // }
    // headEle.appendChild(styleEle);

    GM_addStyle(style);
  }

  function createElement() {
    const icon = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
          <defs>
            <clipPath id="clip-translate">
              <rect width="32" height="32"/>
            </clipPath>
          </defs>
          <g id="translate" clip-path="url(#clip-translate)">
            <path id="Untitled-1" d="M59.056,103.379l-3.507-3.466.041-.041a24.19,24.19,0,0,0,5.122-9.016h4.045V88.095H55.093V85.333H52.332v2.761H42.667v2.761H58.089a21.768,21.768,0,0,1-4.377,7.387,21.6,21.6,0,0,1-3.189-4.625H47.762a24.248,24.248,0,0,0,4.115,6.3l-7.028,6.931,1.961,1.961,6.9-6.9,4.294,4.294,1.049-2.817m7.773-7H64.068l-6.213,16.569h2.761l1.546-4.142h6.558l1.56,4.142h2.761L66.829,96.379m-3.617,9.665,2.237-5.978,2.237,5.978H63.212Z" transform="translate(-41.667 -83.333)"/>
          </g>
        </svg>
        `;

    // DEPRECATED!
    // const bodyContainer = document.querySelector("body");
    // const ele = document.createElement('span');
    // ele.setAttribute('title', `Hi, Google Translate, don't translate here`)
    // ele.classList.add('google-translate__no');
    // ele.innerHTML = icon;
    // bodyContainer.appendChild(ele);

    GM_addElement(document.querySelector('body'), 'span', {
      title: `Hi, Google Translate, don't translate here`,
      class: 'google-translate__no',
    });

    const ele = document.querySelector('.google-translate__no');
    ele.innerHTML = icon;
  }

  // 有的站点不生效，需要手动触发
  function manual() {
    const ele = document.querySelector('.google-translate__no');

    ele.addEventListener('click', () => {
      notranslate();
    });
  }

  function main() {
    const currentSite = location.origin;
    const currentPage = location.href;

    const isIgnoreSite = ignoreSites.some((item) =>
      `${currentSite}`.startsWith(`${item}`)
    );

    const isIgnorePage = ignorePages.some((item) => {
      if (`${item}`.endsWith('*')) {
        return `${currentPage}`.startsWith(`${item}`.slice(0, -1));
      }
      return `${currentPage}`.startsWith(`${item}`);
    });

    if (isIgnoreSite || isIgnorePage) {
      return;
    }

    createStyleSheet();
    createElement();
    manual();
    notranslate();
  }

  main();
})();
