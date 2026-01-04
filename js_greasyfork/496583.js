// ==UserScript==
// @name     clash.gg case linker (battles)
// @version  2.1
// @grant    none
// @namespace https://clash.gg
// @description Turns case names seen in the battle UI into clickable links
// @match https://clash.gg/
// @match https://clash.gg/*
// @match https://clash.gg/csgo-case-battles
// @match https://clash.gg/csgo-case-battles/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496583/clashgg%20case%20linker%20%28battles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496583/clashgg%20case%20linker%20%28battles%29.meta.js
// ==/UserScript==
/* jshint esversion: 9 */
function getslug(n) {
  n = n.replaceAll(/(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu, ''); //emojis
 n = n.replaceAll("$", "dollar");
  n = n.replaceAll("%", "percent");
  n = n.replaceAll("<", "less");
  n = n.replaceAll("^", "");
  n = n.replaceAll(">", "greater");
  //n = n.replaceAll("-", "");
  n = n.replaceAll(" ", "-");
  n = n.replaceAll("&", "and");
  n = n.replaceAll("|", "or");
  n = n.replaceAll("=", "");
  n = n.replaceAll("{", "");
  n = n.replaceAll("}", "");
  n = n.replaceAll("[", "");
  n = n.replaceAll("]", "");
  n = n.replaceAll(";", "");
  n = n.replaceAll(",", "");
  n = n.replaceAll("/", "");
  return n;
}
function onGet() {
  var f = document.body.querySelector(".css-fhyd8n");
  if (f) {
    var a = document.createElement("a");
    a.setAttribute('href', "https://clash.gg/casescs2/"+getslug(f.innerText));
    a.innerText = f.innerText;
    a.style = "font-weight:bold;color:rgb(64, 94, 245);text-decoration:underline";
    f.innerText = "";
    f.appendChild(a);
  }
  var inte = setInterval(() => { //couldnt find a better way
  	if (!document.body.querySelector(".css-fhyd8n")) {
     clearInterval(inte);
      loadfunc();
      return;
    }
      var o = document.body.querySelector(".css-fhyd8n");
      if (o.innerText != "") {
        var a = document.createElement("a");
    		a.setAttribute('href', "https://clash.gg/casescs2/"+getslug(o.innerText));
    		a.innerText = o.innerText;
        a.style = "font-weight:bold;color:rgb(64, 94, 245);text-decoration:underline";
    		o.innerText = "";
    		o.appendChild(a);
    }
  }, 300);
}
const loadfunc = () => {
  if (document.body.querySelector(".css-fhyd8n")) {
   onGet();
  }
 const obs = new MutationObserver((mut, f) => {
   if (document.body.querySelector(".css-fhyd8n")) {
     obs.disconnect();
     onGet();
   }
 });
 obs.observe(document.body, {childList: true, subTree: true});
};
window.addEventListener("load", loadfunc);