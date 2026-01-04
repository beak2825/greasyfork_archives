// ==UserScript==
// @name         Airtable Customizations
// @namespace    nulleffort.com
// @version      0.3
// @description  Fix JS/CSS issues
// @author       Danny Hinshaw
// @match        https://airtable.com/*?prefill_Map*
// @match        https://airtable.com/*?prefill_Venue*
// @downloadURL https://update.greasyfork.org/scripts/36005/Airtable%20Customizations.user.js
// @updateURL https://update.greasyfork.org/scripts/36005/Airtable%20Customizations.meta.js
// ==/UserScript==
(function() {
  'use strict';
  /*jshint esnext: true */

  const linkWrap = (link, el) => {
    const wrapper = document.createElement('a');
    wrapper.href = link;
    wrapper.target = '__blank';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  };

  setTimeout(() => {
    const inputs = Array.from(document.querySelectorAll('.flex-auto.flex.baymax')).filter(i => {
      return i.querySelector('input') && i.querySelector('input').value.startsWith('http');
    }).map(i => {
      return {link: i.querySelector('input').value, title: i.closest('.sharedFormField').querySelector('.title')};
    });

    [].forEach.call(inputs, i => {
      return linkWrap(i.link, i.title);
    });
  }, 1500);
})();