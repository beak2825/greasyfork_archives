// ==UserScript==
// @name         Torn Filter Advanced Search Revives (5t3n mod)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter out advanced search results that are not "Hospitalized by" or do not have revives turned on. Filtering executes when the "Filter Revives" button at the top of the page is clicked, navigating to different search results pages will require clicking again after load. Requires Torn Tools.
// @author       LeKapitan [149306] -modified by Prince-5t3n [2156450]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444540/Torn%20Filter%20Advanced%20Search%20Revives%20%285t3n%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444540/Torn%20Filter%20Advanced%20Search%20Revives%20%285t3n%20mod%29.meta.js
// ==/UserScript==
// 5t3n mod creates new button to allow choice between hosp only and all hospital reasons
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
                if (resp.profileButtons.buttons.revive.state != 'active') {
                    li.classList.add('tt-hidden');
                }
            });
        }
    }
    var filterRevivesH = function() {
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
     $('div.content-title').append('<button id="filterRevivesHButton">Filter Revives Hosp Only</button>');
     $('#filterRevivesHButton').on("click", filterRevivesH);
})();
