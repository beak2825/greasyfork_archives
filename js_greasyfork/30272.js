// ==UserScript==
// @name        WebMoney PayButton
// @namespace   http://tampermonkey.net/
// @version     1.2.2
// @description try to take over the world!
// @author      Bisumaruko
// @match       https://mini.wmtransfer.com/*
// @match       http://steamfarmkey.ru/*
// @match       http://steam1.lequeshop.ru/*
// @match       http://steam1.ru/*
// @match       http://lastkey.ru/*
// @match       http://steamkeyswhosales.com/*
// @match       http://alfakeys.ru/*
// @match       http://cheap-steam-games.ru/*
// @match       http://dmshop.lequeshop.ru/*
// @match       http://kartonanet.lequeshop.ru/*
// @match       http://keyssell.ru/*
// @match       http://keys.farm/*
// @match       http://rig4all.lequeshop.ru/*
// @match       http://steam-tab.ru/*
// @match       http://steamd.lequeshop.ru/*
// @match       http://steamkeys-shop.ru/*
// @match       http://steamkey.lequeshop.ru/*
// @match       http://steamkeystore.ru/*
// @match       http://farmacc.ru/*
// @match       http://steamrandomkeys.ru/*
// @match       http://animekeys.ru/*
// @match       http://drunkpatrick.store/*
// @match       http://steamfarm.lequestore.ru/*
// @match       http://maxfarmshop.ru/*
// @match       http://bestkeystore.ru/*
// @match       http://bestfarmkey.lequestore.ru/*
// @match       http://tkfg.ru/*
// @match       http://indiegamekeys.lequestore.ru/*
// @icon        http://store.steampowered.com/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30272/WebMoney%20PayButton.user.js
// @updateURL https://update.greasyfork.org/scripts/30272/WebMoney%20PayButton.meta.js
// ==/UserScript==

/* global $, window, location, sessionStorage */

const payment = () => {
    const data = {
        wm_wmk: true
    };

    switch (location.host) {
        case 'steamkeyswhosales.com':
        case 'alfakeys.ru':
            data.purse = $('#purse > span').text();
            data.amount = $('#price > span').text();
            data.desc = $('#message > span').text();
            break;
        case 'cheap-steam-games.ru':
        case 'lastkey.ru':
        case 'steam1.lequeshop.ru':
        case 'steam1.ru':
        case 'dmshop.lequeshop.ru':
        case 'kartonanet.lequeshop.ru':
        case 'keyssell.ru':
        case 'keys.farm':
        case 'rig4all.lequeshop.ru':
        case 'steam-tab.ru':
        case 'steamd.lequeshop.ru':
        case 'steamkeys-shop.ru':
        case 'steamkey.lequeshop.ru':
        case 'steamkeystore.ru':
        case 'farmacc.ru':
        case 'steamrandomkeys.ru':
        case 'animekeys.ru':
        case 'drunkpatrick.store':
        case 'steamfarmkey.ru':
        case 'steamfarm.lequestore.ru':
        case 'maxfarmshop.ru':
        case 'bestkeystore.ru':
        case 'bestfarmkey.lequestore.ru':
        case 'tkfg.ru':
        case 'indiegamekeys.lequestore.ru':
            data.purse = $('#copyfund > b').text();
            data.amount = parseFloat($('.payprice').text());
            data.desc = $('#copybill > b').text();
            break;
        default:
    }

    window.open(`https://mini.wmtransfer.com/SendWebMoney.aspx?${JSON.stringify(data)}`, '', 'height=800,width=1000');
};
const $payBtn = $('<span>Pay</span>').click(payment);

switch (location.host) {
    case 'mini.wmtransfer.com':
        if (location.href.includes('purses-view-history') && sessionStorage.getItem('wm_wmk')) window.close();
        if (location.pathname !== '/SendWebMoney.aspx') break;
        if (!location.search.length) break;

        try {
            const search = location.href.split('?').pop();
            const data = JSON.parse(decodeURIComponent(search));

            if (!data.wm_wmk) break;

            $('#ctl00_cph_tbEmailOrPurseNumber').val(data.purse);
            $('#ctl00_cph_tbAmount').val(data.amount);
            $('#ctl00_cph_tbDesc').val(data.desc);

            sessionStorage.setItem('wm_wmk', 1);
        } catch (err) {
            throw err;
        }
        break;
    case 'steamkeyswhosales.com':
    case 'alfakeys.ru':
        $payBtn.addClass('btn').css({
            'margin-right': '10px',
            cursor: 'pointer',
            color: '#FFF',
            'background-color': '#337ab7',
            'border-color': '#2e6da4'
        }).insertBefore('#check_pay');
        break;
    case 'cheap-steam-games.ru':
    case 'lastkey.ru':
    case 'keys.farm':
    case 'steamkeys-shop.ru':
    case 'maxfarmshop.ru':
    case 'bestkeystore.ru':
    case 'bestfarmkey.lequestore.ru':
    case 'steamfarmkey.ru':
    case 'indiegamekeys.lequestore.ru':
        $payBtn.addClass('btn-leque btn-leque-primary btn-leque-xs').css({
            float: 'right',
            'margin-top': '5px'
        }).insertAfter('.btn-leque-xs');
        break;
    case 'steam1.lequeshop.ru':
    case 'steam1.ru':
    case 'steam-tab.ru':
    case 'steamd.lequeshop.ru':
    case 'steamkeystore.ru':
    case 'steamrandomkeys.ru':
    case 'keyssell.ru':
        $payBtn.addClass('btn btn-primary').css('margin-top', '10px').insertBefore('.checkpaybtn');
        break;
    case 'dmshop.lequeshop.ru':
    case 'kartonanet.lequeshop.ru':
    case 'rig4all.lequeshop.ru':
    case 'steamkey.lequeshop.ru':
    case 'farmacc.ru':
    case 'drunkpatrick.store':
    case 'steamfarm.lequestore.ru':
    case 'animekeys.ru':
    case 'tkfg.ru':
        $payBtn.addClass('btn btn-primary').insertBefore('.checkpaybtn');
        break;
    default:
}