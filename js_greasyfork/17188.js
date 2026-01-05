// ==UserScript==
// @name        Trello Card Number
// @namespace   http://allencch.wordpress.com
// @description Show trello card number
// @include     https://trello.com/b/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17188/Trello%20Card%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/17188/Trello%20Card%20Number.meta.js
// ==/UserScript==

/**
 * Changelog:
 * Just override the card-short-id class
 */

function removeClass(elem, className) {
  elem.className = elem.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}

function addClass(elem, className) {
  elem.className += ' ' + className;
}

function showCardNumbers() {
  //Get all the elements
  var elems = Array.from(document.querySelectorAll('.card-short-id'));
  for(var i in elems) {
    addClass(elems[i], 'card-short-id');
  }
}

function createCSS() {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.card-short-id { font-weight: bold ; display: inline }';
  var style2 = document.createElement('style');
  style2.type = 'text/css';
  style2.innerHTML = '.card-short-id:after { content: " " }';
  
  document.getElementsByTagName('head')[0].appendChild(style);
  document.getElementsByTagName('head')[0].appendChild(style2);
}

window.setTimeout(function() {
  createCSS();
  //showCardNumbers();
},1000);