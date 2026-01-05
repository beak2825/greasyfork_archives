// ==UserScript==
// @name         SyrupRemover
// @namespace    syrup
// @version      0.1
// @description  bye bye syrupman
// @author       You
// @include        http://boards.4chan.org/pol/*
// @include		 http://boards.4chan.org/int/*
// @include        https://boards.4chan.org/pol/*
// @include		 https://boards.4chan.org/int/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13721/SyrupRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/13721/SyrupRemover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var HidePosts = function () {
  var target_posts = document.querySelectorAll('span[title="Canada"]');
  var count = 0;
  for (var i = 0; i < target_posts.length; i++) {
    var post = target_posts[i].parentNode.parentNode.parentNode.parentNode;
    post.style.display = 'none';
    count++;
  }
  console.log(count + ' syrups removed');
};
function omega(data1, data2) {
  HidePosts();
}
var clickExpandHide = function () {
  var mo = new MutationObserver(omega);
  var options = {
    childList: true,
    subtree: true
  }; //equ DOMSubtreeModified
  var targets = document.querySelectorAll('div[class="board"]');
  for (var i = 0; i < targets.length; i++) {
    var t = targets[i];
    mo.observe(t, options);
  }
};
HidePosts();
clickExpandHide();
