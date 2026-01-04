// ==UserScript==
// @name m.newsmth.net BW
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description black white style for m.newsmth.net
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.m.newsmth.net/*
// @downloadURL https://update.greasyfork.org/scripts/406826/mnewsmthnet%20BW.user.js
// @updateURL https://update.greasyfork.org/scripts/406826/mnewsmthnet%20BW.meta.js
// ==/UserScript==

(function() {
let css = `

li div span a {
    color: #999;
    font-size: 60%;
    padding: 0 0 0 8px;
}
.f,
.hla,
.sp {
    background-color: #fff !important;
    color: #333;
}
.hl {
    width: 400px;
    background-color: #eee !important;
}
.sec {
    border: none;
}
ul.list.sec {
    border-top: 3px solid #040;
    border-bottom: 3px solid #040;
}
.menu {
    background-color: #fff !important;
    color: #333 !important;
}
.menu a,
a {
    color: #053 !important;
}
a.top {
    color: #c00 !important;
}
.list li {
    border-top: none;
    padding: 1px;
    padding-left: 5px;
}
#m_main div.sec.sp:nth-last-child(2),
span.f,
.f+br,
.logo.sp {
    display: none;
}
input.btn {
    padding-left: 10px;
    padding-right: 10px;
}
#wraper {
    margin-top: 78px;
    margin-bottom: 80px;
    background-color: #fff !important;
}
.sec.nav:nth-child(1),
.sec.nav:nth-child(2),
.list.sec + .sec.nav,
.sec.sp:nth-last-child(1),
.menu.nav,
.menu.sp {
    position: fixed;
    background-color: #eee !important;
    overflow: hidden;
    white-space: nowrap;
    height: 24px;
}
.menu.sp {
    width: 100%;
    top: 0px;
}
.sec.nav:nth-child(1) {
    width: 100%;
    top: 24px;
}
.sec.nav:nth-child(2) {
    width: 100%;
    top: 48px;
}
.list.sec + .sec.nav {
    width: 100%;
    bottom: 50px;
    border-top: solid 1px #999;
}
.menu.nav {
    width: 100%;
    bottom: 26px;
}
.sec.sp:nth-last-child(1) {
    width: 100%;
    bottom: 0px;
    border: none;
}
div iframe, div[id^='_'] {
    display: none !important;
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
