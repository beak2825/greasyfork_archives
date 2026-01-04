// ==UserScript==
// @name         Search pages in cabinet of tilda
// @namespace    https://dev-postnov.ru/search-pages-in-tilda-tempermonkey
// @version      1.0
// @description  This script help find need pages in list of cabinet tilda
// @author       https://dev-postnov.ru
// @match        https://members.tilda.cc/groups/?groupid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/440345/Search%20pages%20in%20cabinet%20of%20tilda.user.js
// @updateURL https://update.greasyfork.org/scripts/440345/Search%20pages%20in%20cabinet%20of%20tilda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add search field before list pages
    var pageList = document.querySelector('#member_to_group');
    var searchPage = document.createElement("input");

    searchPage.setAttribute('input', 'text');
    searchPage.setAttribute('class','js-search-page')
    searchPage.setAttribute('placeholder','Введите название страницы');
    searchPage.setAttribute('style','padding: 15px 20px; margin-bottom: 30px; width: 400px;font-size: 18px;');

    pageList.before(searchPage);

    var linksPages = document.querySelectorAll('.tlk__table-groups-link');



    searchPage.addEventListener('keyup', function(e) {
      var inputValue = e.target.value.toLowerCase();
      setTimeout(function() {
        linksPages.forEach(function(item,i){
            var filter = item.innerText.toLowerCase().indexOf(inputValue)
            if (filter < 0) {
              item.closest('.tlk__table-row').setAttribute('style','display: none;');
            } else {
              item.closest('.tlk__table-row').setAttribute('style','display: flex;');
            }
        });
      },1000)
    })

})();