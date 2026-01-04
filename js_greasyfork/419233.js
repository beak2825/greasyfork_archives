// ==UserScript==
// @name         Anti-Zerocks
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Posi
// @match        https://onche.org/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419233/Anti-Zerocks.user.js
// @updateURL https://update.greasyfork.org/scripts/419233/Anti-Zerocks.meta.js
// ==/UserScript==

var y = document.getElementsByClassName("message");
    if (y.length == 0) {
        return;
    }

    const emojis = /\<div class\=\"message-username\"\>Zerocks\<\/div\>/

      for(let i = 0; i < y.length; i++){
        if (y[i].innerHTML.match(emojis)) {
            let elem = y[i];
            let original = elem.innerHTML;
            let auteur = elem.getElementsByClassName("message-username")[0].innerText;
            if(auteur == "Zerocks")elem.innerHTML = `<h4 style='text-align:center;user-select:none;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${auteur}</h4>`;
            elem.style.cursor = "pointer";
            elem.setAttribute('onclick', `this.innerHTML=\`${original}\`;this.removeAttribute('onclick');this.style.cursor='default';`);
        }
      }