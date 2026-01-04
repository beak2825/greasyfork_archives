// ==UserScript==
// @name        GW2 Forums Append Killproof.me and WingmanKP links to profile names
// @description Append Killproof.me and WingmanKP links to profile names to the Guild Wars 2 forums. Not all accounts are available in the linked tools and this script does not attempt to verify before generating links. This script is not intended to harm or harass or gatekeep. This script is intended to automate a process which was tedious to execute for each user. Killproof.me is completely Opt-In. WingmanKP requires one person from the group to upload the log. This script is not associated with either.
// @match       https://*forum.guildwars2.com/topic/*
// @run-at      document-end
// @version     1.3
// @license     GPLv3
// @namespace https://greasyfork.org/users/1438344
// @downloadURL https://update.greasyfork.org/scripts/527692/GW2%20Forums%20Append%20Killproofme%20and%20WingmanKP%20links%20to%20profile%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/527692/GW2%20Forums%20Append%20Killproofme%20and%20WingmanKP%20links%20to%20profile%20names.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to append links
  function appendLinks() {
    const links = document.querySelectorAll("h3.cAuthorPane_author a[href*='guildwars2.com/profile/']:last-child");

    links.forEach(link => {
      // Create a line break
      link.append(document.createElement("br"));

      // Create Killproof.me link
      const kpmeImg = document.createElement("img");
      kpmeImg.src = "https://killproof.me/static/images/site_icon_32x32.png";
      kpmeImg.height = 20;
      kpmeImg.width = 20;

      const kpme = document.createElement("a");
      kpme.href = `https://killproof.me/proof/?id=${link.text}`;
      kpme.target = "_blank";
      kpme.append(kpmeImg);
      link.after(kpme);

      // Create WingmanKP link
      const wingmanImg = document.createElement("img");
      wingmanImg.src = "https://gw2wingman.nevermindcreations.de/static/favicon.png";
      wingmanImg.height = 20;
      wingmanImg.width = 20;

      const wingman = document.createElement("a");
      wingman.href = `https://gw2wingman.nevermindcreations.de/kp/${link.text}`;
      wingman.append(wingmanImg);
      wingman.target = "_blank";
      link.after(wingman);
    });
  }

  // Run appendLinks once on page load
  appendLinks();

  // MutationObserver to watch for changes
  const observerOptions = {
    childList: true,
    subtree: true,
  };
  const observer = new MutationObserver(appendLinks);
  observer.observe(document.querySelector("#comments"), observerOptions);
})();
