// ==UserScript==
// @name         GGn quicksearch default filter
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Use the default filter in quicksearch
// @author       lucianjp
// @match        https://gazellegames.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/393401/GGn%20quicksearch%20default%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/393401/GGn%20quicksearch%20default%20filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var filter = GM_getValue('filter');
  if(filter == null){
    let http = new XMLHttpRequest();
    http.responseType = "document";
    http.open('GET', 'torrents.php', true);
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        setFilter(parseFilter(http.responseXML));
      }
    };
    http.send();
  } else {
    handleQuickSearch(filter);
  }

  if (window.location.pathname == '/torrents.php' && !/id=/.test(window.location.search)) {
    let btn = document.querySelector('#torrentbrowse .submit input[name="cleardefault"]');
    if(btn){
      btn.addEventListener('click', function(){
        setFilter('');
      });
    }

    btn = document.querySelector('#torrentbrowse .submit input[name="setdefault"]');
    if(btn){
      btn.addEventListener('click', function(){
        setFilter(parseFilter(document));
      });
    }
  }

  function setFilter(value){
    GM_setValue('filter', value);
    handleQuickSearch(value);
  }

  function handleQuickSearch(filter){
    const $form = document.querySelector('#searchbar_torrents>form');
    $form.querySelectorAll('input[type="hidden"]').forEach($el => $el.remove());
    $form.innerHTML += filter;
  }

  function parseFilter(doc){
    const formData = new FormData(doc.querySelector('#torrentbrowse>form[name="filter"]'));
    let builder = '';
    for (var [key, value] of formData.entries()) {
      if(key !== "groupname") {
        builder += `<input type="hidden" name="${key}" value="${value}" />`
      }
    }
    return builder;
  }
})();