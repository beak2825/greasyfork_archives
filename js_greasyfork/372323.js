// ==UserScript==
// @name           Dilbert autofocus to previous
// @namespace      dilbert_autofocus_to_previous
// @description    Sets focus to the "previous" link
// @version        0.2
// @include        http://www.dilbert.com/strip/* 
// @include        http://dilbert.com/strip/*
// @include        https://www.dilbert.com/strip/* 
// @include        https://dilbert.com/strip/*
// @downloadURL https://update.greasyfork.org/scripts/372323/Dilbert%20autofocus%20to%20previous.user.js
// @updateURL https://update.greasyfork.org/scripts/372323/Dilbert%20autofocus%20to%20previous.meta.js
// ==/UserScript==


var links = document.getElementsByTagName('a');

// <a href="/strip/2018-09-17" title="Older Strip" accesskey="o">

for(x in links){
  if (links[x].title == 'Older Strip') {
    links[x].focus();
  }
}

console.log("Set focus to previous");