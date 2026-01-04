// ==UserScript==
// @name        Gitlab CE - Link to upgrade path from help page
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.*/help
// @grant       none
// @version     1.0
// @author      PotatoesMaster
// @description Add a link to the upgrade path tool on Gitlab help page.
// @run-at document-end
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/529695/Gitlab%20CE%20-%20Link%20to%20upgrade%20path%20from%20help%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/529695/Gitlab%20CE%20-%20Link%20to%20upgrade%20path%20from%20help%20page.meta.js
// ==/UserScript==

const tagA = document.querySelector('a[href^="https://gitlab.com/gitlab-org/gitlab-foss/-/tags/v"]');
if (tagA) {
  const tag = tagA.href.split('tags/v')[1];

  // addapt the following parameters according to your Gitlab install
  const params = new URLSearchParams({
    distro: 'docker',
    edition: 'ce',
    current: tag,
  });

  const upgradeA = document.createElement('a');
  upgradeA.href = `https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/?${params}`;
  upgradeA.innerText = "-> upgrade path";
  tagA.insertAdjacentElement('afterend', upgradeA);
  tagA.insertAdjacentText('afterend', ' ');
}