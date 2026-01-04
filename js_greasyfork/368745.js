// ==UserScript==
// @name         Google search results arrow key navigation
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Enable arrow key navigation through google search results
// @author       Sandro Bürki
// @include      /^https?://www\.google\.[^/]*/search\?/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368745/Google%20search%20results%20arrow%20key%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/368745/Google%20search%20results%20arrow%20key%20navigation.meta.js
// ==/UserScript==

// config constants
const resultContainerClass = 'tF2Cxc';
const mainResultLinkContainerClass = 'yuRUbf';
const subResultLinkClass = 'l';


$(document).ready(function() {

  let linkPointer = -1;
  let resultLinks;
  let queryInputField;

  $(document).keydown(function(e) {
    console.log(e.which);
    switch (e.which) {
      case 38: // up
        resultLinks = findResultLinks();

        linkPointer--;
        if (resultLinks[linkPointer]) {
          resultLinks[linkPointer].focus();
        }
        return false;
      case 40: // down
        resultLinks = findResultLinks();

        linkPointer++;
        if (resultLinks[linkPointer]) {
          resultLinks[linkPointer].focus();
        }
        return false;
      case 8: // backspace
        queryInputField = document.querySelector('input[name="q"]');
        if (document.activeElement.tagName === 'INPUT') {
            return;
        }
        if (!queryInputField.length) {
          var tmp = queryInputField.value;
          console.log(tmp);
          queryInputField.focus();
          queryInputField.value = '';
          queryInputField.value = tmp;
        }
        break;
      case 13: // enter
    }
  });
});

function findResultLinks() {
  let resultLinks = [];
  const resultContainers = document.getElementsByClassName(resultContainerClass);

  for (let i = 0; i < resultContainers.length; i++) {
    const mainResultLink = resultContainers[i].querySelector('.' + mainResultLinkContainerClass + ' > a');

    const subResultLinks = document.querySelectorAll('a.' + subResultLinkClass);
    console.log(subResultLinks);

    resultLinks.push(mainResultLink);
    resultLinks.concat(subResultLinks);
  }

  return resultLinks;
}
