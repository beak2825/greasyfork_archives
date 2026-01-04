// ==UserScript==
// @name        AOTY fixer
// @namespace   Violentmonkey Scripts
// @match       https://www.albumoftheyear.org/
// @match       https://www.albumoftheyear.org/releases/this-week/
// @match       https://www.albumoftheyear.org/artist/*/
// @grant       none
// @version     1.0
// @author      reveewer
// @description 2/25/2023, 2:58:37 PM
// @downloadURL https://update.greasyfork.org/scripts/462639/AOTY%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/462639/AOTY%20fixer.meta.js
// ==/UserScript==
let url = document.URL;
var index1 = 0;
var index2 = 0;
var index3 = 0;
var index4 = 0;
var index5 = 0;
var index6 = 6;
var index7 = 0;
//ratings hider
for (i=0; i<document.getElementsByClassName("ratingRowContainer").length;i++){
  const ratingHider = document.getElementsByClassName("ratingRowContainer")[index1]
  ratingHider.style.display = 'none';
  index1 = index1 + 1;
}
//popular reviews hider
for (i=0; i<document.getElementsByClassName("userReviewBlock").length;i++){
  const popularHider = document.getElementsByClassName("userReviewBlock")[index2]
  popularHider.style.display = 'none';
  index2 = index2 + 1;
}
//user best songs hider
for (i=0; i<document.getElementsByClassName("trackListTable").length;i++){
  const bestSongsHider = document.getElementsByClassName("trackListTable")[index3]
  bestSongsHider.style.display = 'none';
  index3 = index3 + 1;
}
//user's and critic's best albums hider
for (i=0; i<document.getElementsByClassName("listItemSmall").length;i++){
  const bestAlbumsHider = document.getElementsByClassName("listItemSmall")[index4]
  bestAlbumsHider.style.display = 'none';
  index4 = index4 + 1;
}
//news hider
for (i=0; i<document.getElementsByClassName("newsBlockLarge").length;i++){
  const newsHider = document.getElementsByClassName("newsBlockLarge")[index5]
  newsHider.style.display = 'none';
  index5 = index5 + 1;
}
//recently added hider


if (url == "https://www.albumoftheyear.org"){
  for (i=0; i<document.getElementsByClassName("albumBlock small").length;i++){
    const recentHider = document.getElementsByClassName("albumBlock small")[index6]
    recentHider.style.display = 'none';
    index6 = index6 + 1;
  }
}





