// ==UserScript==
// @name     Quizlet fuzz remover
// @version  1.1
// @grant    none
// @include https://quizlet.com/*-flash-cards/
// @description Remove all flashcard answer fuzz
// @namespace https://greasyfork.org/users/22981
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509050/Quizlet%20fuzz%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/509050/Quizlet%20fuzz%20remover.meta.js
// ==/UserScript==

/// While the load more button exists, load more

let tryCounter = 1
console.log('script running')
interval_documentHidden = setInterval(function checker() {
  if (!document.hidden) {
    if (document.readyState === 'complete') {
      try{
        let scripts = document.getElementsByTagName('script');
        [].forEach.call(scripts, el => {
          if (el.src.includes('setSlug')) {el.remove();let found = true;console.log('found slug')}
        });
        let fuzz = document.querySelectorAll('[class*="b1sa2ccx"');
        [].forEach.call(fuzz, el => {
          el.classList.remove('b1sa2ccx') 
        });
      if (found = true) {console.log('script exiting');clearInterval(interval_documentHidden)}
    }
    catch{
      console.log('Waiting for elements to load. Try #'+tryCounter)
      tryCounter++;
      if (tryCounter > 5){
        console.log('Quizlet fuzz remover-Something wrong happened.')
        clearInterval(interval_documentHidden)}
    }
    }
  }
}, 1000);