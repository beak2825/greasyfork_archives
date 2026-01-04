// ==UserScript==
// @name         Fix Scroll Issue
// @namespace    https://example.com
// @version      1.0
// @description  Fix Scroll Issue within ChatGPT webpage
// @author       Murzik
// @match        https://chatgpt.com/*
// @inject-into  auto
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523871/Fix%20Scroll%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/523871/Fix%20Scroll%20Issue.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.innerHTML = `
  .composer-parent>.flex-1>div>div>div {
    height: 100%;
    overflow: auto;
  }
`;
document.head.appendChild(style);