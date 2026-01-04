// ==UserScript==
// @name KissAnime.ru Basic UI
// @match https://kissanime.ru/Anime/*
// @version 2019.05.20
// @description Removes every distraction when watching an anime, leaving only the episode list and next episode button
// @grant none
// @namespace openuserjs.org/users/rokie95
// @downloadURL https://update.greasyfork.org/scripts/383312/KissAnimeru%20Basic%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/383312/KissAnimeru%20Basic%20UI.meta.js
// ==/UserScript==

var divRemoveList = ["btnShowComments", "navbar", "headnav", "divDownload", "divFileName", "divTextQua", "footer", "switch"];
for(var i = 0; i < divRemoveList.length; i++) {
  document.getElementById(divRemoveList[i]).outerHTML = "";
}
document.getElementsByTagName("h3")[0].outerHTML = "";
document.getElementsByTagName("a")[0].outerHTML = "";
for(var i = 0; i < document.getElementsByTagName("a").length; i++) {
  if(!document.getElementsByTagName("a")[i].href.includes("https://kissanime.ru/Anime/"))
    document.getElementsByTagName("a")[i].outerHTML = "";
  if(document.getElementsByTagName("a")[i].innerHTML == "[ Back to top ]") {
    document.getElementsByTagName("a")[i].outerHTML = "";
  }
}
for(var i = 0; i < document.getElementsByClassName("clear").length; i++) {
    document.getElementsByClassName("clear")[i].outerHTML = "";
}
document.querySelectorAll('link[rel="stylesheet"], style')
  .forEach(elem => elem.parentNode.removeChild(elem));
for(var i in document.getElementsByTagName("div")) {
  try {
    if(document.getElementsByTagName("div")[i].attributes.style.nodeValue == "font-size: 15px; width: 854px; display: inline-block;") {
      document.getElementsByTagName("div")[i].outerHTML = "";
      i++;
    }
    if(document.getElementsByTagName("div")[i].attributes.style.nodeValue == "text-align: center; height: 100px; padding-top: 10px") {
      document.getElementsByTagName("div")[i].outerHTML = "";
      i++;
    }
  }catch{}
}