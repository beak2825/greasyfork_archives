// ==UserScript==
// @name        GitHub squash reminder
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/github_squash_reminder
// @include     *github.com*
// @include     *github.skyscannertools.net*
// @exclude     none
// @version     8
// @description:en	Adds an reminder to squash PRs that have > 1 commit
// @grant    		none
// @description   	Adds an reminder to squash PRs that have > 1 commit
// @downloadURL https://update.greasyfork.org/scripts/368661/GitHub%20squash%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/368661/GitHub%20squash%20reminder.meta.js
// ==/UserScript==

let lastModifiedPr = null;

function addReminder() {
    const currentReminder = document.getElementById('squash_reminder_button');
    console.log(`currentReminder`, currentReminder);
    if (currentReminder) { return; }

    const commitCount = parseInt(
      document.getElementById('commits_tab_counter').textContent,
      10,
    );
    if (commitCount !== 1) {
      let allElements = document.getElementsByTagName('DIV');
      for (let i = 0; i < allElements.length; i += 1) {
        const element = allElements[i];
        if (element.className === 'merge-message') {
          element.innerHTML = `<div style="display: block;margin-bottom: -2rem;text-decoration: none;font-weight: bold;font-size: 1.5rem;font-family: Quattrocento Sans,sans-serif;color: #e02626;">REMEMBER TO SQUASH!</div> <br/> <br/>${element.innerHTML}`;
        }
      }
      allElements = document.getElementsByTagName('BUTTON');
      for (let i = 0; i < allElements.length; i += 1) {
        const element = allElements[i];
        if (
          element.textContent &&
          element.textContent.includes('Merge pull request')
        ) {
          element.disabled = true;
          element.textContent = 'MERGE ONLY ONCE SQUASHED!';
          element.id = "squash_reminder_button";
          element.style.backgroundImage =
            'linear-gradient(-180deg, #e02626 0%, #9F2D27 90%)';
          element.style.color = 'white';
        }
        // if (
        //   element.textContent &&
        //   element.textContent.includes('Squash and merge')
        // ) {
        //   element.textContent = 'SMERGE!';
        // }
        // if (
        //   element.textContent &&
        //   element.textContent.includes('Confirm squash and merge')
        // ) {
        //   element.textContent = 'Confirm SMERGE!';
        // }
      }
    }
}

function worker() {
  try {
    addReminder();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 2000);
