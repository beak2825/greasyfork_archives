// ==UserScript==
// @name        GitHub actual time
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/github_actual_time
// @include     *github.*
// @exclude     none
// @version     1
// @description:en	Adds the actual time next to the relative time on GitHub
// @grant    		none
// @description   	Adds the actual time next to the relative time on GitHub
// @downloadURL https://update.greasyfork.org/scripts/406513/GitHub%20actual%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/406513/GitHub%20actual%20time.meta.js
// ==/UserScript==

function addTimes() {
  const allElements = document.getElementsByTagName('RELATIVE-TIME');
  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];
    if (
      element.innerHTML &&
      element.innerHTML.includes &&
      !element.innerHTML.includes(' - ')
    ) {
      element.innerHTML += ` - ${element.title}`;
    }
  }
}

function worker() {
  try {
    addTimes();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 2000);
