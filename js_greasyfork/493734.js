// ==UserScript==
// @name             Reddit - No new gallery/video/image urls
// @namespace        bitmonster
// @description      Redirect Reddit media links to their comment section to avoid new reddit.
// @match            https://www.reddit.com/*
// @match            https://old.reddit.com/*
// @license          MIT 
// @author           Martin Smith
// @version          1.1
// @downloadURL https://update.greasyfork.org/scripts/493734/Reddit%20-%20No%20new%20galleryvideoimage%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/493734/Reddit%20-%20No%20new%20galleryvideoimage%20urls.meta.js
// ==/UserScript==
'use strict';

const observer = new MutationObserver(onMutation);

function onMutation(mutations) {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      // Check if the node is an element node
      if (node.nodeType === Node.ELEMENT_NODE) {
        repairLinks(node);
      }
    }
  }
}

function repairLinks(node) {
  // Find all anchors matching specific patterns within the added node
  const links = node.querySelectorAll('a[href^="https://v.redd.it/"], a[href^="https://i.redd.it/"], a[href^="https://www.reddit.com/gallery/"]');
  links.forEach(link => {
    // Find the closest ancestor with class 'thing'
    const thing = link.closest('.thing');
    if (thing) {
      // Extract the permalink attribute
      const permalink = thing.getAttribute('data-permalink');
      if (permalink) {
        let permaHref = `${window.location.origin}${permalink}`;

        // Rewrite the href attribute of the link
        link.href = permaHref;
        if (link.hasAttribute("data-href-url")) {
          link.setAttribute("data-href-url", permaHref);
        }
        if (link.hasAttribute("data-outbound-url")) {
          link.setAttribute("data-outbound-url", permaHref);
        }
      }
    }
  });
  
}

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: true
});

function initialize() {
  let isShittyReddit = document.body.matches('.v2');

  // Check if on New Site and bail if so
  if (isShittyReddit) {
    observer.disconnect();
    return;
  }

  repairLinks(document.body);
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}