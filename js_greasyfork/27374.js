// ==UserScript== 
// @name Block Jamin
// @namespace habs
// @description Hides all posts and threads from LetsRun.com's user 'jamin'
// @include http://www.letsrun.com/*
// @include https://www.letsrun.com/*
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/27374/Block%20Jamin.user.js
// @updateURL https://update.greasyfork.org/scripts/27374/Block%20Jamin.meta.js
// ==/UserScript==   

var authors = document.getElementsByClassName('author');

if (authors.length > 0) {
  for (i = 0; i < authors.length; i++) {
    reg = authors[i].getElementsByTagName('strong');
    if (reg.length > 0) {
      regname = reg[0].innerHTML;
      if (regname == 'jamin') {
        child = authors[i].parentElement.parentElement;
        child.parentElement.removeChild(child);
      }
    }
  }
}

var post_authors = document.getElementsByClassName('post_author');

if (post_authors.length > 0) {
  for (i = 0; i < post_authors.length; i++) {
    regname = post_authors[i].innerHTML;
    if (regname == 'jamin') {
      child = post_authors[i].parentElement.parentElement;
      child.parentElement.removeChild(child);
    }
  }
}