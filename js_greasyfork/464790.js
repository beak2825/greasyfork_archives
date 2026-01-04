// ==UserScript==
// @name          Gutenberg Progressive Word Count
// @namespace     https://vox.quartertone.net
// @version       1.0.1
// @description   Progressive word counter for Gutenberg HTML ebooks - adapted from https://greasyfork.org/en/scripts/35167
// @author        Quartertone
// @grant        none
// @match       *://*.gutenberg.org/files/*
// @match       *://*.gutenberg.org/cache/epub/*
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/464790/Gutenberg%20Progressive%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/464790/Gutenberg%20Progressive%20Word%20Count.meta.js
// ==/UserScript==

(function() {
'use strict';

var targetcount = 2000;

function gettargetcount() {
  targetcount = prompt("Please enter the target number of words to count", targetcount);
  return targetcount ? targetcount : 0;
}

function clearAll() {
  for (const pp of document.querySelectorAll("p.wcpg")) {
    pp.style.border = "";
    pp.classList.remove("wcpg");
  }
  for (const para of document.querySelectorAll("span.wcpg")) {
    para.remove();
  }
}

function scrollGo(o) {
  o.scrollIntoView()
  window.scrollBy(0, 500);
}

function mycounttotarget(startp, wctarget) {
  var txt = '', pcount = 0, count = 0, prevpara = null, n = 0;
  // FIX - remove n ?
  while (startp && (count < wctarget) && (n < 1000)) {
    startp.classList.add("wcpg");
    startp.style.border = "1px solid #f00";
    txt = startp.textContent;
    pcount = txt.trim().split(/--|[\s\*—]+/).length;
    count += pcount;
    // showParaCount(startp, count, pcount);
    let wcpg = document.createElement("span");
    wcpg.className = "wcpg";
    wcpg.style = 'background:#ff07';
    wcpg.innerHTML = "(paragraph " + pcount.toString() + " words, running total " + count.toString() + " words";
    startp.appendChild(wcpg);

    prevpara = startp;
    startp = startp.nextElementSibling;
    if (startp && startp.tagName.match(/^(h\d|pre|div)/i)) { startp = null; }
    n++;
  }
  scrollGo(startp || prevpara);
}

document.addEventListener("click", function(e) {
  if (e.target.tagName == "P") {
    clearAll();
    mycounttotarget(e.target, gettargetcount());
  }
});

alert("click the paragraph where you want to start the count!");

})();