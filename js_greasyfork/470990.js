// ==UserScript==
// @name        Hotmart Player + - HP+
// @namespace   Violentmonkey Scripts
// @match       https://*.club.hotmart.com/lesson/*
// @grant       none
// @version     1.0
// @author      @lucaskbr
// @description 7/3/2023, 7:09:52 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470990/Hotmart%20Player%20%2B%20-%20HP%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/470990/Hotmart%20Player%20%2B%20-%20HP%2B.meta.js
// ==/UserScript==

const getElementsInScreen = () => {
  return {
    reviewLessonAside: document.querySelector('.content-related.col-12.col-lg-4.col-xl-3'),
    video: document.querySelector('.content-page-video'),
  };
};

function updateMediaForClass(className, property, value) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';

  const cssRules = ['1481px', '544px'].map(rule => `
    @media (min-width: ${rule}) {
      .${className} {
       ${property}: ${value};
      }
    }
  `);

  cssRules.forEach(cssRule => {
    styleElement.appendChild(document.createTextNode(cssRule));
  });

  document.head.appendChild(styleElement);
}


const changeScreen = () => {
  if (!getElementsInScreen()) {
    changeScreen();
  }

  const { reviewLessonAside, video } = getElementsInScreen();
  reviewLessonAside.hidden = true;
  video.style.width = '100%';

  updateMediaForClass('container', 'max-width', '100%');
  updateMediaForClass('col-xl-9',  'max-width', '100%');
  updateMediaForClass('col-xl-9', 'flex', '0 0 100%');

};


window.onload = function() {
  setTimeout(changeScreen, 2000);
};
