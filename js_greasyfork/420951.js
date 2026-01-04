// ==UserScript==
// @name     4chan egg puns
// @description Wonder Egg Priority shitposting
// @version  2
// @grant    none
// @include *//boards.4chan.org/*
// @include *//boards.4channel.org/*
// @namespace https://greasyfork.org/users/141341
// @downloadURL https://update.greasyfork.org/scripts/420951/4chan%20egg%20puns.user.js
// @updateURL https://update.greasyfork.org/scripts/420951/4chan%20egg%20puns.meta.js
// ==/UserScript==
function process() {
  posts = document.getElementsByClassName('postMessage');
  for (var post of posts) {
    for (var i = 0; i < post.childNodes.length; ++i) {
      var node = post.childNodes[i];
      if (node.nodeName == '#text') {
        node.textContent = node.textContent
          .replaceAll('ex', 'eggs')
          .replaceAll('EX', 'EGGS')
          .replaceAll('Ex', 'Eggs')
        	.replaceAll(/eg(?!g)/g, 'egg')
        	.replaceAll(/EG(?!G)/g, 'EGG')
        	.replaceAll(/Eg(?!g)/g, 'Egg');
      }
    }
  }
}
process();
document.addEventListener('4chanXInitFinished', function(e) {
  process();
});
document.addEventListener('ThreadUpdate', function(e) {
  process();
});
