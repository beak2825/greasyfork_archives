    // ==UserScript==
    // @name        Erhaltung der Moral
    // @namespace   Violentmonkey Scripts
    // @match       https://www.mydealz.de/*
    // @grant       none
    // @version     1.0
    // @author      helix
    // @description Removes offers by certain vendors from MyDealz
// @downloadURL https://update.greasyfork.org/scripts/421296/Erhaltung%20der%20Moral.user.js
// @updateURL https://update.greasyfork.org/scripts/421296/Erhaltung%20der%20Moral.meta.js
    // ==/UserScript==
    let merchantNames = [
      'Amazon',
      'NBB'
    ]
     
    javascript:setInterval(function(){
      let hits = document.querySelectorAll('span.cept-merchant-name')
      for (let node of hits) {
        if (merchantNames.includes(node.textContent.split('.', 1)[0])) {
          node.closest('article').remove()
        }
      }
    }, 400);