// ==UserScript==
// @name        Show Alternates Smallable
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://*.smallable.com/*
// @grant       none
// @version     1.0.2
// @author      Hoax017
// @description Show modal with page info
// @downloadURL https://update.greasyfork.org/scripts/487384/Show%20Alternates%20Smallable.user.js
// @updateURL https://update.greasyfork.org/scripts/487384/Show%20Alternates%20Smallable.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
let us = document.querySelector("[class*=UserSettings_userSetting]")
let magicButton = document.createElement("button");
magicButton.textContent = 'Magic';
magicButton.addEventListener("click", function  () {
function  copyText(text) {
  navigator.clipboard.writeText(text);
}

function showAlt(alt)
{
return "<spanstyle=\"cursor:copy\"onclick='copyText(\"" + alt + "\")'>" + alt + "</span>"
}
function removeElement(element)
{
element && element.parentNode && element.parentNode.removeChild(element);
}
function createModal(textModal)
{
removeElement(document.getElementById('myDialog'));
let styleModal = "\"border:1pxsolid#ddd;width:60%;margin:auto;padding:20px\"";
let myModal = "<dialog id='myDialog' style=" + styleModal + " onClick='/*document.getElementById(\"myDialog\").close()*/'>" + textModal + "</dialog>";
document.body.insertAdjacentHTML("beforeend", myModal);
document.getElementById('myDialog').showModal();
}

const title = document.title ? document.title : "NO TITLE";
const description = document.head.querySelector("[name~=description][content]") ? document.head.querySelector("[name~=description][content]").content : 'NO TITLE';
const canonical = document.head.querySelector("[rel~=canonical]") ? document.head.querySelector("[rel~=canonical]").href : "NO CANONICAL";
let equalAdress = document.location.href === canonical ? "same page" : "other page";
let altFr = document.head.querySelector("[hreflang=fr]")?.href || document.location.href;
let altDe = document.head.querySelector("[hreflang=de]")?.href || document.location.href;
let altEn = document.head.querySelector("[hreflang=en]")?.href || document.location.href;
let altEs = document.head.querySelector("[hreflang=es]")?.href || document.location.href;
let altIt = document.head.querySelector("[hreflang=it]")?.href || document.location.href;
const resultText = "<b>Title :</b><br>" + title + "<br><br><b>Description :</b><br>" + description + "<br><br><b>Canonical : </b><br>" + canonical + "<br>" + equalAdress + "<br><b>Alternates</b><br>FR : " + showAlt(altFr) + "<br>EN : " + showAlt(altEn) + "<br>DE : " + showAlt(altDe) + "<br>ES : " + showAlt(altEs) + "<br>IT : " + showAlt(altIt) + "<br><button onClick=\"document.getElementById(\'myDialog\').close()\">Fermer</button>";
createModal(resultText);
});

setTimeout(_ => us.appendChild(magicButton), 2000)