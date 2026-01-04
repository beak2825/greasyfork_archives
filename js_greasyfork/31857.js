// ==UserScript==
// @name         Currency Converter
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  try to take over the world!
// @icon         http://store.steampowered.com/favicon.ico
// @author       Bisumaruko
// @include      http*://yuplay.ru/*
// @include      http*://*.gamersgate.com/*
// @include      http*://www.greenmangaming.com/*
// @include      http*://gama-gama.ru/*
// @include      http*://*.gamesplanet.com/*
// @include      http*://www.cdkeys.com/*
// @include      http*://directg.net/*
// @include      http*://www.humblebundle.com/*
// @include      http*://www.indiegala.com/*
// @include      http*://www.bundlestars.com/*
// @include      http*://www.opiumpulses.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.6.6/sweetalert2.min.js
// @resource     SweetAlert2CSS https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/6.6.6/sweetalert2.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-start
// @connect      www.ecb.europa.eu
// @downloadURL https://update.greasyfork.org/scripts/31857/Currency%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/31857/Currency%20Converter.meta.js
// ==/UserScript==

/* global swal, games */

// inject swal css
GM_addStyle(
    GM_getResourceText('SweetAlert2CSS'),
);

// setup swal
swal.setDefaults({
    timer: 3000,
    useRejections: false,
});

// load config
const config = JSON.parse(
    GM_getValue('Bisko_CC', '{}'),
);
const interval = 3 * 60 * 60 * 1000; // update exchange rate every 3 hours
const currencies = {
    ORI: {
        nameEN: '',
        nameZH: '恢復',
        symbol: '',
    },
    AUD: {
        nameEN: 'Australian Dollar',
        nameZH: '澳幣',
        symbol: 'AU$',
    },
    CAD: {
        nameEN: 'Canadian Dollar',
        nameZH: '加幣',
        symbol: 'CA$',
    },
    CNY: {
        nameEN: 'Chinese Yuan',
        nameZH: '人民幣',
        symbol: 'CN¥',
    },
    EUR: {
        nameEN: 'Euro',
        nameZH: '歐元',
        symbol: '€',
    },
    GBP: {
        nameEN: 'Great Britain Pound',
        nameZH: '英鎊',
        symbol: '£',
    },
    HKD: {
        nameEN: 'Hong Kong Dollar',
        nameZH: '港幣',
        symbol: 'HK$',
    },
    JPY: {
        nameEN: 'Japanese Yen',
        nameZH: '日圓',
        symbol: 'JP¥',
    },
    KRW: {
        nameEN: 'South Korean Won',
        nameZH: '韓圓',
        symbol: '₩',
    },
    MYR: {
        nameEN: 'Malaysian Ringgit',
        nameZH: '令吉',
        symbol: 'RM',
    },
    NTD: {
        nameEN: 'New Taiwan Dollar',
        nameZH: '台幣',
        symbol: 'NT$',
    },
    NZD: {
        nameEN: 'New Zealand Dollar',
        nameZH: '紐幣',
        symbol: 'NZ$',
    },
    RUB: {
        nameEN: 'Russian Ruble',
        nameZH: '盧布',
        symbol: 'руб',
    },
    USD: {
        nameEN: 'United States Dollar',
        nameZH: '美元',
        symbol: 'US$',
    },
};

let originalCurrency = 'USD';

// jQuery extension
$.fn.price = function price() {
    return this.eq(0).text().replace(/[^.0-9]/g, '');
};

$.fn.bindPriceData = function bindPriceData() {
    return this.each((index, element) => {
        const $ele = $(element);

        $ele
            .addClass('CCPrice')
            .attr('data-CCPrice', JSON.stringify({
                currency: originalCurrency,
                price: $ele.text().replace(/[^.0-9]/g, ''),
            }));
    });
};

// constructing functions
const has = Object.prototype.hasOwnProperty;
const preferredCurrency = () => (has.call(config.exchangeRate.rates, config.preferredCurrency) ? config.preferredCurrency : 'CNY'); // default to CNY
const updateCurrency = (currency = null) => {
    let targetCurrency = currency || preferredCurrency();

    $('.CCPrice').each((index, element) => {
        const $ele = $(element);
        const data = JSON.parse(
            $ele.attr('data-CCPrice'),
        );

        let convertedPrice = 0;

        if (targetCurrency === 'ORI') {
            targetCurrency = data.currency;
            convertedPrice = data.price;
        } else {
            const rates = config.exchangeRate.rates;

            convertedPrice = data.price * (rates[targetCurrency] / rates[data.currency]);
        }

        $ele.text(
            convertedPrice
                .toLocaleString('en', {
                    style: 'currency',
                    currency: targetCurrency,
                    maximumFractionDigits: 2,
                })
                .replace('MYR', currencies.MYR.symbol)
                .replace('NTD', currencies.NTD.symbol),
        );
    });
};
const constructMenu = () => {
    const $li = $('<li class="Bisko_CC_Menu"><a>Currencies</a></li>');
    const $ul = $('<ul></ul>').appendTo($li);
    const preferred = preferredCurrency();

    GM_addStyle(`
        .Bisko_CC_Menu ul {
            display: none;
            position: absolute;
            padding: 0;
            background-color: #272727;
            z-index: 9999;
        }
        .Bisko_CC_Menu:hover ul { display: block; }
        .Bisko_CC_Menu li { padding: 2px 10px; list-style-type: none; cursor: pointer; }
        .Bisko_CC_Menu li:hover, .preferred { background-color: SandyBrown; }
    `);

    Object.keys(currencies).forEach((currency) => {
        const itemName = `${currency} ${currencies[currency].nameZH}`;

        $ul.append(
            $(`<li class="${currency}">${itemName}</li>`)
                .addClass(() => (preferred === currency ? 'preferred' : ''))
                .click(() => {
                    config.preferredCurrency = currency;

                    GM_setValue('Bisko_CC', JSON.stringify(config));
                    updateCurrency(currency);

                    $('.Bisko_CC_Menu .preferred').removeClass('preferred');
                    $(`.Bisko_CC_Menu .${currency}`).addClass('preferred');
                }),
        );
    });

    return $li;
};
const handler = () => {
    switch (location.host) {
        case 'yuplay.ru':
            originalCurrency = 'RUB';

            GM_addStyle(`
                .games-pricedown span.CCPrice { font-size: 18px; }
                .good-title span.CCPrice { margin-right: 3px; font-size: 22px; }
            `);

            $('.header-right').append(
                constructMenu(),
            );
            // homepage games-pricedown
            $('.games-pricedown .sale > s, .games-pricedown .price').bindPriceData();
            // homepage game box & product page
            $('.games-box .price, .good-title .price')
                .contents()
                .each((index, node) => {
                    const $node = $(node);
                    const text = $node.text().trim();

                    if (node.tagName === 'S') $node.bindPriceData(); // retail price
                    if (node.tagName === 'SPAN') $node.remove(); // currency
                    else if (node.nodeType === 3 && text.length > 0) { // sales price
                        $node.replaceWith(
                            $(`<span>${text}<span>`).bindPriceData(),
                        );
                    }
                });
            break;
        case 'gama-gama.ru':
            originalCurrency = 'RUB';

            GM_addStyle(`
                .Bisko_CC_Menu > a, .Bisko_CC_Menu li { color: white; }
                .Bisko_CC_Menu ul { margin: 0; }
            `);

            $('#top_back').append(
                constructMenu()
                    .wrapInner('<div class="Bisko_CC_Menu top_menu"></div>')
                    .children()
                    .unwrap(),
            );
            // homepage
            $('.price_1, .old_price, .promo_price').bindPriceData();
            // product page
            $('.card-info-oldprice > span, .card-info-price > span').bindPriceData();
            $('.card-info-oldprice, .card-info-price')
                .contents()
                .filter((i, node) => node.nodeType !== 1)
                .remove();
            break;
        case 'ru.gamersgate.com':
        case 'cn.gamersgate.com':
            if (location.host.startsWith('ru')) originalCurrency = 'RUB';
            if (location.host.startsWith('cn')) originalCurrency = 'CNY';

            GM_addStyle(`
                .Bisko_CC_Menu { width: 49px; text-align: center; }
                .Bisko_CC_Menu svg {
                    width: 36px;
                    height: 36px;
                    background-color: #093745;
                    border: 1px solid #2c7c92;
                }
                .Bisko_CC_Menu, .Bisko_CC_Menu li { background-image: none !important; color: white; }
                .Bisko_CC_Menu li {
                    height: initial !important;
                    float: none !important;
                    padding: 5px 10px !important;
                }
                .Bisko_CC_Menu li:hover, .preferred { background-color: SandyBrown !important; }
            `);

            $('.btn_menuseparator').replaceWith(
                constructMenu(),
            );
            $('.Bisko_CC_Menu a').replaceWith(`
                <svg viewBox="0 0 24 24">
                    <path fill="#a9ebea" d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z" />
                </svg>
            `);
            // homepage & product page
            $(`
                .prtag > span,
                .grid-old-price,
                .price_price > span,
                div > span > .bold.white,
                li > .f_right:nth-child(2) > span
            `).bindPriceData();
            break;
        case 'www.greenmangaming.com':
            GM_addStyle(`
                .Bisko_CC_Menu > a {
                    margin: 0 !important;
                    padding: 6px 15px !important;
                    font-size: 14px;
                }
                .Bisko_CC_Menu > a:hover, .Bisko_CC_Menu li:hover, .preferred { background-color: #494a4f !important; }
            `);

            $('.megamenu').append(
                constructMenu(),
            );

            try {
                // product page
                originalCurrency = games.Currency;
                $('price > span').bindPriceData();
            } catch (e) {
                // home page & search page
                const currencyObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((addedNode) => {
                            if (addedNode.tagName === 'SCRIPT' && addedNode.src.includes('bam.nr-data.net')) {
                                const currency = decodeURI(addedNode.src).split('currency_code":"').pop().slice(0, 3);

                                if (currency.length > 0) {
                                    originalCurrency = currency;

                                    const $prices = $('.prices > span, .prices > p, .listing-price > span');
                                    // offset decimal place in Europe (. ,)
                                    if (['EUR', 'RUB'].includes(currency)) $prices.text((i, text) => text.replace(',', '.'));

                                    $prices.bindPriceData();
                                    updateCurrency();
                                }

                                currencyObserver.disconnect();
                            }
                        });
                    });
                });

                currencyObserver.observe(document.head, { childList: true });

                // search listing
                const $listing = $('.table-search-listings');

                if ($listing.length > 0) {
                    new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((addedNode) => {
                                $(addedNode).find('.listing-price > span').bindPriceData();
                                updateCurrency();
                            });
                        });
                    }).observe($listing[0], { childList: true });
                }
            }
            break;
        case 'uk.gamesplanet.com':
        case 'de.gamesplanet.com':
        case 'fr.gamesplanet.com': {
            originalCurrency = !location.host.startsWith('uk') ? 'EUR' : 'GBP';

            const GPHandler = () => {
                const $prices = $('.price_base > strike, .price_current');

                $('.container > ul').append(
                    constructMenu(),
                );
                // offset decimal place in Europe (. ,)
                if (!location.host.startsWith('uk')) {
                    $prices.text((i, text) => text.replace(',', '.'));
                }

                $prices.bindPriceData();
                updateCurrency();
            };

            GPHandler(true);

            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((removedNode) => {
                        if (removedNode.id === 'nprogress') GPHandler();
                    });
                });
            }).observe(document, {
                childList: true,
                subtree: true,
            });
            break;
        }
        case 'www.cdkeys.com': {
            originalCurrency = $('.currency-switcher:first-child .value').text();
            const currenciesDefault = ['AUD', 'CAD', 'EUR', 'GBP', 'JPY', 'NZD', 'USD'];
            const currenciesAppend = ['CNY', 'HKD', 'KRW', 'MYR', 'NTD', 'RUB'];
            // bind event to default currency switcher to save preferrred currency
            $('.currency-switcher:first-child ul span').each((index, element) => {
                const $ele = $(element);
                const currency = $ele.text().slice(0, 3);

                if (currenciesDefault.includes(currency)) {
                    $ele.parent().click(() => {
                        config.preferredCurrency = currency;

                        GM_setValue('Bisko_CC', JSON.stringify(config));
                    });
                }
            });
            // append currencies not in the default currency switcher
            currenciesAppend.forEach((currency) => {
                $('.currency-switcher:first-child ul').append(
                    $(`<li><a>${currency} - ${currencies[currency].nameEN}</a></li>`).click(() => {
                        config.preferredCurrency = currency;

                        GM_setValue('Bisko_CC', JSON.stringify(config));
                        updateCurrency(currency);
                    }),
                );
            });

            $('.price').bindPriceData();
            break;
        }
        case 'directg.net':
            originalCurrency = 'KRW';

            GM_addStyle(`
                .Bisko_CC_Menu ul {
                    width: 180px;
                    border-top: 3px solid #67c1f5;
                    background-color: #1b2838 !important;
                    opacity: 0.95;
                    color: rgba(255,255,255,0.5) !important;
                }
                .Bisko_CC_Menu ul li { padding: 10px 30px; font-weight: bold; }
                .Bisko_CC_Menu ul li:hover, .preferred { background-color: initial !important; color: white; }
            `);

            $('.nav').append(
                constructMenu(),
            );
            $('span.PricebasePrice, span.PricesalesPrice')
                .bindPriceData()
                .next('span[itemprop="priceCurrency"]')
                .remove();
            break;/*
        case 'www.origin.com': {
            const region = location.pathname.split('/')[1];
            const currencyRegion = {
                twn: 'NTD',
                jpn: 'JPY',
                rus: 'RUB',
                usa: 'USD',
                nzl: 'NZD',
                irl: 'EUR',
                kor: 'KRW',
            };
        }*/
        case 'www.humblebundle.com':
            originalCurrency = 'USD';

            GM_addStyle(`
                .Bisko_CC_Menu { float: left; }
                .Bisko_CC_Menu > a { display: block; padding: 15px 20px; }
                .Bisko_CC_Menu ul { background-color: #494f5c !important; color: rgba(255, 255, 255, 0.6); }
                .Bisko_CC_Menu ul li { padding: 5px 10px; }
                .Bisko_CC_Menu ul li:hover, .preferred { background-color: initial !important; color: white; }
            `);

            $('.nav:first-child').append(
                constructMenu(),
            );

            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((removedNode) => {
                        if (removedNode.data === 'The Humble Store: Loading') {
                            $('.price, .store-price, .full-price, .current-price').bindPriceData();
                            updateCurrency();
                        }
                    });
                });
            }).observe(document.head, {
                childList: true,
                subtree: true,
            });
            break;
        case 'www.indiegala.com':
            originalCurrency = 'USD';

            GM_addStyle(`
                .Bisko_CC_Menu ul {
                    transform: translateY(-100%);
                    background-color: #474747 !important;
                    border: 1px solid #272727;
                }
                .Bisko_CC_Menu ul li { padding: 8px 15px; color: #dad6ca; }
                .Bisko_CC_Menu ul li:hover, .preferred { background-color: #2E2E2E !important; color: white; }
            `);

            $('#libdContainer > ul:not(:first-child)').append(
                constructMenu(),
            );
            $('.Bisko_CC_Menu > a').addClass('libd-group-item libd-bounce');
            // homepage & product page
            $('.inner-info, .inner, .price-container')
                .contents()
                .each((index, node) => {
                    const $node = $(node);
                    const text = $node.text().trim();

                    $node.parent().parent().css('overflow', 'hidden');
                    if (node.nodeType === 1 && node.tagName !== 'BR') $node.bindPriceData();
                    else if (node.nodeType === 3 && text.length) {
                        $node.replaceWith(
                            $(`<a>${text}</a>`).bindPriceData(),
                        );
                    }
                });
            // search result
            $('.price-cont').bindPriceData();
            break;
        case 'www.bundlestars.com':
            originalCurrency = 'USD';

            GM_addStyle(`
                .Bisko_CC_Menu ul { background-color: #212121 !important; }
                .Bisko_CC_Menu ul li { padding: 8px 15px; }
                .Bisko_CC_Menu ul li:hover, .preferred { background-color: #1A1A1A !important; }
            `);

            $('.nav').eq(0).append(
                constructMenu(),
            );
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((removedNode) => {
                        if (removedNode.id === 'loading-bar-spinner') {
                            $('.bs-price, .bs-currency-discount > span, .bs-currency-price').bindPriceData();
                            $('.bs-card-meta > .bs-pricing, .bs-card-meta > .bs-currency-discount').css({
                                position: 'absolute',
                                right: '19px',
                            });
                            updateCurrency();
                        }
                    });
                });
            }).observe(document.body, { childList: true });
            break;
        case 'www.opiumpulses.com':
            originalCurrency = 'USD';

            GM_addStyle(`
                .Bisko_CC_Menu {
                    float: right;
                    margin-top: 5px;
                    padding: 1px 5px;
                    vertical-align: middle;
                    background-image: linear-gradient(#4E4E4E, #101112 40%, #191b1d);
                    font-size: 12px;
                    line-height: 1.5;
                    border-radius: 3px;
                    border-bottom-right-radius: 0;
                    border-top-right-radius: 0;
                }
                .Bisko_CC_Menu > a { color: #f89406; }
            `);

            $('.top-bar > .container > form').after(
                constructMenu()
                    .wrapInner('<div class="Bisko_CC_Menu top_menu"></div>')
                    .children()
                    .unwrap(),
            );
            // homepage
            $('.album__container p > span:first-of-type').bindPriceData();
            // store page
            $('.product-box s, .product-box .text-danger').bindPriceData();
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((addedNode) => {
                        if (addedNode.id === 'productlistview') {
                            $(addedNode).find('.product-box s, .product-box .text-danger').bindPriceData();
                            updateCurrency();
                        }
                    });
                });
            }).observe(document.body, {
                childList: true,
                subtree: true,
            });
            break;
        default:
    }
    // only update prices when appended currencies are selected
    if (originalCurrency !== preferredCurrency()) updateCurrency();
};
const getExchangeRate = () => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
        onload: (res) => {
            if (res.status === 200) {
                try {
                    config.exchangeRate = {
                        lastUpdate: Date.now(),
                        rates: {},
                    };

                    res.response.split("\n").forEach((line) => {
                        if (line.includes('currency=')) {
                            const currency = line.split('currency=\'').pop().slice(0, 3);
                            const rate = line.trim().split('rate=\'').pop().slice(0, -3);

                            config.exchangeRate.rates[currency] = parseFloat(rate);
                        }
                    });
                    config.exchangeRate.rates.EUR = 1;

                    // get NTD
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://www.google.com/search?q=1+EUR+%3D+NTD',
                        onload: (searchRes) => {
                            const rate = parseFloat(searchRes.response.split('<div class="vk_ans vk_bk">').pop().slice(0, 7).trim());
                            const NTDRate = isNaN(rate) ? config.exchangeRate.rates.HKD * 3.75 : rate;

                            config.exchangeRate.rates.NTD = NTDRate;
                            GM_setValue('Bisko_CC', JSON.stringify(config));
                        },
                        onerror: () => {
                            config.exchangeRate.rates.NTD = config.exchangeRate.rates.HKD * 3.75;
                        },
                    });

                    handler();
                } catch (e) {
                    swal(
                        'Parsing Failed',
                        'An error occured when parsing exchange rate data, please reload to try again',
                        'error',
                    );
                }
            } else {
                swal(
                    'Loading Failed',
                    'Unable to fetch exchange rate data, please reload to try again',
                    'error',
                );
            }
        },
    });
};

$(() => {
    if (Object.keys(config).length === 0) getExchangeRate(); // first installed
    else if (Date.now() - interval > config.lastUpdate) getExchangeRate(); // update exchange rate
    else handler();
});
