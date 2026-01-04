

// ==UserScript==
// @name         Anti-Zerocks v2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  toujours contre zerocks
// @author       Positron
// @match        https://onche.org/topic/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/455947/Anti-Zerocks%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/455947/Anti-Zerocks%20v2.meta.js
// ==/UserScript==

((function(){
    var y = document.getElementsByClassName("message");
        if (y.length == 0) {
            return;
        }
     	const pseudo = "Zerocks"
     
          for(let i = 0; i < y.length; i++){
            if (y[i].innerHTML.indexOf(pseudo) !== -1) {
                let elem = y[i];
                let original = elem.innerHTML;
                let auteur = elem.getElementsByClassName("message-username")[0].innerText;
                if(auteur == pseudo)elem.innerHTML = `<h4 style='text-align:center;user-select:none;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${auteur}</h4>`;
                elem.style.cursor = "pointer";
                elem.setAttribute('onclick', `this.innerHTML=\`${original}\`;this.removeAttribute('onclick');this.style.cursor='default';`);
            }
          }

})())