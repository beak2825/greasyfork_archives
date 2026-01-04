// ==UserScript==
// @name      facebook-hide-login
// @description Hides the more annoying of the three facebook login prompts. One prompt remains.
// @version   1
// @namespace https://greasyfork.org/en/users/217495-eric-toombs
// @license   MIT
// @grant     none
// @match     *://*.facebook.com/*
// @run-at    document-end
// @downloadURL https://update.greasyfork.org/scripts/526867/facebook-hide-login.user.js
// @updateURL https://update.greasyfork.org/scripts/526867/facebook-hide-login.meta.js
// ==/UserScript==

// Not used right now; it is too difficult to find.
request = 'Log in or sign up for Facebook to connect with friends, family and people you know.'

style_tag = document.createElement('style');
style_tag.innerHTML = `
  /* Bob, the big login prompt that hides everything. */
  .__fb-light-mode.x1n2onr6.xzkaem6 {
    visibility: collapse !important;
  }
`;
// If Bob is hidden first, then the smaller login prompt at the bottom never appears in the first place.
document.getElementsByTagName('head')[0].append(style_tag);

// Currently does not work because #login_form doesn't exist yet.
// Very annoying!!!!!
document.getElementById('login_form').style.visibility = 'collapse';