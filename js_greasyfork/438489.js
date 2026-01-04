//Replaces the link in all hyperlinks with target="_blank" to be correct.
//On youtube.com/watch links, usually the only links with target="_blank" in are links in the description.

// ==UserScript==
// @license MIT
// @version 2.44
// @namespace YoutubeDescriptionLinkFixer
// @name Youtube Description Link Fixer
// @description On YouTube, this replaces all links in the description with the original link instead of the YouTube tracker links.
// @include https://www.youtube.com/*
// @include http://www.youtube.com/*
// @author georgewoodall82
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/438489/Youtube%20Description%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/438489/Youtube%20Description%20Link%20Fixer.meta.js
// ==/UserScript==


function detectScroll (callback) {

	if (!callback || typeof callback !== 'function') return;
	let isScrolling;

	window.addEventListener('scroll', function (event) {
		window.clearTimeout(isScrolling);
		isScrolling = setTimeout(callback, 66);
	}, false);

}

function ydlf(){
  var links = document.getElementsByTagName('a');
  for (var i=0, len=links.length; i < len; i++) {
    if (links[i].target == '_blank') {
      try{
        const queryString = links[i].search;
	    const urlParams = new URLSearchParams(queryString);
	    const verSearch = urlParams.get('q');
	    links[i].href = verSearch;
	    links[i].target = '_blank/';
      }catch(e){
          
      }
    }
  }

}



function ydlfCheck(){

  if (window.location.pathname == '/watch'){
    console.log("%cYoutube Description Link Fixer Loaded","color: green; font-family:sans-serif; font-size: 20px");
    console.log("By georgewoodall82")
    setTimeout(ydlf, 15000);
    setTimeout(ydlf, 9000);
    setTimeout(ydlf, 6000);
    setTimeout(ydlf, 5500);
    setTimeout(ydlf, 3000);
    setTimeout(ydlf, 1000);
    detectScroll(ydlf);
  }
  
}

function checkURLchange(){
    if(window.location.href != oldURL){
        ydlfCheck();
        oldURL = window.location.href;
    }
}

var oldURL = window.location.href;
setInterval(checkURLchange, 1000);

ydlfCheck();