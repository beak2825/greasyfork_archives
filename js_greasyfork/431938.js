// ==UserScript==
// @name          eTools in two columns for widescreen desktop PC
// @description   eTools search engine in two columns for widescreen desktop PC - works best with a DuckDuckGo menu pass-through and an URL that gives 16 results.
// @author        dhaden
// @homepage
// @include       https://*.etools.ch/*
// @version       
// @namespace https://greasyfork.org/users/186630
// @downloadURL https://update.greasyfork.org/scripts/431938/eTools%20in%20two%20columns%20for%20widescreen%20desktop%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/431938/eTools%20in%20two%20columns%20for%20widescreen%20desktop%20PC.meta.js
// ==/UserScript==
(function() {var css = [".result {",
"    display: table-cell;",
"    columns: auto;",
"    columns: 2;",
"    vertical-align: middle;",
"    width: 80%;",
"}",
".record {",
"    display: inline-block;",
"}",
"td.count {",
"    text-align: left;",
"    padding-right: 5px;",
"    color: #ffffff;",
"    font-size: 16px;",
"    font-weight: bold;",
"}",
"strong, a.title {",
"    font-weight: bold;",
"    font-size: 11pt;",
"}",
"div.attr {",
"    font-size: 12px;",
"    color: #6392d0;",
"    margin-bottom: 3px;",
"}",
"var {",
"    font-style: normal;",
"    font-size: 13px;",
"    color: #d76351;",
"}",
"em {",
"    background-color: #ffffff;",
"    font-style: normal;",
"    text-decoration: inherit;",
"}",
"div.rankBox {",
"    border: 1px solid #ffffff;",
"    position: absolute;",
"    width: 5px;",
"    height: 30px;",
"    margin: 3px 0 0 2px;",
"}",
"span.rankInd {",
"    background-color: #ffffff;",
"    position: absolute;",
"    width: 5px;",
"    bottom: 0;",
"}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();