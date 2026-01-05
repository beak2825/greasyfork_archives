// ==UserScript==
// @name        Rock Paper Shotgun ImgAlt2Title
// @description On the "Rock, Paper, Shotgun" website, set img tags title attributes with (often humorous) alt text so that browsers display it on mouse hover.
// @author      esabouraud
// @namespace   https://greasyfork.org/users/4492-eric-sabouraud
// @include     http://www.rockpapershotgun.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4257/Rock%20Paper%20Shotgun%20ImgAlt2Title.user.js
// @updateURL https://update.greasyfork.org/scripts/4257/Rock%20Paper%20Shotgun%20ImgAlt2Title.meta.js
// ==/UserScript==

var altImgs;
altImgs = document.evaluate('//img[@src and not(@title) and @alt]',
  document,
  null,
  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
  null);
 

for (var i=0; i != altImgs.snapshotLength; ++i) {
  var thisImg = altImgs.snapshotItem(i);
   thisImg.title = thisImg.alt;
}
