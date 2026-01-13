// ==UserScript==
// @name         Twitch staggerrilla command buttons
// @namespace    https://github.com/Mishasama/UserScript/tree/master/Misha's%20US
// @version      2.1.3
// @description  Adds buttons to send commands in the Twitch chat
// @author       Kurotaku & Misha
// @license      CC-BY-NC-SA-4.0
// @match        https://www.twitch.tv/staggerrilla*
// @match        https://www.twitch.tv/*/staggerrilla/chat*
// @icon         https://static-cdn.jtvnw.net/jtv_user_pictures/c0df83fd-4db0-4175-8db2-3f011757031f-profile_image-70x70.png
// @require      https://update.greasyfork.org/scripts/547392/My%20own%20functions%20library.js
// @require      https://update.greasyfork.org/scripts/547394/Library%20Twitch%20Command%20Buttons.js
// @require      https://update.greasyfork.org/scripts/547397/interact.js
// @require      https://update.greasyfork.org/scripts/547401/sweetalert2-latest.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @supportURL   https://github.com/Mishasama/UserScript/issues
// @homepageURL  https://github.com/Mishasama/UserScript/tree/master/Misha's%20US/Twitch%20Command%20Buttons
// @contributionURL			https://ko-fi.com/mishasama
// @contributionAmount			1￥
// @compatible				chrome
// @compatible				edge
// @compatible				firefox
// @downloadURL https://update.greasyfork.org/scripts/547402/Twitch%20staggerrilla%20command%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/547402/Twitch%20staggerrilla%20command%20buttons.meta.js
// ==/UserScript==


let twitch_channel = "staggerrilla";
let streamelements_store = "staggerrilla";

(async function() {
    await main();
})();

function init_gm_config() {
    GM_registerMenuCommand('Settings', () => GM_config.open());
    GM_config.init(
        {
            'id': 'configuration',
            'title': 'Staggerrilla Config',
            'fields':
            {
                'script_enabled': { 'type': 'checkbox', 'default': true, 'label': 'Enable/Disable the script' },
                'buttons_general': { 'type': 'checkbox', 'default': true, 'label': 'General buttons' },
                'voucher_buttons': { 'type': 'checkbox', 'default': true, 'section': ['Voucher'], 'label': 'Enable Voucher redemption buttons' },
                'irc': { 'type': 'checkbox', 'default': false, 'label': 'Use IRC (Recommended! Requires Oauth)', 'section': ['IRC'] },
                'auth_username': { 'label': 'Username', 'type': 'textbox' },
                'auth_oauth': { 'label': 'Oauth Token. Generate here: <a href="https://twitchtokengenerator.com" target="_blank">twitchtokengenerator.com</a>', 'type': 'textbox' },
                'show_streamelements_points': { 'type': 'checkbox', 'default': true, 'section': ['Miscellaneous'], 'label': 'Show StreamElement Points' },
                'collect_point_bonus': { 'type': 'checkbox', 'default': true, 'label': 'Collect Point Bonus Automatically' },
                'notifications': { 'type': 'checkbox', 'default': false, 'label': 'Desktop notification if message contains your name' },
                'hide_powerups': { 'type': 'checkbox', 'default': true, 'label': 'Hide Power-Ups in Store' },
                'prevent_shadowban': { 'type': 'checkbox', 'default': true, 'label': 'Prevent Shadowban. Commands become random case.<br>Shadowban means your messages temporarily don\'t appear.<br>Without IRC, you can\'t see if you\'re shadowbanned' },
                'custom_css_styles': { 'label': 'Custom CSS Styles:', 'type': 'textarea' }
            },
            'events': {
                'save': () => {location.reload()},
            },
            'frame': document.body.appendChild(document.createElement('div')),
        });
}

function generate_button_groups() {
    let buttongroups = "";
    if(GM_config.get("buttons_general"))
        buttongroups += `${btngrp_label("General")}
                <div class="k-buttongroup">
                ${btngrp_button("!bleep", "Bleep")}
                ${btngrp_button("!bloop", "Bloop")}
                ${btngrp_button("!bleep !bloop", "Bleep & Bloop")}
                </div>
                <div style="height: 5px;"></div>
                <div class="k-buttongroup">
                ${btngrp_button("!fish", "Fish")}
                ${btngrp_button("!ticket", "Ticket")}
                ${btngrp_button("!steam", "Steam")}
                </div>
                <div style="height: 5px;"></div>
                <div class="k-buttongroup">
                ${btngrp_button("!giveaway 1", "Giveaway")}
                ${btngrp_button("!enter", "Enter")}
                ${btngrp_button("!pokecatch", "Pokecatch")}
                </div>`;

    return(buttongroups);
}

async function generate_voucher_buttons() {
    insert_voucher_buttons(
        generate_voucher_button("100k Bubbers!", "+100k") +
        generate_voucher_button("Totes a Bot", "Bot")
    );
}
