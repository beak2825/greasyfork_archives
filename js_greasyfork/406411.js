// ==UserScript==
// @name     					TwitLonger Button
// @version						1.1.1
// @author						Adam J Frost
// @description				    Adds A TwitLonger Button To Twitter.
// @namespace					https://www.tampermonkey.net/
// @include  					https://twitter.com/*
// @license                     GPL-3.0-only
// @grant    					none
// @downloadURL https://update.greasyfork.org/scripts/406411/TwitLonger%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/406411/TwitLonger%20Button.meta.js
// ==/UserScript==

var buttonText = "Long Tweet";
var updateTime = 50;

setInterval(function(){ twitLongerButtonStyle(); }, updateTime);

// Stylesheet
function twitLongerButtonStyle() {
  
  const styleExists = document.querySelector('#twitlonger-stylesheet');
	if (styleExists === null) {
  	// Set Style for button
		var twitLongerButtonStyle = document.createElement('style');
    defaultStylesheet = `
    /* <-- Style for TwitLonger Button --> */
    .create-twitlonger-post-home,
		.create-twitlonger-post-popup {
				background-color: var(--twitlonger-button-color);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
        font-weight: bold;
        text-decoration: none;
        border: none;
        border-radius: 30px;
        color: #ffffff;
        margin-left: 10px;
        padding: 8px 15px 8px 15px;
        -webkit-transition: 0.3s !important;
        -moz-transition: 0.3s !important;
        -o-transition: 0.3s !important;
        transition: 0.3s !important;
    }
    .create-twitlonger-post-home:hover,
		.create-twitlonger-post-popup:hover {
				background-color: var(--twitlonger-button-hover-color);
        border-color: none;
        cursor: pointer;
    }
    `;
    twitLongerButtonStyle.innerHTML = defaultStylesheet;
		twitLongerButtonStyle.setAttribute("id", "twitlonger-stylesheet");
    document.head.appendChild(twitLongerButtonStyle);
  }
  else { return; }
};

setInterval(function(){ 
  setInterval(function(){
  	if (typeof document.getElementsByClassName('r-urgr8i')[0] !== 'undefined') {
    // Set Blue Style for button
   	twitLongerButtonColor.innerHTML = `
   	/* <-- Blue TwitLonger Button --> */
		:root {
				--twitlonger-button-color: rgb(29, 161, 242);
				--twitlonger-button-hover-color: rgb(26, 145, 218);
		}
    `;
    }
    if (typeof document.getElementsByClassName('r-1vkxrha')[0] !== 'undefined') {
      // Set Yellow Style for button
      twitLongerButtonColor.innerHTML = `
      /* <-- Yellow TwitLonger Button --> */
			:root {
          --twitlonger-button-color: rgb(255, 173, 31);
          --twitlonger-button-hover-color: rgb(230, 156, 28);
			}
      `;
    }
    if (typeof document.getElementsByClassName('r-1dgebii')[0] !== 'undefined') {
      // Set Pink Style for button
      twitLongerButtonColor.innerHTML = `
      /* <-- Pink TwitLonger Button --> */
			:root {
          --twitlonger-button-color: rgb(224, 36, 94);
          --twitlonger-button-hover-color: rgb(202, 32, 85);
			}
      `;
    }
    if (typeof document.getElementsByClassName('r-1qqlz1x')[0] !== 'undefined') {
      // Set Purple Style for button
      twitLongerButtonColor.innerHTML = `
      /* <-- Purple TwitLonger Button --> */
			:root {
          --twitlonger-button-color: rgb(121, 75, 196);
          --twitlonger-button-hover-color: rgb(134, 93, 202);
			}
      `;
    }
    if (typeof document.getElementsByClassName('r-18z3xeu')[0] !== 'undefined') {
      // Set Orange Style for button
      twitLongerButtonColor.innerHTML = `
      /* <-- Orange TwitLonger Button --> */
			:root {
          --twitlonger-button-color: rgb(244, 93, 34);
          --twitlonger-button-hover-color: rgb(220, 84, 31);
			}
      `;
    }
    if (typeof document.getElementsByClassName('r-b5skir')[0] !== 'undefined') {
      // Set Green Style for button
      twitLongerButtonColor.innerHTML = `
      /* <-- Green TwitLonger Button --> */
			:root {
          --twitlonger-button-color: rgb(23, 191, 99);
          --twitlonger-button-hover-color: rgb(21, 172, 89);
			}
      `;
    }
  }, updateTime);
  
  var styleDoesExist = document.querySelector('#twitlonger-btn-color');
	if (styleDoesExist === null) {
    var twitLongerButtonColor = document.createElement('style');
    twitLongerButtonColor.setAttribute("id", "twitlonger-btn-color");
    document.head.appendChild(twitLongerButtonColor);
  }
}, updateTime);

// Create TwitLonger Button (Home Page)
setInterval(function(){ 
	var elementExists = document.getElementsByClassName("create-twitlonger-post-home")[0];
  
  if (elementExists){
  	return;
  }
  
  var newNode = document.createElement('a');
  newNode.classList.add("create-twitlonger-post-home");
  newNode.setAttribute("target", "_blank");
  newNode.setAttribute("href", "https://www.twitlonger.com/post");
  newNode.innerHTML = buttonText; // Creates the button.
  var getElementA = document.querySelector('div[data-testid="tweetButtonInline"]');
  // place new element after the tweetButton element 'Use .before to place afterwards'
  getElementA.after(newNode);
}, updateTime);

// Create TwitLonger Button (Popup)
setInterval(function(){ 
	var elementExists = document.getElementsByClassName("create-twitlonger-post-popup")[0];
  
  if (elementExists){
  	return;
  }
  
  var newNode = document.createElement('a');
  newNode.classList.add("create-twitlonger-post-popup");
  newNode.setAttribute("target", "_blank");
  newNode.setAttribute("href", "https://www.twitlonger.com/post");
  newNode.innerHTML = buttonText; // Creates the button.
  var getElement = document.querySelector('div[data-testid="tweetButton"]');
  // place new element after the tweetButton element 'Use .before to place afterwards'
  getElement.after(newNode);
}, updateTime);