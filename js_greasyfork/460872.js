// ==UserScript==
// @name Clean Douyu
// @namespace joyhooian.styles.douyu
// @version 0.1
// @description cleaner Douyu
// @author joyhooian
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www.douyu.com/[0-9]+)$/
// @downloadURL https://update.greasyfork.org/scripts/460872/Clean%20Douyu.user.js
// @updateURL https://update.greasyfork.org/scripts/460872/Clean%20Douyu.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    overflow-y: hidden;
}

aside {
    display: none;
}

#js-bottom {
    display: none;
}

#js-player-toolbar {
    visibility: hidden !important;
}

#js-player-title {
    display: none;
}

#js-player-aside-state {
    display: none;
}

main.layout-Main {
    margin-left: 0!important;
    padding-left: 144px!important;
    padding-right: 144px!important;
    bottom: 0px!important;
}

section.layout-Container {
    margin-top: 88px;
    height: calc(200vh - 60px);
}

div.layout-Player-rank {
    display: none;
}

div.layout-Player-rankAll {
    display: none;
}

div.layout-Player-announce {
    display: none;
}

div.layout-Player-barrage {
    top: 0;
}

.layout-Player-asideMain {
    bottom: 88px;
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
