// ==UserScript==
// @name        Amazon Price Variation (Fork)
// @namespace   dsr-price-variation-camel
// @description Embeds CamelCamelCamel price chart in Amazon product pages
// @include     https://amazon.*/*
// @include     https://www.amazon.*/*
// @include     https://smile.amazon.*/*
// @version     20250708
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/34849/Amazon%20Price%20Variation%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/34849/Amazon%20Price%20Variation%20%28Fork%29.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const width = 500, height = 200, duration = '1y', chart = 'amazon-new';

  /**
   * Brief: Determine country code from hostname
   */
  const getCountry = () => {
    const parts = location.hostname.split('.');
    let tld = parts.pop();
    return tld === 'com' ? 'us' : tld;
  };

  /**
   * Brief: Create and insert chart element under availability
   */
  const insertChart = asin => {
    const country = getCountry();
    const imgUrl = `${location.protocol}//charts.camelcamelcamel.com/${country}/${asin}/${chart}.png?force=1&zero=0&w=${width}&h=${height}&desired=false&legend=1&ilt=1&tp=${duration}&fo=0`;
    const link = document.createElement('a');
    link.href = `${location.protocol}//${country}.camelcamelcamel.com/product/${asin}`;
    link.target = '_blank';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = 'Price history chart';
    img.width = width;
    img.height = height;
    link.appendChild(img);

    const container = document.querySelector('#titleSection');
    if (container) {
      const wrapper = document.createElement('div');
      wrapper.id = 'camelcamelcamel';
      wrapper.style.margin = '0';
      wrapper.appendChild(link);
      container.appendChild(wrapper);
    }
  };

  // get ASIN from hidden input or URL
  const asinInput = document.querySelector('input[name="ASIN"]');
  const asin = asinInput
    ? asinInput.value.trim()
    : location.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1];

  if (asin) {
    console.info('[!] Amazon Price Variation: ASIN found', asin);
    insertChart(asin);
  }
})();
