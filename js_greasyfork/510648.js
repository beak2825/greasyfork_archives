// ==UserScript==
// @name new york times paywall begone
// @namespace Violentmonkey Scripts nyt
// @match https://www.nytimes.com/*
// @description read nyt for free, if you must
// @grant none
// @version 0.0.1.20241001160222
// @downloadURL https://update.greasyfork.org/scripts/510648/new%20york%20times%20paywall%20begone.user.js
// @updateURL https://update.greasyfork.org/scripts/510648/new%20york%20times%20paywall%20begone.meta.js
// ==/UserScript==

var t = '',
    h = '',
    po = '<p class="css-at9mc1 evys1bk0">',
    pc = '</p>',
    br = '<br />',
    bc = 'blockquote',
    ih = 'innerHTML',
    n = __preloadedData.initialData.data.article.sprinkledBody;
$ = function(_) {
  return document.getElementsByTagName(_)
}
if ($("header")[1]) {
  h = $("header")[1][ih]
}
for (var i = 0, l = n.content.length; i < l; ++i) {
  var nc = n.content[i];
  if (nc.__typename == "ParagraphBlock") {
    t += po + nc.content[0].text + pc + br + br
  }
}
$("body")[0][ih] = '<' + bc + ' style="padding:255px">' + po + h + t + pc + '</' + bc + '>';