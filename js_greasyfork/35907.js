// ==UserScript==
// @name        Steam Wholesale Sites Extension
// @namespace   http://tampermonkey.net/
// @version     1.7.0
// @description try to take over the world!
// @icon        https://store.steampowered.com/favicon.ico
// @author      Bisumaruko
// @contributor Renoz fghhdfh@greasyfork for Russian translation
// @include     https://wallet.web.money/finances*
// @include     https://mini.wmtransfer.com/*
// @include     https://qiwi.com/payment/form/99*
// @include     http*://www.cheapkeys.ovh/*
// @include     http*://cheapkeys.ovh/*
// @include     http://steamfarmkey.ru/*
// @include     http://steam1.lequeshop.ru/*
// @include     http://steam1.ru/*
// @include     http://lastkey.ru/*
// @include     http://steamkeyswhosales.com/*
// @include     http://alfakeys.ru/*
// @include     http://cheap-steam-games.ru/*
// @include     http://dmshop.lequeshop.ru/*
// @include     http://kartonanet.lequeshop.ru/*
// @include     http://keyssell.ru/*
// @include     http://keys.farm/*
// @include     http://rig4all.lequeshop.ru/*
// @include     http://steam-tab.ru/*
// @include     http://steamd.lequeshop.ru/*
// @include     http://steamkeys-shop.ru/*
// @include     http://steamkey.lequeshop.ru/*
// @include     http://steamkeystore.ru/*
// @include     http://farmacc.ru/*
// @include     http://steamrandomkeys.ru/*
// @include     http://animekeys.ru/*
// @include     http://drunkpatrick.store/*
// @include     http://steamfarm.lequestore.ru/*
// @include     http://maxfarmshop.ru/*
// @include     http://bestkeystore.ru/*
// @include     http://bestfarmkey.lequestore.ru/*
// @include     http://tkfg.ru/*
// @include     http://indiegamekeys.lequestore.ru/*
// @include     http://m-b-shop.leque.shop/*
// @include     http://200plus.lequeshop.ru/*
// @include     http://randomkey.ru/*
// @include     http://farmkeys.ru/*
// @include     http://baty131shop.lequestore.ru/*
// @include     http://baty131shop.lequeshop.ru/*
// @include     http://200plus.lequestore.ru/*
// @include     http://azimut-steam.leque.shop/*
// @include     http://imperiumkey.com/*
// @include     http://alonekey.net/*
// @include     http://keys.lequestore.ru/*
// @include     http://wlutmarket.lequeshop.ru/*
// @include     http://cheapkeys.akens.ru/*
// @include     http://steam-discount.ru/*
// @include     http://jplay.lequeshop.ru/*
// @include     http://sovkey-farm.ru/*
// @include     http://gamesforfarm.lequeshop.com/*
// @include     http://bestgames.lequeshop.com/*
// @include     http://bobkeys.lequeshop.ru/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.0.6/sweetalert2.min.js
// @resource    SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.0.6/sweetalert2.min.css
// @connect     store.steampowered.com
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/35907/Steam%20Wholesale%20Sites%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/35907/Steam%20Wholesale%20Sites%20Extension.meta.js
// ==/UserScript==

/* global swal */

// inject swal css
GM_addStyle(GM_getResourceText('SweetAlert2CSS'));

// inject styles
GM_addStyle(`
    body.hideOwned .SWSE_owned { display: none; }
    body.hideDLC .SWSE_DLC { display: none; }
    th.discount { width: 150px; }
    .SWSE_hide { display: none !important; }
    .SWSE_settings, .SWSE_settings input { width: -webkit-fill-available; width: -moz-available; }
    .SWSE_settings .name { text-align: right; vertical-align: top; }
    .SWSE_settings .value { text-align: left; }
    .SWSE_settings .value > * { height: 30px; margin: 0 20px 10px; }
    .SWSE_settings .switch { position: relative; display: inline-block; width: 60px; }
    .SWSE_settings .switch input { display: none; }
    .SWSE_settings .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
    }
    .SWSE_settings .slider:before {
        position: absolute;
        content: "";
        height: 26px; width: 26px;
        left: 2px; bottom: 2px;
        background-color: white;
        transition: 0.4s;
    }
    .SWSE_settings input:checked + .slider { background-color: #2196F3; }
    .SWSE_settings input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
    .SWSE_settings input:checked + .slider:before { transform: translateX(30px); }
    .SWSE_settings > span { display: inline-block; cursor: pointer; color: white; }
    .SWSE_owned, .SWSE_owned > .name {
        background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.1) 90%) !important;
        background-color: #9ccc65 !important;
        transition: background 500ms ease 0s;
        color: white !important;
    }
    .SWSE_owned a { color: white !important; }
`);

// load up
const regURL = /(https?:\/\/)?([.\w]*steam[-.\w]*){1}\/.*?(apps?|subs?){1}\/(\d+){1}(\/.*\/?)?/m;
const regKey = /((?:([A-Z0-9])(?!\2{4})){5}-){2,5}[A-Z0-9]{5}/g;
const has = Object.prototype.hasOwnProperty;
const forEachAsync = (array, callback, lastIterationCallback) => {
    if (!Array.isArray(array)) throw Error('Not an array');
    if (typeof callback !== 'function') throw Error('Not an function');

    const iterators = [...array.keys()];
    const processor = taskStartTime => {
        let taskFinishTime;

        do {
            const iterator = iterators.shift();

            if (iterator in array) callback(array[iterator], iterator, array);

            taskFinishTime = window.performance.now();
        } while (taskFinishTime - taskStartTime < 1000 / 60);

        if (iterators.length > 0) requestAnimationFrame(processor);
        // finished iterating array
        else if (typeof lastIterationCallback === 'function') lastIterationCallback();
    };

    requestAnimationFrame(processor);
};

// setup jQuery
const $ = jQuery.noConflict(true);

$.fn.pop = [].pop;
$.fn.shift = [].shift;
$.fn.eachAsync = function eachAsync(callback, lastIterationCallback) {
    forEachAsync(this.get(), callback, lastIterationCallback);
};

const owned = JSON.parse(GM_getValue('SWSE_owned') || '{}');
const discountCode = JSON.parse(GM_getValue('SWSE_discount_code') || '{}');
const config = {
    data: JSON.parse(GM_getValue('SWSE_config') || '{}'),
    set(key, value, callback = null) {
        this.data[key] = value;
        GM_setValue('SWSE_config', JSON.stringify(this.data));

        if (typeof callback === 'function') callback();
    },
    get(key) {
        return has.call(this.data, key) ? this.data[key] : null;
    },
    init() {
        if (!has.call(this.data, 'language')) this.data.language = 'english';
        if (!has.call(this.data, 'count')) this.data.count = 1;
        if (!has.call(this.data, 'email')) this.data.email = '';
    }
};
const i18n = {
    data: {
        tchinese: {
            name: '繁體中文',
            settingsTitle: '設定',
            settingsCount: '購買數量',
            settingsEmail: '購買信箱',
            settingsLanguage: '語言',
            menuHideOwned: '隱藏已擁有',
            menuShowOwned: '顯示已擁有',
            menuHideDLC: '隱藏DLC',
            menuShowDLC: '顯示DLC',
            menuSyncLibrary: '同步遊戲庫',
            menuFilterDiscount: '折扣篩選',
            menuFilterDiscountLoading: '折扣載入中...',
            menuSort: '排序',
            keyField: 'Steam 序號',
            payButtonText: '付款',
            syncSuccessTitle: '同步成功',
            syncSuccess: '成功同步Steam 遊戲庫資料'
        },
        schinese: {
            name: '简体中文',
            settingsTitle: '设置',
            settingsCount: '购买数量',
            settingsEmail: '购买邮箱',
            settingsLanguage: '语言',
            menuHideOwned: '隐藏已拥有',
            menuShowOwned: '显示已擁有',
            menuHideDLC: '隐藏DLC',
            menuShowDLC: '显示DLC',
            menuSyncLibrary: '同步游戏库',
            menuFilterDiscount: '折扣筛选',
            menuFilterDiscountLoading: '加载折扣中...',
            menuSort: '排序',
            keyField: 'Steam 激活码',
            payButtonText: '付款',
            syncSuccessTitle: '同步成功',
            syncSuccess: '成功同步Steam 游戏库资料'
        },
        english: {
            name: 'English',
            settingsTitle: 'Settings',
            settingsCount: 'Purchase Quantity',
            settingsEmail: 'Purchase Email',
            settingsLanguage: 'Language',
            menuHideOwned: 'Hide Owned',
            menuShowOwned: 'Show Owned',
            menuHideDLC: 'Hide DLC',
            menuShowDLC: 'Show DLC',
            menuSyncLibrary: 'Sync Library',
            menuFilterDiscount: 'Discount Filter',
            menuFilterDiscountLoading: 'Loading discounts...',
            menuSort: 'Sort',
            keyField: 'Steam Keys',
            payButtonText: 'Pay',
            syncSuccessTitle: 'Sync Successful',
            syncSuccess: 'Successfully sync Steam library data'
        },
        russian: {
            name: 'Русский',
            settingsTitle: 'Настройки',
            settingsCount: 'Приобретаемое количество',
            settingsEmail: 'Email для покупок',
            settingsLanguage: 'Язык',
            menuHideOwned: 'Скрыть имеющиеся',
            menuShowOwned: 'Показать имеющиеся',
            menuHideDLC: 'Скрыть DLC',
            menuShowDLC: 'Показать DLC',
            menuSyncLibrary: 'Синхронизировать список игр',
            menuFilterDiscount: 'Фильтр скидок',
            menuFilterDiscountLoading: 'Скидки загружаются...',
            menuSort: 'Сортировка',
            keyField: 'Steam ключи',
            payButtonText: 'Оплатить',
            syncSuccessTitle: 'Синхронизация успешна',
            syncSuccess: 'Успешно синхронизированы данные Steam библиотеки'
        }
    },
    language: null,
    set() {
        const selectedLanguage = has.call(this.data, config.get('language')) ? config.get('language') : 'english';

        this.language = this.data[selectedLanguage];
    },
    get(key) {
        return has.call(this.language, key) ? this.language[key] : this.data.english[key];
    },
    init() {
        this.set();
    }
};

const settingsHandler = arg => {
    swal.showLoading();

    arg();

    setTimeout(swal.hideLoading, 500);
};
const settings = () => {
    const panelHTML = `
        <table class="SWSE_settings">
            <tr>
                <td class="name">${i18n.get('settingsLanguage')}</td>
                <td class="value"><select class="language"></select></td>
            </tr>
            <tr>
                <td class="name">${i18n.get('settingsCount')}</td>
                <td class="value"><input type="number" class="count" value="1" min="1"></select></td>
            </tr>
            <tr>
                <td class="name">${i18n.get('settingsEmail')}</td>
                <td class="value"><input type="text" class="email"></td>
            </tr>
        </table>
    `;
    const panelHandler = panel => {
        // apply settings
        const $panel = $(panel).find('.SWSE_settings');

        // language
        const $language = $panel.find('.language');

        Object.keys(i18n.data).forEach(language => {
            $language.append(new Option(i18n.data[language].name, language));
        });
        $panel.find(`option[value=${config.get('language')}]`).prop('selected', true);
        $language.change(settingsHandler.bind(null, () => {
            const newLanguage = $language.val();

            config.set('language', newLanguage);
            i18n.set();
        }));

        // count, email
        ['count', 'email'].forEach(field => {
            const $field = $panel.find(`.${field}`);
            const val = config.get(field);

            if (val) $field.val(val);

            $field.change(settingsHandler.bind(null, () => {
                config.set(field, $field.val().trim());
            }));
        });
    };

    swal({
        title: i18n.get('settingsTitle'),
        html: panelHTML,
        onBeforeOpen: panelHandler
    });
};
const matchSteamUrl = (str = '') => {
    const input = str.trim();
    let output = null;

    if (input.length > 0) {
        const found = input.match(regURL);

        if (found) {
            output = {
                type: found[3].slice(0, 3),
                id: parseInt(found[4], 10),
                index: found.index,
                matched: found[0]
            };
        }
    }

    return output;
};
const check = (d, s, c) => {
    let source = d;
    let selector = s;
    let callback = c;

    if (typeof d === 'string') {
        // dom source omitted
        source = document;
        selector = d;
        callback = s;
    }

    $(source).find(selector.split(',').map(x => `${x}:not(.SWSE_checked)`).join()).eachAsync(element => {
        const $ele = $(element);
        const classes = [];
        let attr = null;

        for (let i = 0; i < element.attributes.length; i += 1) {
            if (!attr) attr = matchSteamUrl(element.attributes[i].value);
        }

        if (attr && owned[attr.type].includes(attr.id)) classes.push('SWSE_owned');
        if ($ele.text().toLowerCase().includes(' dlc')) classes.push('SWSE_DLC');
        if (classes.length > 0) callback($ele, classes.join(' '));

        $ele.addClass('SWSE_checked');
    });
};
const syncLibrary = (notify = false) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: `https://store.steampowered.com/dynamicstore/userdata/t=${Math.random()}`,
        onload: res => {
            if (res.status === 200) {
                const data = JSON.parse(res.response);

                if (data.rgOwnedApps.length > 0) owned.app = data.rgOwnedApps;
                if (data.rgOwnedPackages.length > 0) owned.sub = data.rgOwnedPackages;
                owned.lastSync = Date.now();

                GM_setValue('SWSE_owned', JSON.stringify(owned));

                if (notify) {
                    swal({
                        title: i18n.get('syncSuccessTitle'),
                        text: i18n.get('syncSuccess'),
                        type: 'success',
                        timer: 3000
                    });
                }
            }
        }
    });
};

const headerMenu = () => {
    // insert header menu
    GM_addStyle(`
        header.SWSE_header {
            display: flex !important;
            position: sticky;
            top: 0;
            padding: 0 7%;
            background: #2d3f51;
            box-shadow: 0 2px 5px rgba(68, 68, 68, 0.3);
            transition: all 0.2s ease;
            z-index: 9999;
        }
        .SWSE_nav ul { margin: 0; padding: 0; list-style: none; }
        .SWSE_nav li { float: left; }
        .SWSE_nav a {
            color: #f5f5f5;
            text-decoration: none;
            display: block;
            padding: 1.5em;
            font-size: initial;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s ease;
            overflow: hidden;
        }
        .SWSE_nav a:hover { color: #16A085; }
        body.hideDiscountRange_-1 tr[data-discount-range="-1"],
        body.hideDiscountRange_1 tr[data-discount-range="1"],
        body.hideDiscountRange_2 tr[data-discount-range="2"],
        body.hideDiscountRange_3 tr[data-discount-range="3"],
        body.hideDiscountRange_4 tr[data-discount-range="4"],
        body.hideDiscountRange_5 tr[data-discount-range="5"],
        body.hideDiscountRange_6 tr[data-discount-range="6"],
        body.hideDiscountRange_7 tr[data-discount-range="7"],
        body.hideDiscountRange_8 tr[data-discount-range="8"],
        body.hideDiscountRange_9 tr[data-discount-range="9"] { display: none; }
        .menuFilterDiscount { position: relative; }
        .menuFilterDiscount ul {
            width: 165px; max-height: 0;
            position: absolute; top: 80px;
            background-color: #2d3f51;
            color: #FFF;
            transition: max-height 0.5s ease;
            overflow: hidden;
        }
        .menuFilterDiscount:hover ul { max-height: 500px; }
        .menuFilterDiscount li { width: 100%; }
        .menuFilterDiscount input { display: none; }
        .menuFilterDiscount input:checked + span { color: #16A085; }
        .menuFilterDiscount label {
            width: 100%;
            display: inline-block;
            padding: 10px 20px;
            text-align: right;
            font-weight: 100;
            text-transform: none;
            box-sizing: border-box;
            cursor: pointer;
        }
        .menuFilterDiscount label:hover input + span { color: #16A085; }
        .menuFilterDiscount label:hover input:checked + span { color: #FFF; }
    `);

    const $nav = $('<nav class="SWSE_nav"><ul></ul></nav>');

    $nav.prependTo('body').wrap('<header class="SWSE_header"></header>');
    $nav.find('ul').append(
    // hide owned button
    $(`<li class="menuHideOwned"><a>${i18n.get('menuHideOwned')}</a></li>`).click(() => {
        $('.menuHideOwned > a').text(document.body.classList.toggle('hideOwned') ? i18n.get('menuShowOwned') : i18n.get('menuHideOwned'));
    }),
    // hide DLC button
    $(`<li class="menuHideDLC"><a>${i18n.get('menuHideDLC')}</a></li>`).click(() => {
        $('.menuHideDLC > a').text(document.body.classList.toggle('hideDLC') ? i18n.get('menuShowDLC') : i18n.get('menuHideDLC'));
    }),
    // sync library button
    $(`<li class="menuSyncLibrary"><a>${i18n.get('menuSyncLibrary')}</a></li>`).click(syncLibrary.bind(null, true)),
    // settings button
    $(`<li class="settings"><a>${i18n.get('settingsTitle')}</a></li>`).click(settings));
};
const handler = () => {
    // order page, auto download keys
    if (location.pathname.startsWith('/order/get/') || location.pathname === '/views/') {
        const url = $('table a, .down a').eq(0).attr('href');

        if (url.length > 0) {
            fetch(url, {
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) return res.text();
                throw Error('Request was not ok');
            }).then(t => {
                const keys = t.match(regKey).map(k => `<span>${k}</span><a class="activateOnSteam" href="https://store.steampowered.com/account/registerkey?key=${k}" target="_blank"></a>`);

                $('table tr:last-child').before(`<tr><td>${i18n.get('keyField')}</td><td>${keys.join('<br>')}</td></tr>`);
                $('.down > .btn-primary').before(`<p>${i18n.get('keyField')}<br>${keys.join('<br>')}</p>`);

                GM_addStyle(`
                    .activateOnSteam {
                        width: 16px; height: 16px;
                        display: inline-block;
                        margin-left: 5px;
                        background-image: url("https://store.steampowered.com/favicon.ico");
                    }
                `);
            });
        }
        // product page
    } else {
        // pre-fill inputs
        $('input[name=count]').val(config.get('count'));
        $('input[name=email]').val(config.get('email'));
        $('#agreeLicense').click();
        if (has.call(discountCode, location.hostname)) {
            $('input[name=copupon]').val(discountCode[location.hostname]);
        }

        // insert pay button
        const $payButton = $(`<span class="SWSE_payButton">${i18n.get('payButtonText')}</span>`).click(() => {
            const data = {
                swse: true,
                purse: $('#purse > span, #copyfund > b, #purse > span').text().trim() || $('.payment > input').val(),
                amount: $('#price > span, .payprice, form#pay #price, table tr:nth-child(4) .wow').text().toLowerCase().trim(),
                desc: $('#message > span, #copybill > b, #message > span').text().trim() || $('table tr:nth-child(6) input').val()
            };
            const paymentGateways = {
                qiwi: 'https://qiwi.com/payment/form/99',
                webmoney: 'https://wallet.web.money/finances'
            };
            const gateway = data.amount.includes('qiwi') ? 'qiwi' : 'webmoney';

            data.currency = data.amount.includes('wm') ? data.amount.match(/[a-z]+/)[0] : 'wmz';
            data.amount = parseFloat(data.amount);
            window.open(`${paymentGateways[gateway]}?${JSON.stringify(data)}`, '', 'height=800,width=1000');
        });

        switch (location.hostname) {
            case 'steamkeyswhosales.com':
            case 'alfakeys.ru':
            case 'cheapkeys.akens.ru':
                $payButton.addClass('btn').css({
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
            case 'randomkey.ru':
            case 'farmkeys.ru':
            case 'azimut-steam.leque.shop':
            case 'alonekey.net':
            case 'keys.lequestore.ru':
            case 'wlutmarket.lequeshop.ru':
                $payButton.addClass('btn-leque btn-leque-primary btn-leque-xs').css({ float: 'right', 'margin-top': '5px' }).insertAfter('.btn-leque-xs');
                break;
            case 'steam1.lequeshop.ru':
            case 'steam1.ru':
            case 'steam-tab.ru':
            case 'steamd.lequeshop.ru':
            case 'steamkeystore.ru':
            case 'steamrandomkeys.ru':
            case 'keyssell.ru':
                $payButton.addClass('btn btn-primary').css('margin-top', '10px').insertBefore('.checkpayButton, .checkpaybtn');
                break;
            case 'dmshop.lequeshop.ru':
            case 'kartonanet.lequeshop.ru':
            case 'rig4all.lequeshop.ru':
            case 'steamkey.lequeshop.ru':
            case 'farmacc.ru':
            case 'drunkpatrick.store':
            case 'steamfarm.lequestore.ru':
            case 'tkfg.ru':
            case '200plus.lequeshop.ru':
            case 'baty131shop.lequestore.ru':
            case 'baty131shop.lequeshop.ru':
            case '200plus.lequestore.ru':
            case 'jplay.lequeshop.ru':
            case 'animekeys.ru':
            case 'gamesforfarm.lequeshop.com':
            case 'bestgames.lequeshop.com':
            case 'bobkeys.lequeshop.ru':
                $payButton.addClass('btn btn-primary').insertBefore('.checkpayButton, .checkpaybtn');
                break;
            case 'steam-discount.ru':
                $payButton.addClass('btn ipaid-btn btn-primary').css({
                    width: '200px',
                    'margin-right': '20px',
                    'font-size': 'x-large',
                    'line-height': '80px'
                }).insertBefore('.ipaid-btn');
                break;
            default:
        }

        // check owned
        switch (location.hostname) {
            case 'www.cheapkeys.ovh':
            case 'cheapkeys.ovh':
                {
                    check('a[href*="steampowered"], img[src*="steam/apps/"]', ($ele, classes) => {
                        $ele.closest('tr.row, div.demo').addClass(classes);
                    });

                    // save discount code
                    const $as = $('a[data-clipboard-text]:has(img.cp)');
                    const codes = {};

                    $as.eachAsync(ele => {
                        const site = ele.hostname;
                        const code = ele.dataset.clipboardText.trim();

                        if (site && code.length > 0 && !has.call(codes, site)) codes[site] = code;
                    }, () => {
                        GM_setValue('SWSE_discount_code', JSON.stringify(codes));
                    });

                    // insert percentage off
                    GM_addStyle(`
                    td[data-discount-text] {
                        position: relative;
                        padding-right: 65px !important;
                    }
                    td[data-discount-text]::after {
                        content: attr(data-discount-text);
                        position: absolute;
                        top: 8px;
                        right: 10px;
                    }
                `);

                    $('.menuSyncLibrary').before(`<li class="menuFilterDiscount"><a>${i18n.get('menuFilterDiscount')}<ul><li><label>${i18n.get('menuFilterDiscountLoading')}</label></li></ul></a></li>`);
                    $('.dataTable').css('width', '1280px');

                    forEachAsync($('#tables tbody tr').get(), tr => {
                        const price = parseFloat(tr.children[2].textContent);
                        const retail = parseFloat(tr.children[7].textContent);
                        let range = -1;

                        if (price > 0 && retail > 0) {
                            const discount = Math.min(100 - Math.round(price / retail * 100), 99);

                            tr.children[1].setAttribute('data-discount-text', `${discount}% off`);
                            if (discount >= 0) range = `00${discount}`.slice(-2).slice(0, 1);
                        }

                        tr.setAttribute('data-discount-range', range);
                    }, () => {
                        // finished inserting disocunts then append filter panel
                        const $ul = $('.menuFilterDiscount ul');

                        $ul.empty();

                        for (let i = -1; i < 10; i += 1) {
                            const text = i === -1 ? '~ - 0% off' : `${i * 10}% - ${(i + 1) * 10}% off`;
                            const $option = $(`<li><label><input type="checkbox" checked><span> ${text}</span></label></li>`);

                            $option.find('input').change(e => {
                                $('body').toggleClass(`hideDiscountRange_${i}`, !e.currentTarget.checked);
                            });
                            $ul.append($option);
                        }
                    });
                    break;
                }
            case 'steamkeyswhosales.com':
            case 'alfakeys.ru':
            case 'ign.akens.ru':
            case 'bestkey.akens.ru':
            case 'goldkeys.akens.ru':
            case 'domenkeys.akens.ru':
            case 'cada.akens.ru':
                check('div[title*="steam"]', ($ele, classes) => {
                    $ele.closest('tr').addClass(classes);
                });
                break;
            case 'keymarket.pw':
                check('div[style*="steam/apps/"]', ($ele, classes) => {
                    $ele.nextAll().addClass(classes);
                    $ele.parent().parent().addClass(classes);
                });
                break;
            case 'steamkey.lequeshop.ru':
                check('img[src*="steam/apps/"]', ($ele, classes) => {
                    $ele.next().addClass(classes);
                    $ele.parent().addClass(classes);
                });
                break;
            case 'cheap-steam-games.ru':
                check('img[src*="steam/apps/"]', ($ele, classes) => {
                    $ele.closest('.hero-feature').addClass(classes);
                    $ele.parent().next().addClass(classes);
                });
                break;
            case 'cheapkey.lequeshop.ru':
                check('div[style*="steam/apps/"]', ($ele, classes) => {
                    $ele.parent().addClass(classes);
                });
                break;
            case 'steamfarmkey.ru':
            case 'kartonanet.lequeshop.ru':
            case 'lastkey.ru':
            case 'rig4all.lequeshop.ru':
            case 'steamkeys-shop.ru':
            case 'farmacc.ru':
            case 'steamfarm.lequestore.ru':
            case 'proxzy.lequestore.ru':
            case 'maxfarmshop.ru':
            case 'bestkeystore.ru':
            case 'keys.farm':
            case 'bestfarmkey.lequestore.ru':
            case 'm-b-shop.leque.shop':
            case 'indiegamekeys.lequestore.ru':
            case '200plus.lequeshop.ru':
            case 'farmkeys.ru':
            case 'baty131shop.lequestore.ru':
            case 'baty131shop.lequeshop.ru':
            case '200plus.lequestore.ru':
            case 'azimut-steam.leque.shop':
            case 'imperiumkey.com':
            case 'alonekey.net':
            case 'keys.lequestore.ru':
            case 'jplay.lequeshop.ru':
            case 'gamesforfarm.lequeshop.com':
            case 'bestgames.lequeshop.com':
            case 'bobkeys.lequeshop.ru':
                check('img[src*="steam"]', ($ele, classes) => {
                    $ele.closest('tr').addClass(classes);
                });
                break;
            case 'keyssell.ru':
            case 'steam-tab.ru':
            case 'steamd.lequeshop.ru':
            case 'steam1.ru':
            case 'steamkeystore.ru':
            case 'steam1.lequeshop.ru':
            case 'steamrandomkeys.ru':
            case 'sovkey-farm.ru':
                check('a > img[src*="steam/apps/"]', ($ele, classes) => {
                    $ele.closest('.item-loop').addClass(classes);
                    $ele.closest('div').prev().addClass(classes);
                });
                check('.item-poster > img[src*="steam/apps/"]', ($ele, classes) => {
                    $ele.parent().addClass(classes);
                    $ele.prev().prev().addClass(classes);
                });
                break;
            case 'reronage.akens.ru':
                check('.good-title > div', ($ele, classes) => {
                    $ele.closest('tr').addClass(classes);
                });
                break;
            case 'animekeys.ru':
                check('img[src*="steam"]', ($ele, classes) => {
                    $ele.closest('.panel').addClass(classes);
                });
                break;
            case 'steam-discount.ru':
                check('img[src*="steam"]', ($ele, classes) => {
                    $ele.closest('div.item-loop').addClass(classes);
                });
                break;
            case 'tkfg.ru':
                check('a > img[src*="steam"]', ($ele, classes) => {
                    $ele.closest('.list-item').addClass(classes);
                });
                break;
            case 'randomkey.ru':
                $('#header').css('position', 'initial');
                check('a > img[src*="steam"]', ($ele, classes) => {
                    $ele.parent().prev('.title').find('p').addClass(classes);
                    $ele.closest('.b-poster').addClass(classes);
                });
                break;
            case 'wlutmarket.lequeshop.ru':
                check('img[src*="steam"]', ($ele, classes) => {
                    $ele.closest('div.short').addClass(classes);
                });
                break;
            case 'cheapkeys.akens.ru':
                check('a[href*=steampowered]', ($ele, classes) => {
                    $ele.closest('div.good').addClass(classes);
                });
                break;
            case 'steamground.com':
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://www.steamgifts.com/discussion/iy081/steamground-wholesale-build-a-bundle',
                    onload: res => {
                        if (res.status !== 200) return;

                        const $games = $('<div/>', {
                            html: res.response
                        }).find('.comment__description:first table a[href*="steampowered"]');
                        const $titles = $('.wholesale-card_title');
                        const hrefs = {};
                        const process = t => {
                            let tx = t.trim();

                            if (tx === 'Ball of Light (Journey)') tx = 'Ball of Light';
                            if (tx === 'Shake Your Money Simulator') tx = 'Shake Your Money Simulator 2016';

                            return tx.toLowerCase().replace(/[\W]/g, '');
                        };

                        $games.each((index, element) => {
                            hrefs[process(element.textContent)] = element.href;
                        });
                        $titles.each((index, element) => {
                            const $ele = $(element);
                            const href = hrefs[process($ele.text())] || '';

                            if (href.length > 0) $ele.parent().attr('href', href);
                        });

                        check('.wholesale-card > a[href*="steampowered"]', (element, classes) => {
                            $(element).parent().addClass(classes);
                            $(element).children().eq(1).css('color', 'black');
                        });
                    }
                });
                break;
            default:
        }
    }
};
const init = () => {
    // on WebMoney payment page (new)
    if (location.hostname === 'wallet.web.money') {
        if (location.pathname === '/finances' && location.search.length > 0) {
            try {
                const search = location.href.split('?').pop();
                const data = JSON.parse(decodeURIComponent(search));

                if (data.swse) {
                    const observer = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            Array.from(mutation.addedNodes).forEach(addedNode => {
                                if (addedNode.nodeType === 1) {
                                    const $addedNode = $(addedNode);

                                    if ($addedNode.find('img[src*="to-wm-purse.png"]').length > 0) $addedNode.click();
                                    if ($addedNode.prop('tagName') === 'FORM' && $addedNode.attr('kz-root') === 'transfer') {
                                        const $receiver = $addedNode.find('[name="receiver"] input');
                                        const $amount = $addedNode.find('input[name="amount"]');
                                        const $currency = $amount.next('select');
                                        const $description = $addedNode.find('textarea[name="description"]');

                                        $receiver.val(data.purse);
                                        $amount.val(data.amount);
                                        $currency.val(data.currency);
                                        $description.val(data.desc);
                                        unsafeWindow.angular.element($receiver).triggerHandler('input');
                                        unsafeWindow.angular.element($amount).triggerHandler('input');
                                        unsafeWindow.angular.element($currency).triggerHandler('change');
                                        unsafeWindow.angular.element($description).triggerHandler('input');
                                        sessionStorage.setItem('paidWM', 1);
                                    }
                                    if (sessionStorage.getItem('paidWM') && $addedNode.prop('tagName') === 'OPERATION-BLOCK') window.close();
                                }
                            });
                        });
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            } catch (err) {
                throw err;
            }
        }
        // on WebMoney payment page (old)
    } else if (location.hostname === 'mini.wmtransfer.com') {
        if (location.href.includes('purses-view-history') && sessionStorage.getItem('paidWM')) window.close();
        if (location.pathname === '/SendWebMoney.aspx' && location.search.length > 0) {
            try {
                const search = location.href.split('?').pop();
                const data = JSON.parse(decodeURIComponent(search));

                if (data.swse) {
                    $('#ctl00_cph_tbEmailOrPurseNumber').val(data.purse);
                    $('#ctl00_cph_tbDesc').val(data.desc);
                    $('#ctl00_cph_tbAmount').val(data.amount);

                    sessionStorage.setItem('paidWM', 1);
                }
            } catch (err) {
                throw err;
            }
        }
        // on Qiwi payment page
    } else if (location.hostname === 'qiwi.com') {
        if (location.pathname === '/payment/form/99' && location.search.length > 0) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        const className = addedNode.nodeType === 1 ? addedNode.getAttribute('class') || '' : '';

                        if (className.includes('center-loader-self')) {
                            try {
                                const search = location.href.split('?').pop();
                                const data = JSON.parse(decodeURIComponent(search));
                                const $divs = $('#app form > div');

                                if (data.swse) {
                                    $divs.eq(1).find('input').each((i, input) => {
                                        input.value = `+${data.purse}`;
                                        input._valueTracker.setValue('+'); // hack React16

                                        input.dispatchEvent(new Event('input', { bubbles: true }));
                                    });
                                    $divs.eq(2).find('textarea').each((i, textarea) => {
                                        textarea.value = data.desc;
                                        textarea._valueTracker.setValue(''); // hack React16

                                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                    });
                                    $divs.eq(3).find('input').each((i, input) => {
                                        input.value = data.amount;
                                        input._valueTracker.setValue(''); // hack React16

                                        input.dispatchEvent(new Event('input', { bubbles: true }));
                                    });

                                    $divs.find('.text-area-form-field-title-text-160, .mask-text-input-form-field-title-text-131').css({
                                        top: 0,
                                        'font-size': '13px'
                                    });

                                    sessionStorage.setItem('paidQiwi', 1);
                                }
                            } catch (err) {
                                throw err;
                            }
                        }

                        // close window on successful payment
                        if ($('div[class^="block-content-icon"] > svg[fill="#55D467"]').length > 0) window.close();
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        // wholesale sites
    } else {
        config.init();
        i18n.init();

        // sync owned every 10 min
        const syncTimer = 10 * 60 * 1000;
        if (!owned.lastSync || owned.lastSync < Date.now() - syncTimer) syncLibrary();

        headerMenu();
        handler();
    }
};

$(init);