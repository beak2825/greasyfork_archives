// ==UserScript==
// @name        1337news
// @namespace   1337news
// @run-at         document-body
// @include        *://youtube.tld/*
// @include        *://*.youtube.tld/*
// @version     1.3
// @grant       none
// @description Press alt+l (lowercase "L") to change comments on YouTube to text with accent marks to avoid fake news or hate fact keyword filters. Long live free speech.
// @downloadURL https://update.greasyfork.org/scripts/28812/1337news.user.js
// @updateURL https://update.greasyfork.org/scripts/28812/1337news.meta.js
// ==/UserScript==
function leetNews(e) {
  if (e.key === 'l' && e.altKey) {
    var elem = e.target;
    setTimeout(function () {
      var str = elem.value;
      if(str === undefined){
        str = elem.innerText;
      }
      str = str.replace(/A/g, '?');
      str = str.replace(/B/g, '?');
      str = str.replace(/C/g, '?');
      str = str.replace(/D/g, '?');
      str = str.replace(/E/g, '?');
      str = str.replace(/F/g, '?');
      str = str.replace(/G/g, '?');
      str = str.replace(/H/g, '?');
      str = str.replace(/I/g, '?');
      str = str.replace(/J/g, '?');
      str = str.replace(/K/g, '?');
      str = str.replace(/L/g, '?');
      str = str.replace(/M/g, '?');
      str = str.replace(/N/g, '?');
      str = str.replace(/O/g, '?');
      str = str.replace(/P/g, '?');
      str = str.replace(/Q/g, '?');
      str = str.replace(/R/g, '?');
      str = str.replace(/S/g, '?');
      str = str.replace(/T/g, '?');
      str = str.replace(/U/g, '?');
      str = str.replace(/V/g, '?');
      str = str.replace(/W/g, '?');
      str = str.replace(/X/g, '?');
      str = str.replace(/Y/g, '?');
      str = str.replace(/Z/g, '?');
      str = str.replace(/a/g, '?');
      str = str.replace(/b/g, '?');
      str = str.replace(/c/g, '?');
      str = str.replace(/d/g, '?');
      str = str.replace(/e/g, '?');
      str = str.replace(/f/g, '?');
      str = str.replace(/g/g, '?');
      str = str.replace(/h/g, '?');
      str = str.replace(/i/g, '?');
      str = str.replace(/j/g, '?');
      str = str.replace(/k/g, '?');
      str = str.replace(/l/g, '?');
      str = str.replace(/m/g, '?');
      str = str.replace(/n/g, '?');
      str = str.replace(/o/g, '?');
      str = str.replace(/p/g, '?');
      str = str.replace(/q/g, '?');
      str = str.replace(/r/g, '?');
      str = str.replace(/s/g, '?');
      str = str.replace(/t/g, '?');
      str = str.replace(/u/g, '?');
      str = str.replace(/v/g, '?');
      str = str.replace(/w/g, '?');
      str = str.replace(/x/g, '?');
      str = str.replace(/y/g, '?');
      str = str.replace(/z/g, '?');
      if(elem.value !== undefined)
      {
        elem.value = str;
      }else{
        elem.innerText = str;
      }
    });
  }
}
var divs = document.addEventListener('keypress', leetNews, false);
