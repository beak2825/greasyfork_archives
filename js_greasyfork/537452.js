// ==UserScript==
// @name             GitHub Link Dashboard Avatar
// @namespace        https://github.com/ikelax/userscripts
// @match            https://github.com/
// @match            https://github.com/orgs/*/dashboard
// @grant            none
// @version          0.1.0
// @author           Alexander Ikonomou
// @description      A userscript that links the avatar on the GitHub dashboard to its profile or organization.
// @license          MIT
// @supportURL       https://github.com/ikelax/userscripts/issues
// @copyright        2025, Alexander Ikonomou (https://github.com/ikelax)
// @homepageURL      https://github.com/ikelax/userscripts
// @homepage         https://github.com/ikelax/userscripts
// @contributionURL  https://github.com/ikelax/userscripts
// @collaborator     ikelax
// @icon             https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/537452/GitHub%20Link%20Dashboard%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/537452/GitHub%20Link%20Dashboard%20Avatar.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const avatar = document.querySelector(
    "div.dashboard-sidebar img.avatar-small",
  );

  if (avatar == null) {
    return;
  }

  const link = document.createElement("a");
  link.setAttribute("href", getLink(avatar.getAttribute("alt")));

  wrap(avatar, link);

  /**
   * Wraps `elementToWrap` with `outerElement`.
   *
   * @example `elementToWrap` is an image `<img />`.
   * `outerElement` is a link `<a href="https://"><a>
   *
   * @param {*} elementToWrap The inner element
   * @param {*} outerElement The outer element
   */
  function wrap(elementToWrap, outerElement) {
    outerElement.innerHTML = elementToWrap.outerHTML;
    elementToWrap.parentNode.insertBefore(outerElement, elementToWrap);
    elementToWrap.remove();
  }

  /**
   * @param {*} atName The reference to a user or an organization
   * @returns The link to the profile of the user or the organization
   */
  function getLink(atName) {
    const name = atName.replace("@", "");
    return `https://github.com/${name}`;
  }
})();
