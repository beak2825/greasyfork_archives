// ==UserScript==
// @name Small Apple.com
// @namespace https://greasyfork.org/en/users/759797-lego-savant
// @version 1.0
// @description Shrinks apple home page to be readable for normal people
// @author legosavant
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/458981/Small%20Applecom.user.js
// @updateURL https://update.greasyfork.org/scripts/458981/Small%20Applecom.meta.js
// ==/UserScript==

(function() {
let css = `/******************************HOME*************************/
/*super huge*/
.main [data-module-template="heroes"] {
    --columns:3;
    --content-height:400px;
    --gutter-width: 8px;
    --gutter-half-width: 4px;
    --gutter-and-half-width: 12px;
}
.main [data-module-template="heroes"] .unit-image-wrapper .unit-image[class] {
    background-size:54%;
    background-position:center bottom
}
.main [data-module-template="heroes"] [data-unit-id] .unit-copy-wrapper {
    padding-top:4px
}
@media (max-width:1681px) {
    .main [data-module-template="heroes"] {
        --content-height:300px
    }
    .main [data-module-template="heroes"] .unit-image-wrapper .unit-image[class] {
        background-size:40%;
        background-position:center bottom
    }
    .main [data-module-template="heroes"] [data-unit-id] .unit-copy-wrapper>*.headline {
        font-size:36px
    }
    .main [data-module-template="heroes"] [data-unit-id] .unit-copy-wrapper>*.subhead {
        font-size:24px
    }
    .main [data-module-template="heroes"] .unit-copy-wrapper>*.callout, .main [data-module-template="heroes"] [data-unit-id] .unit-copy-wrapper>*.cta, .main [data-module-template="heroes"] [data-unit-id] .unit-copy-wrapper>*.cta-links {
        font-size:16px
    }
}
/*huge*/
.main [data-module-template="promos"] {
    --columns:6;
    --content-height:300px
}
.main [data-module-template="promos"] .unit-image-wrapper .unit-image[class] {
    background-size:52%;
    background-position:center bottom
}
.main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .headline {
    margin-top:6px;
    font-size:24px
}
.main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .subhead {
    font-size:16px
}
@media (max-width:1681px) {
    .main [data-module-template="promos"] .unit-image-wrapper .unit-image[class] {
        background-size:43%;
        background-position:center bottom
    }
    .main [data-module-template="promos"] {
        --columns:6;
        --content-height:250px
    }
    .main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .headline {
        margin-top:4px;
        font-size:20px
    }
    .main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .subhead, .main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .cta-links, .main [data-module-template="promos"] [data-unit-id] .unit-copy-wrapper .cta {
        font-size:14px
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
