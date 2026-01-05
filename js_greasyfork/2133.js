// ==UserScript==
// @name        No derpibooru comment placeholder.
// @namespace   http://derpiboo.ru/images/no_pass
// @description Delete aggressive admin comment placeholder.
// @include     http://derpiboo.ru/*
// @include     http://www.derpiboo.ru/*
// @include     http://trixiebooru.org/*
// @include     http://www.trixiebooru.org/*
// @include     http://derpibooru.org/*
// @include     http://www.derpibooru.org/*
// @include     https://derpiboo.ru/*
// @include     https://www.derpiboo.ru/*
// @include     https://trixiebooru.org/*
// @include     https://www.trixiebooru.org/*
// @include     https://derpibooru.org/*
// @include     https://www.derpibooru.org/*
// @version     v1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2133/No%20derpibooru%20comment%20placeholder.user.js
// @updateURL https://update.greasyfork.org/scripts/2133/No%20derpibooru%20comment%20placeholder.meta.js
// ==/UserScript==

var images = document.getElementsByTagName ("textarea");
var x=0;
while(x<images.length)
{
  if(images[x].name == "comment[body]" || images[x].name == "post[body]" || images[x].name == "topic[posts_attributes][0][body]")
  {
    images[x].placeholder = "";
  }
  x=x+1;
}