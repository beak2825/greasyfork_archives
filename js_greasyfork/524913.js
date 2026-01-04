// ==UserScript==
// @name         DoesTheDogDie - Filter
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Helps you find specific information about movies by filtering only "Yes" answers on the DoesTheDogDie website.
// @author       hacker09
// @match        https://www.doesthedogdie.com/media/*
// @icon         https://www.doesthedogdie.com/favicon-32x32.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524913/DoesTheDogDie%20-%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/524913/DoesTheDogDie%20-%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelectorAll('.topicRowContainer').forEach(div => {
    var yesCount = parseInt(div.querySelector('.yesNo .yes .count')?.textContent||0);
    var noCount = parseInt(div.querySelector('.yesNo .no .count')?.textContent||0);
    if(yesCount < noCount || yesCount === noCount) div.style.display='none';
  });
})();