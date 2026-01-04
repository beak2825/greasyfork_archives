// ==UserScript==
// @name ESC Nation Facelift (Light)
// @namespace https://github.com/a-felix/userstyles/blob/main/esc-nation/light.user.css
// @version 1.1.1
// @description `A more modern take on the ESC Nation message board, voting assistant and some other pages on the website.`
// @author Andrei Felix
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match http://www.escnation.com/
// @match http://escnation.com/
// @match http://www.escnation.com/more.php
// @match http://escnation.com/more.php
// @match http://www.escnation.com/mbnews/index.php*
// @match http://escnation.com/mbnews/index.php*
// @match http://www.escnation.com/mbnews/viewmsg.php*
// @match http://escnation.com/mbnews/viewmsg.php*
// @match http://www.escnation.com/mbnews/mbright.php*
// @match http://escnation.com/mbnews/mbright.php*
// @match http://www.escnation.com/mbnews/postmessage.php*
// @match http://escnation.com/mbnews/postmessage.php*
// @match http://www.escnation.com/mbnews/mbrules.php*
// @match http://escnation.com/mbnews/mbrules.php*
// @match http://www.escnation.com/mbnews/index.php?action=view*
// @match http://escnation.com/mbnews/index.php?action=view*
// @match http://www.escnation.com/mbnews/votingassistant/*
// @match http://escnation.com/mbnews/votingassistant/*
// @match http://www.escnation.com/startnew.php*
// @match http://escnation.com/startnew.php*
// @match http://www.escnation.com/news/*
// @match http://escnation.com/news/*
// @match http://www.escnation.com/navmore.php*
// @match http://escnation.com/navmore.php*
// @match http://www.escnation.com/aboutescn.php*
// @match http://escnation.com/aboutescn.php*
// @match http://www.escnation.com/news/resources/*
// @match http://escnation.com/news/resources/*
// @match http://www.escnation.com/menucrips.html*
// @match http://escnation.com/menucrips.html*
// @match http://www.escnation.com/mbnews/search.php*
// @match http://escnation.com/mbnews/search.php*
// @match http://www.escnation.com/mbnews/messageposted.php*
// @match http://escnation.com/mbnews/messageposted.php*
// @match http://www.escnation.com/mbnews/mb.html*
// @match http://escnation.com/mbnews/mb.html*
// @downloadURL https://update.greasyfork.org/scripts/439056/ESC%20Nation%20Facelift%20%28Light%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439056/ESC%20Nation%20Facelift%20%28Light%29.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("http://www.escnation.com/mbnews/index.php") || location.href.startsWith("http://escnation.com/mbnews/index.php") || location.href.startsWith("http://www.escnation.com/mbnews/viewmsg.php") || location.href.startsWith("http://escnation.com/mbnews/viewmsg.php") || location.href.startsWith("http://www.escnation.com/mbnews/mbright.php") || location.href.startsWith("http://escnation.com/mbnews/mbright.php") || location.href.startsWith("http://www.escnation.com/mbnews/postmessage.php") || location.href.startsWith("http://escnation.com/mbnews/postmessage.php") || location.href.startsWith("http://www.escnation.com/mbnews/mbrules.php") || location.href.startsWith("http://escnation.com/mbnews/mbrules.php")) {
  css += `
  * { font-family: "Segoe UI" !important; line-height: 1.35em; }
  hr { display: none !important; }
  .tit { font-size: 13px; }
  ul, .lightbg { background: white; color: black; padding: 5px; box-shadow: 0px 0px 10px rgba(102, 102, 204, .6); }
  li { display: block; -webkit-margin-collapse: discard; }
  ul li ul { margin-left: -5px; margin-right: -5px; padding-top: 0; padding-bottom: 0; box-shadow: none; }
  ul li ul li { padding-left: 6px; border-left: 3px #ccc solid; }
  ul li ul li > span[title]:before, ul > li > span.tit:before, ul li ul li > a > span.tit:before { display: inline-block; content: "\\25B8"; margin-left: -11px; margin-right: -1px; color: #ccc; font-weight: bold; }
  ul li > span[title] > a:hover { text-decoration: underline; text-decoration-color: #339 !important; }
  ul li:hover { border-left-color: #66c; }
  ul li ul li:hover > span[title]:before, ul li:hover > span.tit:before, ul li ul li:hover > a > span.tit:before { color: #66c; }
  ul:empty, p:empty, font:empty { display: none; }
  div[style="background-color:eeffff"] { background-color: #fff !important; padding:5px; }
  a[href], a[href] div[color], a[href] span { text-decoration: none; color: #339 !important; }
  .lightbg font[color] { color: black !important; }
  .lightbg { margin-bottom: 10px; }
  body.mbwhite, body.mbblue { background: #DDE; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/viewmsg.php") || location.href.startsWith("http://escnation.com/mbnews/viewmsg.php") || location.href.startsWith("http://www.escnation.com/mbnews/mbright.php") || location.href.startsWith("http://escnation.com/mbnews/mbright.php") || location.href.startsWith("http://www.escnation.com/mbnews/index.php?action=view") || location.href.startsWith("http://escnation.com/mbnews/index.php?action=view") || location.href.startsWith("http://www.escnation.com/mbnews/postmessage.php")) {
  css += `
  ul { background: white; padding: 5px; margin-left: 5px; margin-right: -5px; box-shadow: -2px 2px 5px rgba(102, 102, 204, 0.4); }
  li div[style="background-color:eeffff"] { background-color: #eef !important; box-shadow:none; margin-bottom:5px; padding: 0; }
  li div[style="background-color:eeffff"] font:not(:empty) { display:block; padding: 5px; color: black !important; }
  div[style="background-color:eeffff"] { background-color: #eef !important; }
  div[style="background-color:eeffff"] font:not(:empty) { color: black !important; }
  input:not([type=submit]), textarea { width: 100%; border: 1px solid #66c; background-color: #fdfdff; color: #000; padding: 5px; }
  input:not([type=submit]):focus, textarea:focus { background-color: #fff; }
  td { padding:0 }
  input[type=submit] { background-color: #66c !important; color: white !important; border: none; margin-top: -32px; margin-left: 2px; padding: 5px 10px; outline:none; }
  input[type=submit]:active { background-color: #44a; }
  input:focus, textarea:focus { outline: none !important; box-shadow: 0px 0px 10px rgba(102, 102, 204, 0.6) !important; }
  textarea { width: 100% !important; }
  table { width: 100% !important; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/votingassistant/") || location.href.startsWith("http://escnation.com/mbnews/votingassistant/")) {
  css += `
  * { font-family: "Segoe UI" !important; cursor: default !important; }
  body.mbblue { background: #dde; color: black; }
  li { color: black; padding: 5px; box-shadow: 0px 0px 10px rgba(102, 102, 204, 0.6); }
  li.sortlist { background: white; width: calc(100% - 15px); }
  div[style="position: absolute; left:30px;"] { left: 35px !important; width: calc(100% - 40px); }
  ul { list-style:none; padding-left:0; }
  input[type=submit] { background-color: #66c; color: white; border: none; padding: 5px 10px; margin-left: 4px; outline:none; }
  input[type=submit]:active { background-color: #44a; }
  :focus { outline: none; box-shadow: 0px 0px 10px rgba(102, 102, 204, 0.6); }
  `;
}
if (location.href.startsWith("http://www.escnation.com/startnew.php") || location.href.startsWith("http://escnation.com/startnew.php")) {
  css += `
  * { font-family: "Segoe UI" !important; color: black !important; }
  .menuhead, h1, h2 { color: white !important; }
  hr, td.news br { display: none; }
  div.mainc, td.mainc { background: rgba(255, 255, 255, 0.1); border: none !important; }
  table#wordletable { border-collapse: collapse; }
  td.news { border: none !important; padding: 0; vertical-align: top; }
  p.sidetext { background: rgba(255, 255, 255, 0.8); color: black; padding: 5px; -webkit-margin-before: 0 !important; -webkit-margin-after: 5px !important; }
  td.news p.sidetext { display: block; background: none; padding: 29px 0 0 0; float: right; }
  table#newstable { border-spacing: 0 !important; }
  table#newstable tr, table#blogtable, table#wordletable { background: rgba(255, 255, 255, 0.8); margin: 0 0 5px 0; display: block; }
  table#newstable td:nth-child(2), table#wordletable td:nth-child(2) { width: 100%; height: 100%; padding: 5px; }
  table#newstable td:nth-child(2) a { padding-top: 10px; height: 40px; }
  a[href], a[href].alwaysnew, a:link, a:visited { text-decoration: none; color: #339 !important; }
  a[href].newslink { margin: -5px 0; font-size: 15px; }
  a[style] { color: inherit !important; }
  td.mainc:nth-child(2) p.sidetext:last-child { display: none; }
  td.mainc:nth-child(3) a[href].alwaysnew { color:white !important; }
  table tr:last-child a[href].alwaysnew { color:white !important; }
  table#table1 > tbody > tr:last-child p, table#table1 > tr:last-child p { background: none !important; color:white !important; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/news/") || location.href.startsWith("http://escnation.com/news/") || location.href.startsWith("http://www.escnation.com/navmore.php") || location.href.startsWith("http://escnation.com/navmore.php") || location.href.startsWith("http://www.escnation.com/aboutescn.php") || location.href.startsWith("http://escnation.com/aboutescn.php") || location.href.startsWith("http://www.escnation.com/news/resources/") || location.href.startsWith("http://escnation.com/news/resources/")) {
  css += `
  *, h1, h2, h3, h4, h5, h6 { color: black; font-family: "Segoe UI"; }
  body, body.whitebg, body.mbwhite { background-color: #dde !important; }
  .midbg, .lightbg { background-color: #eef; box-shadow: 0px 0px 10px rgba(102, 102, 204, .6); }
  .span3 { width: auto; max-width: 160px; }
  div.newsimage { padding: 0; }
  .well { border-radius: 0; }
  a[href] { text-decoration: none; color: #339 !important; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/menucrips.html") || location.href.startsWith("http://escnation.com/menucrips.html")) {
  css += `
  * { font-family: "Segoe UI" !important; }
  #topbanner { height: 50px; }
  img[height="45px"] { height: 50px !important; }
  div.hltbtn a { color: #EEE; }
  div.hltbtn a:hover { color: #339; }
  div.hltbtn:hover { background-color: #EEE; opacity: 1; }
  `;
}
if (location.href === "http://www.escnation.com/" || location.href === "http://escnation.com/" || location.href === "http://www.escnation.com/more.php" || location.href === "http://escnation.com/more.php") {
  css += `
  body, frame { background-color: #dde; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/search.php") || location.href.startsWith("http://escnation.com/mbnews/search.php") || location.href.startsWith("http://www.escnation.com/mbnews/messageposted.php") || location.href.startsWith("http://escnation.com/mbnews/messageposted.php")) {
  css += `
  * { color: black; font-family: "Segoe UI" !important; }
  hr { display: none !important; }
  body, body[bgcolor] { background-color: #dde; }
  input[type=text] { width: 100%; border: 1px solid #66c; background-color: #fdfdff; color: black; margin-top: 5px; padding: 5px; }
  input[type=text]:focus { background-color: #fff; }
  td { padding:0 }
  input[type=submit] { background-color: #66c !important; color: white !important; border: none; margin-left: 2px; padding: 5px 10px; outline:none; }
  input[type=submit]:active { background-color: #44a; }
  input[type=checkbox], input[type=radio] { accent-color: #66c; vertical-align: -2px; }
  :focus { outline: none !important; box-shadow: 0px 0px 10px rgba(102, 102, 204, 0.6) !important; }
  table { width: 100% !important; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/mb.html") || location.href.startsWith("http://escnation.com/mbnews/mb.html")) {
  css += `
  html, frame { background-color: #dde; }
  frame[name="west"] { border-right: 1px solid #ccc !important; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/index.php?action=view") || location.href.startsWith("http://escnation.com/mbnews/index.php?action=view")) {
  css += `
  body > ul { margin-right: 0; }
  ul ul { margin-left: -5px; box-shadow: none }
  ul li > span.tit:before, ul li > b:before { display: inline-block; content: "\\25B8"; margin-left: -11px; margin-right: -1px; color: #ccc; font-weight: bold; }
  ul li { padding-left: 6px; border-left: 3px #ccc solid; }
  ul li:hover { border-left-color: #66c; }
  ul li ul li:hover > span[title]:before, ul li:hover > span.tit:before, ul li ul li:hover > a > span.tit:before, ul li:hover > b:before, ul li ul li:hover > b:before { color: #66c; }
  `;
}
if (location.href.startsWith("http://www.escnation.com/mbnews/postmessage.php") || location.href.startsWith("http://escnation.com/mbnews/postmessage.php")) {
		css += `
		input[type=checkbox] {
			display: inline-block;
			width: auto;
			accent-color: #66c; 
			vertical-align: -2px;
		}
		input[type=submit] {
			margin-left: 0;
			margin-top: -25px;
		}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
