// ==UserScript==
// @name Sexart video player customization
// @namespace Adults
// @description Custom video player of Sexart
// @icon https://cdnmansite.metartnetwork.com/static/logos/A4C247F3ED924A70846D2722FD8B50F3/sa@2x.png
// @run-at document-start
// @match *://*sexart.com/model*
// @grant none
// @version 1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483342/Sexart%20video%20player%20customization.user.js
// @updateURL https://update.greasyfork.org/scripts/483342/Sexart%20video%20player%20customization.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(event) {
  var isCustomized = false;
  document.addEventListener("click", function(e) {
    var element = document.getElementById('my-unique-id');
    if (!isCustomized && (e.target === element || element.contains(e.target))) {
      isCustomized = true;
      const player = jwplayer('my-unique-id');
      player.setVolume(20);
      const playerContainerSelector = '#player';
      const playerContainer = document.querySelector(playerContainerSelector);

      // display icon
      const rewindContainer = playerContainer.querySelector('.jw-display-icon-rewind');
      const forwardContainer = rewindContainer.cloneNode(true);
      const forwardDisplayButton = forwardContainer.querySelector('.jw-icon-rewind');
      forwardDisplayButton.style.transform = "scaleX(-1)";
      forwardDisplayButton.ariaLabel = "Forward 10 Seconds"
      const nextContainer = playerContainer.querySelector('.jw-display-icon-next');
      nextContainer.parentNode.insertBefore(forwardContainer, nextContainer);


      // control bar icon
      playerContainer.querySelector('.jw-display-icon-next').style.display = 'none'; // hide next button
      const buttonContainer = playerContainer.querySelector('.jw-button-container');
      const rewindControlBarButton = buttonContainer.querySelector(".jw-icon-rewind");
      const forwardControlBarButton = rewindControlBarButton.cloneNode(true);
      forwardControlBarButton.style.transform = "scaleX(-1)";
      forwardControlBarButton.ariaLabel = "Forward 10 Seconds";
      rewindControlBarButton.parentNode.insertBefore(forwardControlBarButton, rewindControlBarButton.nextElementSibling);

      // add onclick handlers
      [forwardDisplayButton, forwardControlBarButton].forEach(button => {
        button.onclick = () => {
          player.seek((player.getPosition() + 10));
        }
      });
    }
  });
});