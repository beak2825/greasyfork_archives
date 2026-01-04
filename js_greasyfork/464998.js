// ==UserScript==
// @name         誠也の部屋 Dark Theme
// @description  誠也の部屋 Dark Theme になる
// @namespace    https://github.com/huihuimoe
// @home         https://huihui.cat/snippets/3
// @version      0.3.4
// @author       huihuimoe
// @match        https://seiya-saiga.com/*
// @match        https://galge.seiya-saiga.com/*
// @exclude      https://seiya-saiga.com/cgi/joyful/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/464998/%E8%AA%A0%E4%B9%9F%E3%81%AE%E9%83%A8%E5%B1%8B%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/464998/%E8%AA%A0%E4%B9%9F%E3%81%AE%E9%83%A8%E5%B1%8B%20Dark%20Theme.meta.js
// ==/UserScript==

; (function () {
  'use strict'

  console.log('Dark theme loaded.')

  const style = `
    body {
      background: #000;
      color: #fff;
    }

    [bgcolor="#ccffff"], [bgcolor="#ffffcc"] {
      color: #000;
    }

    a {
      text-decoration: none;
      color: #66c0f4 !important;
    }

    .a:focus {
      outline: 0px none;
    }

    a:hover {
      text-decoration: none;
      color: #ccc !important;
    }

    table.table_hover tr:hover td {
      background: #666 !important;
    }

    [bgcolor="#ffffff"] {
      background: #000 !important;
    }

    table[background="image/back.gif"] {
      background: transparent !important;
    }

    font[color="#0000ff"] {
      color: #66c0f4;
    }

    font[color="#660000"] {
      color: #AAFFFF;
    }

    /* ア カ サ タ ナ ハ マ ヤ・ラ・ワ */
    body > div > table > tbody > tr > th > table:nth-child(6) > tbody > tr > th > font > a:link{
      color: #0000FF !important;
    }
    body > div > table > tbody > tr > th > table:nth-child(6) > tbody > tr > th > font > a:visited{
      color: #0000FF !important;
    }
    body > div > table > tbody > tr > th > table:nth-child(6) > tbody > tr > th > font > a:hover{
      color: red !important;
    }
  `;
  GM_addStyle(style);

  // remove disable selection and context menu
  window.addEventListener('DOMContentLoaded', function () {
    document.body.removeAttribute('oncontextmenu');
    document.body.removeAttribute('onselectstart');
  });
})()
