// ==UserScript==
// @name         tiwar cave
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cave automatization
// @author       You
// @match        *://tiwar.ru/cave/*
// @icon         
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459739/tiwar%20cave.user.js
// @updateURL https://update.greasyfork.org/scripts/459739/tiwar%20cave.meta.js
// ==/UserScript==

function fuu() {
    var hrefs = document.getElementsByTagName('a');
    var notEnughtHealth = document.body.innerHTML.includes('Для нападения надо минимум');

for (let i = 0; i < hrefs.length; i++) {
  if(notEnughtHealth && hrefs[i].attributes.href.value.includes('/cave/runaway')){
    hrefs[i].click();
    break;
  }
  if (!notEnughtHealth && hrefs[i].attributes.href.value.includes('/cave/attack')) {
    hrefs[i].click();
    break;
  }
  if (hrefs[i].attributes.href.value.includes('/cave/down')) {
    hrefs[i].click();
    break;
  }
  if (hrefs[i].attributes.href.value.includes('/cave/speedUp')) {
    hrefs[i].click();
    break;
  }
  if (hrefs[i].attributes.href.value.includes('/cave/gather')) {
    hrefs[i].click();
    break;
  }

  }
}

(function() {
    setTimeout(fuu, 500);
})();