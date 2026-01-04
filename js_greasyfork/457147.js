// ==UserScript==
// @name        lightnovelpub.com cleanup
// @namespace   Violentmonkey Scripts
// @match       https://www.lightnovelpub.com/novel/*
// @grant       none
// @version     2.1
// @author      owittek
// @description This script removes all annoyances off of the page,
//              stretches the text section to 1200px
//              & sets (my preferred) font size & text alignment
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457147/lightnovelpubcom%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/457147/lightnovelpubcom%20cleanup.meta.js
// ==/UserScript==

waitForElmToLoad('div#chapter-container').then(() => {
  setStyleSettings();
  enableTextSelection('auto');
  removeJunk();
  removeElements();
  addTopNavigation();
});

waitForElmToLoad('h3')
  .then(adblockWarnings => adblockWarnings
        .forEach(adblockWarning => adblockWarning.parentNode.parentNode.remove())
       );

function addTopNavigation() {
  const topNav = document.querySelector('div.chapternav').cloneNode(true);
  const title = document.querySelector('div.titles');
  document.querySelector('section').prepend(topNav);
  document.querySelector('section').prepend(title);

  title.style['border-top'] = '2px solid';
  topNav.style['border-bottom'] = '1px solid';
}

function removeElements() {
  removeElement(document.querySelector('header'));
  removeElement(document.querySelector('div.container'));
  removeElement(document.querySelector('div.left-panel'));
  removeElement(document.querySelector('div.right-panel'));
}

function removeElement(element) {
  try {
    element.remove();
  } catch (_) {}
}

function removeJunk() {
  const selfPromo = document.querySelectorAll('div#chapter-container>div');
  for (let i = 0; i < selfPromo.length; i++) selfPromo[i].remove();

  const textByLine = document.querySelectorAll('div#chapter-container>p');
  for (let i = 0; i < textByLine.length; i++) {

    const line = textByLine[i].innerText;
    if (i+1 < textByLine.length && line === textByLine[i+1].innerText) {
      textByLine[i].remove();
      continue;
    }

    // Removes HTML tags and other junk from the text
    textByLine[i].innerText = line
      .replace(/[\u0000-\u001F\u007F-\u009F\u200A-\u200F]/g, '')
      .replace(/\n|<.*?>/g, '')
      .replace(/&.+;/g, '')
      .replace(/\.[\w\s]+lightnovelpub.+\.?/g, '.')
      .replace(/\.[\w\s]+[^\x00-\x7F].+\.?/g, '.')
      .replace(/\.\b/g, '. ');
  }
}

// Adapted from https://greasyfork.org/en/scripts/454332
function enableTextSelection(style) {
  const chapter = document.getElementById("chapter-container");
  chapter.style['user-select'] = style;
  chapter.style['-webkit-user-select'] = style;
  chapter.style['-moz-user-user-select'] = style;
  chapter.style['-ms-user-select'] = style;
}

function setStyleSettings() {
  document.querySelector('section').style['max-width'] = '1200px';
  const chapContainer = document.querySelector('div#chapter-container');
  chapContainer.style['font-size'] = '24px';
  chapContainer.style['text-align'] = 'justify';
}

// Adapted from https://stackoverflow.com/a/61511955
function waitForElmToLoad(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}