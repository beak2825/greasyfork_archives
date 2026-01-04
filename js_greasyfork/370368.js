// ==UserScript==
// @name         Coub Song Description
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add coub song author and title to coub description (if exist).
// @author       Kamil Spisak
// @match        https://coub.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370368/Coub%20Song%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/370368/Coub%20Song%20Description.meta.js
// ==/UserScript==

(function() {
     const musicTitleElement = document.querySelectorAll('[class="musicTitle"]')[0];
     const musicAuthorElement = document.querySelectorAll('[class="musicAuthor"]')[0];

     const musicTitle = musicTitleElement.innerText || musicTitleElement.textContent;
     const musicAuthor = musicAuthorElement.innerText || musicAuthorElement.textContent;

     console.log(`${musicAuthor} - ${musicTitle} `);

     const musicDescriptionDiv = document.createElement('div');
     musicDescriptionDiv.className = 'row';
     musicDescriptionDiv.innerHTML =`<div><span style="color: #999999; font-weight: lighter">Song: </span>${musicAuthor} - ${musicTitle}</div>`;
     musicDescriptionDiv.style = "padding: 20px 0px 0px 3px; font-size: 18px; font-weight: bold;";

     const coubDescriptionDiv = document.querySelectorAll('[class="coub__description"]')[0];
     coubDescriptionDiv.appendChild(musicDescriptionDiv);
})();