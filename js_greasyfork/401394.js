// ==UserScript==
// @name Worldometers.info Corona Dark Covid-19 edition
// @namespace https://greasyfork.org/users/517035
// @version 0.0.4
// @description This is the Corona Dark Covid-19 edition for Worldometers.info
// @author zirs3d
// @license CC0-1.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.worldometers.info/*
// @downloadURL https://update.greasyfork.org/scripts/401394/Worldometersinfo%20Corona%20Dark%20Covid-19%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/401394/Worldometersinfo%20Corona%20Dark%20Covid-19%20edition.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Disable */
    /* Button */
    /* Text */
    li.news_li strong a,
    .counterdiv span {
        color: #f8f8f2 !important;
    }

    a,
    li a {
        color: #ad0505 !important;
    }

    td {
        color: #00b21e !important;
    }

    blockquote p strong {
        color: #282a36 !important;
    }

    /* Root */
    body,
    div,
    tr,
    th,
    blockquote,
    footer,
    label,
    button,
    .breadcrumb {
        background-color: #282a36 !important;
        color: #f8f8f2 !important;
    }

    .nav-pills > li.active > a {
        background-color: #ad0505 !important;
        color: #f8f8f2 !important;
    }


    /* Resolve highcharts*/
    rect {
        fill: #282a36 !important;
        color: #282a36 !important;
    }

    text {
        fill: #f8f8f2 !important;
        color: #f8f8f2 !important;
    }

    .highcharts-tooltip text {
        fill: #282a36 !important;
    }

    /* Popup */
    /* Logo */
    /* Navigation */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
