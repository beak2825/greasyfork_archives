// ==UserScript==
// @name          Facebook Toolbar Remover
// @namespace     http://nmtools.com
// @description   Removes the new Facebook apps toolbar
// @include       *apps.facebook.com/*
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/13247/Facebook%20Toolbar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/13247/Facebook%20Toolbar%20Remover.meta.js
// ==/UserScript==

document.getElementById("toolbarContainer").style.display = "none";