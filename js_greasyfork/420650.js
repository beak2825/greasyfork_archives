// ==UserScript==
// @name          PCDVD - Dark Mode
// @namespace     http://userstyles.org
// @description	  PCDVD is a very famous forum in Taiwan and this style will improve the display quality.
// @author        Tronic Lin
// @homepage      https://userstyles.org/styles/196482
// @match         http://pcdvd.com.tw/*
// @match         https://pcdvd.com.tw/*
// @match         http://*.pcdvd.com.tw/*
// @match         https://*.pcdvd.com.tw/*
// @run-at        document-start
// @version       1.2
// @license       MIT
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420650/PCDVD%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/420650/PCDVD%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `
*{
    font-family: "KaiGen Gothic TW", "Noto Sans CJK TC", "Microsoft YaHei", "Microsoft JhengHei", Helvetica !important;
}

.smallfont {
    font: 10pt  "KaiGen Gothic TW", "Noto Sans CJK TC", "Microsoft YaHei", "Microsoft JhengHei", Helvetica !important;
}

td, th, p, li {
    font: 12pt "KaiGen Gothic TW", "Noto Sans CJK TC", "Microsoft YaHei", "Microsoft JhengHei", Helvetica !important;
}

body
{
    background-color: #222425 !important;
    color: #e8e8e8 !important;
}

.page,
.alt2,
.alt2Active,
.panelsurround
{
    background-color: #2f2f2f !important;
}

.tcat,
.tfoot,
.alt1,
.alt1Active
{
    background-color: #222425 !important;
}

.tborder
{
    background-color: #555 !important;
}

a:link {
color: #ffb700 !important;
}

a:visited {
color: #ffb300 !important;
}


@media (min-width: 1200px){
    html{
        zoom: 125% !important;
    }

  td img{
        max-width: calc(100vw - 400pt) !important;
    }
}

@media (min-width: 1400px){
  td img{
        max-width: calc(100vw - 425pt) !important;
    }
}

@media (min-width: 1600px){
    html{
        zoom: 150% !important;
    }

  td img{
        max-width: calc(100vw - 700pt) !important;
    }
}
`;
   if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();