// ==UserScript==
// @name        Explain XKCD
// @namespace   Alice
// @include     http*://xkcd.com/*
// @version     1.1.1
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @description Adds Explain XKCD links to each XKCD comic page
// @downloadURL https://update.greasyfork.org/scripts/12184/Explain%20XKCD.user.js
// @updateURL https://update.greasyfork.org/scripts/12184/Explain%20XKCD.meta.js
// ==/UserScript==

var explain = "http://www.explainxkcd.com/wiki/index.php/";
var curPage = document.location.toString();
var pageTitle = $('#ctitle').text();
pageTitle = pageTitle.replace(/ /, "_");

if (curPage.match(/\d+/) === null) {
  curPage = $('#middleContainer').text();
  curPage = curPage.replace(/[\u0000-\uffff\n]*(Permanent link to this comic: )(http:\/\/xkcd\.com\/\d+\/)[\u0000-\uffff\n]*/gm, "$2");
}

curPage = curPage.replace(/(https?:\/\/xkcd\.com\/)(\d+)(\/)/, "$2");
explain = explain + curPage + ":_" + pageTitle;

$('#ctitle').append("<br><a href=\""+explain+"\">Explain XKCD</a>");

var tmp = $('#comic img').attr('title');
console.log(tmp);
$('#comic img').after("<p class=\"altTitle\">" + tmp + "</p>");
var style = '<style>.altTitle {\n  text-align: center;\n  font-size: 14px;\n  font-weight: bold;\n  color: black !important;\n  max-width: 600px;\n  margin: 0 auto;\n}</style>';
$('body').prepend(style);