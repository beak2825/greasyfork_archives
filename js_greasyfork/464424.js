// ==UserScript==
// @name     Pomahach
// @namespace griffi-gh
// @description quickly show answers on pomahach.com
// @version  1
// @grant    none
// @match    *://pomahach.com/question/*
// @icon     https://pomahach.com/themes/test/favicon1.ico
// @downloadURL https://update.greasyfork.org/scripts/464424/Pomahach.user.js
// @updateURL https://update.greasyfork.org/scripts/464424/Pomahach.meta.js
// ==/UserScript==

//unfold
Array.from(document.getElementsByClassName("collapseds")).forEach(e => e.style.display = "block");
//remove labels
Array.from(document.getElementsByClassName("label-info")).forEach(e => e.remove());
//remove first block
document.getElementsByClassName("list-group")[0].remove();
//remove button
document.querySelectorAll("a.collapsed.spoiler.btn-success.btn")[0].remove();
//remove warning
document.querySelectorAll("div.alert.alert-warning")[0].remove();

//bring correct to the top and make it bigger
{
  const correct_arr = Array.from(document.querySelectorAll(".list-group-item.list-group-item-success"));
  for (const correct of correct_arr) {
    correct.style.fontWeight = "bold";
    correct.style.fontSize = "2rem";
    const parent = correct.parentElement;
    correct.remove();
    parent.prepend(correct);
  }
}

//remove spacing between question and answ
Array.from(document.getElementsByClassName("floatright")[0].querySelectorAll("br")).forEach(v => v.remove());