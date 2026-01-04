// ==UserScript==
// @name        Wikipedia Category Table Auto Expand
// @description Automatically expand all the collapsed category tables
// @icon        https://en.wikipedia.org/static/favicon/wikipedia.ico
// @namespace   https://greasyfork.org/users/113252-garrison-baird
// @include     *://*.wiki*.org/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31149/Wikipedia%20Category%20Table%20Auto%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/31149/Wikipedia%20Category%20Table%20Auto%20Expand.meta.js
// ==/UserScript==

function expand(){
  Array.prototype.slice.call(window.document.querySelectorAll('table[id^="collapsibleTable"]'), 0).forEach(function(el){
  	Array.prototype.slice.call(el.querySelectorAll('tr[style*="display: none;"]'), 0).forEach(function(el){
  		//el.style.display = 'table-row';
  	});
    if (el.querySelectorAll('tr[style*="display: none;"]').length > 0){
      el.querySelector('a[id*="collapseButton"]').click();
    }
  });
}

function removeAutocollapse(){
  Array.prototype.slice.call(window.document.querySelectorAll('table[class*="autocollapse"]'), 0).forEach(function(el){
  	el.classList.remove('autocollapse');
  });
  Array.prototype.slice.call(window.document.querySelectorAll('table[class*="collapsed"]'), 0).forEach(function(el){
  	el.classList.remove('collapsed');
  });
}

window.addEventListener('load', function(){
  setTimeout(expand, 500); 
});

window.document.addEventListener('DOMContentLoaded', function(){
  removeAutocollapse();
});
