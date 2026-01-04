// ==UserScript==
// @name         OpenAI Chat Old Colors
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bring back the old colors/style in OpenAI Chat
// @author       Clavilux
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486909/OpenAI%20Chat%20Old%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/486909/OpenAI%20Chat%20Old%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customStyles = `

:root   {
--gray-900: #000;
--gray-700: #3f3f4b;
--gray-800: #343541;
}

.items-start {
  margin-left: 5.90px;
}

.dark.bg-gray-950.rounded-md {
   background-color: black;
}


    `;

  const cred = document.createElement('div');
  cred.textContent = 'ChatGPT Old Style by Clavilux';
  cred.style.fontSize = '6px';
  cred.style.color = '#888';
  cred.style.position = 'fixed';
  cred.style.bottom = '5px';
  cred.style.right = '5px';
  document.body.appendChild(cred);

    GM_addStyle(customStyles);
})();