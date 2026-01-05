// ==UserScript==
// @name        Renbow h4x
// @namespace   sophie
// @description Provide an alert when a user appears to have gained a level
// @include     https://www.wanikani.com/chat/*
// @include     http://www.wanikani.com/chat/*
// @version     0.1
// @grant       none
// @license     GPL version 3 or later: http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/16539/Renbow%20h4x.user.js
// @updateURL https://update.greasyfork.org/scripts/16539/Renbow%20h4x.meta.js
// ==/UserScript==

function parse( ) {
  var names = window.localStorage.renbow ?
	JSON.parse(window.localStorage.renbow)
	: { };
  var authors = document.querySelectorAll('.forum-post-author > div');
  var nameExpr = /([^\/]*)$/;
  for(var i=0;i<authors.length;++i) {
    var name = nameExpr.exec(authors[i].children[0].href)[1];
    var level = parseInt(authors[i].children[1].textContent,10);
    if(names[name] && names[name] < level)
      alert(name + " has gained a level!");
    names[name] = level;
  }
  window.localStorage.renbow = JSON.stringify(names);
}
window.onload = parse( );