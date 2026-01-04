// ==UserScript==
// @name         Finviz & SEC Flow
// @namespace    lekisti
// @version      0.5
// @description  Add a button next to Finviz screener stock results that opens respective SEC filings on a new tab. Renders SEC filings as plain html to remove annoying clickable items. Optionally, hide market cap amounts on SEC filings.
// @author       lekisti
// @match        https://finviz.com/screener.ashx*
// @match        https://www.sec.gov/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462189/Finviz%20%20SEC%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/462189/Finviz%20%20SEC%20Flow.meta.js
// ==/UserScript==

//* globals ParseXbrl */

var $ = window.jQuery;

// ==Options==

var showMarketCapAmounts = false;
var zoomLevel = '150%';

// ==/Options==

var mappings = [];

$(function () {
    var url = window.location.href;
    if (url.includes('finviz')) {
        setMappings();
        addButtons();
    }
    else {
        if (url.includes('ix?doc=')) {
            redirectToPlainHtm(url);
        }
        
        if (!showMarketCapAmounts && url.startsWith('https://www.sec.gov/Archives/edgar/data/')) {
            hideMarketCapAmounts();
        }

        document.body.style.zoom = zoomLevel;
    }
});

function setMappings() {
    let headers = new Headers({
        "User-Agent": "Lekisti Co lekisti@outlook.com",
        "Accept-Encoding" : "gzip, deflate",
        "Host": "www.sec.gov"
    });

    fetch('https://gist.githubusercontent.com/lekisti/a17e75b21c65536f0c9f477b22501f61/raw/56fc1fb6ca8fbe9278dfbcab962ae5f4055298d3/company_tickers.json', {
        method  : 'GET',
        //headers : headers
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        Object.keys(data).forEach(function(prop) {
            var obj = data[prop];
            mappings[obj.ticker] = obj.cik_str;
        });
    }).catch(function(err) {
        console.log('Error: ', err);
    });
}

function addButtons() {
    $('.table-light > tbody > tr:nth-child(1) > td:nth-child(2)').after('<td class="table-top cursor-pointer">Filings</td>');
    $('.table-light > tbody > tr:nth-child(n+2) > td:nth-child(2)').each(function() {
        var btn_id = $(this).text();
        var btn_title = 'Open filings for ' + $(this).next('td').text();
        $(this).after('<td height="10" align="center" class="screener-body-table-nw">' +
            '<button id=' + '"' + btn_id + '"' + ' title="' + btn_title + '" type="button"><img src="https://cdn.iconscout.com/icon/free/png-128/folder-1964989-1659079.png" /></button></td>');
        GM_addStyle('#' + btn_id + '{cursor:pointer}#' + btn_id + ':hover{color:#fff;opacity:.65}');
        $('#' + btn_id + ' > img').width('25px');
        $('#' + btn_id + ' > img').height('25px');
        $('#' + btn_id).click(function() {
            window.open('https://www.sec.gov/edgar/browse/?CIK=' + mappings[btn_id], '_blank').focus();
        });
    });
}

function redirectToPlainHtm(url) {
    var search = '/data/';
    var start = url.indexOf(search);
    var searchLen = search.length;
    var newStart = 'https://www.sec.gov/Archives/edgar/data/';
    var rest = url.substring(start + searchLen, url.length);
    var newUrl = newStart + rest;
    window.location.href = newUrl;
}

function hideMarketCapAmounts(url) {
    var xbrlElement = $('ix\\:nonfraction[name="dei:EntityPublicFloat"]');
    if (xbrlElement.length > 0) {
        xbrlElement.replaceWith(' ___');
        return;
    }

    var container = $('p:contains(market value)').first();
    if (container.length > 0) {
        var dollarFound = false;
        var deleting = true;
        container.find('font').each(function() {
            console.log($(this).text());
            if (deleting) {
                var innerText = $(this).text();
                if (dollarFound) {
                    if (isNumeric(innerText) || innerText === '.') {
                        $(this).remove();
                    }
                    else {
                        deleting = false;
                    }
                }
                else if (innerText.includes('$')) {
                    dollarFound = true;
                    $(this).text(innerText.replace(/(?<!,)\d+(,\d{3})*\.?[0-9]?[0-9]?$/, ' ___'));
                }
            }
        });

        return;
    }

    container = $('div:contains(market value):not(:has(div))').first();
    if (container.length > 0) {
        var innerText = container.text();
        container.text(innerText.replace(/(?<!,)\d+(,\d{3})*\.?[0-9]?[0-9]?$/, ' ___'));
        return;
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail.
}