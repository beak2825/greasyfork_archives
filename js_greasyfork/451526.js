// ==UserScript==
// @name www.onelook.com - 2022/9/17 19:40:48
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.onelook.com/*
// @downloadURL https://update.greasyfork.org/scripts/451526/wwwonelookcom%20-%202022917%2019%3A40%3A48.user.js
// @updateURL https://update.greasyfork.org/scripts/451526/wwwonelookcom%20-%202022917%2019%3A40%3A48.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    table:first-of-type,[alt="OneLook"],br:first-of-type,font,#fb2{
        display:none;
    }
    #olform{
    margin: 0; 
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
