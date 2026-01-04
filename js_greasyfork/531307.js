// ==UserScript==
// @name            Steam Trading Cards Bulk Buyer (Enhanced)
// @version         1.0.1
// @description     A free userscript to purchase remaining cards needed for a desired level badge in bulk
//
// @copyright       2025 - HoangVN
// @copyright       Contains parts of the Steam-TradingCardsBulkBuyerMAX script © 2018 Zhiletka
// @copyright       Contains parts of the Steam Trading Cards Bulk Buyer script © 2013 - 2015 Dr. McKay
// @license         MIT
//
// @icon            https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/steam-icon.png
//
// @match           *://steamcommunity.com/*/gamecards/*
// @require         https://code.jquery.com/jquery-3.7.1.min.js
// @grant           GM_info
// @namespace https://greasyfork.org/users/1438931
// @downloadURL https://update.greasyfork.org/scripts/531307/Steam%20Trading%20Cards%20Bulk%20Buyer%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531307/Steam%20Trading%20Cards%20Bulk%20Buyer%20%28Enhanced%29.meta.js
// ==/UserScript==

$.ajaxSetup({
    cache: false,
    xhrFields: {
        withCredentials: true
    }
});

const CONFIG = {
    debugMode: false,
    logLevel: {
        ERROR: 0,
        INFO: 1
    },
    now: Date.now(),
    statusSeparator: " - ",
    sessionID: null,
    name: GM_info.script.name + " - v" + GM_info.script.version,
    currency: {
        id: 1,
        prefix: "",
        suffix: "",
        separator: "."
    },
    historyRangeDays: 7,
    badge: {
        level: 0,
        maxLevel: 5,
        showedLevel: 0,
        isFoil: false,
        isSale: false,
        saleIds: [2861720] // Winter Sale 2024
    },
    messages: {
        error: {
            cannot_buy: 'Cannot buy now (No sellers or card has expired)',
            no_listings: 'There are no listings for this item',
            not_logged_in: 'Not logged in',
            get_histogram: 'Failed to get item orders histogram',
            get_price_history: 'Failed to get item price history',
            get_buy_order_status: 'Cannot get buy order status',
            no_available: 'No longer available',
        },
        status: {
            placing_order: 'Placing buy order...',
            loading: 'Loading...',
            purchased: 'Purchased',
            placed: 'Order placed',
            checking: 'Checking order status...',
            canceling: 'Canceling active order...'
        }
    },
    colors: {
        success: 'LimeGreen',
        error: 'FireBrick',
        progress: 'Gold'
    },
    urls: {
        createBuyOrder: 'https://steamcommunity.com/market/createbuyorder/',
        cancelOrder: '/market/cancelbuyorder/',
        orderStatus: '/market/getbuyorderstatus',
        priceHistory: '/market/pricehistory',
        itemOrdersHistogram: '/market/itemordershistogram',
        marketListings: 'https://steamcommunity.com/market/listings/753/'
    },
    panel: null
};

$(document).ready(function() {
    // Ensure that the page is loaded in HTTPS
    if (document.location.protocol != 'https:') {
        let badgePageUrl = window.location.href;
        window.location.href = badgePageUrl.replace('http://', 'https://');
    }
});

if ($('.badge_card_set_card').length && $('.badge_info').length) {
    // Get current badge level
    if ($('.badge_info_unlocked').length) {
        CONFIG.badge.level = parseInt($('meta[property="og:description"]').attr('content').match(/\d+/), 10);
    }

    // Set max level to 1 for a Foil badge
    if (document.documentURI.includes('border=1')) {
        CONFIG.badge.maxLevel = 1;
        CONFIG.badge.isFoil = true;
    }

    // Detect Steam Sale badge
    let appId = document.documentURI.match(/gamecards\/(\d+)/)[1];
    if(CONFIG.badge.saleIds.includes(parseInt(appId)) ||
        // Fallback for future sales,
        // In case the app id of the new sale badge has not been updated
        $('.badge_title').text().match(/\s*(Winter|Summer) Sale \d+ Badge\s*/) ||
        $('.badge_title').text().match(/\s*(Winter|Summer) Sale \d+ Foil Badge\s*/)) {
        CONFIG.badge.maxLevel = CONFIG.badge.level + 1;
        CONFIG.badge.isSale = true;
    }

    $('.badge_detail_tasks:first').append('<div style="margin: 10px"><div id="bb_panel" style="visibility: hidden; margin-top: 5px"/></div>');
    CONFIG.panel = $('#bb_panel');
    CONFIG.badge.showedLevel = CONFIG.badge.maxLevel;
    updatePrices();

    // We have to do this visibility/display thing in order for offsetWidth to work
    CONFIG.panel.css({display: 'none', visibility: 'visible'}).show('blind');
}

function _bottomLayout(w) {
    let _total_label = `<br/><b>
        <span style="display: inline-block; width:${w}px;padding-right: 10px; text-align: right">TOTAL</span>
        <span id="bb_totalprice"></span>
        <span id="bb_old_totalprice" style="padding-left: 10px;"></span></b><br/>`;
    let _history_slider = `<span id="bb_historyrange">
        <span style="padding-left: 30px; padding-right: 10px">History analyze range</span>
        <input type="range" id="bb_rangeslider" style="vertical-align: middle; width: 30%"/>
        <span id="bb_slidervalue" style="padding-left: 10px"/></span><br/>`;

    let _place_orders = `<br/><button type="button" id="bb_placeorders" class="btn_green_white_innerfade btn_medium_wide"
            style="padding: 10px 20px">
        PLACE ORDERS</button><br/></div>`;

    let _buy_now = `<div id="bb_controls"><br/>
        <label><input type="checkbox" id="bb_changemode" style="margin-left: 0;
            margin-right: 10px; vertical-align: middle; position: relative; top: -1px"/>BUY NOW</label>`;

    return _total_label + _buy_now + _history_slider + _place_orders;
}

function _chooseMaxLevel(level) {
    CONFIG.badge.showedLevel = level;
    return `<div class="bb_next_lvl" style="margin-bottom: 5px;">
           <span style="padding-right: 10px; font-size: 18px">Your max level</span>
           <input id="bb_lvl_box" type="number" min="1" value=${level}
           style="padding-left: 10px; width: 60px; height: 20px; font-size: 18px; width: 6ch;"></div></br>`;
}

function updatePrices() {
    CONFIG.panel.html('');
    let cardElements = $('.badge_card_set_card');
    let cardData = [];

    cardElements.each(function() {
        let card = $(this);
        let cardText = card.find('.badge_card_set_text')[0].textContent;
        let quantity = cardText.match(/\((\d+)\)\r?\n|\r/);
        let cardName = cardText.substring(cardText.indexOf(')') + 1).replace(/\t|\r?\n|\r/g, '');
        quantity = quantity ? parseInt(quantity[1], 10) : 0;
        if (quantity == 0) {
            cardName = cardText.replace(/\t|\r?\n|\r/g, '');
        }
        quantity = (CONFIG.badge.showedLevel - CONFIG.badge.level) - quantity;
        if (quantity < 1) return;
        
        cardData.push({ cardName, quantity });
    });

    if (cardData.length > 0) {
        let title = `<div class="badge_title_rule"></div><div class="badge_title">${CONFIG.name}</div><br/>`;
        CONFIG.panel.append(title);
        CONFIG.panel.append(_chooseMaxLevel(CONFIG.badge.showedLevel));
    }

    cardData.forEach(function(data) {
        let row = $(`<div class="bb_cardrow" style="padding-bottom: 3px; opacity: 0.4"><label>
            <input class="bb_cardcheckbox" type="checkbox" style="margin: 0; vertical-align: bottom; position: relative; top: -1px"
            checked/><span class="bb_cardname" style="padding-right: 10px; text-align: right; display: inline-block; font-weight: bold">
            ${data.cardName} (${data.quantity})</span></label><span class="bb_cardprice" data-name="${data.cardName.replace(/"/g, '&quot;')}"/></div>`);

        CONFIG.panel.append(row);
        row.data('quantity', data.quantity);
        setCardStatus(row, CONFIG.messages.status.loading);

        let appID = document.documentURI.match(/gamecards\/(\d+)/);
        let cardPagePreUrl = CONFIG.urls.marketListings + appID[1] + '-';
        let cardPageUrl1 = cardPagePreUrl + encodeURIComponent(`${data.cardName}`);
        let cardPageUrl2 = cardPagePreUrl + encodeURIComponent(`${data.cardName} (Trading Card)`);

        if(CONFIG.badge.isFoil) {
            cardPageUrl1 = cardPagePreUrl + encodeURIComponent(`${data.cardName} (Foil)`);
            cardPageUrl2 = cardPagePreUrl + encodeURIComponent(`${data.cardName} (Foil Trading Card)`);
        }
        cardPageUrl1 = cardPageUrl1.replace("(", "%28").replace(")", "%29");
        cardPageUrl2 = cardPageUrl2.replace("(", "%28").replace(")", "%29");
        cardPageAjaxRequest([cardPageUrl1, cardPageUrl2]);

        function cardPageAjaxRequest(urls) {
            if (urls.length == 0) {
                setCardStatusError(row, CONFIG.messages.error.no_listings);
                return;
            }
            let url = urls.pop();
            $.get(url).done(function(html) {
                var marketID = html.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\);/);
                var sessionID = html.match(/g_sessionID = "(.+)";/);
                var countryCode = html.match(/g_strCountryCode = "([a-zA-Z0-9]+)";/);
                var currency = html.match(/"wallet_currency":(\d+)/);
                var hashName = html.match(/"market_hash_name":"((?:[^"\\]|\\.)*)"/);
                var oldOrderID = html.match(/CancelMarketBuyOrder\(\D*(\d+)\D*\)/);

                let no_available = html.match(/This item can no longer be bought or sold on the Community Market./);
                if (no_available) {
                    setCardStatusError(row, CONFIG.messages.error.no_available, true);
                    return;
                }

                if (!currency || !countryCode) {
                    setCardStatusError(row, CONFIG.messages.error.not_logged_in);
                    return;
                }

                if (!marketID || !sessionID || !hashName) {
                    LOG(CONFIG.logLevel.ERROR, `Failed to parse url: ${url}`);
                    return cardPageAjaxRequest(urls);
                }
                _insertUrl(row, url);
                CONFIG.currency.id = currency[1];
                CONFIG.sessionID = sessionID[1];

                hashName[1] = decodeURIComponent(JSON.parse('"' + hashName[1] + '"'));
                $.get(CONFIG.urls.itemOrdersHistogram,
                    {"country": countryCode[1], language: 'english', "currency": CONFIG.currency.id, "item_nameid": marketID[1]}).always(function(histogram) {

                    if (!histogram || !histogram.success) {
                        setCardStatusError(row, CONFIG.messages.error.get_histogram);
                        return;
                    }

                    if (histogram.price_prefix) {
                        CONFIG.currency.prefix = histogram.price_prefix;
                    } else {
                        CONFIG.currency.suffix = histogram.price_suffix;
                    }

                    [[histogram.buy_order_graph, histogram.highest_buy_order, histogram.buy_order_summary],
                        [histogram.sell_order_graph, histogram.lowest_sell_order, histogram.sell_order_summary]].forEach(function(array) {
                        if (!array[0].length && array[1]) {
                            let s = new DOMParser().parseFromString(array[2], 'text/html').documentElement.textContent;
                            let p = s.match(/(\d+)\D*([\d.]+)/);
                            array[0].push([Number(p[2]), Number(p[1]), s]);
                        }
                    });

                    $.get(CONFIG.urls.priceHistory, {"appid": 753, "market_hash_name": hashName[1]}).always(function(history) {
                        if (history && history.success && history.prices) {
                            for (let i = 0; i < history.prices.length; i++) {
                                history.prices[i][0] = Date.parse(history.prices[i][0]);
                                history.prices[i][2] = parseInt(history.prices[i][2], 10);
                                history.prices[i][1] *= 100;
                            }
                        }

                        row.data('hashname', hashName[1]);
                        row.data('histogram', histogram);
                        row.data('history', history);

                        var price = getOptimumPrice(histogram, history, data.quantity);
                        row.data('price_total', price[0] * data.quantity);

                        row.data('old_price', 0);

                        if (oldOrderID) {
                            let oldOrderData = _oldOrderData(html, countryCode[1]);
                            row.data('old_orderid', oldOrderID[1]);
                            row.data('old_orderdata', ` <span style="opacity: 0.5"><strike>
                                ${oldOrderData[0]} x ${oldOrderData[1]} (${priceToString(oldOrderData[2])}) ordered</strike></span>`);
                            row.data('old_price', oldOrderData[1]);
                        }

                        setCardStatus(row, priceToString(price[0] * data.quantity - price[1], true) + CONFIG.statusSeparator +
                                price[2] + (row.data('old_orderdata') ? row.data('old_orderdata') : ''));
                        row.css('opacity', 1);

                        row.addClass('ready');

                        if ($('.bb_cardrow:not(.ready)').length === 0) {
                            let w = $('.bb_cardprice:first').offset().left - $('.bb_cardrow:first').offset().left - 10;
                            $('#bb_panel').append(_bottomLayout(w));

                            let t_oldest, t_latest;
                            for (let i = 0, cards = $('.bb_cardrow'); i < cards.length; i++) {
                                let prices = $(cards[i]).data('history').prices;
                                if (prices && prices.length) {
                                    t_oldest = Math.min(prices[0][0], t_oldest || Number.MAX_VALUE);
                                    t_latest = Math.max(prices[prices.length-1][0], t_latest || 0);
                                }
                            }

                            if (t_oldest && t_latest) {
                                t_oldest = Math.round((CONFIG.now - t_oldest) / 86400000);
                                t_latest = Math.round((CONFIG.now - t_latest) / 86400000);
                                CONFIG.historyRangeDays = Math.min(t_oldest, CONFIG.historyRangeDays);

                                $('#bb_slidervalue').text(`${CONFIG.historyRangeDays} days`);
                                $('#bb_rangeslider').prop({min: t_latest, max: t_oldest, value: CONFIG.historyRangeDays});
                                $('#bb_rangeslider').on('input change', function() {
                                    CONFIG.historyRangeDays = $(this).val();
                                    $('#bb_slidervalue').text(`${CONFIG.historyRangeDays} days`);
                                    $('#bb_changemode').change();
                                });
                            } else {
                                $('#bb_historyrange').css('display', 'none');
                            }

                            $('#bb_lvl_box').change(function() {
                                let level = $(this).val();
                                if (CONFIG.isSale) {
                                    if(level <= CONFIG.badge.level) {
                                        $(this).val(CONFIG.badge.maxLevel);
                                        level = CONFIG.badge.maxLevel;
                                    }
                                    CONFIG.badge.maxLevel = level;
                                } else {
                                    if(level < (CONFIG.badge.level + 1) || level > CONFIG.badge.maxLevel) {
                                        $(this).val(CONFIG.badge.maxLevel);
                                        level = CONFIG.badge.maxLevel;
                                    }
                                }
                                CONFIG.badge.showedLevel = level;
                                updatePrices();
                            });

                            $('#bb_changemode').change(function() {
                                var total = 0;
                                var old_total = 0;
                                var fail_count = 0;
                                var skip_count = 0;
                                var card_num = 0;
                                document.getElementById('bb_placeorders').style.visibility = 'visible';

                                for (let i = 0, cards = $('.bb_cardrow'); i < cards.length; i++) {
                                    let card = $(cards[i]);
                                    if (card.hasClass('error')) {
                                        card.removeClass('error');
                                        card.find('.bb_cardcheckbox').prop({checked: true, disabled: false});
                                        if(card.hasClass('skip')) {
                                            card.find('.bb_cardcheckbox').prop({checked: false});
                                        }
                                    }
                                    card_num++;
                                    if (card.hasClass('skip')) {
                                        skip_count++;
                                    }

                                    let quantity = card.data('quantity');
                                    let price = (this.checked ? getImmediatePrice : getOptimumPrice)(card.data('histogram'), card.data('history'), quantity);

                                    if (this.checked && price[2] !== 'OK') {
                                        if (!card.hasClass('skip')) {
                                            setCardStatusError(card, CONFIG.messages.error.cannot_buy);
                                            fail_count++;
                                            continue;
                                        }
                                    }
                                    // Current order is not highest order, increase price
                                    if (price[2] == 'Highest buy order') {
                                        if(card.data('old_price') !== (parseInt(price[0]) / 100).toFixed(2)) {
                                            price[0] += 1;
                                        }
                                    }

                                    card.data('price_total', price[0] * quantity);
                                    let price_info = priceToString(price[0] * quantity - price[1], true) + CONFIG.statusSeparator +
                                                        price[2] + (card.data('old_orderdata') ? card.data('old_orderdata') : '');
                                    setCardStatus(card, price_info);
                                    let new_price = price[0] * quantity - price[1];
                                    let old_price = Number(card.data('old_price')) * quantity;
                                    // same old price, no need to place new order, avoid sending too many requests
                                    if(old_price.toFixed(2) == (parseInt(new_price, 10) / 100).toFixed(2)) {
                                        card.find('.bb_cardcheckbox').prop({checked: false});
                                    } else {
                                        card.find('.bb_cardcheckbox').prop({checked: true});
                                    }

                                    if (card.find('.bb_cardcheckbox').is(':checked')) {
                                        total += new_price;
                                        old_total += old_price;
                                        card.removeClass('skip');
                                        card.css('opacity', 1);
                                    } else {
                                        card.addClass('skip');
                                        card.css('opacity', 0.4);
                                    }
                                }

                                if (fail_count > 0 && (fail_count + skip_count) == card_num) {
                                    document.getElementById('bb_placeorders').style.visibility = 'hidden';
                                }
                                else {
                                    document.getElementById('bb_placeorders').style.visibility = 'visible';
                                }

                                $('#bb_totalprice').text(priceToString(total, true));

                                let new_total = parseInt(total, 10) / 100;
                                let sign = new_total >= old_total ? '+' : '-';
                                let color = new_total > old_total ? CONFIG.colors.error : CONFIG.colors.success;
                                $('#bb_old_totalprice').text(`(${sign}${priceToString(Math.abs(new_total-old_total))})`);
                                $('#bb_old_totalprice').css('color', color);

                                $('#bb_historyrange').css('visibility', this.checked ? 'hidden' : 'visible');
                            });

                            $('#bb_changemode').change();

                            $('#bb_placeorders').click(function() {
                                $('.bb_cardcheckbox').prop('disabled', true);
                                $('#bb_controls').hide();
                                placeBuyOrder();
                            });
                        }
                    });
                });
            }).fail(function(jqXHR) {
                LOG(CONFIG.logLevel.ERROR, `Failed to fetch URL: ${url} - Status: ${jqXHR.status} ${jqXHR.statusText}`);
                setCardStatusError(row, '(' + jqXHR.status + ') ' + jqXHR.statusText);
            });
        }
    });

    let elements = $('.bb_cardname');
    if (elements.length > 0) {
        let largestWidth = Math.max(...elements.map((_, el) => el.offsetWidth).get());
        $('.bb_cardname').css('width', largestWidth + 'px');
    }

    $('.bb_cardcheckbox').change(function() {
        $('#bb_changemode').change();
    });
}

function placeBuyOrder() {
    var card = $('.bb_cardrow:not(.buying,.canceling,.skip,.error)').first();
    if (!card.length) {
        return;
    }

    card = $(card);

    if (card.data('old_orderid')) {
        card.addClass('canceling');
        setCardStatusInProgress(card, CONFIG.messages.status.canceling);

        cancelBuyOrder(card.data('old_orderid'), function() {
            card.removeData('old_orderid');
            card.removeClass('canceling');
            setTimeout(placeBuyOrder, 500);
        });
    } else {
        card.addClass('buying');
        setCardStatusInProgress(card, CONFIG.messages.status.placing_order);

        $.post(CONFIG.urls.createBuyOrder, {
            "sessionid": CONFIG.sessionID,
            "currency": CONFIG.currency.id,
            "appid": 753,
            "market_hash_name": card.data('hashname'),
            "price_total": card.data('price_total'),
            "quantity": card.data('quantity')
        }).done(function(json) {
            if (json.success !== 1) {
                setCardStatusError(card, json.message);
                return;
            }

            card.data('buy_orderid', json.buy_orderid);
            card.data('checks', 0);
            card.data('checks_max', $('#bb_changemode').is(':checked') ? 5 : 2);

            setCardStatusInProgress(card, `${CONFIG.messages.status.checking} ${_showProgress(card.data('checks'), card.data('checks_max'))}`);
            checkOrderStatus(card);
        }).always(function() {
            setTimeout(placeBuyOrder, 500);
        });
    }
}

function checkOrderStatus(card) {
    $.get(CONFIG.urls.orderStatus, {"sessionid": CONFIG.sessionID, "buy_orderid": card.data('buy_orderid')}).always(function(json) {
        if (json && json.success === 1) {
            if (json.quantity_remaining == 0) {
                setCardStatusSuccess(card, CONFIG.messages.status.purchased);
                return;
            } else {
                card.data('checks', card.data('checks') + 1);
                if (card.data('checks') >= card.data('checks_max')) {
                    setCardStatusSuccess(card, CONFIG.messages.status.placed);
                    return;
                }
            }
        }
        else {
            setCardStatusError(card, CONFIG.messages.error.get_buy_order_status, true);
            return;
        }

        setTimeout(function() {
            setCardStatusInProgress(card, `${CONFIG.messages.status.checking} ${_showProgress(card.data('checks'), card.data('checks_max'))}`);
            checkOrderStatus(card);
        }, 500);
    });
}

function cancelBuyOrder(orderid, callback) {
    $.post(CONFIG.urls.cancelOrder, {"sessionid": CONFIG.sessionID, "buy_orderid": orderid}).always(function(json) {
        if (json && json.success === 1) {
            callback(json);
        } else {
            setTimeout(function() {
                cancelBuyOrder(orderid, callback);
            }, 500);
        }
    });
}

function setCardStatus(card, status, type) {
    const colors = {
        error: CONFIG.colors.error,
        success: CONFIG.colors.success,
        progress: CONFIG.colors.progress,
        '': ''
    };

    let color = colors[type || ''];
    let oldStatus = card.find('.bb_cardprice').html();
    let p = oldStatus ? oldStatus.indexOf(CONFIG.statusSeparator) : -1;

    card.find('.bb_cardprice').html(p >= 0 && status.indexOf(CONFIG.statusSeparator) < 0 ?
        oldStatus.substring(0, p + CONFIG.statusSeparator.length) + status : status);
    card.css({ color, opacity: color ? 0.8 : 1 });

    if (type === 'error') {
        card.find('.bb_cardcheckbox').prop({ checked: false, disabled: true });
        if (arguments[3]) card.removeClass();
        card.addClass('error');
    }
}

const setCardStatusError = (card, status, removeClass) => setCardStatus(card, status, 'error', removeClass);
const setCardStatusSuccess = (card, status) => setCardStatus(card, status, 'success');
const setCardStatusInProgress = (card, status) => setCardStatus(card, status, 'progress');

function _oldOrderData(html, country_code) {
    let [_, quantity, price] = html.match(/<span class="market_listing_inline_buyorder_qty">(\d+) @<\/span>\s*(?:[^\d,.]*)([\d,.]+)(?:[^\d,.]*)\s*<\/span>/);
    price = country_code === 'VN' ? price.replace('.', '').replace(',', '.') : price.replace(',', '');
    return [quantity, price, Number(quantity * parseFloat(price))];
}

const _showProgress = (done, total) => ((done/total).toFixed(2) * 100) + "%";

function priceToString(price, cents) {
    if (cents) price = parseInt(price, 10) / 100;
    return CONFIG.currency.prefix +
           price.toFixed(2).replace(".", CONFIG.currency.separator) +
           CONFIG.currency.suffix;
}

function getOptimumPrice(histogram, history, quantity) {
    if (history && history.success && history.prices) {
        if (histogram && histogram.buy_order_graph.length) {
            for (let j = histogram.buy_order_graph.length - 1; j >= 0; j--)
            {
                let price = histogram.buy_order_graph[j][0] * 100;
                let cardsSold = histogram.buy_order_graph[j][1] + quantity;
                for (let i = history.prices.length - 1; i >= 0 && (CONFIG.now - history.prices[i][0]) / 86400000 <= CONFIG.historyRangeDays; i--) {
                    if (history.prices[i][1] <= price && --cardsSold == 0) {
                        return [price, 0, 'Optimum history price'];
                    }
                }
            }
        } else {
            let price;
            for (let i = history.prices.length - 1; i >= 0 && (CONFIG.now - history.prices[i][0]) / 86400000 <= CONFIG.historyRangeDays; i--) {
                price = Math.min(history.prices[i][1], price || Number.MAX_VALUE);
            }
            if (price) {
                return [price, 0, 'Lowest history price'];
            }
        }
    }

    if (histogram) {
        if (histogram.highest_buy_order) {
            return [parseInt(histogram.highest_buy_order, 10), 0, 'Highest buy order'];
        }
        if (histogram.lowest_sell_order) {
            return [parseInt(histogram.lowest_sell_order, 10), 0, 'Lowest sell order'];
        }
    }

    return [3, 0, 'No buy/sell orders to analyze'];
}

function getImmediatePrice(histogram, history, quantity) {
    if (!histogram || !histogram.sell_order_graph.length) {
        return getOptimumPrice(histogram, history, quantity);
    }

    var total = 0;
    var quantityLeft = quantity;
    var maxPrice = 0;

    for (let i = 0; i < histogram.sell_order_graph.length && quantityLeft > 0;) {
        maxPrice = histogram.sell_order_graph[i][0] * 100;
        let buyQuantity = Math.min(histogram.sell_order_graph[i][1], quantityLeft);
        total += maxPrice * buyQuantity;
        if ((quantityLeft -= buyQuantity) <= 0) {
            return [maxPrice, maxPrice * quantity - total, 'OK'];
        }
        if (buyQuantity == histogram.sell_order_graph[i][1]) {
            i++;
        }
    }

    return [maxPrice, maxPrice * quantity - total, 'Not enough ' + quantityLeft + ' sell orders'];
}

function _insertUrl(card, url) {
    LOG(CONFIG.logLevel.INFO, `Insert URL: ${url}`);
    card.find('.bb_cardname').html(`<a href=${url} target="_blank">${card.find('.bb_cardname').text()}</a>`);
}

function LOG(level, message) {
    if (CONFIG.debugMode) {
        if (level === CONFIG.logLevel.ERROR) {
            console.error(`${message}`);
        }
        else {
            console.log(`${message}`)
        }
    }
}