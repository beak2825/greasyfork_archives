// ==UserScript==
// @name     		Pinterest No Videos
// @description	Removes videos from Pinterest.
// @version     1.0.0
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @license     MIT
// @include     https://pinterest.com/*
// @include     https://www.pinterest.com/*
// @include     https://pinterest.*/*
// @include     https://www.pinterest.*/*
// @downloadURL https://update.greasyfork.org/scripts/485508/Pinterest%20No%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/485508/Pinterest%20No%20Videos.meta.js
// ==/UserScript==

const interval = setInterval(function() {
  
  const videoLengthLabels = document.querySelectorAll('[data-test-id="PinTypeIdentifier"]');
  if(videoLengthLabels.length < 1) return;
  [...videoLengthLabels].forEach(videoLengthLabel => {
    	const pin = videoLengthLabel.closest('[data-grid-item="true"]');
    	if(pin)	pin.removeChild(pin.firstChild);
  });
  
 }, 1000);

