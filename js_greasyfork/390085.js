// ==UserScript==
// @name        Countdown spakliness
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/countdown_spakles
// @include     *itsalmo.st*
// @exclude     none
// @version     6
// @description:en	Makes your countdown sparkly!
// @grant    		none
// @description	Makes your countdown sparkly!
// @downloadURL https://update.greasyfork.org/scripts/390085/Countdown%20spakliness.user.js
// @updateURL https://update.greasyfork.org/scripts/390085/Countdown%20spakliness.meta.js
// ==/UserScript==

const DURATION = 12;

function changeColor() {
  const footerElements = document.getElementsByClassName('app-footer');
  
  if(footerElements.length > 0) {
    const footer = footerElements[0];
    footer.style.display = 'none';
  }

  const r = Math.floor((Math.random() * 127));
  const g = Math.floor((Math.random() * 127));
  const b = Math.floor((Math.random() * 127));
  
  
  const backgroundElements = document.getElementsByClassName('countdown-display');
  
  if(backgroundElements.length > 0) {
  	const background = backgroundElements[0];
    background.style.transition = `all ${DURATION}s ease-in-out`;
    background.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }
  
  const textElements = document.getElementsByClassName('countdown-timer-wrap');
  
  if(textElements.length > 0) {
  	const text = textElements[0];
    text.style.transition = 'all 1s ease-in-out';
    const brightness = (r + g + b) / (255*3);
    text.style.color = 'white';
  }
  
}

function worker() {
  try {
    changeColor();
  } catch (e) {
    console.log(e);
  }
}

worker();
setInterval(worker, DURATION * 1000);
