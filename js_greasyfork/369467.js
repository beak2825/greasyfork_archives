// ==UserScript==
// @name         火猫屏蔽聊天栏
// @namespace    https://github.com/southhill/huomao-live-greasy-script
// @version      0.0.2
// @description  聊天需要脑子，可惜火猫直播带脑子发言的不多
// @author       Cao
// @match        *://www.huomao.com/*
// @downloadURL https://update.greasyfork.org/scripts/369467/%E7%81%AB%E7%8C%AB%E5%B1%8F%E8%94%BD%E8%81%8A%E5%A4%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/369467/%E7%81%AB%E7%8C%AB%E5%B1%8F%E8%94%BD%E8%81%8A%E5%A4%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('.chat-bigbox-warp').style.display = 'none'
})();