// ==UserScript==
// @name         SSW Shop Autopricer
// @namespace    shiftasterisk
// @version      2.0
// @description  Automatically prices shop to 1 np less than lowest on SSW
// @author       shiftasterisk
// @match        http://www.neopets.com/market.phtml?*type=your*
// @match        http://www.neopets.com/market_your.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26223/SSW%20Shop%20Autopricer.user.js
// @updateURL https://update.greasyfork.org/scripts/26223/SSW%20Shop%20Autopricer.meta.js
// ==/UserScript==
var userName = $('.user a').html();
var minSearchSpeed = 2000;
var maxSearchSpeed = 5000;

var lowerPrice = 0;
var finalPrice = 0;

var banned = false;

var waitForResults;

console.log(userName);

//Form
$('p b font:contains("Note:")').parent().parent().before().append(
    '<div id="sswAP">' +
    '<input id="autoPrice" class="sswInner" type="button" value="SSW Auto Price">' +
    '<label class="sswInner" for="lowDiff">Low Price Alert (%):</label><input type="input" name="lowDiff" id="lowDiff" value="25">' +
    '<label class="sswInner" for="lowerPrice">Price Below:</label><input type="input" name="lowerPrice" id="lowerPrice" value="10">' +
    '<label for="finalPrice"> to Price:</label><input type="input" name="finalPrice" id="finalPrice" value="1">' +
    '<input id="priceAfterBan" name="priceAfterBan" class="sswInner" type="checkbox"><label for="priceAfterBan">Price check after ban</label>' +
    '</div>'
);
$('.sswInner').css({
    "margin-left": "20px"
});

$('#lowDiff, #lowerPrice, #finalPrice').css({
    'width': '50px'
});

//Table headers
$('form[action="process_market.phtml"] table tbody tr').first().append(
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Ignore</b><input id="ignoreAll" type="checkbox">' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Reprice</b><input id="repriceAll" type="checkbox">' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Lower Own</b><input id="lowerOwnAll" type="checkbox">' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Reduce By</b><input id="reduceByAll" type="input">' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Rate</b><select id="rateAll">' +
    '<option value="np">NP</option>' +
    '<option value="%">%</option>' +
    '</select>' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Search Type</b><select id="searchTypeAll">' +
    '<option value="search">Search</option>' +
    '<option value="pc">Price Check</option>' +
    '<option value="none">None</option>' +
    '</select>' +
    '</td>' +
    '<td align="center" bgcolor="#dddd77">' +
    '<b>Lowest Prices/Price Check</b>' +
    '</td>'
);
$('#reduceByAll').css({
    'width': '60px'
});

//click functions
$('#ignoreAll').click(function() {
    ignoreAll = $('#ignoreAll').is(':checked');
    if (ignoreAll)
        $('.itemIgnore').prop('checked', true);
    else
        $('.itemIgnore').prop('checked', false);
});
$('#repriceAll').click(function() {
    repriceAll = $('#repriceAll').is(':checked');
    if (repriceAll)
        $('.itemReprice').prop('checked', true);
    else
        $('.itemReprice').prop('checked', false);
});
$('#lowerOwnAll').click(function() {
    repriceAll = $('#lowerOwnAll').is(':checked');
    if (repriceAll)
        $('.itemLowerOwn').prop('checked', true);
    else
        $('.itemLowerOwn').prop('checked', false);
});
$('#reduceByAll').change(function() {
    $('.itemReduceBy').val($('#reduceByAll').val());
});
$('#rateAll').change(function() {
    $('.itemRate').val($('#rateAll').val());
});
$('#searchTypeAll').change(function() {
    $('.itemSearchType').val($('#searchTypeAll').val());
});

//table rows
$('form[action="process_market.phtml"] table tbody tr').not(':first').not(':last').each(function() {
    $(this).append(
        '<td width="50" align="center" bgcolor="#ffffcc">' +
        '<input class="itemIgnore" type="checkbox">' +
        '</td>' +
        '<td width="50" align="center" bgcolor="#ffffcc">' +
        '<input class="itemReprice" type="checkbox">' +
        '</td>' +
        '<td width="50" align="center" bgcolor="#ffffcc">' +
        '<input class="itemLowerOwn" type="checkbox">' +
        '</td>' +
        '<td align="center" bgcolor="#ffffcc">' +
        '<input class="itemReduceBy" type="input" value="1">' +
        '</td>' +
        '<td align="center" bgcolor="#ffffcc">' +
        '<select class="itemRate">' +
        '<option value="np">NP</option>' +
        '<option value="%">%</option>' +
        '</select>' +
        '</td>' +
        '<td align="center" bgcolor="#ffffcc">' +
        '<select class="itemSearchType">' +
        '<option value="search">Search</option>' +
        '<option value="pc">Price Check</option>' +
        '<option value="none">None</option>' +
        '</select>' +
        '</td>' +
        '<td class="lowestPriceCell" width="50" align="center" bgcolor="#ffffcc"></td>'
    );
});
$('.itemReduceBy').css({
    'width': '60px'
});

//autoprice button function
$('#autoPrice').click(function() {
    banned = false;
    lowerPrice = parseInt($('#lowerPrice').val());
    finalPrice = parseInt($('#finalPrice').val());
    if ($('.sswdrop.panel_hidden').length)
        $('#sswmenu div.imgmenu').click();
    $('form[action="process_market.phtml"] table tbody tr').not(':first').not(':last').each(function() {
        if ($(this).find('td input').val() == 0 || $(this).find('.itemReprice:eq(0)').is(':checked'))
            $(document).queue('prices', createPrice($(this)));
    });

    $(document).queue('prices', function() {
        console.log("finished pricing");
    });

    $(document).dequeue('prices');
});

function createPrice(item) {
    return function(next) {
        doPrice(item, next);
    };
}

function doPrice(item, next) {
    itemName = item.find('td b').first().html();
    searchType = item.find('.itemSearchType:eq(0)').val();
    console.log(itemName);
    console.log(searchType);

    if (itemName.indexOf('pin_prefs.phtml') != -1) {
        console.log("Don't process, pin");
        next();
    } else if (item.find('.itemIgnore:eq(0)').is(':checked')) {
        console.log("Don't process, ignored");
        next();
    } else {
        submitted = submitSSW(itemName, searchType);
        waitForResults = setInterval(function() {
            var gotResults = !submitted;
            if (!gotResults)
                gotResults = checkForNoSearchDeduction(item, searchType);
            if (!gotResults)
                gotResults = checkForSearchResults(item, searchType);
            if (!gotResults)
                gotResults = checkForPriceCheck(item);
            if (!gotResults)
                gotResults = checkForError(item);
            if (!gotResults)
                if (checkSearchLimit())
                    submitted = submitSSW(itemName, searchType);
            if (gotResults)
                moveToNextItem(next);
        }, 100);
    }
}

function processItem() {

}

function submitSSW(itemName, searchType) {
    if (searchType == "none")
        return true;
    $('#searchstr').val(itemName);
    $('#ssw-criteria').val('exact');
    if ((banned && $('#priceAfterBan').is(':checked')) || searchType == "pc")
        $('#price-limited').prop('checked', true);
    else if (!banned)
        $('#price-limited').prop('checked', false);
    else
        return false;

    $('#button-search').click();
    return true;
}

function checkForNoSearchDeduction(item, searchType) {
    if (searchType == "none") {
        setLowestPrice(item, searchType);
        return true;
    }
    return false;
}

function checkForSearchResults(item, searchType) {
    if ($('#results_table').length) {
        console.log("Search complete");
        setLowestPrice(item, searchType);
        addLowestPriceLinks(item);
        resetSearch();
        return true;
    }
    return false;
}

function checkForPriceCheck(item) {
    if ($('#results').html().indexOf("average") > -1) {
        console.log("Price Check complete");
        addPriceCheck(item);
        resetSearch();
        return true;
    }
    return false;
}

function checkForError() {
    if ($('#ssw_error_result').length) {
        resetSearch();
        return true;
    }
    return false;
}

function checkSearchLimit(item) {
    message = $('#results b').first().html();
    if (message != null) {
        if (message.indexOf("Whoa there") > -1) {
            waitTime = parseInt($('#results p.pmod b').html());
            console.log("Hit search limit, setting banned");
            banned = true;
            return true;
        }
    }
    return false;
}

function resetSearch() {
    $('#results_table').remove();
    $('#button-new-search').click();
}

function moveToNextItem(next, searchType) {
    clearInterval(waitForResults);
    if (searchType == "none") {
        next();
    } else {
        setTimeout(function() {
            console.log('pausing for next item');
            next();
        }, getRandomWait());
    }
}

function getRandomWait() {
    return Math.round(Math.random() * (maxSearchSpeed - minSearchSpeed)) + minSearchSpeed;
}

function setLowestPrice(item, searchType) {
    if (searchType == "search")
        price = parseInt($('#results_table tbody tr').not(':first').first().find('td:nth-child(3)').html().replace(",", "").replace(" NP", ""));
    else
        price = item.find('td input').first().val();

    reduceBy = parseInt(item.find('.itemReduceBy:eq(0)').val());
    rate = item.find('.itemRate:eq(0)').val();

    if (rate == "np")
        amount = reduceBy;
    else
        amount = Math.round(price * (reduceBy / 100));

    console.log("Setting price lowest price - " + amount);

    if (price > 1) price -= amount;

    if (lowerPrice > 0 && finalPrice > 0) {
        if (price < lowerPrice)
            price = finalPrice;
    }
    if ($('#results_table tbody tr').not(':first').first().find('td a').first().html() != userName || item.find('.itemLowerOwn:eq(0)').is(':checked')) {
        console.log("Setting price to " + price);
        item.find('td input').first().val(price);
    }
}

function addPriceCheck(item) {
    result = $('#results').html();
    item.find('.lowestPriceCell:eq(0)').html(result.substring(result.indexOf(':') + 1, result.length).trim());
}

function addLowestPriceLinks(item) {
    var lowestPriceUrls = "";
    var lowestPrice = 0;
    var secondLowest = 0;
    $('#results_table tbody tr').not(':first').each(function() {
        additionalClass = "";
        if ($(this).find('td a').first().html() == userName) {
            console.log("adding class to your price");
            additionalClass = "yourPrice";
        }
        lowestPriceUrls += '<a class="lowestPriceUrl ' + additionalClass + '" href="' + $(this).find('td a').first().attr('href') + '">' + $(this).find('td:nth-child(3)').html() + '</a><br>';
    });
    item.find('.lowestPriceCell:eq(0)').html(lowestPriceUrls);
    findUnderpriced(item.find('.lowestPriceCell'));
    $('.redPrice').css({
        'color': 'red'
    });
    $('.yourPrice').css({
        'color': 'green'
    });
}

function findUnderpriced(item) {
    firstUrl = item.find('.lowestPriceUrl:eq(0)');
    secondUrl = item.find('.lowestPriceUrl:eq(1)');
    lowestPrice = firstUrl.html().replace(",", "").replace(" NP", "");
    secondLowest = secondUrl.html().replace(",", "").replace(" NP", "");
    console.log('lowestPrice = ' + lowestPrice);
    console.log('secondLowest = ' + secondLowest);

    if (lowestPrice > 0 && secondLowest > 0) {
        priceDiff = (1 - (lowestPrice / secondLowest)) * 100;
        console.log('priceDiff = ' + priceDiff);
        if (priceDiff >= parseInt($('#lowDiff').val())) {
            console.log("large difference between two lowest prices");
            firstUrl.addClass('redPrice');
            secondUrl.addClass('redPrice');
        }
    }
}