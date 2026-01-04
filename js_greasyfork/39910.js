// ==UserScript==
// @name        Fantasynamegenerators better style
// @description Makes https://www.fantasynamegenerators.com/ have less clutter.
// @namespace   azzu
// @match       https://www.fantasynamegenerators.com/*
// @grant       none
// @version     1.0.0
// @downloadURL https://update.greasyfork.org/scripts/39910/Fantasynamegenerators%20better%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/39910/Fantasynamegenerators%20better%20style.meta.js
// ==/UserScript==

const head = document.getElementsByTagName('head')[0];
const style = document.createElement('style');
style.innerHTML = `

.cc_banner-wrapper,
#contentdiv,
.divBorder
{
  display: none;
}

#banner {
  padding-top: 0;
  background: none;
}

#navContainer, #banner, #bannercontainer, .navmenu {
  height: 50px;
}


`;
head.appendChild(style);