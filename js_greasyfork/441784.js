// ==UserScript==
// @name         Facebook messenger chat rotation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A script to rotate the video chat window. For instance, a mobile user can rotate their phone to landscape and their rear facing camera will display their image sideways on your screen.  This is the way to fix that.
// @author       nohren
// @license      MIT; https://raw.githubusercontent.com/nohren/Facebook-Messenger-Chat-Video-Rotation/main/LICENSE
// @match        https://www.facebook.com/groupcall/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441784/Facebook%20messenger%20chat%20rotation.user.js
// @updateURL https://update.greasyfork.org/scripts/441784/Facebook%20messenger%20chat%20rotation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //create a button, append to DOM
  const container = document.createElement('div');
  container.innerHTML =
    '<button id="myButton" type="button">' + 'rotate' + '</button>';
  container.setAttribute('id', 'myContainer');
  document.body.appendChild(container);

  //style injector function
  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
  }

  //inject style
  addGlobalStyle(`
  #myContainer {
      position:               relative;
      margin:                 5px;
      opacity:                1;
  }
  #myButton {
      cursor:                 pointer;
      height:                 40px;
      width:                  100px;
      font-size:              medium;
      color:                  white;
      background-color:       #4ec419;
      border-radius:          20px;
  }
  #myContainer p {
      color:                  red;
      background:             white;
  }
`);

  //register click event listener to button element with method to invoke.
  document
    .getElementById('myButton')
    .addEventListener('click', ButtonClickAction, false);

  //button state
  let currentIndex = 0;
  const rotations = [90, 180, 270, 0];

  //function attatched to DOM button element as method. Invoked on button click.
  function ButtonClickAction(event) {
    const videoElement = document.querySelector('.m0q0jmkx');
    videoElement.style.transform = 'rotate(' + rotations[currentIndex] + 'deg)';
    currentIndex++;
    if (currentIndex > rotations.length - 1) {
      currentIndex = 0;
    }
  }

  //  target element <div class="m0q0jmkx r30xiam5 alrytcbg hnte7a8w g7usbkpd geq71ugt"></div>
})();
