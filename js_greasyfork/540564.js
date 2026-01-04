// ==UserScript==
// @name Replace SimSun/SimHei with PingFang SC
// @namespace softforum
// @version 1.2
// @description Redirect SimSun, 宋体, Songti SC, SimHei, 黑体, and Heiti SC to PingFang SC
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include http://*/*
// @include https://*/*
// @downloadURL https://update.greasyfork.org/scripts/540564/Replace%20SimSunSimHei%20with%20PingFang%20SC.user.js
// @updateURL https://update.greasyfork.org/scripts/540564/Replace%20SimSunSimHei%20with%20PingFang%20SC.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

    @font-face {
        font-family: "SimSun";
        src: local("PingFang SC");
    }

    @font-face {
        font-family: "宋体";
        src: local("PingFang SC");
    }

    @font-face {
        font-family: "Songti SC";
        src: local("PingFang SC");
    }

    @font-face {
        font-family: "SimHei";
        src: local("PingFang SC");
    }

    @font-face {
        font-family: "黑体";
        src: local("PingFang SC");
    }

    @font-face {
        font-family: "Heiti SC";
        src: local("PingFang SC");
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
