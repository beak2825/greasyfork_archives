// ==UserScript==
// @name          Nitro Type KingLegend Text Style
// @namespace     http://userstyles.org/
// @description      nnnnnnnn
// @author        aoesnuthaosnetuh
// @homepage      https://userstyles.org/styles/237598
// @include       http://nitrotype.com/*
// @include       https://nitrotype.com/*
// @include       http://*.nitrotype.com/*
// @include       https://*.nitrotype.com/*
// @run-at        document-start
// @version       0.20220427123648
// @downloadURL https://update.greasyfork.org/scripts/445722/Nitro%20Type%20KingLegend%20Text%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/445722/Nitro%20Type%20KingLegend%20Text%20Style.meta.js
// ==/UserScript==
(function() {var css = [
    ".dash-letter {",
    "    font-family: 'Roboto Mono', monospace;",
    "    padding: 0px 12px !important;",
    "    /*",
    "    change to 5px if you're using multi-line",
    "    */",
    "    font-weight: 500;",
    "    color: white;",
    "}",
    "span.dash-letter.is-waiting {",
    "    border-radius: 10px!important;",
    "    background: rgb(70, 102, 150);",
    "}",
    "span.dash-letter.is-incorrect {",
    "    border-radius: 10px !important;",
    "    background: #a83232;",
    "}",
    "div.dash-copyContainer {",
    "    background: rgb(30, 30, 40);",
    "    box-shadow: 0px 0px 25px black;",
    "    border-radius: 30px;",
    "}",
    ".rv-xy-plot__grid-lines {",
    "    color: red;",
    "    background: red;",
    "    background-color: red;",
    "    fill: red;",
    "}",
    "#chart-gradient {",
    "    color: red !important;",
    "}",
".chart--a .chart-gradient .chart-gradient1 {",
    "    stop-color: #f00;",
    "    stop-opacity: 0.6;",
    "}",
    ".chart--a .chart-gradient .chart-gradient2 {",
    "    stop-color: #486dd7;",
    "    stop-opacity: 0.3;",
    "}",
    ".chart--a .chart-gradient .chart-gradient3 {",
    "    stop-color: #000;",
    "    stop-opacity: 0.5;",
    "}",
    ".chart--a .chart-line {",
    "stroke: rgb(0, 0, 0, 0) !important;",
    "stroke-width: 2 !important;",
    "}",
    ".chart--a .chart-line circle {",
    "fill: #000 !important;",
    "    stroke-width: 0 !important;",
    "    stroke: #fff !important;",
    "    display: none;",
    "}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
    addStyle(css);
} else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }
}
})();