// ==UserScript==
// @name         Google, 12 hour date-time picker
// @namespace    https://greasyfork.org/users/649
// @version      1.1.6
// @description  Switches the date time picker on google searches to a 12 hour clock
// @author       Adrien Pyke
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/.*$/
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/32011/Google%2C%2012%20hour%20date-time%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/32011/Google%2C%2012%20hour%20date-time%20picker.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Util = {
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    }
  };

  waitForElems({
    sel: '.tdu-datetime-picker > div.tdu-t > div:nth-child(1) > div > ul',
    onmatch(hourSelector) {
      Util.qq('li', hourSelector).forEach(hour => {
        const value = parseInt(hour.dataset.value);
        if (value === 0) {
          hour.textContent = 'AM 12';
        } else if (value === 12) {
          hour.textContent = 'PM 12';
        } else {
          hour.textContent = (value < 12 ? 'AM ' : 'PM ') + (value % 12);
        }
      });
    }
  });
})();
