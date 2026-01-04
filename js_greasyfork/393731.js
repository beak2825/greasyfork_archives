// ==UserScript==
// @name        AddMarkdown
// @namespace   Morimasa
// @description Do things
// @match       https://anilist.co/*
// @grant       none
// @version     0.01
// @author      Morimasa
// @downloadURL https://update.greasyfork.org/scripts/393731/AddMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/393731/AddMarkdown.meta.js
// ==/UserScript==
"use strict";

const markdownTemplates = [
  {t:"Bold", el:["<b>", "</b>"]},
  {t:"Italic", el:["<i>", "</i>"]},
  {t:"url", el:["<a href=\"URL HERE\">", "</a>"]},
  {t:"break line", el:["", "<br>"]},
  {t:"duplicate", el:["", `<b>This entry is locked and marked for deletion due to being a duplicate entry. You can find the other one <a href="URL">here</a>. </b><br><br>`]}
]

function wrapSelection(textarea, elName="<b>", endName="</b>") {
    const text = textarea.value,
          start = textarea.selectionStart,
          end = textarea.selectionEnd;
  
    textarea.value = `${text.slice(0, start)}${elName}${text.slice(start, end)}${endName}${text.slice(end)}`;
}

function buttonCreator({t, el}={}) {
  const textarea = document.querySelector("textarea"),
        butt = document.createElement("button"),
        [s, e] = el;
  
  butt.innerText = t;
  butt.addEventListener("click", ev => wrapSelection(textarea, s, e))
  textarea.dataset.injectedmarkdown = true;
  textarea.parentNode.prepend(butt)
}
// don't blame me if it burns your house
setInterval(()=>{
  const path = window.location.pathname.split("/");
  if (path[1] === "edit" && ["staff", "anime", "manga", "character"].includes(path[2])) {
    const injected = document.querySelector("textarea").dataset.injectedmarkdown;
    if (!injected && path[4] !== "submission") {
        markdownTemplates.reverse().forEach(buttonCreator)
    }
  }
}, 1000)