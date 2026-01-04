// ==UserScript==
// @name      Torn City Item Market Bulk Remove
// @namespace TornCityUserScripts
// @include   https://www.torn.com/imarket.php#/p=your
// @match     https://www.torn.com/imarket.php#/p=your
// @version   1.0
// @grant     none
// @run-at    document-idle
// @description removes all listed items displayed with one click, BEWARE of ABUSE!
// @downloadURL https://update.greasyfork.org/scripts/388099/Torn%20City%20Item%20Market%20Bulk%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/388099/Torn%20City%20Item%20Market%20Bulk%20Remove.meta.js
// ==/UserScript==

  let allYesButton = document.createElement('button');
  allYesButton.append('all YES');
	allYesButton.style.display = 'none';
  allYesButton.addEventListener('click', function() {
    let allYes = document.getElementsByClassName('yes t-blue h c-pointer m-left10 bold');
    for(let y = 0; y < allYes.length; y++) { 
      setTimeout(500, allYes[y].click());
    }
  });
  let allButton = document.createElement('button');
  allButton.append('click all');
  allButton.addEventListener('click', function() {
    let titles = document.getElementsByClassName('remove h-icon');
    for(let i = 0; i < titles.length; i++) { titles[i].lastElementChild.click();}
    allYesButton.style.display = 'inline';
  });

  let buttonContainer = document.createElement('div');
  buttonContainer.style.backgroundColor = 'cyan';
  buttonContainer.style.padding = '5px';
  buttonContainer.style.borderRadius = '5px';
  buttonContainer.append(allButton);
  buttonContainer.append(allYesButton);

  document.getElementById('mainContainer').prepend(buttonContainer);
