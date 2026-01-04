// ==UserScript==
// @name         unhook theskimm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete the last three single links that lead you down an internet rabbithole on the daily skimm newsletter.
// @author       madburt
// @match        https://www.theskimm.com/newsletter/daily-skimm/*
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAATXAJzMdUX3Rb75oT9bmzzatYkRyhJ15fDE9cZUug%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=fdd99dc2f921473e2e47b291e9d4b272628136fd3710747892e98d583b1058c6&ipo=images
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465818/unhook%20theskimm.user.js
// @updateURL https://update.greasyfork.org/scripts/465818/unhook%20theskimm.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function hideLastThree(selector, property) {
    const div = document.querySelector('div[data-channel-title="AND ALSO...THIS"]');
    const elements = div.querySelectorAll(selector);
    const lastThree = Array.from(elements).slice(-3);

    lastThree.forEach((element) => {
      element.style[property] = 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    hideLastThree('h3', 'display');
    hideLastThree('p', 'display');
    hideLastThree('hr.my-24', 'display');
  });
})();