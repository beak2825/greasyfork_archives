// ==UserScript==
// @name          liChess.org Knight's Rainbow Mohawk
// @namespace     http://userstyles.org
// @description	  lichesspiecestyle
// @author        ceberous
// @homepage      https://creatitees.info
// @include       http://en.lichess.org/*
// @run-at        document-start
// @version       2.0
// @downloadURL https://update.greasyfork.org/scripts/17836/liChessorg%20Knight%27s%20Rainbow%20Mohawk.user.js
// @updateURL https://update.greasyfork.org/scripts/17836/liChessorg%20Knight%27s%20Rainbow%20Mohawk.meta.js
// ==/UserScript==

(function(){

var knights = document.getElementsByClassName("knight white");
var i;
for (i = 0; i<knights.length; i++){
	console.log(knights[i]);
    knights[i].setAttribute('style', 'background-image: url(\"http://i.imgur.com/7Ysv65s.png\")!important;');
}

})();    