// ==UserScript==
// @name        GitHub expand rich diffs
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/github_expand_rich_diffs
// @include     *github.com*
// @include     *github.skyscannertools.net*
// @exclude     none
// @version     7
// @description:en	Creates a button which can expand all rich diffs in a PR.
// @grant    		none
// @description   	Creates a button which can expand all rich diffs in a PR.
// @downloadURL https://update.greasyfork.org/scripts/389465/GitHub%20expand%20rich%20diffs.user.js
// @updateURL https://update.greasyfork.org/scripts/389465/GitHub%20expand%20rich%20diffs.meta.js
// ==/UserScript==

function expandAllRichDiffs() {
  const toClick = document.querySelectorAll(
    `[aria-label="Display the rich diff"]`,
  );
  for (let i = toClick.length - 1; i >= 0; i -= 1) {
    toClick[i].click();
  }
}

function makeGHButton() {
  const filesElement = document.getElementsByClassName('repository-content')[0];
  if (!filesElement) {
    return;
  }
  const buttonElement = document.createElement('button');
  buttonElement.innerText = `Expand all rich diffs`;
  buttonElement.style.backgroundColor = '#00A698';
  buttonElement.style.border = 'none';
  buttonElement.style.fontSize = '1.2rem';
  buttonElement.style.fontWeight = 'bold';
  buttonElement.style.padding = '0.375rem 1.5rem';
  buttonElement.style.borderRadius = '0.5rem';
  buttonElement.style.color = 'white';
  buttonElement.id = 'expand_all_rich_diffs';
  buttonElement.onclick = expandAllRichDiffs;

  const newElement = document.createElement('div');
  newElement.style.width = '100%';
  newElement.style.display = 'flex';
  newElement.style.justifyContent = 'center';

  newElement.appendChild(buttonElement);

  filesElement.appendChild(document.createElement('br'));
  filesElement.appendChild(newElement);
}

function makeLinks() {
  const docLoc = document.location.href;
  if (!docLoc.includes('pull') || !docLoc.includes('files')) {
    return;
  }

  const addedLink = document.getElementById('expand_all_rich_diffs');
  if (addedLink) {
    return;
  }

  makeGHButton();
}

function worker() {
  try {
    makeLinks();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 2000);
