// ==UserScript==
// @name     Solr logs - dates fixer
// @author	 Jędrzej Flak 
// @version  1
// @grant    CSP
// @include  */solr/*
// @run-at   document-end
// @license MIT
// @description  Skrypt poprawiający daty w solrze (wyświetlanie dat w zakładce logging "/solr/#/~logging")
// @namespace https://greasyfork.org/users/1350299
// @downloadURL https://update.greasyfork.org/scripts/503394/Solr%20logs%20-%20dates%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/503394/Solr%20logs%20-%20dates%20fixer.meta.js
// ==/UserScript==

function rebuildDates() {
  var dates = document.querySelectorAll('#viewer table tbody td.span:first-child span')
	dates.forEach((element) => {
  	var text = element.innerText;
    var d = new Date(text);

    element.innerText = d.toISOString().replace('T', "\n").replace('Z', '');
  });
}

function observeDOM(targetNode, callback2) {
    var config = { childList: true };
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                callback2();
            }
        }
    };
    var observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
}

function resetTimersBuilder() {
  setTimeout(() => {
    rebuildDates()
    observeDOM(document.querySelector('#viewer table'), rebuildDates)
  },250); 
  
}

(function() {
	'use strict';
  window.addEventListener('hashchange', function(){
    if (window.location.hash == '#/~logging') {
      resetTimersBuilder()
    }
  });
  
  if (window.location.hash == '#/~logging') {
     		resetTimersBuilder()
  }
})();