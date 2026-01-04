// ==UserScript==
// @name        Al Jazeera - Learning Arabic
// @namespace   Violentmonkey Scripts
// @match       https://learning.aljazeera.net/*/articles/pages/*
// @grant       none
// @version     1.1
// @author      Firat Ozdemir
// @description Highlights vocabulary in the text, gives the definition when hovered over.
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/503082/Al%20Jazeera%20-%20Learning%20Arabic.user.js
// @updateURL https://update.greasyfork.org/scripts/503082/Al%20Jazeera%20-%20Learning%20Arabic.meta.js
// ==/UserScript==


newStyles = document.createElement("style")
newStyles.innerHTML = `
@media (pointer: coarse), (hover: none) {
      [title] {
        position: relative;
        display: inline-flex;
        justify-content: center;
      }
      [title]:focus::after {
        content: attr(title);
        position: absolute;
        top: 90%;
        color: #000;
        background-color: #fff;
        border: 1px solid;
        width: fit-content;
        padding: 3px;
      }
    }
`;
document.head.appendChild(newStyles);

phrases = document.querySelectorAll(".phrases-row")

entries = []
defs = []
for(p of phrases){
  e = p.firstElementChild.innerText;
  e = e.replace(/\(.*\)/g, "");
  e = e.replace(/\.\.+/g, "");
  e = e.replace(/ـ+$/, "");
  e = e.normalize();
  e = e.trim();
  e = e.trim("ًٌٍَُِّْ");
  entries.push(e);
}

text = document.querySelector(".formilized-body").innerHTML;
texto = document.querySelector(".original-body").innerHTML;


for(i = 0; i <entries.length; i++){
  e = entries[i];
  r = e.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "");
  r = r.split("");
  r = r.join("[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]*");
  r = new RegExp(`(${r})`, "ig");
  // text = text.replace(/["ًٌٍَُِّْ]/g, "");

  //text = highlight(text, e);
  //texto = highlight(texto, e);

  console.log(i,e,r, text.match(r) !== null )

  text = text.replace(r, "<b title='" + phrases[i].innerText + "' style='cursor:pointer;'>" + "$1" + "</b>");
  texto = texto.replace(r, "<b title='" + phrases[i].innerText + "' style='cursor:pointer;'>" + "$1" + "</b>");

}

document.querySelector(".formilized-body").innerHTML = text;
document.querySelector(".original-body").innerHTML = texto;