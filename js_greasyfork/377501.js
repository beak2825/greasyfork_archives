// ==UserScript==
// @name ALFastSearch
// @namespace Morimasa
// @author Morimasa
// @description Adds quicksearch links to entries
// @match https://anilist.co/*
// @version 0.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377501/ALFastSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/377501/ALFastSearch.meta.js
// ==/UserScript==
const iconmangadex = 'https://mangadex.org/images/misc/navbar.svg'

new MutationObserver(() => {
    if (window.location.href.includes('/manga/', 18)) {
      try{
        const title = document.getElementsByClassName('content')[0].getElementsByTagName('h1')[0];
        const format = document.getElementsByClassName('data')[0].getElementsByClassName('value')[0].innerText;
        if (!title.dataset['mangadex'] && format!=='Light Novel'){
          title.dataset['mangadex'] = true;
          title.innerHTML+=` <a href="https://mangadex.org/quick_search/${title.innerText}" target="_blank"><img src="${iconmangadex}" height=20></a>`
        }
      }
       catch{}
    }
}).observe(document.getElementById('app'), {childList: true, subtree: true})