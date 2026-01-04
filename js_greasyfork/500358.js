// ==UserScript==
// @name        Intitola l'Aeroporto di Malpensa a chi vuoi tu
// @namespace   StephenP
// @match       https://*.milanomalpensa-airport.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      StephenP
// @license     MIT
// @description Scegli a chi intitolare l'Aeroporto di Malpensa: questo script rimpiazza ogni riferimento a Silvio Berlusconi con un nome a tua scelta. Intitola l'aeroporto a qualcuno di davvero degno, oppure divertiti a intitolarlo ad altri personaggi che hanno messo in imbarazzo il nostro paese.
// @downloadURL https://update.greasyfork.org/scripts/500358/Intitola%20l%27Aeroporto%20di%20Malpensa%20a%20chi%20vuoi%20tu.user.js
// @updateURL https://update.greasyfork.org/scripts/500358/Intitola%20l%27Aeroporto%20di%20Malpensa%20a%20chi%20vuoi%20tu.meta.js
// ==/UserScript==
/*
  Original script by JoinSummer (https://greasyfork.org/users/907515-joinsummer)
  Original script page: https://greasyfork.org/scripts/495283
*/
(async function(){
  var name=await getName();
  if(!name){
    name=setName();
    location.reload();
  }
  else{
    replaceName(name);
    GM_registerMenuCommand("Cambia nome", changeName, "C");
  }
})();
function changeName(){
  let name=setName();
  location.reload();
}
function replaceName(name) {
    'use strict';

    const replacements = new Map([
        ['Silvio Berlusconi', name[0]],
        ['Berlusconi', name[1]],
    ]);


    function replaceText(node) {
      //console.log(node.nodeType,node.nodeValue)
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            replacements.forEach((value, key) => {
                const regex = new RegExp(key, 'g');
                text = text.replace(regex, value);
            });
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(replaceText);
        }
    }

    replaceText(document.body);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
function setName(){
  let fullName="";
  let surname="";
  do{
    fullName=prompt("Indica il nome completo di colui/colei a cui vuoi intitolare l'aeroporto:")
  }while(!fullName);
  do{
    surname=prompt("Indica solo il cognome di colui/colei a cui vuoi intitolare l'aeroporto:")
  }while(!surname);
  GM_setValue("fullName",fullName);
  GM_setValue("surname",surname);
}
async function getName(){
  let fullName=await GM_getValue("fullName");
  let surname=await GM_getValue("surname");
  if(fullName&&surname){
		return [fullName,surname];
  }
  else{
    return;
  }
}