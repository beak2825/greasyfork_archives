// ==UserScript==
// @name         Letterboxd Watched to Fan Ratio
// @namespace    stanuwu
// @version      0.1
// @description  Display the ratio of watchers to fans.
// @author       stanuwu
// @match        https://letterboxd.com/film/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simply-how.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445493/Letterboxd%20Watched%20to%20Fan%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/445493/Letterboxd%20Watched%20to%20Fan%20Ratio.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const findData = () => {
    // get possible elements that could contain the amount of fans or watched
    const searchLink = document.querySelectorAll(
      'a.all-link.more-link, a.has-icon.icon-watched.icon-16.tooltip',
    );

    let fanElement;
    let fans = '';
    let watched = '';

    //go through the elements and find the fans and watched
    for (let l of searchLink) {
      if (l.innerHTML ? l.innerHTML.includes(' fans') : false) {
        fans = l.innerHTML;
        fanElement = l;
      } else if (l.dataset.originalTitle.includes('Watched by ')) {
        watched = l.dataset.originalTitle;
      }
    }

    //stupid formating to get the numbers
    const fanNumber = numberFormat(fans.split(' ')[0]);
    const watchedNumber = Number(watched.split(' ')[2].replace(' members', '').replaceAll(',', ''));

    //display as percentage next to the fans
    const percentRatio = ((fanNumber / watchedNumber) * 100).toFixed(2);
    fanElement.innerHTML += ` (${percentRatio}%)`;
  };

  //code to format numbers using k or m
  const numberFormat = (num) => {
    switch (num[num.length - 1]) {
      case 'k':
        return parseFloat(num) * 1e3;
      case 'm':
        return parseFloat(num) * 1e6;
      default:
        return Number(num);
    }
  };

  setTimeout(findData, 500);
})();
