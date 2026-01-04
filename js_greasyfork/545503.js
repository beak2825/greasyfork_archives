// ==UserScript==
// @name        Cuberealm.io Chat+ Utilities
// @namespace   cooluser1481
// @match       https://cuberealm.io/*
// @version     1.0
// @author      cooluser1481
// @description Advanced chat features for Cuberealm.io. Adds chat highlighting and remove character limit. Enjoy!
// @license     Do whatever you want, I don't care.
// @downloadURL https://update.greasyfork.org/scripts/545503/Cuberealmio%20Chat%2B%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/545503/Cuberealmio%20Chat%2B%20Utilities.meta.js
// ==/UserScript==
 
 
 
document.body.style.userSelect = "text"; /*allows chat to be selected/coppied*/
document.body.style.webkitUserSelect = "text"; /*for Safari*/
 
setInterval(function(){document.querySelectorAll('input').forEach(input => {  input.removeAttribute('maxlength');});},1);