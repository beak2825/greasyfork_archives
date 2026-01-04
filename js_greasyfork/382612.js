// ==UserScript==
// @name        Pinterest with no registration modal popup
// @namespace   jesusmg
// @version     2.5
// @description Allows to browse Pinterest without login/registration, removing the offending modal popup
// @include     http://*.pinterest.com/*
// @include     https://*.pinterest.com/*
// @include     https://*.pinterest.*/*
// @author	    Jesús González
// @require     http://code.jquery.com/jquery-latest.min.js
// @require 		https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/382612/Pinterest%20with%20no%20registration%20modal%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/382612/Pinterest%20with%20no%20registration%20modal%20popup.meta.js
// ==/UserScript==

$(document).ready(function() { 
  setInterval(function() {
    if ($("div[data-reactcontainer='']").is(':empty')) {
  		console.log("Page is empty, reloading");
      location.reload();
		}
  }, 1000);
  
  
    waitForKeyElements (
  //"iframe[title='fb:login_button Facebook Social Plugin']", hideElement
  "iframe", removeElement  
  );

  waitForKeyElements (
    "div[data-test-id='signup']", removeElement
  );

  waitForKeyElements (
    "div[data-test-id='fullPageSignupModal']", removeElement
  );

  waitForKeyElements (
      "div[data-test-id='giftWrap']", removeElement
  );

  /*
  waitForKeyElements (
    ".FullPageModal__scroller", removeParent
  );
  */
});

function hideElement(jNode) {
	console.log("Hiding offending registration crap");
	console.log(jNode);  
  jNode.css('visibility', 'hidden');
  
}

function removeElement(jNode) {
	console.log("Removing offending registration crap");
	console.log(jNode);
  
  jNode.remove();
}

function removeParent(jNode) {
  removeElement(jNode.parent());
}

function removeElementDelayed(jNode) {
  setTimeout(removeElement(jNode), 3000);
}