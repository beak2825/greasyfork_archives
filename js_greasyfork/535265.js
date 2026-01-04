// ==UserScript==
// @name jpdb-clear-review-history
// @version 1
// @homepage https://gitlab.com/ioric/jpdb-clear-review-history
// @namespace https://gitlab.com/ioric/jpdb-clear-review-history
// @description Adds a button to clear review history for a word during jpdb reviews, with 'd' as hotkey
// @author ioric
// @license https://opensource.org/licenses/MIT
// @match https://jpdb.io/review*
// @connect self
// @downloadURL https://update.greasyfork.org/scripts/535265/jpdb-clear-review-history.user.js
// @updateURL https://update.greasyfork.org/scripts/535265/jpdb-clear-review-history.meta.js
// ==/UserScript==
'use strict';

function clearReviewHistory() {
  // origin url is sent to clear-review-history form, which is
  // based on the vocabulary url that the answer word links to
  let orig = document.querySelector('.answer-box a')?.href;
  // while the 'c' value is sent to the grade review form, the
  // 'v' and 's' values in it are sent to clear-review-history
  const c = document.querySelector('input[name="c"]')?.value;
  if (!(c && orig)) {
    console.error('Vocabulary variables not found');
    return;
  }
  const [_, v, s] = c.split(',');
  orig = orig.replace('#a', '').concat('/review-history');

  fetch('/clear-review-history', {
    method: 'POST',
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `v=${v}&s=${s}&origin=${orig}`,
  }).then((response) => {
    if (response.status == 302 || response.status == 200) {
      // now submit the review form to move to the next word
      document.querySelector('#grade-clear').parentElement.submit();
    } else {
      console.error(`Unexpected response from clearing review history: ${response.status}`);
    }
  }).catch((e) => {
    console.error(e);
  });
}

function insertClearButton() {
  // Add a new 'Clear history' button between Blacklist and Never forget

  const blacklistButton = document.querySelector('#grade-blacklist');
  if (blacklistButton == null) {
    console.error('blacklist button not found');
    return;
  }
  const blacklistForm = blacklistButton.parentElement;
  // we want the whole form for "submitting the review" later
  // this will have no effect on the word as the history has been cleared
  // but will move forward to the next review properly
  const clearForm = blacklistForm.cloneNode(true);
  const clearButton = clearForm.querySelector('#grade-blacklist');
  clearForm.querySelector('input[name="g"]').value = '1';
  clearButton.id = 'grade-clear';
  clearButton.value = 'Clear history';
  clearButton.type = 'button'; // prevent submit, which will be manually triggered later
  clearButton.style = 'padding: 0'; // restore style that only applies to 'submit' type
  clearButton.onclick = clearReviewHistory;
  blacklistForm.insertAdjacentElement('afterend', clearForm);

  // Change "I'll never forget" label to save some space
  document.querySelector('#grade-permaknown').value = 'Never forget';

  document.addEventListener("keyup", (e) => {
      if (e.key == 'd') { // 'c' would be nice but it's already used by jpdb
          e.preventDefault();
          document.querySelector('#grade-clear').click();
      }
  });
}

(() => {
  // Find the div with the 'Show answer' button, add a new button
  // after it changes to show the review buttons on the card back
  const reviewButtonGroup = document.querySelector('.review-button-group');
  if (reviewButtonGroup == null) {
    console.error('review-button-group not found');
    return;
  }

  const callback = (mutationList, _) => {
    for (const mutation of mutationList) {
      if (mutation.type == 'childList'
          && mutation.addedNodes[0].tagName == 'DIV') {
        insertClearButton();
      }
    }
  }
  const observer = new MutationObserver(callback);
  observer.observe(reviewButtonGroup, {childList: true, subtree: true});
})();
