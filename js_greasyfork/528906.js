// ==UserScript==
// @name          Atalho GPT
// @description   Um atalho para o ChatGPT
// @namespace     CowanGPT
// @license       GPL-3.0
// @version       3.0
// @author        Cowanbas
// @match         *://*/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/528906/Atalho%20GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/528906/Atalho%20GPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.bottom = '15px';
    button.style.left = '17px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.padding = '0';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.7';
    button.style.zIndex = '1000';
    button.style.width = '30px';
    button.style.height = '30px';

    var icon = document.createElement('div');
    icon.innerHTML = `<svg height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 21.6C6.70514 21.6 2.4 17.2949 2.4 12C2.4 6.70514 6.70514 2.4 12 2.4C17.2949 2.4 21.6 6.70514 21.6 12C21.6 17.2949 17.2949 21.6 12 21.6Z" fill="#6E6E6E"/>
      <path d="M12 4.8C8.68629 4.8 6 7.48629 6 10.8C6 14.1137 8.68629 16.8 12 16.8C15.3137 16.8 18 14.1137 18 10.8C18 7.48629 15.3137 4.8 12 4.8ZM12 15.6C9.34822 15.6 7.2 13.4518 7.2 10.8C7.2 8.14822 9.34822 6 12 6C14.6518 6 16.8 8.14822 16.8 10.8C16.8 13.4518 14.6518 15.6 12 15.6Z" fill="#6E6E6E"/>
    </svg>`;
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.style.borderRadius = '50%';
    icon.style.overflow = 'hidden';

    button.appendChild(icon);

    button.onclick = function() {
        var width = 500;
        var height = 500;
        var left = window.screenX + button.getBoundingClientRect().left;
        var top = window.screenY + button.getBoundingClientRect().top;
        window.open('https://chat.openai.com/', 'Chat GPT', `width=${width},height=${height},top=${top},left=${left}`);
    };

    document.body.appendChild(button);

    button.onmouseover = function() {
        button.style.opacity = '1';
    };

    button.onmouseout = function() {
        button.style.opacity = '0.7';
    };
})();
