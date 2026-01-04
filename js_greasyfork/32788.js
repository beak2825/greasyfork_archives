// ==UserScript==
// @name        kcBlock
// @namespace   kcBlock@userscript.org
// @description Block Krautchan countries
// @include     https://krautchan.net/catalog/int
// @include     http://krautchan.net/catalog/int
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32788/kcBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/32788/kcBlock.meta.js
// ==/UserScript==

var block = ['ca','br','au','pl','tr','hu']; //hu = hungary?
var articles = document.querySelectorAll('article.thread.teaser');
Array.prototype.forEach.call(articles, function(art, i) {
  var postCountry = art.querySelector('img.post_country');
  for (var ii = 0; ii < block.length; ii++)
    if (postCountry.src.indexOf(block[ii] + '.png') !== -1)
      art.style.display = 'none';
});
