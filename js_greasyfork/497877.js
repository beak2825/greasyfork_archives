// ==UserScript==
// @name        linux.do去模糊
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description 去模糊
// @author       ddatsh
// @match        https://linux.do/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=linux.do
// @downloadURL https://update.greasyfork.org/scripts/497877/linuxdo%E5%8E%BB%E6%A8%A1%E7%B3%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/497877/linuxdo%E5%8E%BB%E6%A8%A1%E7%B3%8A.meta.js
// ==/UserScript==

GM_addStyle ( `
    .spoiler-blurred {
        filter: none !important;
    }
  .spoiler-blurred img{
        filter: none !important;
    }
` );
