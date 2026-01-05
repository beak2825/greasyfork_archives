// ==UserScript==
// @name        Eishockeyforum - Dislike-Knopf
// @namespace   ehf neu
// @description Reaktiviert den Dislike-Knopf
// @include     http://www.eishockeyforum.at/*
// @version     20150727
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/351/Eishockeyforum%20-%20Dislike-Knopf.user.js
// @updateURL https://update.greasyfork.org/scripts/351/Eishockeyforum%20-%20Dislike-Knopf.meta.js
// ==/UserScript==
//setTimeout(function(){$(".dislikeButton").css("display","inline-block")},500);
setTimeout(function(){dislike()},500);

function dislike(){
  var elems = document.getElementsByClassName('dislikeButton');
  for(var i = 0; i < elems.length; i++) {
      elems[i].style.display = 'inline-block';
  }
  //alert("blah");
}

//http://stackoverflow.com/questions/10693845/can-getelementsbyclassname-change-style