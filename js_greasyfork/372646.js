
// ==UserScript==
// @name     Trump Filter on Newspages (Nzz)
// @description Removes Content containing the word 'Trump' (or other self defined)
// @a
// @version  1
// @grant    none
// @include     https://www.nzz.ch/*
// @run-at document-end
// @namespace https://greasyfork.org/users/216079
// @downloadURL https://update.greasyfork.org/scripts/372646/Trump%20Filter%20on%20Newspages%20%28Nzz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372646/Trump%20Filter%20on%20Newspages%20%28Nzz%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

function hide_political() {
  let searchables = [
    			{selector: 'span.zzteaser__title-name', parentClass: 'zzteaser'},
    			{selector: 'div.zzteaser__lead', parentClass: 'zzteaser'},
    			{selector: 'div.title__name', parentClass: 'teaser'},
    			{selector: 'div.teaser__lead', parentClass: 'teaser'}
                    ]

  const findAncestor = (el, cls) => {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
	}

  searchables.forEach((search) => {
    let elements = document.querySelectorAll(search.selector)
    elements.forEach(elem => {
      if(elem.style.display !== 'none' && elem.innerText.includes('Trump')) {
        console.log('+elem', elem)
        let el = findAncestor(elem, search.parentClass)
        console.log('++found', el)
        if (el) el.style.display = 'none'
      }
    })
  })
}
hide_political()

window.setInterval(function(){
  hide_political();
}, (60000));
    // Your code here...
})();