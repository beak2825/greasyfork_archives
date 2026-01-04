// ==UserScript==
// @name        AOTY rating remover
// @namespace   Violentmonkey Scripts
// @match       https://www.albumoftheyear.org/
// @match       https://www.albumoftheyear.org/releases/this-week/
// @match       https://www.albumoftheyear.org/artist/*/
// @grant       none
// @version     1.1
// @author      -
// @description Removes ratings
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460727/AOTY%20rating%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/460727/AOTY%20rating%20remover.meta.js
// ==/UserScript==

var index1 = 0;
var index2 = 0;
var index3 = 0;
var index4 = 0;
for (i=0; i<document.getElementsByClassName("ratingRowContainer").length;i++){
  const ratingHider = document.getElementsByClassName("ratingRowContainer")[index1]
  ratingHider.style.display = 'none';
  index1 = index1 + 1;
}

for (i=0; i<document.getElementsByClassName("userReviewBlock").length;i++){
  const popularHider = document.getElementsByClassName("userReviewBlock")[index2]
  popularHider.style.display = 'none';
  index2 = index2 + 1;
}
for (i=0; i<document.getElementsByClassName("trackListTable").length;i++){
  const bestSongsHider = document.getElementsByClassName("trackListTable")[index3]
  bestSongsHider.style.display = 'none';
  index3 = index3 + 1;
}
for (i=0; i<document.getElementsByClassName("listItemSmall").length;i++){
  const bestAlbumsHider = document.getElementsByClassName("listItemSmall")[index4]
  bestAlbumsHider.style.display = 'none';
  index4 = index4 + 1;
}