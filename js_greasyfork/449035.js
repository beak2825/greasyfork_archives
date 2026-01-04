// ==UserScript==
// @name         ahoy injector
// @version       0.0.2
// @author        dEN5
// @include        https://yandex.ru/search/?text=*
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @grant         none
// @description yandex searcher for kinopoisk card
// @license MIT
// @namespace https://greasyfork.org/users/739921
// @downloadURL https://update.greasyfork.org/scripts/449035/ahoy%20injector.user.js
// @updateURL https://update.greasyfork.org/scripts/449035/ahoy%20injector.meta.js
// ==/UserScript==

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}



window.onload = function() {
    const panel = document.querySelector('div[class^="entity-search entity-search_entref_"]')
    var observer = new MutationObserver(function(mutations) {
        const panelButtons = panel.querySelector('div[class="entity-search__sites"] > div[class^="Root"] > div[class^="EntitySites"]')
        const firstElementChild = panelButtons.firstElementChild
        const id_movie = firstElementChild.getAttribute("href").toString().trim().match(/(?<id>\/\d*)/gi)[3].replace("/","");
        let btnView = createElementFromHTML(`<a  target="_blank" href="https://4h0y.gitlab.io/#${id_movie}" class="Button2 Button2_size_m Button2_view_clear Button2_type_link EntitySites-Button"><div class="EntitySites-Icon "></div><span class="Button2-Text">Начать просмотр</span></a>`)
        panelButtons.appendChild(btnView)
        observer.disconnect();

    });
    observer.observe(panel, {attributes: false, childList: true, characterData: false, subtree:true});



};

