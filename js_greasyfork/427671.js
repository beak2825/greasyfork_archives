// ==UserScript==
// @name        HNM - Heise Newsticker Minus
// @name:de     HNM - Heise Newsticker Minus
// @namespace   webattractive.de
// @match       https://www.heise.de/newsticker/
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      hexachlor
// @description Removes all "Heise Plus" and "heise-Angebot" articles from the newsticker list. Removal of offers (heise-Angebot) can be disabled.
// @description:de Entfernt alle "Heise Plus"- und "heise-Angebot"-Artikel aus der Newsticker-Liste. Entfernung von "heise-Angebot"-Artikeln kann deaktiviert werden.
// @downloadURL https://update.greasyfork.org/scripts/427671/HNM%20-%20Heise%20Newsticker%20Minus.user.js
// @updateURL https://update.greasyfork.org/scripts/427671/HNM%20-%20Heise%20Newsticker%20Minus.meta.js
// ==/UserScript==

// Config:
// Remove offers for webinars, etc. that are marked as "heise-Angebot"
let killOffersToo = true;

class HeiseMinus {
	run(removeOffers=false) {
    // 2021-06-08:
    // current element structure is:
    // div.archive
    // 		> section.archive__day
    // 			> ul.archive__list
    // 				> li
    // 					> article.a-article-teaser
    // 						> a.a-article-teaser__link.archive__link
    // 								> div.a-article-teaser__preceded-kicker-container
    // 										> div.a-article-teaser__content-container
    // 												> footer
    // 													> span.a-article-meta__text
    // 													> svg.heiseplus-logo-small
    let offers, matches;
    
    matches = document.querySelectorAll('.archive .a-article-teaser svg.heiseplus-logo-small');
    
    for (let i=0; i < matches.length; i++) {
      let parentListElem = matches[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      
      if (parentListElem === null) {
        continue;
      }
      
      parentListElem.style.display = 'none';
    }
    
    if (removeOffers) {
      offers = document.querySelectorAll('.archive .a-article-teaser span.a-article-meta__text');
      console.log('hnm - found ' + offers.length + ' offers.' );
      for (let i=0; i < offers.length; i++) {
        if (offers[i].textContent.trim() === 'heise-Angebot') {
		      console.log('hnm - offer matches.' );
          let parentListElem = offers[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
          if (parentListElem === null) {
            continue;
          }
          parentListElem.style.display = 'none';
        }
      }
    }
  }
}

let hm = new HeiseMinus();
hm.run(killOffersToo);