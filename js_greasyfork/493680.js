// ==UserScript==
// @name        Cleaner lemellotron.com
// @namespace   Violentmonkey Scripts
// @match       https://www.lemellotron.com/*
// @grant       none
// @version     1.3
// @author      neFAST
// @grant       GM_addStyle
// @run-at      document-end
// @description 27/04/2024 18:10:17
// @icon        https://assets-global.website-files.com/62288d6c9e6c33efb4e67d74/622895bc0943958e9518efd7_Icone_black-favicon.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493680/Cleaner%20lemellotroncom.user.js
// @updateURL https://update.greasyfork.org/scripts/493680/Cleaner%20lemellotroncom.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// This function will be called when the album image src changes
function onImageSrcChange(mutation) {
  // Find the div with the class 'tv'
  var tvDiv = document.querySelector('.tv');

  // Check if the mutation is an attribute mutation and the attribute is 'src'
  if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
    // Set the div's background image to the new src of the image
    tvDiv.style.backgroundImage = 'url(' + mutation.target.src + ')';
  }
}

window.onload = () => {
  // Select the img element whose src you want to observe
  var imgElement = document.querySelector('#release-picture');
  if (imgElement) {
    // Create an observer instance and pass our callback function to it
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(onImageSrcChange);
    });

    // Configure the observer to listen for changes in the attributes
    let config = {
      attributes: true,
      childList: false,
      subtree: false
    };

    // Start observing the img element for mutations
    observer.observe(imgElement, config);
  } else {
    console.warn('The img element was not found.');
  }
};


GM_addStyle(`

.tv {
  height: 570px;
  background-size: cover;
  transition: background-image 1s ease-in-out;
}

.overlay {
  backdrop-filter: blur(55px);
  background: rgb(0 0 0 / 35%);
}

.radioplayer-play-button {
  position: absolute;
  top: 40px
}

#release-picture {
  width: 20%;
  border-radius: 12px;
  box-shadow: -1px 7px 12px 8px rgb(0 0 0 / 75%);
}

#current-track-artist {
  line-height: 150px; /* Matches the image height for vertical alignment */
}

#artist-picture {
    float: right;
    width: unset;
    height: unset;
    margin-right: 0px;
}

video, .canvas {
  visibility: hidden; /* The video is hidden but still takes up space in the layout */
}

.current-track-title,
.current-track-artist,
.current-track-meta {
  font-size: 48px;
  line-height: 48px;
  margin-left: 12px;
  max-width: 500px;
}

.current-track-album {
  color: white;
}

.current-track-artist:before {
  content: "🧑‍🎤 ";
}

.current-track-meta:before {
  content: "💿 ";
}

.logo {
    width: 140px;
}

.logo:after {
    content: "Le Mellotron";
    font-size: 22px;
}

`)