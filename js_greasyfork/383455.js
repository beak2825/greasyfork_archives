// ==UserScript==
// @name        Always PWA Google Map
// @namespace   
// @description PWA GMAP
// @author
// @include        http*://www.google.*.*/*
// @include        http*://google.*.*/*
// @include        http*://www.google.*/*
// @include        http*://google.*/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383455/Always%20PWA%20Google%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/383455/Always%20PWA%20Google%20Map.meta.js
// ==/UserScript==
// ==UserScript==
// @name        Always PWA Google Map
// @namespace   
// @description Always PWA Google Map
// @author
// @include        http*://www.google.*.*/*
// @include        http*://google.*.*/*
// @include        http*://www.google.*/*
// @include        http*://google.*/*
// @version     1.1
// @grant       none
// ==/UserScript==


if (window.location.href.match(/google/)) {

  if (window.location.href.match(/maps/)) {

    if (window.location.href.match(/force=pwa/)) {
    } else {
      if (window.location.href.match(["&"])) {
        window.location.href = window.location.href + "&force=pwa";
      } else {
        if (window.location.href.match(/\?/)){
          window.location.href = window.location.href + "&force=pwa";
        }
          else{
          window.location.href = window.location.href + "?force=pwa";
        }


      }
    }
  }
}
