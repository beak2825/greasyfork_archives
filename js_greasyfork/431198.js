// ==UserScript==
// @name            SDG Waze Forum links
// @namespace       https://github.com/WazeDev/
// @version         2021.06.09.01
// @description     Add profile and beta links in Waze forum
// @author          WazeDev
// @contributor     crazycaveman
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @include         https://www.waze.com/forum/
// @include         /^https:\/\/.*\.waze\.com\/forum\/*/
// @grant           none
// @require         https://code.jquery.com/jquery-2.2.4.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431198/SDG%20Waze%20Forum%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/431198/SDG%20Waze%20Forum%20links.meta.js
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
            let profileURL = ` (<a target="_blank" href="https://www.waze.com/user/editor/${username}">P</a>)`;
            $(elem).after(profileURL);
        });
    }

    function SDGNewForumFixes() {
        // Create wrapper in header
        const FLWrapper = `<div id='FL-Wrapper'></div>`;
        $('#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel').prepend(FLWrapper);

        // Create notification icon in header
        const numNotifications = $('#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(4) > a > strong').text();
        if (parseInt(numNotifications) > 0) {
            $('#FL-Wrapper').prepend(
                `<span id='FL-Notifications'><a href='https://www.waze.com/forum/ucp.php?i=ucp_notifications' style='text-decoration:none;color:black;'>${numNotifications}</a></span>`
            );
            $('#FL-Notifications').css({
                'float': 'left',
                'margin-right': '80px',
                'padding': '0px 10px',
                'border': '2px solid black',
                'border-radius': '50%',
                'background-color': '#33ccff',
                'font-size': '18px'
            });
            $('#FL-Notifications > a').css({ 'color': 'white' });
        }

        // Add Moderator CP link to header (no way to verify if they have access or not that I know off)
        const MCP = `
            <span style='padding:0 3px;'><a href="./mcp.php?i=main&amp;mode=front" title="Moderator Control Panel" role="menuitem">
				<i class="icon fa-gavel fa-fw" aria-hidden="true" style='color:#3c4043;'></i>
			</a></span>`;
        $('#FL-Wrapper').prepend(MCP);

        // Re-enable memberlist button in dropdown
        const $MemberList =
            `<wz-menu-item >
                <a class="no-blue-link" href="./memberlist.php" title="Members" role="menuitem">
                    <i class="icon fa-group fa-fw"></i><span>Members</span>
                </a>
            </wz-menu-item>`;
        $('#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(6)').after($MemberList);
        $("#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(8) > a").click(function() {
            window.location = './memberlist.php';
        });

        // Add link to usergroups page to dropdown
        const $UserGroups =
            `<wz-menu-item >
                <a class="no-blue-link" href="https://www.waze.com/forum/ucp.php?i=167" title="Usergroups" role="menuitem">
                    <i class="icon fa-group fa-fw"></i><span>Usergroups</span>
                </a>
            </wz-menu-item>`;
        $('#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(6)').after($UserGroups);
        $("#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(7) > a").click(function() {
            window.location = 'https://www.waze.com/forum/ucp.php?i=167';
        });

        // Change My Posts link to display topics (same as View Your Posts in old forum)
        $('#control_bar_handler > div.header-waze-wrapper > wz-header > wz-header-user-panel > wz-user-box > wz-menu-item:nth-child(5) > a').attr('href', 'https://www.waze.com/forum/search.php?author_id=16831039&sr=topics');

        // Copy forum path to bottom of page
//         let topicLink = $('#nav-breadcrumbs').clone();
//         topicLink[0].id = 'nav-breadcrumbs-bottom';
//         console.log(topicLink[0]);
//         $('.action-bar bar-bottom').prepend(topicLink[0]);

        // Move 'New' icon to front of text in notification page
        $("#ucp > section > div.notifications-list > ul.cplist.two-columns > li > div.ml-6 > a > div > wz-badge").each(function() {
            $(this).parent().prepend(this);
        });

        // Move link to PM a user to the top left of the user page
        let $newli = $('#page-body > main > aside > ul > li:nth-child(2)').clone();
        $($newli.children()[0]).prop('href', $('#viewprofile > section:nth-child(1) > div:nth-child(14) > div > div:nth-child(2) > span:nth-child(2) > a').prop('href'));
        $($newli.find('i')[0]).removeClass('w-icon w-icon-error ').addClass('w-icon w-icon-inbox');
        $($newli.find('span')[0]).text('Send PM');
        $($newli.find('span')[0]).css('padding-left', '5px');
        $('#page-body > main > aside > ul').prepend($newli);

        // Change the usergroup list to a select again...
        $('#members-groups-list').hide();
        $('#users-group-links').css('display', 'inline-block');
        $('#users-group-links > wz-select').css('display', 'inline-block');
        $('#users-group-links > button').css('display', 'inline-block');
        $('#users-group-links > button').text('Go');
        $('#users-group-links > wz-select').css('width', '250px')

        // Fix the select when managing groups
        const userSelect = $('#page-header > fieldset.display-actions > select').get();
        $(userSelect).append($('<option>', {
            value: 'default',
            text: 'Make group default for member'
        }));
        $(userSelect).append($('<option>', {
            value: 'approve',
            text: 'Approve member'
        }));
        $(userSelect).append($('<option>', {
            value: 'deleteusers',
            text: 'Remove member from group'
        }));

        // Put the "leave shadow topic" and "lock topic" options back on the move topic page
        $('fieldset dd').css('margin-left', '5%');
        $('dd label').css('white-space', 'normal');
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
        SDGNewForumFixes();
        log('Done', cl.i);
        console.groupEnd('WMEFL');
    }

    main();
}());
