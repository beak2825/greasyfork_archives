// ==UserScript==
// @name         PH Video links
// @version      1.2.1
// @description  Linkify video titles on PornHub
// @author       salad: https://greasyfork.org/en/users/241444-salad
// @include      https://www.pornhub.com/view_video.php?*
// @grant        none
// @namespace    https://greasyfork.org/users/241444
// @downloadURL https://update.greasyfork.org/scripts/377026/PH%20Video%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/377026/PH%20Video%20links.meta.js
// ==/UserScript==


(function() {

  const playerWrap = document.getElementById('player');
  if(!playerWrap) {
    console.error('playerWrap element not found');
    return;
  }

  let observer;
  let sourceElement;
  const observerConfig = { attributes: true, childList: true, subtree: true };

  // once source is defined, set title element
  const setLink = () => {

    // video title element
    const title = document.querySelector('h1.title>span');

    // video title
    const titleText = title.innerHTML;

    // username if any
    const username = document.querySelector('.video-info-row .usernameWrap');
    const usernameText = (username !== null) ? username.innerText : 'unknown';

    // video source url
    const sourceUrl = sourceElement.getAttribute('src');

    // wrap in a link
    const link = `<a href="${sourceUrl}">${usernameText} - ${titleText}</a>`;

    title.innerHTML = link;

    // also update the page title
    document.title = `${usernameText} - ${titleText}`;

  }

  // Callback function to execute when mutations are observed
  const checkForSource = () => {

      const source = playerWrap.querySelector('source[src]');
      if(source && source.getAttribute('src')) {
        sourceElement = source;
        setLink();
        observer.disconnect();
      }

  };

  observer = new MutationObserver(checkForSource);
  observer.observe(playerWrap, observerConfig);

  // initial run
  checkForSource();

})();
