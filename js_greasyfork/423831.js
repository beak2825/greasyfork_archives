// ==UserScript==
// @name        pyonpyon slack
// @description   make slack avater jumping
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/*
// @grant    GM_addStyle
// @inject-into content
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/423831/pyonpyon%20slack.user.js
// @updateURL https://update.greasyfork.org/scripts/423831/pyonpyon%20slack.meta.js
// ==/UserScript==

GM_addStyle(`
  @keyframes pyonpyon {
    0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }
    10%  { transform: scale(1.1, 0.9) translate(0%, 5%); }
    40%  { transform: scale(1.2, 0.8) translate(0%, 15%); }
    50%  { transform: scale(1.0, 1.0) translate(0%, 0%); }
    60%  { transform: scale(0.9, 1.2) translate(0%, -50%); }
    75%  { transform: scale(0.9, 1.2) translate(0%, -10%); }
    85%  { transform: scale(1.2, 0.8) translate(0%, 15%); }
    100% { transform: scale(1.0, 1.0) translate(0%, 0%); }
  }
  .c-avatar {
    animation: 1s linear infinite pyonpyon;
  }
  .c-virtual_list__item:nth-of-type(10n) .c-avatar { animation-delay: -0.2s; } 
  .c-virtual_list__item:nth-of-type(10n+1) .c-avatar { animation-delay: -0.6s; } 
  .c-virtual_list__item:nth-of-type(10n+2) .c-avatar { animation-delay: -0.4s; } 
  .c-virtual_list__item:nth-of-type(10n+3) .c-avatar { animation-delay: -0.2s; } 
  .c-virtual_list__item:nth-of-type(10n+4) .c-avatar { animation-delay: -0.8s; } 
  .c-virtual_list__item:nth-of-type(10n+5) .c-avatar { animation-delay: -0.4s; } 
  .c-virtual_list__item:nth-of-type(10n+6) .c-avatar { animation-delay: -0.0s; } 
  .c-virtual_list__item:nth-of-type(10n+7) .c-avatar { animation-delay: -0.6s; } 
  .c-virtual_list__item:nth-of-type(10n+8) .c-avatar { animation-delay: -0.4s; } 
  .c-virtual_list__item:nth-of-type(10n+9) .c-avatar { animation-delay: -0.0s; } 
`);
