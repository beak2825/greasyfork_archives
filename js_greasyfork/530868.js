// ==UserScript==
// @name         Remove Discord Bar
// @namespace    http://tampermonkey.net/
// @version      2025-03-25
// @description  N/A
// @author       Integrace
// @match        https://discord.com/channels/*
// @icon         https://i.imgur.com/LX4MpWZ.png
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/530868/Remove%20Discord%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/530868/Remove%20Discord%20Bar.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 100);
}


waitForElement('.bar_c38106', (contentArea) => {

  contentArea.style.marginTop = '0px';

  //First remove the contents of the "bar"
  const uselessBar = document.querySelector('.bar_c38106');
  if (uselessBar) {
    uselessBar.style.display = 'none';
    console.log('Success! The useless bar is now hidden.');
  } else {
    console.log('R.I.P. The useless bar element was not found.');
  }

  //Then resize the page
  const baseContainer = document.querySelector('.base_c48ade');
  if (baseContainer) {
    baseContainer.style.gridTemplateRows = 'auto';
    console.log('Success! The layout has been resized.');
  } else {
    console.log('R.I.P. The layout element was not found.');
  }

});
