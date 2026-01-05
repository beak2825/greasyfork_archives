// ==UserScript==
// @name        hosta list links
// @namespace   hostalists
// @include     http*://www.hostalists.org/*
// @version     1
// @grant       none
// @description Userscript to add a few helpful links to each listed hosta
// @downloadURL https://update.greasyfork.org/scripts/15591/hosta%20list%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/15591/hosta%20list%20links.meta.js
// ==/UserScript==


(function() {
  const HOSTA_LIST_ITEM_SELECTOR = 'h1 ~ table li, h1 ~ ul li';
  const MAX_NAME_LENGTH = 30;
  const SEARCH_TOKEN = '%s';
  const SEARCHES = {
    GOOGLE: {
      label: 'G',
      title: 'Google',
      url: 'https://www.google.com/search?q="%s" hosta',
    },
    GOOGLE_IMAGES: {
      label: 'img',
      title: 'Google Images',
      url: 'https://www.google.com/search?q="%s" hosta&tbm=isch',
    },
    HOSTA_LIBRARY: {
      label: 'HL',
      title: 'Hosta Library',
      url: 'https://www.google.com/search?q="%s"+site%3Ahostalibrary.org&btnI=1',
    },
    FRANSEN: {
      label: 'Fr',
      title: 'Fransen',
      url: 'https://www.google.com/search?q="%s"+site%3Ahostaparadise.com&btnI=1',
    },
    GARDENWEB: {
      label: 'GW',
      title: 'GardenWeb forums',
      url: 'https://www.google.com/search?q="%s" hosta+site%3Aforums.gardenweb.com&btnI=1',
    },
  };
    
  const LIST_ITEM_CLASS = 'link-decorated-hosta-li';
  const COMMON_CLASS_NAME = 'helper-link';
  const EXPANDED_CLASS = 'expanded';
  const STYLE = `
    .${LIST_ITEM_CLASS} {
      cursor: pointer;
      cursor: alias;
    }
    
    .${LIST_ITEM_CLASS} > .${COMMON_CLASS_NAME} {
      color: #006B45;
      display: none;
    }
    
    .${LIST_ITEM_CLASS}:hover > .${COMMON_CLASS_NAME},
    .${LIST_ITEM_CLASS}.${EXPANDED_CLASS} > .${COMMON_CLASS_NAME} {
      display: inline;
    }
  `;
  
  //////////////
  
  activate();
  
  //////////////
  
  function activate() {
    var listItems = document.querySelectorAll(HOSTA_LIST_ITEM_SELECTOR);
    
    addLinks(listItems);
    addClickHandler();
    addStyle();
  }
  
  function addLinks(hostaListItems) {    
    for (var i = 0, listItem; listItem = hostaListItems[i]; i++) {
      var hosta = listItem.innerHTML.replace(/^\s*('|")|('|")\s*$/g, '');
      var links = makeLinks(hosta);
      for (var j = 0, link; link = links[j]; j++) {
        listItem.innerHTML += ' ';
        listItem.appendChild(link);      
      }
      listItem.className += ` ${LIST_ITEM_CLASS}`;
    }
    
    function makeLinks(hostaName) {
      var links = [];
      if (!isHostaName(hostaName)) return links;
      for (var searchKey in SEARCHES) {
        if (!SEARCHES.hasOwnProperty(searchKey)) continue;
        var search = SEARCHES[searchKey];
        var url = search.url.replace(SEARCH_TOKEN, encodeURIComponent(hostaName));
        var link = makeLink( search.label, search.title, url );
        links.push(link);
      }
      return links;
    }

    function makeLink(label, title, url) {
      var a = document.createElement('a');
      var siteClass = title.replace(/ /g, '-').toLowerCase();
      a.className = `${COMMON_CLASS_NAME} ${siteClass}`;
      a.href = url;
      a.title = title;
      a.target = '_blank';
      a.innerHTML = label;
      return a;
    }
    
    function isHostaName(term) {
      if (term.length > MAX_NAME_LENGTH) return false; // too long
      if (term.indexOf('<') != -1) return false; // contains HTML
      if (term.indexOf('.') != -1) return false; // contains a sentence
      return true;
    }
    
  }
  
  function addClickHandler() {
    document.body.addEventListener('click', function(event) {
      if (event.target.className.indexOf(LIST_ITEM_CLASS) == -1) return;
      if (event.target.className.indexOf(EXPANDED_CLASS) != -1) {
        event.target.className = event.target.className.replace(EXPANDED_CLASS, '');
      } else {
        event.target.className += ` ${EXPANDED_CLASS}`;
        event.target.className = event.target.className.replace('  ', ' ');
      }
    });
  }
  
  function addStyle() {
    var styleBlock = document.createElement('style');
    styleBlock.innerHTML = STYLE;
    document.head.appendChild(styleBlock);
  }
  
})();