// ==UserScript==
// @name        insta - no sponsors
// @namespace   https://github.com/amcginn
// @match       https://www.instagram.com/
// @grant       none
// @license     CC-BY-4.0
// @version     1.0.1
// @author      amcginn
// @description remove sponsored post content from instagram.com
// @downloadURL https://update.greasyfork.org/scripts/466239/insta%20-%20no%20sponsors.user.js
// @updateURL https://update.greasyfork.org/scripts/466239/insta%20-%20no%20sponsors.meta.js
// ==/UserScript==

function removeSponsored() {
  let elements = document.getElementsByTagName('use');

  Array.from(elements).forEach( (element) => {
    let article = element.closest('article');
    if (article != null) {
      article.innerHTML = "<span>&nbsp;&nbsp;Removed sponsored post</span>";
      console.log('removed element')
    }
  })
}

window.addEventListener('load', function() {
  setInterval(removeSponsored, 5000);
});
