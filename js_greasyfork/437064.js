// ==UserScript==
// @name         Steloization
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  제 2의 Steloize!
// @author       You
// @match        https://openuserjs.org/user/add/scripts/new
// @icon         https://www.google.com/s2/favicons?domain=openuserjs.org
// @grant        none
// @copyright    2021, 나무스튜
// @license      MIT
// @include      *://*/*
// @downloadURL https://update.greasyfork.org/scripts/437064/Steloization.user.js
// @updateURL https://update.greasyfork.org/scripts/437064/Steloization.meta.js
// ==/UserScript==

fetch("https://szmanager.prnm789.repl.co/fontface")
.then(function(res){
    return res.text();
})
.then(function(data){
    var newstyletag = document.createElement("style");
    var newstyle = document.createTextNode(data);
    newstyletag.appendChild(newstyle);
    document.body.appendChild(newstyletag);
});

setInterval(load, 500);

function load() {
  var elems = document.querySelectorAll(".se-text-paragraph > span, p:not(.se-text-paragraph), h2, h3, strong.tit, strong.title, a.tit, a.article > span.inner, span.tx > span");
  var reg = /(\|\|)(.+?)(\|)(.+?)(\|\|)/;

  for (let elem of elems) {
    if (reg.test(elem.innerText)) {
      let oldtext = elem.innerText;
      let font = oldtext.match(/(\|\|)(.+?)(\|)/)[0].substr(2).slice(0, -1);
      let newtext = oldtext.replace(/(\|\|)(.+?)(\|)/, '<span style="font-family: \'' + font + '\', sans-serif">');
      newtext = newtext.replace('||', '</span>');
      elem.innerHTML = newtext;
    }
  }
}