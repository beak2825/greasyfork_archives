// ==UserScript==
// @name         hide comments / search / side
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://epicmafia.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386609/hide%20comments%20%20search%20%20side.user.js
// @updateURL https://update.greasyfork.org/scripts/386609/hide%20comments%20%20search%20%20side.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.getElementsByClassName('grid8 mb');
for (var i=0;i<elems.length;i+=1){
  elems[i].style.display = 'none';
}

var elems = document.getElementsByClassName('comment_container');
for (var i=0;i<elems.length;i+=1){
  elems[i].style.display = 'none';
}

document.getElementById('footer').style.display = "none";


var elems = document.getElementsByClassName('search');
for (var i=0;i<elems.length;i+=1){
  elems[i].style.display = 'none';
}
})();