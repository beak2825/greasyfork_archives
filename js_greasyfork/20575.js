// ==UserScript==
// @name         GitHub link fixer
// @version      0.3
// @description  Remove the diff in github links in the notifications view
// @author       Alex Kolpa
// @match        https://github.com/notifications
// @grant        none
// @namespace https://greasyfork.org/users/6644
// @downloadURL https://update.greasyfork.org/scripts/20575/GitHub%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/20575/GitHub%20link%20fixer.meta.js
// ==/UserScript==

function main() {
    var results = document.querySelectorAll('.js-notification-target');
    for(var i =0; i < results.length; i++) {
        var notification = results[i];
        var link = notification.getAttribute('href');
        if(link) {
            notification.setAttribute('href', link.replace(/\/files\/.*\.\..*/, "/"));
        }
    }
}

main();