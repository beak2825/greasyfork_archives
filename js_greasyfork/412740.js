// ==UserScript==
// @name         21tiku print
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  方便打印21世纪题库!
// @author       wei
// @match        http://tiku.21cnjy.com/paper/*.html
// @match        http://tiku.21cnjy.com/tiku.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412740/21tiku%20print.user.js
// @updateURL https://update.greasyfork.org/scripts/412740/21tiku%20print.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style')

  style.innerHTML = `
  @media print {
  body > div:not(.content),#totop, #topbar, #logo_area, #nav, #footer, .sus_nav, .shijuan_more, .shiti .btns, .shiti_container .btns,.shiti > div[style], .catagory.shiti_top {
    display: none !important;
  }
  .content {
    width: 715px;
    padding-left: 32px;
  }
  .content > *:not(.shiti_container) {
    display: none;
  }
  .shijuan, .shiti {
    width: 100%;
    border: none;
  }
  .shiti {
    display: list-item;
    list-style-type: decimal;
    list-style-position: outside;
    overflow: visible;
    padding-left: 0;
    padding-right: 0;
  }
  .shijuan .label {
    display: none;
  }
  .shijuan b {
    white-space: nowrap;
    display: block;
    overflow: hidden;
  }
  .shijuan_detail {
    width: 100%;
    float: none;
    font-size: 16px;
    padding: 0;
  }
  .shiti table {
    font-size: 16px;
  }
  .shijuan_detail, .shiti_answer {
    border: none;
  }
  div, p {
    box-sizing: border-box;
  }
}
  `

  document.head.appendChild(style)
})();