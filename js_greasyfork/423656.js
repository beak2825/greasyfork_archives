// ==UserScript==
// @name         Amazon ReviewMeta
// @namespace    www.pizidavi.altervista.org
// @description  Analyze Amazon product reviews and filters out reviews that may be unnatural
// @author       pizidavi
// @version      1.5.3
// @copyright    2021, PIZIDAVI
// @license      MIT
// @homepageURL  https://reviewmeta.com
// @icon         https://reviewmeta.com/public/imgs/reviewmeta/favicon.ico
// @match        https://*.amazon.com/*dp/*
// @match        https://*.amazon.com.au/*dp/*
// @match        https://*.amazon.com.br/*dp/*
// @match        https://*.amazon.com.mx/*dp/*
// @match        https://*.amazon.co.uk/*dp/*
// @match        https://*.amazon.co.jp/*dp/*
// @match        https://*.amazon.ca/*dp/*
// @match        https://*.amazon.cn/*dp/*
// @match        https://*.amazon.de/*dp/*
// @match        https://*.amazon.es/*dp/*
// @match        https://*.amazon.fr/*dp/*
// @match        https://*.amazon.in/*dp/*
// @match        https://*.amazon.it/*dp/*
// @match        https://*.amazon.nl/*dp/*
// @match        https://*.amazon.com/*gp/product/*
// @match        https://*.amazon.com.au/*gp/product/*
// @match        https://*.amazon.com.br/*gp/product/*
// @match        https://*.amazon.com.mx/*gp/product/*
// @match        https://*.amazon.co.uk/*gp/product/*
// @match        https://*.amazon.co.jp/*gp/product/*
// @match        https://*.amazon.ca/*gp/product/*
// @match        https://*.amazon.cn/*gp/product/*
// @match        https://*.amazon.de/*gp/product/*
// @match        https://*.amazon.es/*gp/product/*
// @match        https://*.amazon.fr/*gp/product/*
// @match        https://*.amazon.in/*gp/product/*
// @match        https://*.amazon.it/*gp/product/*
// @match        https://*.amazon.nl/*gp/product/*
// @connect      reviewmeta.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423656/Amazon%20ReviewMeta.user.js
// @updateURL https://update.greasyfork.org/scripts/423656/Amazon%20ReviewMeta.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const hostname = location.hostname.replace(/www./g, '').replace(/.com(?!.)/g, '').replace(/[.]/g, '-');
  const website = 'https://reviewmeta.com/api/' + hostname + '/';
  const s_overall = [{text: 'Not analyzed', background: '#7f8c8d'}, {text: 'Pass', background: '#4cd137'}, {text: 'Warning', background: '#fbc531'}, {text: 'Fail', background: '#e84118'}];

  const CSS = '.review-meta { display: none; position: fixed; right: 20px; top: 15px; width: 270px; background-color: #7f8c8d; color: white; border-radius: 3px; padding: 15px 20px 10px; margin-top: -130px; opacity: 0; transition: opacity 0.5s, margin-top 0.7s; box-shadow: 10px 10px 18px -8px rgba(0,0,0,0.75); z-index: 99999; } .review-meta.visible { display: block; margin-top: 0; opacity: 1; } .review-meta > * { display: block; margin-bottom: 5px; text-decoration: none !important; color: inherit !important; } .review-meta > .title { text-align: center; text-transform: uppercase; font-size: 120%; margin-bottom: 10px; padding-bottom: 3px; border-bottom: 1px solid; } .review-meta > .report { border: 1px solid; padding: 4px; margin-top: 10px; text-align: center; text-transform: uppercase; font-size: 80%; } .review-meta > .ignore { position: absolute; text-decoration: none; color: inherit; right: 0; top: 0; border: 1px solid; border-right: none; border-top: none; border-bottom-left-radius: 3px; padding: 1px 8px; } .review-meta > span { cursor: default; } .review-meta > span > .text { float: right; font-size: 125%; }';
  const style = document.createElement('style');
  style.innerText = CSS;
  document.head.appendChild(style);

  const HTML = '<span class="title"></span> <span class="rating">Adjusted rating: <span class="text"></span></span> <span class="review">Adjusted review count: <span class="text"></span></span> <span class="not-analizyed" style="display:none;">We have not analyzed this product yet.<br>Please open the report manually.</span> <a class="report" target="_blank" href="#">Report</a> <a class="ignore" href="#">X</a>';
  const element = document.createElement('div');
  element.classList.add('review-meta');
  element.innerHTML = HTML;
  element.querySelector('.ignore').onclick = function(e) {
    e.preventDefault(); e.stopPropagation();
    element.classList.remove('visible');
  };
  document.body.append(element);

  const analyse = function() {
    element.style.backgroundColor = s_overall[0].background;
    element.querySelector('.not-analizyed').style.display = 'none';
    element.querySelector('.rating').style.display = 'none';
    element.querySelector('.review').style.display = 'none';
    element.querySelector('.title').innerText = 'Analysing...';

    const product = document.querySelector('[data-asin]');
    request({
      url: website + product.getAttribute('data-asin'),
      success: function(data) {
        if (!data.s_overall) {
          element.querySelector('.not-analizyed').style.display = 'block';
          element.querySelector('.title').innerText = s_overall[0].text;
        } else {
          element.querySelector('.rating').style.display = 'block';
          element.querySelector('.review').style.display = 'block';
          element.querySelector('.rating > .text').innerText = data.rating;
          element.querySelector('.review > .text').innerText = data.count;

          element.style.backgroundColor = s_overall[data.s_overall].background;
          element.querySelector('.title').innerText = s_overall[data.s_overall].text;
        }
        element.querySelector('.report').href = data.href;
        element.classList.add('visible');
      }
    });
  };

  window.onload = analyse;

  const parent = document.querySelector('#desktop_buybox');
  const MO = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(element) {
        if (element.id === 'buybox')
          analyse();
      });
    });
  });
  if (parent)
    MO.observe(parent, {childList: true, subtree: true});

  // Functions
  function request(options) {
    const onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200)
        options.success(JSON.parse(this.responseText));
    };
    if (typeof GM_xmlhttpRequest != 'undefined') {
      options.onload = onreadystatechange;
      GM_xmlhttpRequest(options);
    } else {
      const xhttp = new XMLHttpRequest();
      xhttp.open('GET', options.url);
      xhttp.onreadystatechange = onreadystatechange;
      xhttp.send();
    }
  }

  /*
    * Powered by ReviewMeta.com
    */

})();