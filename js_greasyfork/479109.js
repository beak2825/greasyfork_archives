// ==UserScript==
// @name        Unity Docs Redirect
// @namespace   https://github.com/Maoyeedy/
// @version     1.0
// @author      Maoyeedy
// @license     MIT
// @description Redirect old Unity docs to its latest LTS version
// @icon        https://unity.com/favicon.ico

// @match       https://docs.unity3d.com/*/Documentation/*
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/479109/Unity%20Docs%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/479109/Unity%20Docs%20Redirect.meta.js
// ==/UserScript==

const regex = /^https:\/\/docs\.unity3d\.com\/[0-9.]+\/Documentation\//

if (regex.test(window.location.href)) {
  let newUrl = window.location.href.replace(regex, 'https://docs.unity3d.com/Documentation/')
  window.location.replace(newUrl)
}