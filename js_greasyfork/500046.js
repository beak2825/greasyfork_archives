// ==UserScript==
// @name         Steam explicit discounts
// @version      2024.7.28
// @namespace    Jakub Marcinkowski
// @description  Some games has just "on sale" tag, instead of percentage discount. This script brings it back to normal. Script is not downloading any info, it is using only the info buried on a page, so might not work everywhere. Yeah, Steam just complies with stupid EU law.
// @author       Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @copyright    2023+, Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @license      Zlib
// @homepageURL  https://gist.github.com/JakubMarcinkowski
// @homepageURL  https://github.com/JakubMarcinkowski
// @run-at       document-idle
// @grant        unsafeWindow
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBjbGlwLXBhdGg9ImNpcmNsZSgxMDAlKSI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiLz48ZyBmaWxsPSIjZmZmIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2Ni41LDM3KSI+PGNpcmNsZSByPSIxOSIvPjxjaXJjbGUgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIHI9IjExIi8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0LjgsNjguNSkiPjxjaXJjbGUgcj0iMTQiLz48Y2lyY2xlIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIiByPSI5Ii8+PC9nPjxwYXRoIGQ9Ik00OCwzOEw2Nyw1Nkw0OCw2OEw0Myw2MEwzNiw1NU0tMSw2MlY0NUwzOCw2MS43TDMyLDc1LjQiLz48L2c+PC9zdmc+
// @match        *://store.steampowered.com/*
// @match        *://store.steampowered.com/news/app/*
// @exclude      *://store.steampowered.com/cart*
// @exclude      *://store.steampowered.com/explore/*
// @exclude      *://store.steampowered.com/adultonly*
// @exclude      *://store.steampowered.com/sale/nextfest*
// @exclude      *://store.steampowered.com/sale/steam_awards*
// @exclude      *://store.steampowered.com/steamawards*
// @exclude      *://store.steampowered.com/vrhardware*
// @exclude      *://store.steampowered.com/steamdeck*
// @exclude      *://store.steampowered.com/points*
// @exclude      *://store.steampowered.com/news*
// @exclude      *://store.steampowered.com/yearinreview*
// @exclude      *://store.steampowered.com/labs*
// @exclude      *://store.steampowered.com/charts*
// @exclude      *://store.steampowered.com/about*
// @downloadURL https://update.greasyfork.org/scripts/500046/Steam%20explicit%20discounts.user.js
// @updateURL https://update.greasyfork.org/scripts/500046/Steam%20explicit%20discounts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let counter = 0;
  // let priceChunks, toPadEnd;

  const styleSheet = document.head.appendChild(document.createElement('style')).sheet;
  function addStyleRules(rules) {
    rules.forEach((rule) => styleSheet.insertRule(rule));
  }
  addStyleRules([
    `.generic_discount_fixed > div:first-child {
      position: relative;
    }`,
    `.generic_discount_fixed > div:first-child:before {
      content: '';
      background-image: url(https://store.akamai.steamstatic.com/public/images/ico/ico_discount_generic.svg);
      background-repeat: no-repeat;
      position: absolute;
      height: 180%;
      width: 100%;
      transform-origin: top left;
    }`,
    `.home_page_body_ctn .generic_discount_fixed > div:first-child:before {
      mix-blend-mode: color-dodge;
    }`,
    `:is(#content_more, .game_description_column .block_responsive_horizontal_scroll,
     .carousel_container.paging_capsules, .store_main_capsule > .info,
     .game_area_dlc_price, #RecommendationsRows)
     .generic_discount_fixed > div:first-child:before {
      transform: scale(0.3);
    }`,
    `.generic_discount_fixed:not(.Discounted) > div:first-child:before {
      transform: scale(0.4);
      left: 0;
      top: 0;
    }`,
    `.generic_discount_fixed.search_discount_block:not(.Discounted) > div:first-child:before {
      top: 9px;
    }`,
    `.generic_discount_fixed.Discounted > div:first-child:before {
      transform: scale(0.5);
      height: 90%;
      left: 0;
    }`,
  ]);

  if (location.pathname === '/'
      || location.pathname.startsWith('/dlc/')
      || location.pathname.startsWith('/developer/')
     ) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE
              || node.className.startsWith('discount')
              || [...node.classList].find((x) => ['ds_options', 'ds_wishlist_flag'].includes(x))
              || node.nodeName === 'VIDEO'
             ) continue;
          convertAllClassic(node);
        }
      }
    });
    const ids = ['content_more', 'RecommendationsRows'];
    for (const id of ids) {
      const node = document.getElementById(id);
      if (node) observer.observe(node, {childList: true});
    }
    const classes = ['recently_updated'];
    for (const cls of classes) {
      const node = document.getElementsByClassName(cls)[0];
      if (node) observer.observe(node, {childList: true});
    }
    const mainContent = document.getElementsByClassName('main_content_ctn')[0];
    if (mainContent) observer.observe(mainContent, {childList: true, subtree: true});
  }

  if (location.pathname === '/'
      || location.pathname.startsWith('/bundle/')
      || location.pathname.startsWith('/sub/')
      || location.pathname.startsWith('/dlc/')
      || location.pathname.startsWith('/developer/')
      || location.pathname.startsWith('/widget/') // embedded iframe strip with basic game info
     ) {
    convertAllClassic(document);
    // setTimeout(convertAllClassic, 200, document);
    return;
  }

  if (location.pathname.startsWith('/app/')) {
    const prices = document.getElementsByClassName('game_purchase_action');
    for (const element of prices) {
      convertAllClassic(element);
    }
    const dlcs = document.getElementById('gameAreaDLCSection');
    if (dlcs) {
      convertAllClassic(dlcs);
    }
    const ids = ['recommended_block_content', 'franchise_app_block_content', 'moredlcfrombasegame_block_content'];
    for (const id of ids) {
      const node = document.getElementById(id);
      if (node) convertAllClassic(node);
    }
    return;
  }

  if (location.pathname.startsWith('/search/')) {
    [...document.getElementById('search_resultsRows').children].forEach(convertAllClassic);

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length !== 1
            || !(mutation.addedNodes[0].nodeName && mutation.addedNodes[0].nodeName === 'A')
           ) continue;
        convertAllClassic(mutation.addedNodes[0]);
      };
    });
    observer.observe(document.getElementById('search_resultsRows'), {childList: true});
    return;
  }

  if (location.pathname.startsWith('/wishlist/')) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length === 0) continue;
        convertAllClassic(mutation.addedNodes[0]);
      };
    });
    observer.observe(document.getElementById('wishlist_ctn'), {childList: true});
    return;
  }

   // Modern Steam pages 2024
  let exampleNonGeneric;
  const reactElem = document.getElementsByClassName('react_landing_background')[0];
  // const reactElem = document.querySelector('.react_landing_background, .ShoppingCart.reactroot');
  if (reactElem) {
    const observerReact = new MutationObserver(() => {
      const nodes = reactElem.getElementsByClassName('Discounted');
      if (nodes.length !== 0 && !unsafeWindow.StoreItemCache) {
        observerReact.disconnect()
        return;
      } else if (nodes.length !== 0) {
        if (!exampleNonGeneric) {
          exampleNonGeneric = document
              .querySelector('.Discounted > div:nth-of-type(2) > div:first-child')
              .parentElement.parentElement;
        }
        if (!exampleNonGeneric) {
          observerReact.disconnect();
          return;
        }
        const genericDiscounts = [...nodes]
            .filter((elem) => elem.firstChild.firstChild.nodeName === 'svg');
        for (const elem of genericDiscounts) {
          convertPricesModern2024(elem);
        }
      }
    });
    observerReact.observe(reactElem, {childList: true, subtree: true});
    return;
  }

  function convertPricesModern2024(priceContainer) {
    const id = findAppId(priceContainer);
    if (!id) return;

    const priceInfo = unsafeWindow.StoreItemCache.m_mapApps.get(id).m_BestPurchaseOption;
    const discountText = (-priceInfo.discount_pct / 100)
        .toLocaleString(navigator.language, {style: 'percent'});

    priceContainer.classList.add('generic_discount_fixed');
    const cloned = exampleNonGeneric.cloneNode(true);
    cloned.firstChild.textContent = discountText;
    cloned.lastChild.firstChild.textContent = priceInfo.formatted_original_price;
    cloned.lastChild.lastChild.textContent = priceInfo.formatted_final_price;
    priceContainer.replaceChildren(...cloned.children);

    console.log('Steam explicit discounts: ', ++counter, priceContainer.firstChild);
  }

  function findAppId(node) {
    let testElem, id;
    testElem = node.closest('a');
    if (testElem) id = parseInt(testElem.href.split('/')[4]);
    if (!id
        && node.parentElement
        && node.parentElement.previousElementSibling
        && node.parentElement.previousElementSibling.firstChild
       ) {
      testElem = node.parentElement.previousElementSibling.firstChild;
      if (testElem.nodeName === 'IMG') id = parseInt(testElem.src.split('/')[5]);
    }
    if (!id
        && node.closest('.Panel')
        && node.closest('.Panel').getElementsByTagName('a')[0]
       ) {
      testElem = node.closest('.Panel').getElementsByTagName('a')[0];
      if (testElem.nodeName === 'A') id = parseInt(testElem.href.split('/')[4]);
    }
    return id;
  }

  function convertAllClassic(node) {
    const nodes = 'length' in node ? node : node.getElementsByClassName('generic_discount');
    while (nodes.length !== 0) {
      convertPricesClassic(nodes[0]);
    }
  }

  function convertPricesClassic(generic) {
    // if (!priceChunks) {
    //   const originalPrice = generic.getElementsByClassName('discount_final_price')[0].textContent.trim();
    //   priceChunks = [...originalPrice.matchAll(/(.*?)([0-9]+[,.]*[0-9]+)(.*)/g)][0];
    //   const priceSplit = priceChunks[2].split(/[,.]/);
    //   if (priceSplit[1]) toPadEnd = priceSplit[1].length
    // }

    const discount_block = generic.parentElement; // div.discount_block
    generic.classList.remove('generic_discount');
    discount_block.classList.add('generic_discount_fixed');
    discount_block.getElementsByClassName('discount_icon')[0].style.display = 'none';

    const discount = discount_block.dataset.discount;
    const discountText = (-discount / 100)
        .toLocaleString(navigator.language, {style: 'percent'});
    const priceFinal = discount_block.dataset.priceFinal;
    const priceCalc = priceFinal / (100 - discount);
    let priceText = '';
    priceText = unsafeWindow.GStoreItemData.fnFormatCurrency(priceCalc * 100);
//     priceText = Number(priceCalc.toFixed(2)).toLocaleString();
//     let priceFinalSplit = priceText.split(/[,.]/);
//     if (priceFinalSplit[1] && priceFinalSplit[1].length < toPadEnd) {
//       while (priceFinalSplit[1].length < toPadEnd) {
//         priceText += '0';
//         priceFinalSplit = priceText.split(/[,.]/);
//       }
//     }
//     if (priceChunks && priceChunks[1]) priceText = priceChunks[1] + priceText;
//     else if (priceChunks && priceChunks[3]) priceText = priceText + priceChunks[3];

    const discount_pct = document.createElement('div');
    discount_pct.className = 'discount_pct';
    discount_pct.textContent = discountText;
    discount_block.prepend(discount_pct);

    const discount_prices = discount_block.getElementsByClassName('discount_prices')[0];
    const discount_original_price = document.createElement('div');
    discount_original_price.textContent = priceText;
    discount_original_price.className = 'discount_original_price';
    discount_prices.prepend(discount_original_price);

    console.log('Steam explicit discounts: ', ++counter, discount_pct);
  }
})();