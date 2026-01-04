// ==UserScript==
// @name        Bitbucket Cloud Helper Functions
// @description Automatically checks the "Delete source branch" checkbox on the create PR page.
//              Updated for new PR experience 2024.
// @namespace   http://jvdl.dev/
// @version     2.0
// @grant       none
// @match  	    https://bitbucket.org/*/*
// @author      John van der Loo <john@jvdl.dev>
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/492710/Bitbucket%20Cloud%20Helper%20Functions.user.js
// @updateURL https://update.greasyfork.org/scripts/492710/Bitbucket%20Cloud%20Helper%20Functions.meta.js
// ==/UserScript==
;(function() {

  function isCreatePullRequestPage() {
    return window.location.pathname.match(/.*\/pull-requests\/new/)
  }

  function setCheckedByLabel(label) {
    if (!label) {
      return;
    }
    console.log('[Bitbucket PR helper] Setting source branch to auto-delete')
    if (label?.querySelector('input').checked === false) {
      label.click();
    }
  }

  async function setupCreatePrHelper(e) {
    let currentLabelId = "";
    let currentTargetBranch = ""
    const observer = new MutationObserver(() => {
      // ignore anything that's not on the create PR page
      if (!isCreatePullRequestPage()) {
        return;
      }
      const label = document.querySelector('[data-testid="delete-branch--checkbox-label"]')
      if (label && currentLabelId === label?.id) {
        // we've observed this label already but let's check if the target branch is the same
        const targetBranch = document.querySelector('[data-testid="create-pull-request-destination-branch-selector"] div[data-value]')?.textContent
        if (targetBranch && currentTargetBranch !== targetBranch) {
          // Ok we need to update the label's checked state
          setCheckedByLabel(label);
          currentTargetBranch = targetBranch;
        }
        // no changes to worry about, byeeee
        return;
      }
      setCheckedByLabel(label);
      currentLabelId = label?.id;

    });

    // we're pretty broad here in observing the body but we short-circuit if we're not on the create PR page
    observer.observe(document.querySelector("body"), {
      subtree: true,
      childList: true,
    });
  }

  setupCreatePrHelper();

}());
