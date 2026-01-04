// ==UserScript==
// @name            Steam Trading Cards Bulk Buyer
// @namespace       https://alanyhq.com/
// @version         3.5.0
// @description     Provides a button to purchase remaining cards needed for a badge in bulk
// @match           *://steamcommunity.com/*/gamecards/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @copyright       2018 - 2023 Alanyhq
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/463445/Steam%20Trading%20Cards%20Bulk%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/463445/Steam%20Trading%20Cards%20Bulk%20Buyer.meta.js
// ==/UserScript==

$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

var links = $('.gamecards_inventorylink');

// Current currency (numerical identifier used by Steam)
var g_Currency = 1;

// Initiatize currency information with default information first
var g_CurrencyInfo = {
    symbol_prefix: "",
    symbol_suffix: "",
    separator: "."
}
// Function to format the string using the currency information
function formatPrice(price, full)
{
    if(full)
    {
        return g_CurrencyInfo.symbol_prefix + price.replace(".", g_CurrencyInfo.separator) + g_CurrencyInfo.symbol_suffix;
    }
    return price.replace(".", g_CurrencyInfo.separator);
}


$(document).ready(function() {
    // Ensure that the page is loaded in HTTPS (Issue #19)
    if(document.location.protocol != "https:") {
        var badgePageUrl = window.location.href;
        badgePageUrl = badgePageUrl.replace("http://", "https://");
        window.location.href = badgePageUrl;
    }

    // Check if we need to craft a badge
    if(parseInt(localStorage.autoCraftBadge, 10)) {
        var button = $('.badge_craft_button');
        if(button.length){
            button.click();
            setTimeout(function() {window.location.reload();}, 100);
            console.log("crafting...");
        }else{
            delete localStorage.autoCraftBadge;
            console.log("suessful craft...");
        }
    }
});

if(links && $('.badge_card_to_collect').length > 0) {
    links.append('<button type="button" class="btn_grey_grey btn_small_thin" id="buycards_1x"><span>自动购买剩余卡牌(Lv+1)</span></button');
    links.append('<button type="button" class="btn_grey_grey btn_small_thin" id="buycards_4x"><span>自动购买剩余卡牌(Lv+4)</span></button');
    $('#buycards_1x').click(function() {
        $('#buycards_1x').hide();
        $('#buycards_4x').hide();
        $('.gamecards_inventorylink').append('<div id="buycardspanel_1x" style="visibility: hidden; margin-top: 5px"></div>');

        updatePrices_1x();
        $('#buycardspanel_1x').css('display', 'none').css('visibility', 'visible').show('blind'); // We have to do this visibility/display thing in order for offsetWidth to work
        $('#buycardspanel_4x').css('display', 'none').css('visibility', 'visible').show('blind'); // We have to do this visibility/display thing in order for offsetWidth to work
    });
    $('#buycards_4x').click(function() {
        $('#buycards_1x').hide();
        $('#buycards_4x').hide();
        $('.gamecards_inventorylink').append('<div id="buycardspanel_4x" style="visibility: hidden; margin-top: 5px"></div>');

        updatePrices_4x();
        $('#buycardspanel_1x').css('display', 'none').css('visibility', 'visible').show('blind'); // We have to do this visibility/display thing in order for offsetWidth to work
        $('#buycardspanel_4x').css('display', 'none').css('visibility', 'visible').show('blind'); // We have to do this visibility/display thing in order for offsetWidth to work
    });
}

var g_SessionID;

function updatePrices_1x() {
    $('#buycardspanel_1x').html('');

    Array.prototype.slice.call($('.badge_card_to_collect')).forEach(function(card) {
        card = $(card);
        var name = card.find('.badge_card_set_text')[0].textContent;
        var row = $('<div class="cardrow"><span class="cardname" style="padding-right: 10px; text-align: right; display: inline-block; font-weight: bold">' + name + '</span><span class="cardprice" data-name="' + name.replace(/"/g, '&quot;') + '">Loading...</span></div>');
        $('#buycardspanel_1x').append(row);

        var url = card.find('.btn_grey_grey.btn_medium[href*=market]')[0].href;
        if (document.location.protocol == "https:") {
            url = url.replace("http://", "https://");
        }
        $.get(url, function(html) {
            if(html.match(/There are no listings for this item\./)) {
                row.find('.cardprice').text('Error');
                return;
            }

            var marketID = html.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\);/);
            var sessionID = html.match(/g_sessionID = "(.+)";/);
            var countryCode = html.match(/g_strCountryCode = "([a-zA-Z0-9]+)";/);
            var currency = html.match(/"wallet_currency":(\d+)/);
            var hashName = html.match(/"market_hash_name":"([^"]+)"/);

            if(!marketID || !sessionID || !countryCode || !currency || !hashName) {
                row.find('.cardprice').text('Error');
                return;
            }

            g_Currency = currency[1];
            g_SessionID = sessionID[1];

            $.get('/market/itemordershistogram', {"country": countryCode[1], language: 'english', "currency": g_Currency, "item_nameid": marketID[1]}, function(json) {
                if(!json.success) {
                    row.find('.cardprice').text('Error');
                    return;
                }

                //console.info(json);

                var _lefts = 5 - parseInt(json.sell_order_graph[0][1]);
                var _level = 0;

                do
                {
                    _lefts -= parseInt(json.sell_order_graph[_level++][1]);
                }
                while (_lefts > 0);
                
                var _price = parseInt(json.lowest_sell_order, 10) + _level;

                row.data('price', _price);

                row.data('hashname', hashName[1]);

                console.log("hashName : ["+ hashName[1] + "]  price: [" + _price + "]");

                // Get the currency symbol
                if(json.price_prefix) {
                    g_CurrencyInfo.symbol_prefix = json.price_prefix;
                }
                else {
                    g_CurrencyInfo.symbol_suffix = json.price_suffix;
                }

                // Get the separator of the price
                var regexString = g_CurrencyInfo.symbol_prefix.replace("$", "\\\$") + '\\s?\\S+(\\D+)\\d{2}\\s?' + g_CurrencyInfo.symbol_suffix.replace("$", "\\\$");
                var regex = new RegExp(regexString, "g");
                var match = regex.exec(json.sell_order_graph[0][2]);
                g_CurrencyInfo.separator = match[1];

                row.find('.cardprice').text(formatPrice((_price / 100).toFixed(2), true));

                row.addClass('ready');

                if($('.cardrow:not(.ready)').length === 0) {
                    var total = 0;
                    var cards = $('.cardrow');
                    for(var i = 0; i < cards.length; i++) {
                        total += parseInt($(cards[i]).data('price'), 10) * 1 / 100;
                    }

                    $('#buycardspanel_1x').append('<br /><span style="font-weight: bold; display: inline-block; width: ' + $('.cardname').css('width') + '; padding-right: 10px; text-align: right">Total</span><b>' + g_CurrencyInfo.symbol_prefix + '<span id="totalprice">' + formatPrice(total.toFixed(2)) + '</span>' + g_CurrencyInfo.symbol_suffix +'</b><br /><br /><button type="button" id="buycardsbutton_1x" class="btn_green_white_innerfade btn_medium_wide" style="padding: 10px 20px; margin-left: ' + ($('.cardname').css('width').replace('px', '') / 2) + 'px">PLACE ORDERS</button>');
                    $('#buycardspanel_1x').append('<br /><br /><label><input type="checkbox" id="auto-reload-and-craft" /> Automatically reload page and craft badge</label>');
                    $('#buycardsbutton_1x').click(function() {
                        $('#buycardsbutton_1x').hide();
                        placeBuyOrder_1x();
                    });

                    if(parseInt(localStorage.autoReloadAndCraftBadge, 10)) {
                        $('#auto-reload-and-craft').prop('checked', true);
                    }

                    $('#auto-reload-and-craft').change(function() {
                        localStorage.autoReloadAndCraftBadge = $('#auto-reload-and-craft').prop('checked') ? 1 : 0;
                    });
                }
            });
        }).fail(function() {
            row.find('.cardprice').text('Error');
        });
    });

    var elements = $('.cardname');
    var largestWidth = 0;
    for(var i = 1; i < elements.length; i++) {
        if(elements[i].offsetWidth > elements[largestWidth].offsetWidth) {
            largestWidth = i;
        }
    }

    $('.cardname').css('width', elements[largestWidth].offsetWidth + 'px');
}

function updatePrices_4x() {
    $('#buycardspanel_4x').html('');

    Array.prototype.slice.call($('.badge_card_to_collect')).forEach(function(card) {
        card = $(card);
        var name = card.find('.badge_card_set_text')[0].textContent;
        var row = $('<div class="cardrow"><span class="cardname" style="padding-right: 10px; text-align: right; display: inline-block; font-weight: bold">' + name + '</span><span class="cardprice" data-name="' + name.replace(/"/g, '&quot;') + '">Loading...</span></div>');
        $('#buycardspanel_4x').append(row);

        var url = card.find('.btn_grey_grey.btn_medium[href*=market]')[0].href;
        if (document.location.protocol == "https:") {
            url = url.replace("http://", "https://");
        }
        $.get(url, function(html) {
            if(html.match(/There are no listings for this item\./)) {
                row.find('.cardprice').text('Error');
                return;
            }

            var marketID = html.match(/Market_LoadOrderSpread\(\s*(\d+)\s*\);/);
            var sessionID = html.match(/g_sessionID = "(.+)";/);
            var countryCode = html.match(/g_strCountryCode = "([a-zA-Z0-9]+)";/);
            var currency = html.match(/"wallet_currency":(\d+)/);
            var hashName = html.match(/"market_hash_name":"([^"]+)"/);

            if(!marketID || !sessionID || !countryCode || !currency || !hashName) {
                row.find('.cardprice').text('Error');
                return;
            }

            g_Currency = currency[1];
            g_SessionID = sessionID[1];

            $.get('/market/itemordershistogram', {"country": countryCode[1], language: 'english', "currency": g_Currency, "item_nameid": marketID[1]}, function(json) {
                if(!json.success) {
                    row.find('.cardprice').text('Error');
                    return;
                }

                //console.info(json);

                var _lefts = 5 - parseInt(json.sell_order_graph[0][1]);
                var _level = 0;

                do
                {
                    _lefts -= parseInt(json.sell_order_graph[_level++][1]);
                }
                while (_lefts > 0);
                
                var _price = parseInt(json.lowest_sell_order, 10) + _level;

                row.data('price', _price);

                row.data('hashname', hashName[1]);

                console.log("hashName : ["+ hashName[1] + "]  price: [" + _price + "]");

                // Get the currency symbol
                if(json.price_prefix) {
                    g_CurrencyInfo.symbol_prefix = json.price_prefix;
                }
                else {
                    g_CurrencyInfo.symbol_suffix = json.price_suffix;
                }

                // Get the separator of the price
                var regexString = g_CurrencyInfo.symbol_prefix.replace("$", "\\\$") + '\\s?\\S+(\\D+)\\d{2}\\s?' + g_CurrencyInfo.symbol_suffix.replace("$", "\\\$");
                var regex = new RegExp(regexString, "g");
                var match = regex.exec(json.sell_order_graph[0][2]);
                g_CurrencyInfo.separator = match[1];

                row.find('.cardprice').text(formatPrice((_price / 100).toFixed(2), true));

                row.addClass('ready');

                if($('.cardrow:not(.ready)').length === 0) {
                    var total = 0;
                    var cards = $('.cardrow');
                    for(var i = 0; i < cards.length; i++) {
                        total += parseInt($(cards[i]).data('price'), 10) * 1 / 100;
                    }

                    $('#buycardspanel_4x').append('<br /><span style="font-weight: bold; display: inline-block; width: ' + $('.cardname').css('width') + '; padding-right: 10px; text-align: right">Total (+Lv4) </span><b>' + g_CurrencyInfo.symbol_prefix + '<span id="totalprice">' + formatPrice(total.toFixed(2)) + '</span>' + g_CurrencyInfo.symbol_suffix +'</b><br /><br /><button type="button" id="buycardsbutton_4x" class="btn_green_white_innerfade btn_medium_wide" style="padding: 10px 20px; margin-left: ' + ($('.cardname').css('width').replace('px', '') / 2) + 'px">PLACE ORDERS</button>');
                    $('#buycardspanel_4x').append('<br /><br /><label><input type="checkbox" id="auto-reload-and-craft" /> Automatically reload page and craft badge</label>');
                    $('#buycardsbutton_4x').click(function() {
                        $('#buycardsbutton_4x').hide();
                        placeBuyOrder_4x();
                    });

                    if(parseInt(localStorage.autoReloadAndCraftBadge, 10)) {
                        $('#auto-reload-and-craft').prop('checked', true);
                    }

                    $('#auto-reload-and-craft').change(function() {
                        localStorage.autoReloadAndCraftBadge = $('#auto-reload-and-craft').prop('checked') ? 1 : 0;
                    });
                }
            });
        }).fail(function() {
            row.find('.cardprice').text('Error');
        });
    });

    var elements = $('.cardname');
    var largestWidth = 0;
    for(var i = 1; i < elements.length; i++) {
        if(elements[i].offsetWidth > elements[largestWidth].offsetWidth) {
            largestWidth = i;
        }
    }

    $('.cardname').css('width', elements[largestWidth].offsetWidth + 'px');
}

function placeBuyOrder_1x() {
    var card = $('.cardrow:not(.buying)')[0];
    if(!card) {
        return;
    }

    card = $(card);
    card.find('.cardprice')[0].innerHTML += ' - Placing buy order...';
    card.addClass('buying');

    $.post('https://steamcommunity.com/market/createbuyorder/', {"sessionid": g_SessionID, "currency": g_Currency, "appid": 753, "market_hash_name": card.data('hashname'), "price_total": card.data('price')*1, "quantity": 1}, function(json) {
        setTimeout(placeBuyOrder_1x, 500);

        if(json.success !== 1) {
            card.find('.cardprice').text(json.message);
            decrementTotal(card.data('price') / 100);
            return;
        }
        
        console.info(json);

        card.data('orderid', json.buy_orderid);
        card.data('checks', 0);

        card.find('.cardprice').text(card.find('.cardprice').text().replace('Placing buy order', 'Waiting'));
        checkOrderStatus(card);
    });
}

function placeBuyOrder_4x() {
    var card = $('.cardrow:not(.buying)')[0];
    if(!card) {
        return;
    }

    card = $(card);
    card.find('.cardprice')[0].innerHTML += ' - Placing buy order...';
    card.addClass('buying');

    $.post('https://steamcommunity.com/market/createbuyorder/', {"sessionid": g_SessionID, "currency": g_Currency, "appid": 753, "market_hash_name": card.data('hashname'), "price_total": card.data('price')*4, "quantity": 4}, function(json) {
        setTimeout(placeBuyOrder_4x, 500);

        if(json.success !== 1) {
            card.find('.cardprice').text(json.message);
            decrementTotal(card.data('price') / 100);
            return;
        }
        
        console.info(json);

        card.data('orderid', json.buy_orderid);
        card.data('checks', 0);

        card.find('.cardprice').text(card.find('.cardprice').text().replace('Placing buy order', 'Waiting'));
        checkOrderStatus(card);
    });
}

function checkOrderStatus(card) {
    card.find('.cardprice')[0].innerHTML += '.';

    $.get('/market/getbuyorderstatus/', {"sessionid": g_SessionID, "buy_orderid": card.data('orderid')}, function(json) {
        if(json.success !== 1) {
            setTimeout(function() {
                checkOrderStatus(card);
            }, 500);
            return;
        }

        if(json.purchases.length) {
            if(json.purchases[0].price_total < card.data('price')) {
                decrementTotal((card.data('price') - json.purchases[0].price_total) / 100);
            }

            card.find('.cardprice').text(formatPrice((json.purchases[0].price_total / 100).toFixed(2), true) + ' - Purchased');
            checkAllPurchasesMade();
            return;
        }

        if(!json.purchases.length) {
            card.data('checks', card.data('checks') + 1);
            if(card.data('checks') >= 10) {
                cancelBuyOrder(card.data('orderid'));
                card.find('.cardprice').text('Order unfulfilled');
                decrementTotal(card.data('price') / 100);
                return;
            }
        }

        setTimeout(function() {
            checkOrderStatus(card);
        }, 500);
    });
}

function cancelBuyOrder(orderid) {
    $.post('/market/cancelbuyorder/', {"sessionid": g_SessionID, "buy_orderid": orderid}, function(json) {
        if(!json.success) {
            setTimeout(function() {
                cancelBuyOrder(orderid);
            }, 500);
        }
    });
}

function decrementTotal(total) {
    // Replace any commas to dots so we get a valid double
    $('#totalprice').text(formatPrice(($('#totalprice').text().replace(",", ".") - total).toFixed(2)));
}

function checkAllPurchasesMade() {
    var elements = $('.cardprice');
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].textContent.indexOf('Purchased') == -1) {
            return;
        }
    }

    // All cards bought
    if(parseInt(localStorage.autoReloadAndCraftBadge, 10)) {
        localStorage.autoCraftBadge = 1;
        window.location.reload();
    }
}
