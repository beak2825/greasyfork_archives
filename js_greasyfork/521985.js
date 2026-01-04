// ==UserScript==
// @name         PDManager
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Lier PDManager MyDstny
// @author       Clément Bahuaud
// @match        https://psm.mydstny.fr/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521985/PDManager.user.js
// @updateURL https://update.greasyfork.org/scripts/521985/PDManager.meta.js
// ==/UserScript==

(function() {

const targetElements = document.querySelectorAll('td.col-sm-6.col-md-6');
targetElements.forEach(targetElement => {
  const contentSpan = targetElement.querySelector('span.js-copyable-content');
  if (contentSpan) { // Check if contentSpan exists
    const content = contentSpan.textContent.trim();
    const url = `https://pdm.as48504.net/mng-edit.php?username=${content}`;
    const link = document.createElement('a');
    link.href = url;
    link.textContent = content;
    link.target = '_blank';
    contentSpan.innerHTML = '';
    contentSpan.appendChild(link);
  }
});

}

)();