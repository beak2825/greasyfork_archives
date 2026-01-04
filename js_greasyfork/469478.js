// ==UserScript==
// @name Display summary in Amazon video
// @namespace github.com/openstyles/stylus
// @version 1.0.6
// @description Amazonプライムビデオのあらすじを常に表示する
// @author TNB
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www\.amazon\..*?/.*?(video|dp)/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/469478/Display%20summary%20in%20Amazon%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/469478/Display%20summary%20in%20Amazon%20video.meta.js
// ==/UserScript==

(function() {
let css = `
    #main div[style]:not([style^="aspect-ratio"]),
    #main label + div {
        opacity: 1 !important;
        overflow: visible !important;
        transform: none !important;
        height: inherit !important;
        transition: none !important;
        margin-bottom: 16px !important;
    }
    .dv-dp-node-synopsis > span > span {
        display: initial !important;
    }
    .dv-dp-node-synopsis > span {
        background: rgba(0, 0, 0, 0.2);
        box-shadow: 0px 0px 20px 20px rgba(0, 0, 0, 0.2);
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
