// ==UserScript==
// @name make niconico user page great again
// @namespace rinsuki.net
// @version 1.0.1
// @description A new userstyle
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match https://www.nicovideo.jp/my*
// @match https://www.nicovideo.jp/user/*
// @downloadURL https://update.greasyfork.org/scripts/415513/make%20niconico%20user%20page%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/415513/make%20niconico%20user%20page%20great%20again.meta.js
// ==/UserScript==

(function() {
let css = `
    .UserPage-main {
        width: 1024px;
        padding-right: 16px;
    }
    .UserDetailsHeader {
        width: 1024px;
    }
    .MainMenuContainer-menuList {
        padding-right: 0;
        width: 1024px;
    }
    .UserPageHeader-inner {
        width: 1024px;
    }
    .HeaderContainer_Re-ad {
        display: none;
    }
    .RightSideContainer {
        display: none;
    }
    .UserDetailsHeader-body {
        flex: 1;
        width: inherit;
    }
    .PageTopButtonContainer {
        width: 1024px !important;
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
