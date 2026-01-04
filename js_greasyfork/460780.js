// ==UserScript==
// @name discord 消息标红
// @namespace lm
// @version 1.0.8
// @description 新消息标红
// @author lm
// @license LGPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/460780/discord%20%E6%B6%88%E6%81%AF%E6%A0%87%E7%BA%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460780/discord%20%E6%B6%88%E6%81%AF%E6%A0%87%E7%BA%A2.meta.js
// ==/UserScript==

(function() {
let css = `
  .item-2LIpTv{

    background-color:red!important;

    width: 15px!important;
  }

  .unread-36eUEm{
    width: 15px!important;
  }

  .unreadRelevant-2f-VSK{
    background-color:red!important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
