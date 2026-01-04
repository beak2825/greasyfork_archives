// ==UserScript==
// @name shiwehi.com - 2022/8/28 19:27:32
// @namespace github.com/openstyles/stylus
// @version 1.0.2
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match https://shiwehi.com/tools/wordsearch/*
// @downloadURL https://update.greasyfork.org/scripts/450326/shiwehicom%20-%202022828%2019%3A27%3A32.user.js
// @updateURL https://update.greasyfork.org/scripts/450326/shiwehicom%20-%202022828%2019%3A27%3A32.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    #header,
    #search_modes,
    .tabs-back,
    .description,
    #shuffle,
    #download,
    .word-delete
 {
        display: none;
    }
    #result-list{
       flex-wrap: wrap;
       display: flex;
    }
    #result{
        font-weight:bold;
    }
    ul,li{
        margin: 0 15px;
        margin-bottom:10px;
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
