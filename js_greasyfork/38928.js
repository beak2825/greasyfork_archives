// ==UserScript==
// @name        FanFiction.Net Accesskey Navigation
// @namespace   Zyx
// @description Ctrl + Arrow key navigation. Based on a script by Crazycatz00.
// @match       *://*.fanfiction.net/s/*
// @match       *://*.fictionpress.com/s/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/38928/FanFictionNet%20Accesskey%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/38928/FanFictionNet%20Accesskey%20Navigation.meta.js
// ==/UserScript==

var moveChap = function(ofs){
  var btns=document.getElementsByTagName("button");
  var newChap;
  if (ofs==1){
    newChap="Next";
  } else {
    newChap="Prev";
  }
  for(var i=0;i<btns.length;i++){
      if (btns[i].textContent.indexOf(newChap)>=0)
  			btns[i].click();
  }
};

document.addEventListener('keydown', function(e){
	if (e.ctrlKey)
	{
		switch (e.keyCode)
		{
			case 37: moveChap(-1); break;
			case 38: window.scroll(0, 0); break;
			case 39: moveChap(1); break;
			case 40: window.scroll(0, document.body.scrollHeight); break;
		}
	}
}, false);
