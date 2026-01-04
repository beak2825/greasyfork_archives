// ==UserScript==
// @name Internet Roadtrip - Odometer sticky note
// @namespace me.netux.site/user-styles/internet-roadtrip/odometer-sticky-note
// @version 0.0.2
// @description Convert the 1st digit of a 5 digit odometer in neal.fun/internet-roadtrip into a sticky note. To be used with jdranczewski's "Internet Roadtrip Fix odometer" userscript.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://neal.fun/internet-roadtrip/*
// @downloadURL https://update.greasyfork.org/scripts/540890/Internet%20Roadtrip%20-%20Odometer%20sticky%20note.user.js
// @updateURL https://update.greasyfork.org/scripts/540890/Internet%20Roadtrip%20-%20Odometer%20sticky%20note.meta.js
// ==/UserScript==

(function() {
let css = `
.odometer {
  position: relative;
  overflow: revert !important;

  &:has(.digit + .digit + .digit + .digit + .digit) .digit:nth-child(1) {
    position: absolute;
    top: 0;
    left: -29px;
    rotate: -4deg;
    background-color: #F1F119;
    border-radius: 1px 4px 1px 0px;
    box-shadow: none;
    scale: 1.1;
      
    &.show-0 {
      display: none;
    }

    & .number {
      font-family: cursive;
      font-size: 90%;
    }

    & .digit-inner {
      transition: none;
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      top: -1px;
      bottom: initial;
      right: 0;
      left: initial;
      border-style: solid;
      border-width: 0 14px 7px 0;
      border-color: transparent rgba(161, 153, 61, .37) transparent transparent;
    }
  }
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
