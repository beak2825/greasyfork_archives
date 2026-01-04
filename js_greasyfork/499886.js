// ==UserScript==
// @name        Medium to Freedium
// @namespace   Violentmonkey Scripts
// @match       *://*.medium.com/*
// @grant       none
// @version     1.3
// @description 30/06/2024, 11:35:39
// @require     https://unpkg.com/@violentmonkey/url
// @include     /.*\..*\..*\/.*/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/499886/Medium%20to%20Freedium.user.js
// @updateURL https://update.greasyfork.org/scripts/499886/Medium%20to%20Freedium.meta.js
// ==/UserScript==

const { onNavigate } = VM;

function handleNavigate() {
  /* The script is also run on two subdomains as some Medium articles are on those.
     As Medium is an SPA, we have to use `onNavigate`
     However, we might not be on an article */
  if (window.location.hostname === "medium.com") {
  if (!/.*\:\/\/.*medium\.com\/.*\/.*/.test(window.location.href)) {
    return;
  }
  }

  /* As mentioned earlier, we might be on two nested subdomains that are a Medium article. We can check this:
     the include patterns are setup to match that */
  document.querySelectorAll("meta").forEach((el) => {
    if (el.getAttribute("content") === "Medium") {
      onMedium();
      return;
    }
  });
}

// Watch route change
VM.onNavigate(handleNavigate);

// Call it once for the initial state
handleNavigate();

function onMedium() {
  // Remove all elements from the page
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Add custom styles to prevent FOUC
  const style = document.createElement('style');
  style.innerHTML = "body { background-color: rgb(31, 41, 55); }";
  document.head.appendChild(style);

  // Redirect to Freedium
  const redirectTo = `https://freedium.cfd/${window.location.hostname}/${window.location.pathname}`;
  window.location.replace(redirectTo);
}

