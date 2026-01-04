// ==UserScript==
// @name        Hackthis.co.uk coding level 2
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/hackthis_coding_2
// @include     https://www.hackthis.co.uk/levels/coding/2
// @exclude     none
// @version     3
// @description Calculates and fills in the solution to coding level 2 on hackthis.co.uk
// @description:en Calculates and fills in the solution to coding level 2 on hackthis.co.uk
// @grant    		none
// @downloadURL https://update.greasyfork.org/scripts/369310/Hackthiscouk%20coding%20level%202.user.js
// @updateURL https://update.greasyfork.org/scripts/369310/Hackthiscouk%20coding%20level%202.meta.js
// ==/UserScript==

let answer = 'INCOMPLETE';

function decrypt(n) {
  if (n === ' ') {
    return n;
  }
  return String.fromCharCode(126 + 32 - n);
}

function solveLevel() {
  if (answer !== 'INCOMPLETE') {
    return;
  }
  const allElements = document.getElementsByTagName('textarea');
  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];
    if (element.style.height === '140px') {
      element.style.backgroundColor = '#44aeff';
      if (answer === 'INCOMPLETE') {
        answer = '';
        const values = element.value.split(',');
        for (let j = 0; j < values.length; j += 1) {
          answer += decrypt(values[j]);
        }
      } else {
        element.value = answer;
      }
    }
  }
}

solveLevel();
setInterval(solveLevel, 500);
