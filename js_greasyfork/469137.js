// ==UserScript==
// @name         Stores checker
// @namespace    http://tampermonkey.net/
// @icon         https://img2.freepng.es/20180319/ize/kisspng-microsoft-excel-logo-microsoft-word-microsoft-offi-excel-png-office-xlsx-icon-5ab06a09e26a86.9276767815215109219274.jpg
// @version      1.0
// @description  Comprueba si una tienda paga o tiene contrato
// @author       xxdamage
// @match        https://es.aliexpress.com/*
// @match        https://www.miravia.es/*
// @match        https://www.amazon.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469137/Stores%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/469137/Stores%20checker.meta.js
// ==/UserScript==

async function checkStore(sellerId) {
    const apiURL = `https://app.michollo.com/api/michollo/search-store-excel?store=${sellerId}`;

    try {
      const response = await fetch(apiURL, {
        method: 'GET',
        mode: 'cors',
      });

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }


function getAmazonSellerID(){
    var sellerProfileTriggerElement = (document.querySelector('#sellerProfileTriggerId') || document.querySelector('span.a-profile-descriptor'));
    if (sellerProfileTriggerElement) {
        var sellerProfileTriggerId = sellerProfileTriggerElement.innerText.trim();
        return sellerProfileTriggerId
    }
    return null
}

function editAmazonProductTitle(data) {
  var productTitleElement = document.querySelector('#productTitle');

  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

function getAliExpressSellerID(){
    var storeNameElement = document.querySelector('h3.store-name');
    if (storeNameElement) {
        var storeName = storeNameElement.innerText.trim();
        return storeName
    }
    return null
}

function editAliExpressProductTitle(data) {
  var productTitleElement = document.querySelector('h1.product-title-text');
  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

function getMiraviaSellerID(){
    var storeNameElement = document.querySelector('h2.xcbFRWwZa2');
    if (storeNameElement) {
        var storeName = storeNameElement.innerText.trim();
        return storeName
    }
    return null
}

function editMiraviaProductTitle(data) {
  var productTitleElement = document.querySelector('h1.LT7WEsjvW0');
  if (productTitleElement) {
    var productTitle = productTitleElement.innerText.trim();
    var color = '';
    var texto = '';

    if (data === 'contrato') {
        color = 'red';
        texto = '[CON CONTRATO]';
    } else if (data === 'contactada') {
        color = 'blue';
        texto = '[CONTACTADA]';
    }

      productTitleElement.innerHTML = '<strong style="color: ' + color + ';">' + texto + '</strong> ' + productTitle;

  }

  return null;
}

var visitedUrl = window.location.href;

async function processStores(){

    if (visitedUrl.includes('amazon.es') && visitedUrl.match(/\b(([0-9]{9}[0-9X])|(B[0-9A-Z]{9}))\b/)) {
        const sellerIdAmazon = getAmazonSellerID();
        const resultAmazon = await checkStore(sellerIdAmazon);
        const dataAmazon = resultAmazon && resultAmazon.store !== null ? JSON.parse(resultAmazon).store : null;

        if (dataAmazon) {
            editAmazonProductTitle(dataAmazon);
        }
    }

    if (visitedUrl.includes('es.aliexpress.com') && visitedUrl.match(/(.+)\.html/)) {
        const sellerIdAliExpress = getAliExpressSellerID();
        const resultAliExpress = await checkStore(sellerIdAliExpress);
        const dataAliExpress = resultAliExpress && resultAliExpress.store !== null ? JSON.parse(resultAliExpress).store : null;

        if (dataAliExpress) {
            editAliExpressProductTitle(dataAliExpress);
        }
    }

    if (visitedUrl.includes('miravia.es') && visitedUrl.match(/\/p\//)) {
        const sellerIdMiravia = getMiraviaSellerID();
        const resultMiravia = await checkStore(sellerIdMiravia);
        const dataMiravia = resultMiravia && resultMiravia.store !== null ? JSON.parse(resultMiravia).store : null;

        if (dataMiravia) {
            editMiraviaProductTitle(dataMiravia);
        }
    }
}

window.onload = async (event) => {
    'use strict';
    await processStores()
}