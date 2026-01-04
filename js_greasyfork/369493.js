// ==UserScript==
// @name            Waze Forum links
// @namespace       https://github.com/WazeDev/
// @version         2021.06.09.01
// @description     Add profile and beta links in Waze forum
// @author          WazeDev
// @contributor     crazycaveman
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @include         https://www.waze.com/forum/
// @include         /^https:\/\/.*\.waze\.com\/forum\/(?!ucp\.php(?!\?i=(pm|166))).*/
// @grant           none
// @require         https://code.jquery.com/jquery-2.2.4.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/369493/Waze%20Forum%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/369493/Waze%20Forum%20links.meta.js
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    var settings = {};
    const settingsKey = 'WFL_settings';
    const cl = {
        e: 1,
        error: 1,
        w: 2,
        warn: 2,
        i: 3,
        info: 3,
        d: 4,
        debug: 4,
        l: 0,
        log: 0,
    };

    function log(message, level = 0) {
        switch (level) {
        case 1:
        case 'error':
            console.error('WFL: ', message);
            break;
        case 2:
        case 'warn':
            console.warn('WFL: ', message);
            break;
        case 3:
        case 'info':
            console.info('WFL: ', message);
            break;
        case 4:
        case 'debug':
            console.debug('WFL: ', message);
            break;
        default:
            console.log('WFL: ', message);
        }
    }

    function saveSettings() {
        if (!localStorage) {
            return;
        }
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    function loadSettings() {
        let defaults = {
            beta: { value: false, updated: 0 },
        };
        if (!localStorage) {
            return;
        }
        if (Object.prototype.hasOwnProperty.call(localStorage, settingsKey)) {
            settings = JSON.parse(localStorage.getItem(settingsKey));
        } else {
            settings = defaults;
        }
        Object.keys(defaults).forEach((prop) => {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)
            && !Object.prototype.hasOwnProperty.call(settings, prop)) {
                settings[prop] = defaults[prop];
            }
        });
    }

    function betaLinks() {
        log('Adding beta links', cl.i);
        let links = $("div.page-body a[href*='/editor']").filter(function(i, elem) {
            return $(this).attr('href').match(/^https:\/\/(www\.)?waze\.com\/(?!user\/)(.{2,6}\/)?editor/);
        });
        links.each((i, elem) => {
            let url = $(elem).attr('href');
            let WMEbURL = url.replace(/(www\.)?waze\.com/, 'beta.waze.com');
            let WMEbAnchor = ` (<a target="_blank" class="postlink" href="${WMEbURL}">&beta;</a>)`;
            $(elem).after(WMEbAnchor);
        });
    }

    function checkBetaUser() {
        let betaUser = false;
        let d = new Date();
        if (settings.beta.value) {
            log('Beta status stored', cl.d);
            betaLinks();
        } else if (parseInt(settings.beta.updated, 10) + 7
                < parseInt(d.getFullYear() + (`0${d.getMonth()}`).slice(-2) + (`0${d.getDate()}`).slice(-2), 10)) {
            let ifrm = $('<iframe>').attr('id', 'WUP_frame').hide();
            ifrm.load((event) => { // What to do once the iframe has loaded
                log('iframe loaded', cl.d);
                let memberships = $(event.currentTarget).contents().find('form#ucp section:first ul.cplist a.forumtitle').text();
                betaUser = memberships.indexOf('WME beta testers') >= 0;
                log(`isBetaUser: ${betaUser}`, cl.d);
                betaUser && betaLinks();
                settings.beta = {
                    value: betaUser,
                    updated: d.getFullYear() + (`0${d.getMonth()}`).slice(-2) + (`0${d.getDate()}`).slice(-2),
                };
                //$(this).remove(); //Remove frame
                saveSettings();
            });
            ifrm.attr('src', 'ucp.php?i=groups');
            $('body').append(ifrm);
        }
    }

    function WMEProfiles() {
        log('Adding editor profile links', cl.i);
        let links = $("div.author a[href*='memberlist.php'], dl.postprofile dt a[href*='memberlist.php']"); //Post authors
        if (links.length === 0) {
            links = $("li.row a[href*='memberlist.php']"); //Topic lists
        }
        if (links.length === 0) {
            links = $("table.table1 tbody a[href*='memberlist.php']"); //Group member lists
        }
        if (links.length === 0) {
            links = $('div.memberlist-title'); //Single user forum profile
        }
        links.each((i, elem) => {
            let username = $(elem).text();
            let profileURL = ` (<a target="_blank" href="https://www.waze.com/user/editor/${username}">profile</a>)`;
            $(elem).after(profileURL);
        });
    }

    function main(tries = 1) {
        if (tries >= 10) {
            log('Giving up on loading', cl.w);
            return;
        } else if (!($ && document.readyState === 'complete')) {
            log('Document not ready, waiting', cl.d);
            setTimeout(main, 500, tries + 1);
            return;
        }
        console.group('WMEFL');
        log('Loading', cl.i);
        loadSettings();
        WMEProfiles();
        checkBetaUser();
        log('Done', cl.i);
        console.groupEnd('WMEFL');
    }

    main();
}());
