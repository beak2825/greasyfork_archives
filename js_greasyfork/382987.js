// ==UserScript==
// @name         ceair fare detail cracker
// @namespace    http://www.ceair.com
// @version      0.7
// @description  Parse the JSON data returned from ceair
// @author       You
// @match        http://www.ceair.com/booking/*_CNY.html*
// @match        http://www.ceair.com/booking/*_JF.html*
// @match        http://www.ceair.com/booking/mt.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382987/ceair%20fare%20detail%20cracker.user.js
// @updateURL https://update.greasyfork.org/scripts/382987/ceair%20fare%20detail%20cracker.meta.js
// ==/UserScript==

'use strict';

var g_flightSearchJSON = "";
var g_readyCount = 0;
var g_changedCount = 0;

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            // We only deal with doFlightSearch's json data
            if (this.readyState == 4 && this.responseURL.indexOf("flight-search!doFlightSearch.shtml") != -1) {
                g_changedCount = 0;
                g_flightSearchJSON = JSON.parse(this.responseText);
                increaseReadyCount();
            }
        }, false);
        open.apply(this, arguments);
    };

    // Setup observer
    new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "class") {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                // Check if searching icon disappears
                if (attributeValue === "searching none") {
                    increaseReadyCount();
                }
            }
        });
    }).observe($("section.searching")[0], {
        attributes: true
    });

    if (window.location.href.indexOf("/mt.html") !== -1) {
        new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "childList") {
                    ++g_changedCount;
                    if (g_changedCount > 1 && g_changedCount % 2 === 1) {
                        callLoaded();
                    }
                }
            });
        }).observe($("#flight-info")[0], {
            childList: true
        });
    }
})(XMLHttpRequest.prototype.open);

function increaseReadyCount() {
    if (++g_readyCount >= 2) {
        callLoaded();
    }
}

function callLoaded() {
    processFlightInfo();

    if (typeof g_flightSearchJSON.airResultDto !== "undefined") {
        onComplexBookingLoaded();
    } else {
        onSimpleBookingLoaded();
    }
}

function processFlightInfo() {
    $("article.flight").each(function() {
        $(this).find("ul.detail-info > li.clearfix").each(function(index) {
            $(this).find("div[name='acfamily']").each(function() {
                var $acfamily = $(this);
                $acfamily.after(' (' + $acfamily.attr("acfamily") + ')');
            });

            $(this).find("mark.icon-booking.meal").each(function() {
                var $meal = $(this);
                $meal.parent().after(' (' + $meal.attr("title") + ')');
            });
        });
    });
}

function onComplexBookingLoaded() {
    $("dl[name='unit']").each(function() {
        var $unit = $(this);
        var dataIndex = $unit.attr("data-index");

        var product = g_flightSearchJSON.airResultDto.productUnits[dataIndex];
        var fareInfo = product.fareInfoView[0];
        var fareBasisCode = fareInfo.fareBasisCode;
        var fare = fareInfo.fare.fdPrice;
        var snk = product.snk;

        $unit.children("dd.tags_container").append('<em class="b-box secondary async auto"><span data-index="' + dataIndex + '" class="popup tip" data-snk="' + snk + '">运价代码:' + fareBasisCode + '</span></em>');

        var $tax = $unit.find("dd.p-p > span.tax");
        if ($tax.length) {
            $tax.before('<span style="color: #ff6600;">运价：' + g_flightSearchJSON.currency + fare + '</span><br/>');
        } else {
            $unit.children("dd.p-p").append('<span class="tax" style="color: #ff6600;">运价:' + g_flightSearchJSON.currency + fare + '</span></span>');
        }
    });
}

function processItem(element, newUI) {
    var $unit = $(element);
    var dataIndex = $unit.attr("data-index");

    var product = g_flightSearchJSON.searchProduct[dataIndex];
    var productCode = product.productCode;

    var cabinCode = product.cabin.cabinCode;
    var snk = product.snk;

    var fare = snk.substring(snk.indexOf(productCode) + productCode.length).substring(cabinCode.length).replace(/-/g, "/");

    if (newUI) {
        var $content = $unit.find("div.content");
        $content.find("ul").prepend('<li data-snk="' + snk + '"><div class="d1 ref_flag"></div><div class="d2">产品代码: ' + productCode + '</div></div></li>');

        var $from = $content.find("span.from");
        if ($from.length) {
            $from.append(' (运价: ' + g_flightSearchJSON.currency + fare + ')');
        } else {
            $content.find("span.s1").append('<span class="from"> (运价: ' + g_flightSearchJSON.currency + fare + ')</span>');
        }
    } else {
        $unit.children("dd.tags_container").append('<em class="b-box secondary async auto"><span data-index="' + dataIndex + '" class="popup tip" data-snk="' + snk + '">产品代码:' + productCode + '</span></em> ');

        var $tax = $unit.find("dd.p-p > span.tax");
        if ($tax.length) {
            $tax.before('<span style="color: #ff6600;">运价：' + g_flightSearchJSON.currency + fare + '</span><br/>');
        } else {
            $unit.children("dd.p-p").append('<span class="tax" style="color: #ff6600;">运价:' + g_flightSearchJSON.currency + fare + '</span></span>');
        }
    }
}

function onSimpleBookingLoaded() {
    $("dl[name='unit']").each(function() { processItem(this, false); });
    $("div[name='unit']").each(function() { processItem(this, true); });
}