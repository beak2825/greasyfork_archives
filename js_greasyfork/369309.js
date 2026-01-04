// ==UserScript==
// @name        Hackthis.co.uk coding level 1
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/hackthis_coding_1
// @include     https://www.hackthis.co.uk/levels/coding/1
// @exclude     none
// @version     3
// @description Calculates and fills in the solution to coding level 1 on hackthis.co.uk
// @description:en Calculates and fills in the solution to coding level 1 on hackthis.co.uk
// @grant    		none
// @downloadURL https://update.greasyfork.org/scripts/369309/Hackthiscouk%20coding%20level%201.user.js
// @updateURL https://update.greasyfork.org/scripts/369309/Hackthiscouk%20coding%20level%201.meta.js
// ==/UserScript==

let sortedString = 'INCOMPLETE';

function solveLevel() {
  if (sortedString !== 'INCOMPLETE') {
    return;
  }
  const allElements = document.getElementsByTagName('textarea');
  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];
    if (element.style.height === '140px') {
      element.style.backgroundColor = '#44aeff';
      if (sortedString === 'INCOMPLETE') {
        const value = element.value.split(',').join('');
        const values = value.split(' ');
        const sorted = values.sort();
        sortedString = sorted.join(', ');
      } else {
        element.value = sortedString;
      }
    }
  }
}

solveLevel();
setInterval(solveLevel, 500);
