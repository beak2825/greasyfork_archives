// ==UserScript==
// @name         Steamgifts Giveaway Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Automatically apply settings when creating giveaways
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @author       Bisumaruko
// @match        https://www.steamgifts.com/giveaways/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29199/Steamgifts%20Giveaway%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/29199/Steamgifts%20Giveaway%20Helper.meta.js
// ==/UserScript==

const eol = "\n";
const settings = {
    type: 'key', // gift, key
    copies: 1, // The number of copies of the game you're looking to give away.
    start: 0, // GA starts in x hours, 0 = now
    end: 1, // GA ends in x hours after start, min 1 hour after start
    region: 'None', // None, China, Europe, Hong Kong, North America, RU + CIS, Saudi Arabia, SE Asia, South America
    who: 'everyone', // everyone, invite_only, groups
    level: 1, // 0 ~ 10
    description: 'Good luck!' // description
};
const atReview = !!$('form.disable-form-onclick').length;

if (!atReview) {
    // giveaway type
    $(`.form__row--giveaway-type [data-checkbox-value=${settings.type}]`).click();

    // giveaway keys
    if (settings.type === 'key') {
        const $keys = $('textarea[name=key_string]');
        const regKey = /([A-Za-z0-9]{5}-){2,4}[A-Za-z0-9]{5}/g;

        $keys.blur(() => {
            $keys.val((i, value) => value.match(regKey).join(eol));
        });
    } else {
        $('.form__row--giveaway-copies input[name=copies]').val(settings.copies);
    }

    // giveaway time
    const now = Date.now();
    const start = parseInt(settings.start, 10) || 0;
    const end = (parseInt(settings.end, 10) || 1) + start;
    const toFormat = (duration = 0) => {
        const dateObj = new Date(now + duration * 60 * 60 * 1000);
        const date = dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const time = dateObj.toLocaleString('en-GB', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });

        return `${date} ${time}`;
    };

    $('input[name=start_time]').val(toFormat(start));
    $('input[name=end_time]').val(toFormat(end));

    // giveaway region restricted
    if (settings.region === 'None') {
        $('input[name=region_restricted] ~ [data-checkbox-value=0]').click();
    } else {
        $('input[name=region_restricted] ~ [data-checkbox-value=1]').click();

        if (settings.region === 'China') {
            $('input[placeholder^=Search]').val('China').keyup();
            $('.form_list_item_summary_name:contains("China")').click();
        } else {
            $(`option:contains("${settings.region}")`).prop('selected', 'selected');
        }
    }

    // giveaway who can enter
    $(`.form__row--who-can-enter [data-checkbox-value=${settings.who}]`).click();

    // giveaway contributor level
    if (settings.level > 0) {
        const s = $('.form__slider--level');

        s.slider('value', settings.level);
        s.slider('option', 'slide').call(s, null, { value: settings.level });
    }

    // giveaway description
    if (settings.description.length > 0) {
        $('textarea[name=description]').val(settings.description);
    }
}