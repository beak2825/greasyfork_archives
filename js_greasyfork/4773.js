// ==UserScript==
// @name          	poop
// @description     asdf
// @version         0.2
// @author			phracker <phracker@bk.ru>
// @namespace       http://github.com/phracker
//
// @include			https://what.cd/*
// @include			https://ssl.what.cd/*
// @downloadURL https://update.greasyfork.org/scripts/4773/poop.user.js
// @updateURL https://update.greasyfork.org/scripts/4773/poop.meta.js
// ==/UserScript==
(function() {
  var a = document.getElementsByTagName('a');
  for(var x = 0; x < a.length; x++) {
    if(a.item(x).href == "https://what.cd/user.php?id=342717" || a.item(x).href == "https://ssl.what.cd/user.php?id=342717") {
      a.item(x).textContent = "poop";
    }
  }
  var i = document.getElementsByTagName('img');
  for(var x = 0; x < i.length; i++) {
    if(i.item(x).src == "https://whatimg.com/i/3OBo2N.png") {
      i.item(x).src = "https://whatimg.com/i/84zEVw.jpg";
    }
  }
})();