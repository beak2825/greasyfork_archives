// ==UserScript==
// @name         Bad Faith Users
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Keep track of bad faith users even if they change their name.
// @author       amflare
// @match        https://scifi.stackexchange.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371255/Bad%20Faith%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/371255/Bad%20Faith%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ids = [931]; //add comma seperated ids here to track others
    function markRW(){
        let that = this;
        let badfaith = false;
        ids.forEach(function(id){
            if (that.href.match('\/'+id+'\/') !== null) badfaith = true;
        });

        if(badfaith) {
            let text = this.innerText;
            if (text.length > 10) {
                text = text.substring(0, text.length - 5);
                this.innerText = '⚠ ' + text + '...';
            } else {
                this.innerText = '⚠ ' + text;
            }
        }
    }

    $('.comment-user').each(markRW);
    $('.user-details a').each(markRW);

    // Your code here...
})();