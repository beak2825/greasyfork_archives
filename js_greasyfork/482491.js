// ==UserScript==
// @name        Custom - rapidgator.net and 1fichier.com Show Status in Tab's Title
// @namespace   Violentmonkey Scripts
// @match       https://rapidgator.net/*
// @match       https://1fichier.com/*
// @grant       none
// @version     1.1
// @author      KeratosAndro4590
// @license     MIT
// @description Makes failed links more obvious by a tab's title alone.
// @downloadURL https://update.greasyfork.org/scripts/482491/Custom%20-%20rapidgatornet%20and%201fichiercom%20Show%20Status%20in%20Tab%27s%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/482491/Custom%20-%20rapidgatornet%20and%201fichiercom%20Show%20Status%20in%20Tab%27s%20Title.meta.js
// ==/UserScript==

// alert(window.location.href);

// rapidgator
if(document.querySelector("body > div.container > div.overall > div > div > h2 > span"))
  {
    document.title = "no - RG";
  }

if(window.location.href.startsWith("https://rapidgator.net/file/" || window.location.href.startsWith("https://rapidgator.net/article/")))
  {
    if(document.querySelector("body > div.container > div.overall > div > div.main-block.wide > div.in > div.text-block.file-descr > div > p > a")){
      document.title = "yes - RG";
    }
    else if(document.href = "https://rapidgator.net/article/premium"){
      document.title = "no - RG";
    }
  } // 1fichier
else if(window.location.href.startsWith("https://1fichier.com")){
    if(document.querySelector("body > form > table > tbody > tr:nth-child(1) > td:nth-child(3)"))
      {
        document.title = "yes - 1fichier.com";
      }
    else
      {
        document.title = "no - 1fichier.com";
      }
}