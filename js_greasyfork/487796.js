// ==UserScript==
// @name        Marketplace RE4 Sound
// @namespace   Dead Frontier
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant       none
// @version     1.2
// @author      Misery
// @description Marketplace RE4 Sound queue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/487796/Marketplace%20RE4%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/487796/Marketplace%20RE4%20Sound.meta.js
// ==/UserScript==

(function() {

  function main() {
    const src = "https://static.wikia.nocookie.net/residentevil/images/c/c1/Merchant_quote_-_What%27re_ya_buyin%27.ogg";
    const sound = new Audio(src);
    sound.play();
  }
  main();
  var element = document.getElementById("loadSelling"); //grab the element
element.onclick = function selling() {
    const src = "https://static.wikia.nocookie.net/residentevil/images/3/39/Merchant_quote_-_What%27re_ya_sellin%27.ogg";
    const sound = new Audio(src);
    sound.play();
}
})();