// ==UserScript==
// @name         PORNBOX Copy Studio Liste Models Names (with IA Help)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  PORNBOX Copy Studio Liste Models Names
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.pornbox.com.ico
// @match        https://pornbox.com/application/model/list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537514/PORNBOX%20Copy%20Studio%20Liste%20Models%20Names%20%28with%20IA%20Help%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537514/PORNBOX%20Copy%20Studio%20Liste%20Models%20Names%20%28with%20IA%20Help%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var containerSelector = '#pane-model-list.tab-pane[style="display: block;"]:has(.models-info .filters .filters__row.js-filters-wrapper .filters__item-wrap.filters__item-wrap--attribute:nth-child(5) .customdrop__selected) .models-info .filters .filters__row.js-filters-wrapper .filters__item-wrap.filters__item-wrap--attribute:nth-child(5):has( .customdrop__selected)';
  console.log('Container selector:', containerSelector);

  var maxAttempts = 10;
  var attempt = 0;

  function appendButton() {
    var container = document.querySelector(containerSelector);
    console.log('Container:', container);
    attempt++;
    if (container) {
      console.log('Container found');
      var button = document.createElement('button');
      button.className = 'copystudio actress';
      button.style.background = 'green';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.padding = '5px 10px';
      button.style.borderRadius = '5px';
      button.style.cursor = 'pointer';
      button.innerHTML = '✏️ Copy Studio Actress';
      button.onclick = function() {
        console.log('Button clicked');
        var actressNames = [];
        var elements = document.querySelectorAll('#pane-model-list.tab-pane[style="display: block;"]:has(.models-info .filters .filters__row.js-filters-wrapper .filters__item-wrap.filters__item-wrap--attribute:nth-child(5) .customdrop__selected)  .itemsWrapper .block-item.block-item--model  .item-inner__data  a[href^="/application/model/"].item-inner__title');
        elements.forEach(function(element) {
          actressNames.push(element.textContent);
        });
        var list = 'Studio Actress:\n' + actressNames.join(', ');
        var textarea = document.createElement('textarea');
        textarea.value = list;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast('Copied!');
      };
      container.appendChild(button);
      console.log('Button appended');
    } else {
      console.log('Container not found');
      if (attempt < maxAttempts) {
        console.log('Retrying in 1 second...');
        setTimeout(appendButton, 1000);
      } else {
        console.log('Max attempts reached. Giving up.');
      }
    }
  }

  function toast(message) {
    var button = document.querySelector('.copystudio.actress');
    var rect = button.getBoundingClientRect();
    var toastElement = document.createElement('div');
    toastElement.style.position = 'fixed';
    toastElement.style.top = (rect.top - 50) + 'px';
    toastElement.style.left = (rect.left + (rect.width / 2) - 100) + 'px';
    toastElement.style.background = 'green';
    toastElement.style.color = 'white';
    toastElement.style.padding = '20px 40px';
    toastElement.style.borderRadius = '10px';
    toastElement.style.zIndex = '1000';
    toastElement.style.fontSize = '18px';
    toastElement.style.fontWeight = 'bold';
    toastElement.innerHTML = message;
    document.body.appendChild(toastElement);
    setTimeout(function() {
      toastElement.remove();
    }, 2000);
  }

  appendButton();
})();
