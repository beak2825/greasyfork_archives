// ==UserScript== 
// @name        Simple sign in button
// @author      Schimon Jehudah, Adv.
// @copyright   2024 - 2025, Schimon Jehudah (http://schimon.i2p)
// @license     AGPL-3.0-only; https://www.gnu.org/licenses/agpl-3.0.en.html
// @namespace   org.openuserjs.sjehuda.simplebutton
// @description Remove the intrusive header bar in favour of a button.
// @match       https://github.com/* 
// @version     25.05.14
// @grant       none
// @homepageURL https://greasyfork.org/scripts/515813-simple-sign-in-button
// @supportURL  https://greasyfork.org/scripts/515813-simple-sign-in-button/feedback
// @downloadURL https://update.greasyfork.org/scripts/515813/Simple%20sign%20in%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/515813/Simple%20sign%20in%20button.meta.js
// ==/UserScript==

var signInLink = document.evaluate('//a[contains(@href, "/login?")]/@href', document, null, XPathResult.STRING_TYPE).stringValue;

if (signInLink) {
  document.querySelector('header').remove();
  let elementsignIn = document.createElement('a');
  //elementsignIn.textContent = '🔌';
  elementsignIn.textContent = 'Connect';
  elementsignIn.title = 'You are encouraged to migrate to cgit, Codeberg, Forgejo, Gitea, or GitLab.';
  elementsignIn.setAttribute ('aria-label', 'You are encouraged to migrate to cgit, Codeberg, Forgejo, Gitea, or GitLab.');
  elementsignIn.style.background = '#000';
  elementsignIn.style.color = '#fff';
  elementsignIn.href = signInLink;
  elementsignIn.className = 'tooltipped tooltipped-sw btn-sm btn';
  let elementLi = document.createElement('li');
  elementLi.append(elementsignIn);
  let elementButtons = document.querySelector('#repository-details-container > ul');
  if (elementButtons) {
    elementButtons.append(elementLi);
  } else {
    let elementHeaderSlim = document.createElement('div');
    elementHeaderSlim.style.background = '#333';
    elementHeaderSlim.style.fontWeight = 'bold';
    elementHeaderSlim.style.padding = '1em';
    elementHeaderSlim.style.textAlign = 'center';
    elementsignIn.textContent = 'Connect';
    elementsignIn.title = 'You are encouraged to migrate to cgit, Codeberg, Forgejo, Gitea, or GitLab.';
    elementsignIn.href = signInLink;
    elementsignIn.style.color = '#fff';
    elementHeaderSlim.append(elementsignIn);
    document.body.prepend(elementHeaderSlim);
  }
}

