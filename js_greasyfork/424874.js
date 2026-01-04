// ==UserScript==
// @name         DuckDuckGo - Ad Remover
// @namespace    someAnonGuy
// @version      2021.04.11.001
// @description  Remove ads from the DuckDuckGo search results page
// @author       someAnonGuy
// @grant        none
// @match        *://duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/424874/DuckDuckGo%20-%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/424874/DuckDuckGo%20-%20Ad%20Remover.meta.js
// ==/UserScript==

(() => {
  function removeByClass(clsname) {
    const a1 = document.getElementsByClassName(clsname);
    for (let i = 0; i < a1.length; i += 1) a1[i].parentNode.removeChild(a1[i]);
  }
  (() => {
    setTimeout(() => {
      removeByClass('results--ads results--ads--main js-results-ads');
      removeByClass('result results_links highlight_a result--ad--good  result--ad  highlight_sponsored  sponsored result--ad--small result--url-above-snippet');
    }, 1000);
  })();
})();