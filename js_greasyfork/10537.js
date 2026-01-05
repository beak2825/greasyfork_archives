// ==UserScript==
// @name        Hide TopCoder problem archive categories
// @namespace   kunaifirestuff
// @description Hides the category list in the topcoder problem archive, because knowing the categories of a problem can spoil the solution! (The categories are replaced with '...', click on them to toggle hidden-ness.)
// @include     http://community.topcoder.com/tc?module=ProblemArchive*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10537/Hide%20TopCoder%20problem%20archive%20categories.user.js
// @updateURL https://update.greasyfork.org/scripts/10537/Hide%20TopCoder%20problem%20archive%20categories.meta.js
// ==/UserScript==

var table = document.getElementsByTagName('b') [0].parentElement.parentElement.parentElement.parentElement;
var categoryArray = new Array(table.childElementCount - 9);
var hiddenText = '...';

for (var i = 3; i < table.childElementCount - 6; i++) {
  (function (i) {
    var cats = table.children[i].children[5];
    
    categoryArray[i - 3] = cats.textContent;
    cats.textContent = hiddenText;
    cats.setAttribute('align', 'center');
    
    cats.addEventListener('click', function () {
      if (cats.textContent == hiddenText) {
        cats.textContent = categoryArray[i - 3];
      } else {
        cats.textContent = hiddenText;
      }
    });
  }(i));
}
