// ==UserScript==
// @name        GitHub WIP reminder
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/github_WIP_reminder
// @include     *github.com*
// @exclude     none
// @version     7
// @description:en	Adds an reminder to not review WIP PR's
// @description	Adds an reminder to not review WIP PR's
// @grant    		none
// @downloadURL https://update.greasyfork.org/scripts/382563/GitHub%20WIP%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/382563/GitHub%20WIP%20reminder.meta.js
// ==/UserScript==

let lastModifiedPr = null;

function addReminder() {
  const prId = `${window.location}`.split('pull/')[1];
  if (lastModifiedPr !== prId) {
    const allElements = document.getElementsByTagName('SPAN');
    for (let i = 0; i < allElements.length; i += 1) {
      const element = allElements[i];
      if (element.innerText.includes('WIP')) {
        if (
          element.parentElement.parentElement.className.includes(
            'labels css-truncate',
          )
        ) {
          const newElement = document.createElement('div');
          newElement.innerText = `HEY THIS IS WIP!`;
          newElement.style.backgroundColor = '#d1435b';
          newElement.style.color = 'white';
          newElement.style.fontSize = '2rem';
          newElement.style.position = 'fixed';
          newElement.style.left = 0;
          newElement.style.top = 0;
          newElement.style.zIndex = 400;
          newElement.style.width = '100vw';
          newElement.style.height = '8rem';
          newElement.style.padding = '4rem 1rem 1rem 1rem';
          newElement.style.display = 'flex';
          newElement.style.alignItems = 'center';
          newElement.style.justifyContent = 'center';
          newElement.style.transition = 'all 0.4s';
          newElement.style.fontWeight = 'bold';
          newElement.onclick = () => {
            newElement.style.opacity = 0;
            newElement.style.pointerEvents = 'none';
          };
          element.parentElement.parentElement.appendChild(newElement);
        }
      }
    }
  }
  lastModifiedPr = prId;
}

setInterval(addReminder, 2000);
