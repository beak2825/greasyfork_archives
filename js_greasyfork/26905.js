// ==UserScript==
// @name        ssherder max stats
// @namespace   yichizhng@gmail.com
// @description Shows level 60 MSPU +40 stats by default
// @include     https://ssherder.com/characters/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26905/ssherder%20max%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/26905/ssherder%20max%20stats.meta.js
// ==/UserScript==

level.querySelector('[value="60"]').parentElement.click();
superb.querySelector('[value="5"]').parentElement.click();
bonus.querySelector('[value="40"]').parentElement.click();