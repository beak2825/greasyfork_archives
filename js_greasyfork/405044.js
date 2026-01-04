// ==UserScript==
// @name         Twitter Politics/Keyword Hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Self censorship and removing news on twitter. Removes the explore buttons, trending side bar, and filters certain words.
// @author       me lol
// @match        https://twitter.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/405044/Twitter%20PoliticsKeyword%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/405044/Twitter%20PoliticsKeyword%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //CONFIGURE
    const filterWords =[
      "word1",
      "word2",
      "word3",
    ];
    const filterWordReplacement = "";
    //END CONFIGURE



    const filterRegex = new RegExp(new RegExp(filterWords.reduce((result, fw) => (result + "|" + fw ))), 'i');

    const targetNode = document.querySelector("[id='react-root']");
    const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {

              //Remove Trending
              mutation.target.querySelectorAll('[aria-label="Timeline: Trending now"]').forEach(e => e.parentNode.removeChild(e));
              //Remove Explore
              mutation.target.querySelectorAll('[href="/explore"]').forEach(e => e.parentNode.removeChild(e));
              //Only remove tweets in which the content of the tweet contains a filteredword, not the username. If the username contains a filtered word, replace it.
              mutation.target.querySelectorAll('[role="article"]').forEach(e => {
                //
              const listoftweetlinks = e.querySelectorAll("a");
                  if(listoftweetlinks[1].innerHTML.match(filterRegex)){
                     listoftweetlinks[1].innerHTML = listoftweetlinks[1].innerHTML.replace(filterRegex, filterWordReplacement);
                  }



                if(e.innerText.match(filterRegex)){
                    e.parentNode.remove()
                }

            });
          });
        });
const observerOptions = {
  childList: true,
  attributes: true,
  subtree: true //Omit or set to false to observe only changes to the parent node.
}
observer.observe(targetNode, observerOptions);
})();