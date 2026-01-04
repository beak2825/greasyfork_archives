// ==UserScript==
// @name        Arrow keys for browsing manga
// @namespace   Violentmonkey Scripts
// @match       https://manganato.com/*
// @match       https://mangakakalot.com/*
// @grant       none
// @version     1.1
// @author      Ost
// @description Allows you to use arrow keys to navigate the site
// @downloadURL https://update.greasyfork.org/scripts/407317/Arrow%20keys%20for%20browsing%20manga.user.js
// @updateURL https://update.greasyfork.org/scripts/407317/Arrow%20keys%20for%20browsing%20manga.meta.js
// ==/UserScript==

// for &
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}


var regex = /href="([^"]*)/gm;
//var regex = /.*/gm;

var doc = document.getElementsByClassName('group-page')
if (!doc.length){
  var doc = document.getElementsByClassName('group_page')
}
doc = doc[0].innerHTML

var elements = [...doc.matchAll(regex)];

var prev = htmlDecode(elements[elements.length-4][1]);
var next = htmlDecode(elements[elements.length-3][1]);

document.addEventListener("keydown", keyDownTextField, false);

  function keyDownTextField(e) {
      var search = document.getElementsByClassName("searchinput")[0];
      if (document.activeElement !== search) {
          switch (e.which) {
              case 37: // "Arrow Left"
                  console.log('left');
                  window.location.href = prev;
                  break;
              case 39: // "Arrow Right"
                  window.location.href = next;
                  break;
              default:
                  return; // exit this handler for other keys
          }
          e.preventDefault(); // prevent the default action
      } else if (e.which == 32) {
          search.value += " ";
          e.preventDefault();
      }
      return;
  }