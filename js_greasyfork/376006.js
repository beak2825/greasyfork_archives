// ==UserScript==
// @name         Endless google - Auto goto next page of google result
// @namespace    http://tampermonkey.net/
// @icon         https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/10346186_1645759148993427_6744387242769246115_n.jpg?_nc_cat=102&_nc_ht=scontent.fdad1-1.fna&oh=b460d464946fcbcb92d4783d903412ef&oe=5C8F4A97
// @version      0.2
// @description  Wait 2 second before auto switch to next result page of google search when you are botton of search page.
// @author       HuuKhanh
// @include      https://www.google.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376006/Endless%20google%20-%20Auto%20goto%20next%20page%20of%20google%20result.user.js
// @updateURL https://update.greasyfork.org/scripts/376006/Endless%20google%20-%20Auto%20goto%20next%20page%20of%20google%20result.meta.js
// ==/UserScript==

(function() {
    'use strict';

  console.log('goo goo');
  window.onscroll = function() {
      var doc = document.documentElement;
      var current = doc.scrollTop + window.innerHeight;
      var height = doc.offsetHeight;

      if (current == height) {
          console.log('At the bottom');
          console.log('Waiting 2 second to switch to next page')
          setTimeout(function(){
              var doc = document.documentElement;
              var current = doc.scrollTop + window.innerHeight;
              if (current == height) {
                  document.getElementById('pnnext').click();
              }
              else {
                  console.log('Next page didn\'t switch because you scrolled up');
              }
          }, 2000);
  }
};
})();