// ==UserScript==
// @name [docs.unity3d & local] Unity Black - a dark theme with JS/C# syntax highlighting css
// @namespace https://greasyfork.org/en/users/10118-drhouse
// @version 1.0
// @description for use with [docs.unity3d & local] Unity Black - css style
// @author drhouse
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/392218/%5Bdocsunity3d%20%20local%5D%20Unity%20Black%20-%20a%20dark%20theme%20with%20JSC%20syntax%20highlighting%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/392218/%5Bdocsunity3d%20%20local%5D%20Unity%20Black%20-%20a%20dark%20theme%20with%20JSC%20syntax%20highlighting%20css.meta.js
// ==/UserScript==

(function() {
let css = `html {
    background-color: #1A1B1C !important;
}

div {
    &.content {
        background-color: #27292C !important;
    }
}

h1, h2, p, span, a {
    color: #fff !important;
}

a {
    &:link {
        color: #fff!important;
    }
}

td {
    border-style: ridge;
    border-width: 2px !important;
    border-color: #fff!important;
    color: #fff!important;
    background-color: #44474D !important;
    &.desc {
        border-width: 2px !important;
        border-color: #fff!important;
        color: #CACCD0!important;
        background-color: #414449!important;
    }
}

table {
    &.list {
        tr {
            &:hover {
                outline: #009393 2px solid !important;
            }
            &:nth-child(odd) {
                background: #222222;
            }
        }
    }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
