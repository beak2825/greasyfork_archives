// ==UserScript==
// @name Block the community 墙外弱智吧联盟 on the Twitter/X
// @namespace x.com
// @version 1.0.0
// @description 屏蔽 Twitter/X 上的 墙外弱智吧联盟 社群
// @author LukeNewNew
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/529355/Block%20the%20community%20%E5%A2%99%E5%A4%96%E5%BC%B1%E6%99%BA%E5%90%A7%E8%81%94%E7%9B%9F%20on%20the%20TwitterX.user.js
// @updateURL https://update.greasyfork.org/scripts/529355/Block%20the%20community%20%E5%A2%99%E5%A4%96%E5%BC%B1%E6%99%BA%E5%90%A7%E8%81%94%E7%9B%9F%20on%20the%20TwitterX.meta.js
// ==/UserScript==

(function() {
let css = `.css-175oi2r[data-testid="cellInnerDiv"]:has([href="/i/communities/1723286568683913463"]) {
	display: none
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
