// ==UserScript==
// @name DealabsLinks
// @author neFAST
// @namespace HandyUserscripts
// @description Liens sur Dealabs en clair
// @version 0.0.4
// @license Creative Commons BY-NC-SA
// @include http*://*dealabs.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/463314/DealabsLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/463314/DealabsLinks.meta.js
// ==/UserScript==

function cleanLink() {
  var links = document.getElementsByClassName('link');
  for (var i=0, max=links.length; i < max; i++) {
      var target = links[i].getAttribute('title');
      // Si ce n'est pas un lien, alors le lien est le texte lui-même (lien trop court donc non réduit)
      if (!/http/.test(target)) {
          target = links[i].innerHTML;
      }
      links[i].setAttribute('href', target);
      links[i].innerHTML = target;
  }
}

function waitForElement(els, func, timeout = 100) {
    const queries = els.map(el => document.querySelector(el));
    if (queries.every(a => a)) {
        func(queries);
    } else if (timeout > 0) {
        setTimeout(waitForElement, 300, els, func, --timeout);
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

waitForElement([".commentList-comment"], () => {
  setTimeout(function () {
    $("button").on("click", async function(event){
      await delay(500);
      cleanLink();
    })
  }, 2000);
});

cleanLink();