// ==UserScript==
// @name          Nitter Teleporter
// @namespace     lousando
// @match         https://*/*
// @match         http://*/*
// @exclude-match https://nitter.net/*
// @run-at        document-idle
// @version       1.0.4
// @author        lousando
// @description   Converts Twitter links to Nitter ones
// @grant         GM_getValue
// @require       https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/408306/Nitter%20Teleporter.user.js
// @updateURL https://update.greasyfork.org/scripts/408306/Nitter%20Teleporter.meta.js
// ==/UserScript==

// allow for overriding of Nitter instance
const nitterDomain = GM_getValue("nitter_domain", "nitter.net");

VM.observe(document.body, () => {
  const twitterRegex = /https?:\/\/twitter\.com?/i;
  const shortTwitterRegex = /https?:\/\/t\.co/i;

  // links
  Array.from(document.body.querySelectorAll("a[href]")).filter(link => {
    return twitterRegex.test(link.href);
  }).forEach(link => {
    const parsedURL = new URL(link.href);
    parsedURL.hostname = nitterDomain;

    if (twitterRegex.test(link.innerText)) {
        link.innerText = link.innerText.replace(twitterRegex, nitterDomain);
    }

    link.setAttribute("href", parsedURL.toString());
  });

  Array.from(document.body.querySelectorAll("a[href]")).filter(link => {
    return shortTwitterRegex.test(link.href);
  }).forEach(link => {
    // expand link
    fetch(link.href).then(r => r.text())
      .then(response => {
        const domParser = new DOMParser();
        const doc = domparser.parseFromString(response, "text/xml")

        const parsedURL = new URL(link.href);
        parsedURL.hostname = nitterDomain;


        if (shortTwitterRegex.test(link.innerText)) {
            link.innerText = link.innerText.replace(shortTwitterRegex, nitterDomain);
        }

        link.setAttribute("href", parsedURL.toString());
    });

  });
});