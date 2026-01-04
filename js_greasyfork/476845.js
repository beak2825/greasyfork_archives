// ==UserScript==
// @name         VACYourFriendsRevamp (VACYFRe)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Prank your friends by adding a fake VAC ban to their Steam profiles. Customize the number of VAC bans and days since their last ban with this script.
// @author       SnabbSpelare
// @match        *://steamcommunity.com/profiles/*
// @match        *://steamcommunity.com/id/*
// @grant        GM_addStyle
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/476845/VACYourFriendsRevamp%20%28VACYFRe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476845/VACYourFriendsRevamp%20%28VACYFRe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Append the button to apply fake VAC status
    document.getElementById('global_action_menu').insertAdjacentHTML('beforeend', '<div id="vyf_btn" class="vyf_btn_red"><a class="vyf_btn_content">VAC Them</a>');

    // Function to apply the fake VAC status
    function applyFakeVACStatus() {
        const banDuration = prompt('Enter the number of VAC bans:');
        const parsedBans = parseInt(banDuration);

        if (!isNaN(parsedBans) && parsedBans >= 0) {
            let daysSinceLastBan = '0 day(s)';
            if (parsedBans > 0) {
                const daysSince = prompt('Enter the days since the last VAC ban:');
                const parsedDays = parseInt(daysSince);
                if (!isNaN(parsedDays) && parsedDays >= 0) {
                    daysSinceLastBan = `${parsedDays} day${parsedDays === 1 ? '' : 's'}`;
                }
            }

            // Inject VAC ban HTML into the DOM with the provided ban data
            const fakeVACBanHTML = `<div class="profile_ban_status"><div class="profile_ban">${parsedBans} VAC ban${parsedBans === 1 ? '' : 's'} on record<span class="profile_ban_info"> | <a class="whiteLink" href="https://support.steampowered.com/kb_article.php?ref=7849-Radz-6869&l=english" target="_blank" rel="noreferrer">Info</a></span></div>${daysSinceLastBan} since last ban</div>`;

            if (!document.getElementsByClassName('profile_ban_status').length) {
                if (document.getElementsByClassName('profile_private_info').length) {
                    document.getElementsByClassName('profile_rightcol')[0].insertAdjacentHTML('beforeend', fakeVACBanHTML);
                } else {
                    document.getElementsByClassName('responsive_status_info')[0].insertAdjacentHTML('beforeend', fakeVACBanHTML);
                }
            }
        } else {
            alert('Invalid input. Please enter a valid non-negative number.');
        }
    }

    // Inject CSS
    GM_addStyle(`#vyf_btn {
        display: inline-block;
        position: relative;
        line-height: 24px;
        margin-left: 3px;
    }

    .vyf_btn_red {
        background-color: #b31515;
    }

    .vyf_btn_content {
        display: inline-block !important;
        padding-left: 35px !important;
        padding-right: 9px !important;
        background-position: 10px 5px !important;
        background-image: url(https://i.postimg.cc/tJ3L2Fbb/vac-them-button.png);
        background-repeat: no-repeat;
        text-decoration: none;
        color: #e5e4dc !important;
        font-weight: 400;
    }`);

    // Attach the click event to the "VAC Them" button
    document.getElementById('vyf_btn').addEventListener('click', applyFakeVACStatus);
})();