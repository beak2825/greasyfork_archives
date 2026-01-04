// ==UserScript==
// @name        DDG ai skip intro
// @namespace   DDG-ai-skip-intro
// @match       https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=*
// @grant       none
// @version     1.0
// @author      thismoon
// @description skips the intro when visiting duck.ai for the first time
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/504548/DDG%20ai%20skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/504548/DDG%20ai%20skip%20intro.meta.js
// ==/UserScript==

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(name, value) {
  document.cookie = name + "=" + (value || "") + "; path=/";
}

if (getCookie("dcm") === undefined) {
  // GPT-4o:   3
  // Claude 3: 1
  // Llama:    5
  // Mixtral:  6
  let x = "3";
  setCookie("dcm", x);
}
//else{
//  console.log(getCookie("dcm"))
//}
