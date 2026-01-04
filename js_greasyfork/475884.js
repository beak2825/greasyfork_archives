// ==UserScript==
// @name         StarterStory no member
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  StarterStory屏蔽用户注册
// @author       You
// @match        https://www.starterstory.com/*
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/475884/StarterStory%20no%20member.user.js
// @updateURL https://update.greasyfork.org/scripts/475884/StarterStory%20no%20member.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    body.modal-open::before {
     content: none
    }
` );
    document.querySelector('#basicCustomOptinModal')?.remove();
    document.querySelector('#registrationWallModal')?.remove();
})();