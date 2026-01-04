// ==UserScript==
// @name         page view optimize - "esdoc"
// @namespace    https://xianghongai.github.io/
// @version      0.0.1
// @description  I love esdoc!
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        https://esdoc.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441601/page%20view%20optimize%20-%20%22esdoc%22.user.js
// @updateURL https://update.greasyfork.org/scripts/441601/page%20view%20optimize%20-%20%22esdoc%22.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  const style = `
#all-tags+ul {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 9;
  background: white;
  list-style: none;
  overflow-y: auto;
  bottom: 0;
  width: 200px;
  box-shadow: -1px 0 10px rgba(0,0,0,.1);
  box-sizing: border-box;
}
#all-tags + ul li {
  list-style: none;
}
#all-tags + ul ul {
}
#all-tags + ul ul {
  padding-left: 0;
}
#all-tags + ul > li:first-child {
  margin-top: 20px;
}
#all-tags + ul>li>a {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}
#all-tags + ul > li {
  margin-top: 10px;
}
body > .content {
  padding-right: 220px;
}
#all-tags + ul > li:last-child {
  margin-bottom: 50px;
}
`;

  GM_addStyle(style);

  function initial(style) {
    let headEle = document.head || document.getElementsByTagName('head')[0];
    let styleEle = document.createElement('style');

    styleEle.type = 'text/css';

    if (styleEle.styleSheet) {
      styleEle.styleSheet.cssText = style;
    } else {
      styleEle.appendChild(document.createTextNode(style));
    }

    headEle.appendChild(styleEle);
  }

  // initial(style);
})();
