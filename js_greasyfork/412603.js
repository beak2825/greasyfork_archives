// ==UserScript==
// @name     Jisho.org #sentence highlight searched word
// @description Highlight the search terms in the sentence results
// @version  1.2
// @grant    none
// @match    https://jisho.org/search/*
// @namespace https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/412603/Jishoorg%20sentence%20highlight%20searched%20word.user.js
// @updateURL https://update.greasyfork.org/scripts/412603/Jishoorg%20sentence%20highlight%20searched%20word.meta.js
// ==/UserScript==


(function () {
  'use strict';

  var search_line=document.getElementById('keyword').value;
  if(search_line.search('#sentence') >= 0) {
    var terms = search_line.replace(/#sentence[s]?/,'').trim().split(/\s+/);
    
    for(var term of terms) {
      for(var s of document.getElementsByClassName('japanese_sentence')) {
        for(var e of s.children) {
          //console.log(e.innerHTML);
          for(var ee of e.children) {
            check_element(ee, "("+term+")");
          }
        }
      }
      
      for(var s of document.getElementsByClassName('english_sentence')) {
        for(var e of s.getElementsByClassName('english')) {
          check_element(e, "\\b("+term+")\\b");
        }
      }
    }
  }
})();

function check_element(elem, regex) {
  elem.innerHTML = elem.innerHTML.replace(new RegExp(regex,'i'),'<span style="background-color:rgba(255,255,255,0.2)">$1</span>');
}