// ==UserScript==
// @name        AH Mobile word count
// @description Show the wordcount next to the date on alternatehistory mobile. Also hides 0-wordcount threads (optional).
// @author      C89sd
// @version     1.7
// @match       https://www.alternatehistory.com/forum/forums/*
// @match       https://www.alternatehistory.com/forum/search/*
// @match       https://www.alternatehistory.com/forum/tags/*
// @namespace   https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533656/AH%20Mobile%20word%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/533656/AH%20Mobile%20word%20count.meta.js
// ==/UserScript==

'use strict';

const IS_FORUM = /^https:\/\/[^\/]+\/forum\/forums\//.test(window.location.href);

const COLLAPSE_ZERO_THREADS = true;
const FIX_PADDING = true;

// Match AH's @media(max-width: 650px){.wordcount{display: none;}},
const style = document.createElement('style');
style.textContent = `
  .mobile-only {
    display: none !important;
  }

  @media (max-width: 650px) {
    .mobile-only {
      display: block !important;
    }
  }
`;
document.head.appendChild(style);

const threads = document.querySelectorAll('div.structItem, li.block-row');
for (const thread of threads) {

  if (FIX_PADDING) {
    thread.style.paddingTop = '0px';
    thread.style.paddingBottom = '0px';

    const titleParent = thread.querySelector('.structItem-title, h3.contentRow-title')?.parentElement;
    if (titleParent) {
      titleParent.style.paddingBottom = '0px';
      titleParent.style.paddingTop = '0px';
    }
    const threadBottom = thread.querySelector('.structItem-cell.structItem-cell--latest');
    if (threadBottom) {
      threadBottom.style.paddingBottom = '0px';
    }
    const threadBottomLeft = thread.querySelector('.structItem-cell.structItem-cell--meta');
    if (threadBottomLeft) {
      threadBottomLeft.style.paddingBottom = '0px';
    }
  }

  var foundCount = false;

  let wordcountOld = thread.querySelector('li>a[data-xf-click="overlay"]');
  let wordcountNew;
  let wordcountSearch;
  if (wordcountOld && wordcountOld.textContent.startsWith('Word')) { // (wordcountOld.startsWith('Words: ') || wordcountOld.startsWith('Word Count: '))) {
    foundCount = true;
  }
  else {
    wordcountNew = thread.querySelector('dl:has(>dd>a[data-xf-click="overlay"])');
    if (typeof wordcountNew === 'string' && wordcountNew.trim().startsWith('Word')) {
      foundCount = true;
    }
    else {
      wordcountSearch = thread.querySelector('li>a.wordcount');
      if (wordcountSearch) {
        foundCount = true;
      }
    }
  }

  if (foundCount && wordcountOld) {
    const mobileDate = thread.querySelector('div.structItem-cell--latest');

    if (mobileDate) {
      const middleDot = document.createElement('a');
      middleDot.textContent = '·';
        const gap = '0.5ch';
      middleDot.style.marginRight = gap;
      middleDot.style.marginLeft = gap;
      middleDot.classList.add('mobile-only');
      mobileDate.append(middleDot);

      const clonedLink = wordcountOld.cloneNode(true);
      clonedLink.classList.add('mobile-only');
      mobileDate.append(clonedLink);
    }
  }

  if (COLLAPSE_ZERO_THREADS) {
    if (!wordcountOld) {
      const title = thread.querySelector('.structItem-title, h3.contentRow-title');
      if (title) {
        const clone = title.cloneNode(true);
        clone.style.opacity = '0.2';
        clone.style.whiteSpace = 'nowrap';
        if (IS_FORUM) clone.style.paddingLeft = '8px';
        clone.style.letterSpacing = '-0.5x';
        // clone.style.fontWeight = '350';

       // Delete all children
        while (thread.firstChild) {
          thread.removeChild(thread.firstChild);
        }
        thread.appendChild(clone);
      }
    }
  }
}
