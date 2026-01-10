// ==UserScript==
// @name        Cuberealm.io Chat+ Utilities
// @namespace   cooluser1481
// @match       https://cuberealm.io/*
// @version     1.1.1
// @author      cooluser1481
// @description Advanced chat features for Cuberealm.io. Adds chat highlighting and remove character limit. Enjoy!
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/545503/Cuberealmio%20Chat%2B%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/545503/Cuberealmio%20Chat%2B%20Utilities.meta.js
// ==/UserScript==
 
 
const chatContainer = document.querySelector("#app > div > div > div:nth-child(2) > div > div:nth-child(1)");
chatContainer.style.userSelect = "text"; /*allows chat to be selected/coppied*/
chatContainer.style.webkitUserSelect = "text"; /*for Safari*/
 
setInterval(function(){
    document.querySelectorAll('input')
    .forEach(input => {
        input.removeAttribute('maxlength');
    });
},1);