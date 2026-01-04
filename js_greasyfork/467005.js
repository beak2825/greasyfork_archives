// ==UserScript==
// @name        Extra Fabulous Comics simplifier and next and previous buttons
// @namespace   Tehhund
// @match       *://*.extrafabulouscomics.com/*
// @icon        https://static.wixstatic.com/media/904535_d7187dcb8545431db8f80865f59ef376%7Emv2.png/v1/fill/w_32%2Ch_32%2Clg_1%2Cusm_0.66_1.00_0.01/904535_d7187dcb8545431db8f80865f59ef376%7Emv2.png
// @grant       none
// @version     24
// @author      Tehhund
// @description Adds previous and next buttons/links to Extra Fabulous Comics to make it easier to read a lot of older comics.
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/467005/Extra%20Fabulous%20Comics%20simplifier%20and%20next%20and%20previous%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/467005/Extra%20Fabulous%20Comics%20simplifier%20and%20next%20and%20previous%20buttons.meta.js
// ==/UserScript==

const blankScreenUntilLoad = () => {
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '* { filter: brightness(0); }';
  style.id = 'tehhundScriptBlankStyle';
  setTimeout(() => { // prevents running before document.head loads. May need to switch to a MutationObserver.
    document.head.prepend(style);
    unBlankScreen();
  });
}
blankScreenUntilLoad();

const unBlankScreen = () => {
  document.body.style.backgroundColor = "black";
  document.getElementById('tehhundScriptBlankStyle').remove();
  const scriptTag = document.getElementById('tehhundScriptBlankStyle');
  if (scriptTag) {
    scriptTag.remove();
  }
}

const calculateCurrentPrevNext = () => {
  let currentComic = window.location.href;
  currentComic = currentComic.slice(-5); // example: https://www.extrafabulouscomics.com/____1
  currentComic = parseInt(currentComic.replace(/\D/g, ''));

  let nextComic = currentComic + 1;
  nextComic = nextComic.toString().padStart(5, '_');
  nextComic = 'https://www.extrafabulouscomics.com/' + nextComic;

  let prevComic = currentComic - 1;
  prevComic = prevComic.toString().padStart(5, '_');
  prevComic = 'https://www.extrafabulouscomics.com/' + prevComic;

  return { 'current': currentComic, 'next': nextComic, 'prev': prevComic };
}

const addLinks = () => {
  let nextPrevLinks = document.getElementsByClassName('tehhundScript');
  while (nextPrevLinks.length > 0) {
    nextPrevLinks[0].remove(); // For of was skipping elements so this fixes that.
  }

  let comic = document.querySelectorAll('img')[0].cloneNode();
  document.body.innerHTML += '<style>* { background: black; }</style>';
  const allElems = document.body.getElementsByTagName('*');
  for (let elem of allElems) {
    //elem.style.filter = 'brightness(0%)';
    elem.remove();
  }
  document.body.appendChild(comic);
  comic.style.paddingTop = '7rem';
  comic.style.paddingBottom = '7rem';

  /*const currentComic = window.location.href;

  document.body.innerHTML += '<a class="tehhundScript tehhundScriptPrev" href="https://paulkoepke.com/redirector/?redirectUrl=' + currentComic + '&direction=prev" style="position: fixed;top: 5rem;left: 0;border: 1px solid #000000;font-size: 1rem;">Prev</button>';
  document.body.innerHTML += '<a class="tehhundScript tehhundScriptPrev" href="https://paulkoepke.com/redirector/?redirectUrl=' + currentComic + '&direction=prev" style="position: fixed;bottom: 5rem;left: 0;border: 1px solid #000000;font-size: 1rem;">Prev</button>';

  document.body.innerHTML += '<a class="tehhundScript tehhundScriptNext" href="https://paulkoepke.com/redirector/?redirectUrl=' + currentComic + '&direction=next" style="position: fixed;top: 5rem;right: 0;border: 1px solid #000000;font-size: 1rem;">Next</button>';
  document.body.innerHTML += '<a class="tehhundScript tehhundScriptNext" href="https://paulkoepke.com/redirector/?redirectUrl=' + currentComic + '&direction=next" style="position: fixed;bottom: 5rem;right: 0;border: 1px solid #000000;font-size: 1rem;">Next</button>';*/
  const topNextLink = document.createElement('a');
  topNextLink.style.position = 'fixed';
  topNextLink.style.top = '5rem';
  topNextLink.style.right = '0';
  topNextLink.style.border = '1px solid #000000';
  topNextLink.style.fontSize = '1rem';
  topNextLink.classList = 'tehhundScript tehhundScriptNext';
  topNextLink.href = calculateCurrentPrevNext()['next'];
  topNextLink.textContent = 'Next';
  document.body.append(topNextLink);

  const bottomNextLink = topNextLink.cloneNode(true);
  bottomNextLink.style.top = '';
  bottomNextLink.style.bottom = '5rem';
  document.body.append(bottomNextLink);

  const topPrevLink = topNextLink.cloneNode(true);
  topPrevLink.style.right = '';
  topPrevLink.style.left = '0';
  topPrevLink.href = calculateCurrentPrevNext()['prev'];
  topPrevLink.textContent = 'Prev';
  document.body.append(topPrevLink);

  const bottomPrevLink = topPrevLink.cloneNode(true);
  bottomPrevLink.style.top = '';
  bottomPrevLink.style.bottom = '5rem';
  document.body.append(bottomPrevLink);

  // EFC website is slow to load new pages. This should speed it up a bit.
  const linkRels = ['prefetch', 'preload', 'preconnect', 'dns-prefetch', 'prerender'];
  for (let rel of linkRels) {
    document.head.innerHTML += '<link link rel="' + rel + '" href="' + calculateCurrentPrevNext()['next'] + '" >';
    document.head.innerHTML += '<link link rel="' + rel + '" href="' + calculateCurrentPrevNext()['prev'] + '" >';
  }

  //Move the whole body up a bit.
  /*document.getElementsByTagName('body')[0].style.position = 'relative';
  document.getElementsByTagName('body')[0].style.top = '-2rem';*/

}
window.addEventListener("DOMContentLoaded", (event) => {
  addLinks();
  setTimeout(unBlankScreen);
});
