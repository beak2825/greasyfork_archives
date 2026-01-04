// ==UserScript==
// @name        Jira GitHub links
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/jira_github_links
// @include     *github.com*
// @include     *github.skyscannertools.net*
// @include     *gojira.skyscanner.net*
// @exclude     none
// @version     10.0.2
// @grant    		none
// @description Creates links from GitHub PRs to their respective Jira ticket and vice-versa
// @downloadURL https://update.greasyfork.org/scripts/382492/Jira%20GitHub%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/382492/Jira%20GitHub%20links.meta.js
// ==/UserScript==

function makeGHLink() {
  const allElements = document.getElementsByTagName('H1');
  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];
    const elementMatch = element.innerText.match(/\[KOA-[0-9]+\]/g);
    if (elementMatch && elementMatch.length > 0) {
      const text = elementMatch[0]
        .split('[')
        .join('')
        .split(']')
        .join('');
      const url = `https://gojira.skyscanner.net/browse/${text}`;
      const newElement = document.createElement('a');
      newElement.innerText = `View ${text} ticket on Jira`;
      newElement.href = url;
      newElement.style.color = 'var(--color-text-link, #0770E3)';
      newElement.style.fontSize = '1rem';
      newElement.id = 'jira_github_links_result';

      element.appendChild(document.createElement('br'));
      element.appendChild(newElement);
    }
  }
}

function makeJiraLink() {
  const allElements = document.getElementsByTagName('LI');
  const viewIssueSidebar = document.getElementById('viewissuesidebar');
  console.log(`viewIssueSidebar`, viewIssueSidebar);
  for (let i = 0; i < allElements.length; i += 1) {
    const element = allElements[i];
    const elementMatch = element.innerText.match(/^KOA-[0-9]+$/g);
    if (elementMatch && elementMatch.length > 0) {
      const text = element.innerText;

      const url1 = `https://github.com/pulls?utf8=%E2%9C%93&q=is%3Apr+repo%3ASkyscanner%2Fbackpack+repo%3ASkyscanner%2Fbackpack-react-native+repo%3ASkyscanner%2Fbackpack-docs+repo%3ASkyscanner%2Fbackpack-react-scripts+repo%3ASkyscanner%2Fbackpack-node-sass+repo%3ASkyscanner%2Feslint-plugin-backpack+repo%3ASkyscanner%2Feslint-config-skyscanner+repo%3ASkyscanner%2Feslint-config-skyscanner+repo%3ASkyscanner%2Fbackpack-ios+repo%3ASkyscanner%2Fbackpack-android+%22${text}%22`;

      const url2 = `https://github.skyscannertools.net/pulls?utf8=%E2%9C%93&q=is%3Apr+repo%3Aapps-tribe%2Fskyscanner-app+%22${text}%22`;

      const newElement1 = document.createElement('a');
      newElement1.innerText = `View PRs for ${text} on GitHub (Public)`;
      newElement1.href = url1;
      newElement1.style.color = '#0770E3';
      newElement1.style.marginLeft = '10px';
      newElement1.id = 'jira_github_links_result';

      const newElement2 = document.createElement('a');
      newElement2.innerText = `View PRs for ${text} on GitHub (Internal)`;
      newElement2.href = url2;
      newElement2.style.color = '#0770e3';
      newElement2.style.marginLeft = '10px';
      newElement2.id = 'jira_github_links_result';

      viewIssueSidebar.appendChild(document.createElement('br'));
      viewIssueSidebar.appendChild(newElement1);
      viewIssueSidebar.appendChild(document.createElement('br'));
      viewIssueSidebar.appendChild(newElement2);
    }
  }
}

function makeLinks() {
  const addedLink = document.getElementById('jira_github_links_result');
  if (addedLink) {
    return;
  }

  makeGHLink();
  makeJiraLink();
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
