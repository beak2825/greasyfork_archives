// ==UserScript==
// @name         WxreadSidenav
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  alter weread css
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hkanime.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466856/WxreadSidenav.user.js
// @updateURL https://update.greasyfork.org/scripts/466856/WxreadSidenav.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.__WxreadSidenav__ = {
    Element: {}
  };
  const getControls = () => document.querySelector("#routerView > div.readerControls.readerControls");
  const getCatalog = () => document.querySelector("#routerView > div:nth-child(5) > div.readerCatalog");
  const getNotePanel = () => document.querySelector("#routerView > div:nth-child(6) > div.readerNotePanel");
  const setStyle = (ele, obj) => {
    const STYLE = 'style';
    const styleArr = [];
    const arr = Object.entries(obj);

    for (const [key, val] of arr) {
      styleArr.push(`${key}:${val};`);
    }

    window.__WxreadSidenav__.Element.readerControls = ele;
    let styleStr = ele.getAttribute(STYLE);
    styleStr += styleArr.join('');
    ele.setAttribute(STYLE, styleStr);
  };
  const loadCssCode = (code) => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    try {
      //for Chrome Firefox Opera Safari
      style.appendChild(document.createTextNode(code));
    } catch (ex) {
      //for IE
      style.styleSheet.cssText = code;
    }
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  function alterControls() {
    const ele = getControls();
    setStyle(ele, {
      left: 'auto',
      right: '16px'
    });
  }

  function alterCatalog() {
    const ele = getCatalog();
    setStyle(ele, {
      left: 'auto',
      right: 0
    });
  }

  function alterNotePanel() {
    const ele = getNotePanel();
    setStyle(ele, {
      left: 'auto',
      right: 0
    });
  }

  function main() {
    console.info('Hello WxreadSidenav!');
    alterControls();
    alterCatalog();
    alterNotePanel();

    loadCssCode([
      `.readerControls_fontSize.expand {
        width: 200px;transform: translateX(-152px);
      }`,
      `.readerControls_fontSize {
        display: flex;
        flex-direction: row;
        align-items: center;
        transition: background-color .2s ease-in-out,width .15s ease-in-out,transform .15s ease-in-out;
        overflow: hidden;
      }`
    ].join(''));
  }

  window.onload = function() {
    main();
    // setTimeout(() => main(), 2 * 1000);
  };
})();