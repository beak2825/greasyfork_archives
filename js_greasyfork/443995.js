// WARNING: DO NOT INSTALL OR USE THIS SCRIPT AT THIS MOMENT
//          IT WAS BROUGHT TO MY ATTENTION THIS SCRIPT MAY BE CONSIDERED CHEATING PER TORN TOS
//          IF THIS SCRIPT IS APPROVED/CLEARED BY ADMIN I WILL RELIST IT AND REMOVE THIS COMMENT
// WARNING: DO NOT USE THIS SCRIPT SO LONG AS THIS COMMENT EXISTS AS IT MEANS IT HAS NOT BEEN APPROVED AND MAY BE CONSIDERED CHEATING
//
// ==UserScript==
// @name         Torn Filter Advanced Search Revives
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Filter out advanced search results that are not "Hospitalized by" or do not have revives turned on. Filtering executes when the "Filter Revives" button at the top of the page is clicked, navigating to different search results pages will require clicking again after load. Requires Torn Tools.
// @author       LeKapitan [149306]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443995/Torn%20Filter%20Advanced%20Search%20Revives.user.js
// @updateURL https://update.greasyfork.org/scripts/443995/Torn%20Filter%20Advanced%20Search%20Revives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = unsafeWindow.jQuery;
    // this will use Torn's jQuery and prevent breaking the page by loading a different version of jQuery

    var filterRevives = function() {
        let lis = $('ul.user-info-list-wrap li[class^=user]').not('.tt-hidden');

        for(let i = 0; i < lis.length; i++) {
            let li = lis[i];
            let id = 0;

            for (let j = 0; j < li.classList.length; j++) {
                if (li.classList[j].indexOf('user') >= 0) {
                    id = li.classList[j].replace('user', '');
                    console.log(id);
                    break;
                }
            }

            $.post('https://www.torn.com/profiles.php?step=getUserNameContextMenu&XID=' + id).done(function(data, obj) {
                let resp = JSON.parse(data);
                if (resp.userStatus.status.description.indexOf('Hospitalized by') < 0 || resp.profileButtons.buttons.revive.state != 'active') {
                    li.classList.add('tt-hidden');
                }
            });
        }
    }

     $('div.content-title').append('<button id="filterRevivesButton">Filter Revives</button>');
     $('#filterRevivesButton').on("click", filterRevives);
})();
