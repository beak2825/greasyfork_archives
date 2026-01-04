// ==UserScript==
// @name         Site Filter
// @version      0.0
// @description  Website Filtering
// @author       Department of IT & Academics
// @match        *://*.instagram.com/*
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @namespace https://greasyfork.org/users/684499
// @downloadURL https://update.greasyfork.org/scripts/471675/Site%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471675/Site%20Filter.meta.js
// ==/UserScript==

alert('Due to your frequent visits to this site and current academic performance, we believe it is better not to let anything hamper your studies.\nWe will soon take immediate actions on other sites on the basis of your activity.\n(Redirecting on interaction...)');

let element = document.getElementsByTagName("html")[0];
element.innerHTML = `<!-- Wisdom has been chasing you, but sadly you were always faster. -->
<!-- Every minute you waste accumulates and you have to face the music later. -->
<p align="center">
<font size="5" face="Verdana">
  Evading work/Slacking off will not be tolerated!<br>
  Please first finish and get your work approved by your supervisor.<br>
  If you believe the site has been blocked by mistake, please contact the IT Department of your organisation.
</font>
</p>
<hr>
<p align="center">
All Rights Reserved<br>
<font size=3>
  @mountcarmelschool.com
</font>
</p>`;

console.clear();
