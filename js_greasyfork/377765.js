// ==UserScript==
// @name         TIOJ Submission AC checker
// @description  TIOJ Helper
// @namespace    https://sean.cat
// @version      0.1
// @author       Sean
// @match        https://tioj.ck.tp.edu.tw/submissions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377765/TIOJ%20Submission%20AC%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/377765/TIOJ%20Submission%20AC%20checker.meta.js
// ==/UserScript==

var AC = [];

var user = document.getElementById("navbar-collapse-01").getElementsByTagName("a")[7].href
var xhr = new XMLHttpRequest();
xhr.open('GET', user, false);
xhr.send(null);
var parser = new DOMParser();
var doc = parser.parseFromString(xhr.responseText, "text/html");
var userAC = doc.getElementsByClassName("text-success")
for (i=0; i<userAC.length; i++)
  AC.push(userAC[i].innerText);
console.log(AC);

t = document.getElementsByTagName("tbody")[0];

for (i=0; i<t.childElementCount; i++) {
  r = t.children[i];
  d = r.children[1];
  p = d.innerText;
  if (AC.indexOf(p) >= 0)
    d.firstElementChild.style.backgroundColor = "#ffa"
}