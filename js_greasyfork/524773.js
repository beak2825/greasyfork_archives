// ==UserScript==
// @name        Remove annoying topics from Reddit
// @name:it     Rimuovi gli argomenti fastidiosi da Reddit
// @namespace   StephenP
// @match       https://www.reddit.com/*
// @grant       none
// @version     0.1
// @author      StephenP
// @description Remove annoying topics from Reddit by hiding posts that include specific keywords. Edit "const kWList" to change the keyword.
// @description:it Rimuovi gli argomenti fastidiosi da Reddit nascondendo i post che includono determinate parole chiave. Modifica "const kWList" per cambiare le parole chiave.
// @license     CC-BY-NC-4.0
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/524773/Remove%20annoying%20topics%20from%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/524773/Remove%20annoying%20topics%20from%20Reddit.meta.js
// ==/UserScript==
(function(){
  const kWList=["Trump","Musk","Solana","crypto","coin"];
  var style=document.createElement("STYLE");
  style.innerText=generateCSS(kWList);
  document.head.appendChild(style)
})();

function generateCSS(kWList){
  let css=""
  for(let k of kWList){
    css+="article[aria-label*="+k+"], ";
  }
  return css.slice(0,css.length-2)+"{display: none}";
}