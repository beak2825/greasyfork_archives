// ==UserScript==
// @name Simple Google SERP Scrape (Title, Meta, Link)
// @author youngfranko
// @description 	Simply, this script scrapes Google and outputs the Title, Meta, and Link, in a text box which you can copy to a sheet and then separate by the semicolon delimiter.
// @grant 			none
// @version 		0.2
// @match 		https://www.google.com/search*
// @namespace https://greasyfork.org/users/768543
// @downloadURL https://update.greasyfork.org/scripts/426113/Simple%20Google%20SERP%20Scrape%20%28Title%2C%20Meta%2C%20Link%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426113/Simple%20Google%20SERP%20Scrape%20%28Title%2C%20Meta%2C%20Link%29.meta.js
// ==/UserScript==

var w = window;
var d = document;
var l = w.location.href;
var t = '';
var o = d.createElement('textarea');

o.style.cssText =
  'position:fixed;top:2%;padding:15px;left:3%;width:90%;height:70%;max-height:80%;z-index:999999 !important;border:4px solid #888;overflow-y:scroll;background-color:#f0f0f0;color:#000;font-size:10px; line-height:1em;';
o.innerHTML = '';

w.addEventListener("load", () => {
  var googleResultArr = Array.from(document.getElementsByClassName('g'));
for (var i = 0; i < googleResultArr.length; i++) {
  let googleResultTitle = googleResultArr[i].getElementsByClassName(
    'LC20lb DKV0Md'
  )[0].innerText;
  let googleResultMetaDescription = googleResultArr[i].getElementsByClassName(
    'IsZvec'
  )[0].innerText;

  let googleResultLink = googleResultArr[i]
    .getElementsByClassName('yuRUbf')[0]
    .getElementsByTagName('a')[0].href;

  o.innerHTML =
    o.innerHTML +
    googleResultTitle +
    ';' +
    googleResultMetaDescription +
    ';' +
    googleResultLink +
    ';' +
    '\r\n';

}

if (o.innerHTML != '') d.body.appendChild(o);

})

  
