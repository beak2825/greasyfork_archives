// ==UserScript==
// @name         Geni Profile Helper
// @namespace    nikku
// @license      MIT
// @version      0.3
// @description  Go to profiles and trees from search results
// @author       nikku
// @match        https://www.geni.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geni.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463787/Geni%20Profile%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463787/Geni%20Profile%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var trs = document.querySelectorAll('.sortable_table > tbody > tr');
    trs.forEach(function(tr) {
        var pid = tr.querySelector('.similar_profiles').id.replace('similar_profiles_link_', '');
        var profile = tr.querySelector('.profile-grid-area > div > a');
        if (profile.href.includes('/signup?')) {
            var peopleUrl = '/people/-/' + pid;
            profile.removeAttribute('onclick');
            profile.href = peopleUrl;

            var manager = tr.querySelector('.manager-grid-area > a');
            if (manager) {
                manager.removeAttribute('onclick');
                manager.removeAttribute('href');
            }

            var name = tr.querySelector('.name-grid-area > div > span > a');
            name.removeAttribute('onclick');
            name.href = peopleUrl;
            name.classList.add('tipped-tip');
            name.setAttribute('bypass_newsfeed_helper', 'true');
            name.setAttribute('data-offset-x', '-10');
            name.setAttribute('data-offset-y', '-10');
            name.setAttribute('data-position', 'topleft');
            name.setAttribute('data-remote-data', '/profile/hovercard');
            name.setAttribute('data-remote-params', '{id:' + pid + '}');
            name.setAttribute('data-show-delay', '800');
            name.setAttribute('data-skin', 'hovercard');
            name.setAttribute('data-template', 'hover.profile');

            var actionList = tr.querySelector('.action-grid-area > .action_list');
            if (actionList) {
                actionList.innerHTML = '<li class="first"><a href="/family-tree/index/' + pid + '" draggable="false" ' +
                    'show_icon="true"><span><img src="https://www.geni.com/images/icn_family_tree.gif"> Открыть древо' +
                    '</span></a></li><li><a href="/list?focus_id=' + pid + '" draggable="false" show_icon="true"><span>' +
                    '<img src="https://www.geni.com/images/icn_settings.gif"> Показать список</span></a></li>';
            }
        }
    });
})();