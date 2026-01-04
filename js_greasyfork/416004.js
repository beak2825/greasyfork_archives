// ==UserScript==
// @name        Discount percentage boxes 
// @version     0.4
// @namespace   https://greasyfork.org/users/219548
// @description Adds discount boxes to promo pages, gradients quickly show you the height of discounts everywhere, order by discount in promo pages
// @author      mnnks
// @icon        https://images.gog.com/67bea49d4dd1f2ce362f3a482f39d9236acd058dac6d2ba91f25eab737126df5_forum_avatar.jpg
// @match       *://www.gog.com/
// @match       *://www.gog.com/games*
// @match       *://www.gog.com/game/*
// @match       *://www.gog.com/account/wishlist
// @match       *://www.gog.com/promo/*
// @match       *://www.gog.com/redeem/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416004/Discount%20percentage%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/416004/Discount%20percentage%20boxes.meta.js
// ==/UserScript==

'use strict';
// change end of the next line to 'radial' for a different effect
let gradientType = {linear: 'linear-bg', radial: 'radial-bg'}.linear;
let discountBoxBgColor = '120, 135, 149';     // #788795 wishlist discount box background color
let discountBoxFpBgColor = '120, 56, 123';    // frontpage discount box background color
let discountBoxFpAltBgColor = '120, 56, 123'; // #D80F5C frontpage big spots discount box background color

const gogData = Object.is(unsafeWindow.gogData, undefined) ? { pageType: 'productCard' } : unsafeWindow.gogData;
const pageType = document.URL.split('/')[3].split('?')[0].toLowerCase();
const discountBoxBaseColor = `\n  --discount-bg-color: ${discountBoxBgColor};`;
const discountBoxFpColor = ['', 'games', 'game'].includes(pageType) ? `\n  --discount-bg-fp-color: ${discountBoxFpBgColor};` : '';
const discountBoxFpAltColor = ['', 'games'].includes(pageType) ? `\n  --discount-bg-fp-alt-color: ${discountBoxFpAltBgColor};` : '';
const menuTray = document.querySelector('.menu-tray');

function reworkDiscountBoxes() {
  const discountBoxCSS = `<style id='discountBoxes'>:root {${discountBoxBaseColor}${discountBoxFpColor}${discountBoxFpAltColor}
}
.price-text--discount { /* on redeem page: .price__discount?!? margin needed when multiple games? */
  ${(['promo', 'redeem'].includes(pageType)) ? 'margin: 0 -8px 0 6px;\n  ' : ''}border-color: rgb(var(--discount-bg-color));
  background-origin: border-box;
  width: calc(1318px / 30); /* (or 1378px?) force width for single digit discounts */
}
.radial-bg {
  background-image: radial-gradient(ellipse 100% 200% at 0, #91b600 var(--discount), transparent calc(var(--discount) + 10%)) !important;
}
.linear-bg {
  background-image: linear-gradient(90deg, hsla(72, 100%, 36%, calc((var(--discount) + 5%))) var(--discount), transparent var(--discount)) !important;
}
.menu-product__discount-text.linear-bg {
  height: 20px;
}${['', 'games', 'game'].includes(pageType) ? `\n.linear-bg {
  background-clip: padding-box;
  border: 1px solid rgba(var(--c-discount, var(--discount-bg-fp-color)), 1);
}
.big-spot__action-left-side .linear-bg {
  padding: 9px 15px;
}
.product-tile__prices .linear-bg {
  border: rgba(var(--c-discount, var(--discount-bg-fp${pageType == '' ? '-alt' : ''}-color)), 1) solid 1px;
  padding: 9.5px 7px 6.5px;
}`: ''}${(pageType == 'game') ? `\n.linear-bg {
  border-left-width: 0px;
  padding-top: 1px;
  width: calc(128px - 2px);
}` : ''}</style>`;
  document.querySelector('head').insertAdjacentHTML('beforeend', discountBoxCSS);
  // add gradient to discount boxes
  document.querySelectorAll('.menu-product__discount-text').forEach(x => {
    x.classList.toggle(gradientType);
    x.setAttribute('style','--discount: {{ product.price.discountPercentage }}%;');
  });
  if(['', 'games'].includes(pageType)) {
    ['.big-spot__discount', '.product-tile__discount'].forEach(box => {
      document.querySelectorAll(box).forEach(x => {
        x.classList.toggle(gradientType);
        x.setAttribute('style','--discount: {{ tile.data.price.discountPercentage }}%;');
      });
    });
  }
  else if(pageType == 'promo') {
    // add discount boxes to promo pages
    const discountBox = `<span ng-if="product.price.discountPercentage" style="--discount: {{ product.price.discountPercentage }}%;" class="price-text--discount ${gradientType}"><span ng-bind="product.price.discountPercentage"></span>%</span>`;
    document.querySelectorAll('.product-row__price').forEach(x => x.insertAdjacentHTML('beforeend', discountBox));
  }
  else if(pageType == 'account') {
    // add gradient to discount boxes on wishlist
    document.querySelector('section.account__product-lists').style.marginBottom = '60px';
    document.querySelectorAll('.price-text--discount').forEach(x => {
      x.classList.toggle(gradientType);
      x.setAttribute('style','--discount: {{ product.price.discountPercentage }}%;');
    });
  }
  else if(pageType == 'redeem') {
    document.querySelectorAll('.price__discount').forEach(x => {
      x.classList.toggle(gradientType);
      x.setAttribute('style','--discount: {{ product.price.discountPercentage }}%;');
    });
  }
  else {
    document.querySelectorAll('.product-actions-price__discount').forEach(x => {
      x.classList.toggle(gradientType);
      x.setAttribute('style','--discount: {{ cardProduct.product.price.discountPercentage }}%;');
    });
  }
}

function compressProductRows() {
  const rowCSS = `<style id='compressedRows'>/* shared css for compressing row height */
.product-row {
  height: calc(var(--row-height-ratio) * 60px);
}

.product-row .label {
  position: relative;
  top: -3px;
}

.product-row__img {
  height: calc(var(--row-height-ratio) * 60px);
  width: calc(var(--row-height-ratio) * 100px);
}

.product-row__content {
  line-height: calc(var(--row-height-ratio) * 54px) !important;
}

.module-list-spacer, .account__product-lists {
  margin-bottom: 35px;
}

/* additional css for wishlist page */
.list--rows .product-row__title {
  margin-top: calc(var(--row-height-ratio) * 19px + 1px);
  width: 50%;
  left: 4px;
}

.list--rows .product-row__info {
  width: 43%
}

.list--rows .product-row__picture, .list--rows .product-row__content-in, .product-row__info {
  height: calc(var(--row-height-ratio) * 60px);
}

.list--rows .product-row__picture {
  width: calc(var(--row-height-ratio) * 100px);
}

.list--rows .product-row__picture .product-row__img {
  left: initial;
}

.list--rows .product-row__info.product-row__alignment::before, .product-row__alignment::before {
  height: calc(var(--row-height-ratio) * 34px + 1px);
}

.list--rows .product-row__date {
  display: inline-block;
}

/* additional css for promo pages */
.csspositionsticky .sticky-floater {
  top: 66px;
}

.promo-page-header {
  background-color: rgba(218, 218, 218, var(--header-alpha));
  box-shadow: 0 1px 5px rgba(0,0,0,.15);
  padding: 6px 15px !important;
}

.promo-page-header div.socials, .column--left .module-header--promo {
  display: none;
}

.header__title {
  margin-top: 0;
  font-weight: 400;
}

.promo-page-header .socials {
  height: inherit;
  margin-top: inherit;
  margin-bottom: inherit;
}

.promo-columns-wrapper {
  margin-top: 20px;
}

.promo-module-top {
  padding: 0 10px;
}

.promo-counter-right {
  font-weight: initial;
}

.is-not-fixed .socials {
    margin-top: 10px !important;
}

.hide-on-scroll, .socials, .socials__list {
  overflow: inherit !important;
}

.list-category-header {
  line-height: 30px;
}</style>`;
  document.querySelector('head').insertAdjacentHTML('beforeend', rowCSS);
  if(pageType == 'account') {
    document.querySelector('.container.account').setAttribute('style', '--row-height-ratio: 0.7;');
    document.querySelector('.page-header.module-header.cf').style.paddingTop = '4px';
    document.querySelector('.account__filters').style.marginTop = '0';
    document.querySelector('section.account__product-lists').style.marginTop = '0';
  };
  if(pageType == 'promo') {
    document.querySelector('.module--list').setAttribute('style', '--row-height-ratio: 0.85;');
    document.querySelector('.columns').setAttribute('style', '--header-alpha: 0.35;');
    document.querySelector('.sticky-floater').insertBefore(document.querySelector('header'), document.querySelector('.floater-css-data'));
  };
};

function promoTransparency() {
  document.querySelectorAll('.social-btn').forEach(x => x.style.backgroundColor = 'rgba(225, 225, 225, var(--header-alpha))');
  document.querySelectorAll('.module').forEach(x => x.style.backgroundColor = 'rgba(225, 225, 225, var(--header-alpha))');
  document.querySelectorAll('.list-category-header').forEach(x => x.style.backgroundColor = 'rgba(218, 218, 218, var(--header-alpha))');
  document.querySelectorAll('.promo-counter').forEach(x => x.style.backgroundColor = 'rgba(218, 218, 218, var(--header-alpha))');
};

function addMenuItem() {
  let menuItem = `
<div class="menu-item menu-item--invisible-on-loading">
    <a class="menu-link menu-link--icon">
        <svg viewBox="0 0 16 16.3" class="menu-icon-svg menu-icon-svg--notifications">
            <g xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 15.1C1.3 15.1 1.1 15.1 0.9 14.9C0.6 14.5 0.6 14 0.9 13.7L13.7 0.9C14 0.6 14.5 0.6 14.9 0.9C15.2 1.2 15.2 1.8 14.9 2.1L2.1 14.9C1.9 15 1.7 15.1 1.5 15.1ZM15.8 12C15.8 9.9 14.1 8.2 12 8.2S8.2 9.9 8.2 12S9.9 15.8 12 15.8S15.8 14.1 15.8 12ZM14.1 12C14.1 13.2 13.2 14.1 12 14.1S9.8 13.2 9.8 12C9.8 10.8 10.8 9.8 12 9.8S14.1 10.8 14.1 12ZM7.6 3.8C7.6 1.7 5.9 0 3.8 0S0 1.7 0 3.8S1.7 7.6 3.8 7.6S7.6 5.9 7.6 3.8ZM6 3.8C6 5 5 6 3.8 6S1.6 5 1.6 3.8S2.6 1.6 3.8 1.6S6 2.6 6 3.8Z"/>
            </g>
        </svg>
        %
    </a>
</div>
`;
  menuTray.insertAdjacentHTML('afterbegin', menuItem);
};

reworkDiscountBoxes();
['promo', 'account'].includes(pageType) && compressProductRows();
['promo'].includes(pageType) && promoTransparency();
['promo'].includes(pageType) && addMenuItem();

window.addEventListener('load', function() {
  
  function toggleDiscountBoxesGradient() {
    let discountBoxes = document.querySelectorAll('[class $=-bg]');
    discountBoxes.forEach(x => x.classList.toggle('linear-bg'));
    discountBoxes.forEach(x => x.classList.toggle('radial-bg'));
  };
  
  function getProducts(productBlock) {
    return [...productBlock.querySelectorAll('.product-state-holder')].map(row => processRowInfo(row));
  };
  
  function isSameProductOrder(list1, list2) {
    let ids1 = [];
    let ids2 = [];
    [...list1].forEach(x => ids1.push(x.id));
    [...list2].forEach(x => ids2.push(x.id));
    return ids1.join('') == ids2.join('');
  };
  
  function processRowInfo(row) {
    let productID = row.getAttribute('gog-product')
    let product = gogData.promoProducts.find(x => x.id == productID);
    return{id: product.id, price: product.price.amount, discount: product.price.discount, title: product.title, node: row};
  };
  
  function sortByDiscount(products) {
    products.sort(function(a, b){
      if(a.discount === b.discount && a.price === b.price) {
        if(a.title.toLowerCase() > b.title.toLowerCase()) {return 1}
        if(a.title.toLowerCase() < b.title.toLowerCase()) {return -1}
        return 0
      };
      if(a.discount === b.discount) {
        return a.price - b.price;
      };
      return b.discount - a.discount;
    });
    return products;
  };
  
  function toggleSortByDiscount() {
    let productOrderCurrent = getProducts(productsNotOwned);
    let productOrderToShow = [];
    productOrderToShow = isSameProductOrder(productOrderCurrent, productOrderSorted) ? productOrderPrevious : productOrderSorted;
    if(!isSameProductOrder(productOrderCurrent, productOrderSorted)) {productOrderPrevious = productOrderCurrent;} 
    productOrderToShow.forEach(p => p.node.parentNode.insertBefore(p.node, null));
  };
  
  let productsNotOwned = document.querySelectorAll('.list__products')[0];
  let productOrderPrevious = [];
  let productOrderSorted = productsNotOwned && sortByDiscount(getProducts(productsNotOwned));
  
  menuTray.addEventListener("click", toggleSortByDiscount);

}, false);

const changelog = {
  "release": {
    "version": "0.4",
    "date": "20210115",
    "changes": {
      "notable": [
        "added discount box to redeem pages",
        "made layout promo pages and wishlist more compact",
        "added transparent UI to promo pages"
      ]
    }
  }
}