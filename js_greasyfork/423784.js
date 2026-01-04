// ==UserScript==
// @name        auto-perk
// @namespace   https://pablobls.tech/
// @match       *://rivalregions.com/
// @author      Pablo
// @description Auto perk
// @grant       GM_getValue
// @grant       GM_setValue
// @version      0.0.2
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/423784/auto-perk.user.js
// @updateURL https://update.greasyfork.org/scripts/423784/auto-perk.meta.js
// ==/UserScript==

/**
 * Perk:
 * 1 = strength
 * 2 = education
 * 3 = endurance
 *
 * Url:
 * 1 = money
 * 2 = gold
 *
 *
 * - TamperMonkey change the default values BEFORE install (re-install if needed).
 * - ViolentMonkey allows to change them in the 'Values' tab on edit script page.
 */

const firstTime = GM_getValue('first-time', true);

if (firstTime) {
    GM_setValue('perk', 2); // perk
    GM_setValue('url', 1); // url
}

$(document).ready(() => {
    if (firstTime) {
        GM_setValue('first-time', false);
    } else {
        var waitInterval = setInterval(() => {
            if ($('#index_perks_list').length) {
                clearInterval(waitInterval);
                // to check if any perk is already active
                const countdownAmount = $(
                    '#index_perks_list>div>div[perk]>.hasCountdown'
                ).length;
                if (countdownAmount === 0) {
                    upgradePerk();
                } else {
                    console.log('perk already active');

                    setUpgradeTimeout();
                }
            }
        }, 1000);
    }
});

function upgradePerk() {
    const perk = GM_getValue('perk');
    const url = GM_getValue('url');
    $.ajax({
        url: '/perks/up/' + perk + '/' + url,
        data: { c: c_html },
        type: 'POST',
        success: function (data) {
            console.log('perk upgraded', new Date().toLocaleString());
            console.log(data);
            // ajax_action('main/content');

            location.reload();
            
        },
    });
}

function setUpgradeTimeout() {
    let nextPerkText = $('.ib_border>div>.tc>.small')
        .first()
        .text()
        .replace('New skill level: ', '');

    if (nextPerkText.includes('tomorrow')){
        
       
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const date = tomorrow.toDateString();
        const time = nextPerkText.replace('tomorrow ', '');

        nextPerkText = `${date} ${time}`;

    } else if (nextPerkText.includes('today')){

        const date = new Date().toDateString();
        const time = nextPerkText.replace('today ', '');

        nextPerkText = `${date} ${time}`;
    }
    
    const nextPerk = Date.parse(nextPerkText);
    
    const timeout = nextPerk - c();
    // console.log('npt', nextPerkText)
    // console.log('np', nextPerk);
    // console.log('to',timeout)

    addDiv(nextPerkText);

    setTimeout(() => {
        upgradePerk();
    }, timeout + 60000);
}

function addDiv(nextPerkDate) {
    const perks = ['Stregth', 'Education', 'Endurance'];
    const urls = ['Money', 'Gold'];

    const perk = perks[GM_getValue('perk') - 1];
    const url = urls[GM_getValue('url') - 1];

    const div = `   <div class="perk_item ib_border hov pointer">
                        <div class="tc small">${nextPerkDate}</div>
                        <div class="tc small">${perk} - ${url}</div>
                        <div class="tc small">
                            <a target="blank_" href="https://github.com/pbl0/rr-scripts">More scripts</a>
                        </div>
                    </div>`;

    if (window.location.href.includes('#overview')) {
        $('#index_perks_list').append(div);
    }
}
