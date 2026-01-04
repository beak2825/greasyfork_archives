// ==UserScript==
// @name         Fanatical bundles carousel enhancer
// @version      2025-04-06
// @namespace    Jakub Marcinkowski
// @description  In all Fanatical Build Your Own bundles, adds "Add to bundle" button to the carousel - like in game bundles. It is handy to have arrows, to browse products, and button to add to cart close by. Also marks a tile of the product, currently shown in the carousel. In bundles with tiers, adds tier info to the carousel. All bundles: move carousel on top and use mouse wheel horizontal scroll to switch next/prev product.
// @author       Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @copyright    2023+, Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @license      Zlib
// @homepageURL  https://gist.github.com/JakubMarcinkowski
// @homepageURL  https://github.com/JakubMarcinkowski
// @match        https://*.fanatical.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii01MCAtNTAgMTAwIDEwMCIgY2xpcC1wYXRoPSJjaXJjbGUoMTAwJSkiPjxjaXJjbGUgcj0iNTAiIGZpbGw9IiNmOTAiLz48cGF0aCBkPSJNLTUwLC0yNUgyOUwyMywtOUgtNTBNMjAsLTNILTE5VjM2TDAsMTJIMTMiIGZpbGw9IiNmZmYiLz48L3N2Zz4
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/500032/Fanatical%20bundles%20carousel%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/500032/Fanatical%20bundles%20carousel%20enhancer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let carousel, tileCard, tileTarget, carouselTarget, button,
      buttonDummy, tilesTitles, carouselTitle, observerAddRem,
      markOnly;
  const observerInitial = new MutationObserver(() => {
    const contentElem = document.getElementsByClassName('content')[0];
    if (!contentElem) return;
    if (contentElem.parentElement.parentElement.id !== 'root') return;
    observerInitial.disconnect();
    observePageChange(contentElem);
  });
  observerInitial.observe(document.body, {childList: true, subtree: true});

  function observePageChange(elem) {
    const observerPage = new MutationObserver((mutationsList) => {
      const addedBundle = mutationsList
          .find((mutation) => [...mutation.addedNodes].find(checkIfBundle));
      if (addedBundle) {
        carousel = document.querySelector('section.bundle-carousel');
        if (carousel) {
          carouselOnTop();
          carousel.addEventListener('wheel', wheelSwitch, {passive: false});
          carouselTitle = carousel.getElementsByClassName('product-name')[0].firstChild; // text node
          carouselTarget = carousel.getElementsByClassName('right-column')[0];
          if (document.querySelector('main.PickAndMixProductPage')) {
            markOnly = !!document.querySelector('.bundle-carousel .pnm-add-btn'); // Add button exists in game bundles by default
            tilesTitles = [...document.querySelectorAll('h2.card-product-name')];
            startButtonCopy();
          } else if (document.getElementsByClassName('tier-title').length !== 0) { // Bundle with tiers
            tilesTitles = [...document.querySelectorAll('h3.card-product-name')];
            startTierCopy();
          }
        }
        return;
      }
      const removedBundle = mutationsList
          .find((mutation) => [...mutation.removedNodes].find(checkIfBundle));
      if (removedBundle) {
        if (observerAddRem) observerAddRem.disconnect();
        if (tileCard) removeListeners(tileCard);
      }
    });
    observerPage.observe(elem, {childList: true});
  }

  function checkIfBundle(node) {
    return node.tagName && node.tagName === 'MAIN'
      && (node.classList.contains('PickAndMixProductPage') || node.classList.contains('bundle-page'));
  }

  function carouselOnTop() {
    unwrapCarousel(carousel);
    unwrapCarousel(carousel.parentElement);
    const bgContrast = document.querySelector('[class$="backgroundContrast"]');
    if (bgContrast) carousel.parentElement.before(bgContrast);
  }

  function unwrapCarousel(relElem) {
    while (relElem.previousElementSibling) {
      carousel.after(relElem.previousElementSibling);
    }
  }

  function startButtonCopy() {
    moveTheButton();
    const observerTitle = new MutationObserver(moveTheButton);
    observerTitle.observe(carouselTitle, {characterData: true});
    if (markOnly) return;
    observerAddRem = new MutationObserver((mutationsList) => {
      if (mutationsList[0].target
          && mutationsList[0].target.tagName === 'A'
          || !buttonDummy
         ) return;
      mutationsList.forEach((mutation) => {
        if (mutation.target.tagName !== 'BUTTON') return;
        const buttonDummy2 = button.cloneNode(true);
        buttonDummy.replaceWith(buttonDummy2);
        buttonDummy = buttonDummy2;
      });
    });
    observerAddRem.observe(
      document.querySelector('div.PickAndMixProductPage__content.container > section'),
      {subtree: true, attributeFilter: ["class"]}
    );
  }

  function moveTheButton() {
    if (tileCard) { // Not on the first run
      moveToTile();
      if (!markOnly) removeListeners(tileCard);
    }
    tileCard = tilesTitles
        .find((tile) => tile.textContent === carouselTitle.nodeValue)
        .closest('article');
    tileTarget = tileCard.querySelector('.PickAndMixCard__addToBundle > div');
    button = tileTarget.getElementsByTagName('button')[0];
    moveToCarousel();
    if (!markOnly) addListeners(tileCard);
  }

  function moveToTile(event) {
    tileCard.parentElement.classList.remove('fbce-in-carousel');
    if (markOnly) return;
    tileTarget.append(button);
    if (buttonDummy) buttonDummy.remove();
    buttonDummy = button.cloneNode(true);
    carouselTarget.prepend(buttonDummy);
  }

  function moveToCarousel(event) {
    tileCard.parentElement.classList.add('fbce-in-carousel');
    if (markOnly) return;
    carouselTarget.prepend(button);
    if (buttonDummy) buttonDummy.remove();
    if (!event) buttonDummy = button.cloneNode(true);
    tileTarget.append(buttonDummy);
  }

  function removeListeners(node) {
    node.removeEventListener('mouseenter', moveToTile);
    node.removeEventListener('mouseleave', moveToCarousel);
  }

  function addListeners(node) {
    node.addEventListener('mouseenter', moveToTile);
    node.addEventListener('mouseleave', moveToCarousel);
  }

  function startTierCopy() {
    const container = document.createElement('div');
    container.className = 'fbce-tierInfo';
    carouselTarget.prepend(container);
    carouselTarget = container;
    copyTierInfo();
    const observerTitle = new MutationObserver(copyTierInfo);
    observerTitle.observe(carouselTitle, {characterData: true});
  }

  function copyTierInfo() {
    const tileCard = tilesTitles
        .find((tile) => tile.textContent === carouselTitle.nodeValue)
        .closest('article')
        .closest('div');
    const tierElem = tileCard.closest('.tier');
    const tierTiles = tierElem.querySelectorAll(':scope > div > div > div');
    const tierCount = tierTiles.length;
    const tierIndex = [...tierTiles]
        .findIndex((tile) => tile === tileCard);
    let string = [...tierElem.children[0].childNodes]
        .reduce((str,node) => {
          return str += node.nodeType === Node.TEXT_NODE ? node.textContent : ''
        }, '');
    string += tierElem.children[0].firstElementChild.textContent;
    carouselTarget.replaceChildren(
      string,
      document.createElement('br'),
      `${tierIndex + 1}/${tierCount}`
    );
  }

  function wheelSwitch(e) {
    if (!e.cancelable || e.deltaY !== 0) return;
    if (e.deltaX > 0) {
      document.querySelector('button.carousel-button[aria-label="Next"]').click();
    } else if (e.deltaX < 0) {
      document.querySelector('button.carousel-button[aria-label="Previous"]').click();
    }
  }

  const styleSheet = new CSSStyleSheet();
  document.adoptedStyleSheets.push(styleSheet);
  styleSheet.replaceSync(`
    .right-column > button {
      float: right;
      padding: 6px;
      margin-left: 0.3rem;
      margin-bottom: 1rem;
    }
    .right-column > div.fbce-tierInfo {
      text-align: right;
      margin-bottom: .5rem;
    }
    h4.mb-3 + .overview-container {clear: both;}
    section.bundle-carousel {padding-top: 1px;}
    #carousel-content {padding: 1rem;}
    .PickAndMixProductPage__content {padding-top: 0 !important;}
    .fbce-in-carousel {scale: 1.1;}
    .fbce-in-carousel > article {background-color: dimgrey;}
    .fbce-in-carousel .PickAndMixCard__bottomRowIcons * {color: bisque !important;}
    article.left-column > div.product-details {
      /* Fix. BYO Fantasy Game Assets Bundle had Pixelart Fonts Asset packs. */
      /* Description contained "supported characters", which swelled container. */
      word-break: break-word;
    }
    :root {
      /* Fix. Sometimes fanatical have unnecesary horizontal scrollbar. */
      margin-left: -1.1rem;
    }
  `);

  /* Tested:
    https://www.fanatical.com/en/pick-and-mix/essential-game-music-build-your-own-bundle - audio
    https://www.fanatical.com/en/pick-and-mix/ultimate-machine-learning-and-ai-build-your-own-bundle - ebook
    https://www.fanatical.com/en/pick-and-mix/build-your-own-tabletop-wargame-bundle - games, already has Add
    https://www.fanatical.com/en/pick-and-mix/new-skills-new-you-build-your-own-bundle - elearning
    https://www.fanatical.com/en/pick-and-mix/build-your-own-fantasy-game-assets-bundle - mixed audio + graphics
  */
})();