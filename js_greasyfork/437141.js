// ==UserScript==
// @name         cake cart better
// @namespace    https://github.com/Benzenoil/my_tampermonkey_inall
// @version      0.1.1
// @description  let cake cart better
// @author       benzenoil
// @include      https://cake.jp/cart/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437141/cake%20cart%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/437141/cake%20cart%20better.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var cartItems = document.querySelectorAll('section.item');
  var dataLayer = window.dataLayer;
  if (dataLayer.length > 0) {
    var cartItemDataList = window.dataLayer[0].cartItemDataList;
  }
  if (cartItemDataList) {
    cartItems.forEach(function (item, index) {
      var thisItem = cartItemDataList[index];
      var itemUrl = 'https://cake.jp/item/' + thisItem.itemCode;
      var imgElement = item.getElementsByTagName('img');
      if (imgElement.length > 0) {
        var aElement = document.createElement('a');
        aElement.setAttribute('href', itemUrl);
        aElement.setAttribute('target', '_blank');
        var parNode = imgElement[0].parentNode;
        parNode.insertBefore(aElement, imgElement[0]);
        aElement.appendChild(imgElement[0]);
      }
    });
  } else {
    cartItems.forEach(function (item) {
      var itemId = item.querySelector("input[name='item_id']").value;
      var itemUrl = 'https://cake.jp/item/' + itemId;
      var imgElement = item.getElementsByTagName('img');
      if (imgElement.length > 0) {
        var aElement = document.createElement('a');
        aElement.setAttribute('href', itemUrl);
        aElement.setAttribute('target', '_blank');
        var parNode = imgElement[0].parentNode;
        parNode.insertBefore(aElement, imgElement[0]);
        aElement.appendChild(imgElement[0]);
      }
    });
  }
  // add a link to head icon
  var headLogo = document.querySelector('.carthead_logo > svg');
  var headLogoParNode = headLogo.parentNode;
  var headLogoAEle = document.createElement('a');
  headLogoAEle.setAttribute('href', 'https://cake.jp/');
  headLogoParNode.insertBefore(headLogoAEle, headLogo);
  headLogoAEle.appendChild(headLogo);
})();
