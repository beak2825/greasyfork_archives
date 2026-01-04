// ==UserScript==
// @name         Hotkey for Random Pocket article
// @namespace    rafaelc.org
// @version      0.1.6
// @description  Go to random Pocket article with a keypress.
// @author       Rafael Cavalcanti <https://rafaelc.org/dev>
// @license      Apache License 2.0
// @homepageURL  https://rafaelc.org/posts/reading-random-pocket-articles-with-a-hotkey/
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418513/Hotkey%20for%20Random%20Pocket%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/418513/Hotkey%20for%20Random%20Pocket%20article.meta.js
// ==/UserScript==

// jshint esversion: 6


const onKeyDown = (e) => {
  const keyAlt = e.altKey;
  const keyCtrl = e.ctrlKey;
  const keyShift = e.shiftKey;

  const keyCode = e.which === 0 ? e.charCode : e.keyCode;

  if (keyAlt && !keyCtrl && keyShift) {
    switch(keyCode){
      case 82: // match 'r' key
        goToRandomArticle();
        break;
            
      case 69: // match 'e' key
        searchPageOnPocket();
        break;
    }
  }
}

const goToRandomArticle = () => {
  document.location = 'https://getpocket.com/random';
}

const searchPageOnPocket = () => {
  const query = escape(document.title.substr(0, 20));
  const url = 'https://getpocket.com/my-list/search?query=' + query;
  document.location = url;
}


(function() {
  'use strict';
  document.addEventListener('keydown', onKeyDown);
})();