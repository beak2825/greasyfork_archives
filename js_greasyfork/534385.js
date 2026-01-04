// ==UserScript==
// @name         Masnavi Mobile
// @description  Makes reading masnavi.net easier on mobile
// @version      1.2
// @grant        none
// @include      http://masnavi.net/*
// @license      MIT
// @namespace https://greasyfork.org/users/1463653
// @downloadURL https://update.greasyfork.org/scripts/534385/Masnavi%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/534385/Masnavi%20Mobile.meta.js
// ==/UserScript==


document.getElementsByClassName("border-container")[0].style.border = "0px" 

const divs = document.querySelectorAll('div');

divs.forEach(div => {
  if (div.style.width === '75%') {
    div.style.width = "100%";
  }
  
  div.style.border = "0px";
});



function replaceDoubleAsterisksWithBr(element) {
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split('**');
      if (parts.length > 1) {
        const fragment = document.createDocumentFragment();
        parts.forEach((part, index) => {
          fragment.appendChild(document.createTextNode(part));
          if (index < parts.length - 1) {
            fragment.appendChild(document.createElement('br'));
          }
        });
        node.replaceWith(fragment);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      replaceDoubleAsterisksWithBr(node);
    }
  });
}

replaceDoubleAsterisksWithBr(document.body);

