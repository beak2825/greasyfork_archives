// ==UserScript==
// @name         ChatGPT适应2K显示器
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  让ChatGPT适应2K显示器
// @author       zxbiubiubiu
// @license MIT
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485614/ChatGPT%E9%80%82%E5%BA%942K%E6%98%BE%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485614/ChatGPT%E9%80%82%E5%BA%942K%E6%98%BE%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`
          @media (min-width: 1280px) {
            .xl\\:max-w-\\[48rem\\] {
                max-width: 120rem !important;
            }
        }

         @media (min-width: 1280px) {
           .xl\\:max-w-3xl {
    max-width: 120rem;
    width: calc(100% - 115px);
    margin: 0 auto;
    padding-left: 56px;
    padding-right: 100px;
}
        }

@media (min-width: 768px){
.dark .md\\:dark\\:border-transparent {
    border-color: transparent;
    padding-left: 1rem;
    padding-right: 1rem;
}
}

.dark\:text-gray-300{
 display:none;
}



    `);







    // Your code here...
})();