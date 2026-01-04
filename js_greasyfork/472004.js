// ==UserScript==
// @name        Unxitter – Twitter X Logo Remover
// @description Userscript that Unxittifies Twitter
// @icon        https://abs.twimg.com/favicons/twitter.2.ico
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.9
// @author      Mozzie
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472004/Unxitter%20%E2%80%93%20Twitter%20X%20Logo%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/472004/Unxitter%20%E2%80%93%20Twitter%20X%20Logo%20Remover.meta.js
// ==/UserScript==

// REPLACE LOGO
// ==============================

// Find the elements to modify...
const svgSelector = `svg:is(.r-13v1u17, .r-1p0dtai, .r-16y2uox) > g > path`;
const faviconSelector = `link[rel="shortcut icon"]`;

// Replace the icon's SVG using CSS
const twitterLogoPath = `M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958
        1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12
        1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072
        3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3
        0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376
        0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254
        0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z`.replace(/\n/g, "");
const logoStyleRule = `
  :is(${svgSelector}) {
      fill: inherit;
      d: path("${twitterLogoPath}");
  }
`;
GM_addStyle(logoStyleRule);

// REPLACE FAVICON
// =================================
{
  const twitterFaviconURL = "https://abs.twimg.com/favicons/twitter.2.ico";
  const twitterFaviconPipURL = 'https://abs.twimg.com/favicons/twitter-pip.2.ico';

  // create a new <link>. the browser should show this one until the old one changes.
  const newLink = document.createElement("link");
  newLink.setAttribute("rel", "icon");
  newLink.setAttribute("href", twitterFaviconURL);
  document.head?.appendChild(newLink);

  // Replace the Favicon
  document.addEventListener("DOMContentLoaded", () => {
    // move new favicon to the end of the head in case the head wasn't done loading.
    document.head.appendChild(newLink);

    // the old <link rel="icon">
    const oldLink = document.querySelector(faviconSelector);
    oldLink.setAttribute("media", "print"); // <- try to stop it from loading

    // callback to update our URL
    const updateFavicon = () => {
      // check if the "real" link has the notification pip.
      const hasPip = oldLink.getAttribute("href").includes("pip");
      newLink.setAttribute("href", hasPip ? twitterFaviconPipURL : twitterFaviconURL);
    }

    const config = { attributes: true, attributeFilter: ["href"], attributeOldValue: true };

    // Watch the old link for changes.
    const observer = new MutationObserver(updateFavicon);
    observer.observe(oldLink, config);
  });
}
// RENAME TAB TITLE
// ================================
window.addEventListener("load", () => {
  // <title>Home / X</title>
  const title = document.querySelector("title");
  // get the X
  const regexp = /(\bX$|(?<=on )X(?=:))/g;
  // callback to replace it
  const updateTitle = () => {
    if (regexp.test(title.innerHTML)) {
      title.innerHTML = title.innerHTML
        .replace(regexp, "Twitter");
    }
  }
 // call once on load
  updateTitle();
  // watch the title element for changes.
  const observer = new MutationObserver(updateTitle);
  observer.observe(title, {
    childList: true
  });
});

// Done. Good puppy!
