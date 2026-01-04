// ==UserScript==
// @name         Torn Flight UserScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trying to take over Torn!
// @author       Pagey
// @match        *://*.torn.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_log
// @grant               GM_xmlhttpRequest
// @grant               GM_openInTab
// @grant               GM_listValues
// @grant               GM_addStyle
// @connect             api.torn.com
// @require             http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/397145/Torn%20Flight%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/397145/Torn%20Flight%20UserScript.meta.js
// ==/UserScript==

// ==/Variables & Constants/==
const locale = ['en-us']
let api_key = GM_getValue('api_key', null);
let mextravel = GM_getValue('mextravel', 0);
let caytravel = GM_getValue('caytravel', 0);
let lontravel = GM_getValue('lontravel', 0);
let soutravel = GM_getValue('soutravel', 0);
let cantravel = GM_getValue('cantravel', 0);
let hawtravel = GM_getValue('hawtravel', 0);
let chitravel = GM_getValue('chitravel', 0);
let japtravel = GM_getValue('japtravel', 0);
let switravel = GM_getValue('switravel', 0);
let argtravel = GM_getValue('argtravel', 0);
let traveltime = GM_getValue('traveltime', 0);
let traveltimes = GM_getValue('traveltimes', 0);
let itemsboughtabroad = GM_getValue('itemsboughtabroad', 0);
let html = '';


// ==/Functions/==
function requestPage(link, modo, handler) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = handler;
    httpRequest.open('GET', link, modo);
    try { httpRequest.send(null); } catch (x) { //alert(x);
    };
    return httpRequest.responseText;
}

function get_api_key() {
    let preferencesPage = $(requestPage('preferences.php'));   // ==/Get current API Key/==
    return preferencesPage.find('#newapi').val();
}

function set_api_key(key) {     // ==/Set API Key/==
    api_key = key;
    GM_setValue('api_key', key);
}

function timeConverter(time){           // ==/Convert time to D:H:M:S/==
    var days = Math.floor(time / 86400)
    var hours = Math.floor((time % 86400) / 3600)
    var minutes = Math.floor((time % 3600) / 60 )
    var seconds = time % 60
    finalTime = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's'
    return finalTime;
  }

function fmtNumber(n) {      // ==/Format Number/==
    var x = n.toString();
    var y = '';
    var k = x.indexOf('.');
    var i = x.length;
    if (k < 0) k = i;
    var j = 0;
    while (i > 0) {
        --i;
        y = x.substr(i, 1) + y;
        if (i < k) {
            if (++j % 3 == 0) {
                if (i) y = ',' + y;
            }
        }
    }
    return y;
}
function formNum(x) {     // ==/Format Number/==
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function requestAPI(link, api_key, modo, handler) {     // ==/API Request/==
    var requestLink = link + api_key;
    var listJSON = requestPage(requestLink, modo, handler);

    if (handler == null) {
        var list = JSON.parse(listJSON);
        //{"error":{"code":2,"error":"Incorrect Key"}}
        if (list.error != null) {
            if (list.error.code == '2' || list.error.code == '12') {
                //get current API Key
                var new_api_key = get_api_key();
                set_api_key(new_api_key);
                list = requestAPI(link, new_api_key);
            }
        }
        return list;
    }
}

// ==/On Doc Ready/==
$(document).ready(function () {

    if (api_key == null) {        // ==/Set API Key if Null/==
        api_key = get_api_key();
        set_api_key(api_key);
    }
    //===============================================/Torn API Page/=======================================================

    if (document.location.href.match(/\/api\.html#/)) {
        $('#u_responseType[value=pretty]').attr('checked', true)  // ==/Auto toggle Pretty/==
        $('#demo input[id=api_key]').val(api_key)                 // ==/Auto fill API/==
    }

    // ================================================/Travel Page/=========================================================


    if (document.location.href.match(/\/index\.php$/) || document.location.href.match(/\/authenticate\.php$/) || document.location.href.match(/\/city\.php$/) || document.location.href.match(/torn.com\/$/) || document.location.href.match(/\/sidebar.php$/)) {

        if ($("#skip-to-content").text().match(/Traveling/) || $("#skip-to-content").text().match(/Mexico|Canada|Cayman Islands|Hawaii|United Kingdom|Argentina|Switzerland|Japan|China|South Africa|Dubai/)) {

            $('#plane').remove()

            // ==/Get number of mails/==
            var apiResponse = requestAPI('//api.torn.com/user/?selections=personalstats,notifications,money&key=', api_key);
            let ps = apiResponse.personalstats

            for (var x in ps) {         // ==/Get personal stats/==
                try {
                    GM_setValue(`${x}`, ps[x]);
                } catch (err) {
                    GM_setValue(`${x}`, 0);
                }
            }

            html = ''       // ==/Travel Stats/==
            html += '<table><tr><th colspan="4">Totals</th></tr><tr><td  align="left"  width="30%" colspan="2">Times Travelled</td><td  align="right" width="20%" colspan="2">' + formNum(GM_getValue('traveltimes')) + '</td></tr><tr><td  align="left"  width="30%" colspan="2">Total Time In Air</td><td  align="right" width="20%" colspan="2">' + timeConverter(traveltime) + '</td></tr><tr><td  align="left"  width="30%"colspan="2">Items Bought Abroad</td><td  align="right" width="20%" colspan="2">' + formNum(GM_getValue('itemsboughtabroad')) + '</td></tr><tr class="blank_row"><td>&nbsp;</td><tr><th colspan="4"><strong>Countries</strong></th></tr><tr><td  align="left"  width="30%">London</td><td  align="center" width="20%">' + formNum(GM_getValue('lontravel')) + '</td><td  align="left"  width="30%">Mexico</td><td  align="center" width="20%">' + formNum(GM_getValue('mextravel')) + '</td></tr><tr><td  align="left"  width="30%">Caymans</td><td  align="center" width="20%">' + formNum(GM_getValue('caytravel')) + '</td><td  align="left"  width="30%">South Africa</td><td  align="center" width="20%">' + formNum(GM_getValue('soutravel')) + '</td></tr><tr><td  align="left"  width="30%">Canada</td><td  align="center" width="20%">' + formNum(GM_getValue('cantravel')) + '</td><td  align="left"  width="30%">Hawaii</td><td  align="center" width="20%">' + formNum(GM_getValue('hawtravel')) + '</td></tr><tr><td  align="left"  width="30%">China</td><td  align="center" width="20%">' + formNum(GM_getValue('chitravel')) + '</td><td  align="left"  width="30%">Japan</td><td  align="center" width="20%">' + formNum(GM_getValue('japtravel')) + '</td></tr><tr><td  align="left"  width="30%">Switzerland</td><td  align="center" width="20%">' + formNum(GM_getValue('switravel')) + '</td><td  align="left"  width="30%">Argentina</td><td  align="center" width="20%">' + formNum(GM_getValue('argtravel')) + '</td></tr><tr class="blank_row"></table>'

            $('.inner-popup').text('').append(html).parent().css('width', '300px')
            $('.inner-popup >>>>').css('color', 'white').css('padding-left', '10px')    // ==/Remove text/==

            $("a.events").after($('<a class="t-clear h c-pointer  m-icon line-h24 right last" href="messages.php"><span role="button">Mailbox (' + apiResponse.notifications.messages + ')</span></a>'));

            if ($("#skip-to-content").text().match(/Traveling/)) {

                var secondsLeft = $("#countrTravel").attr("data-to");       // ==/Landing Time/==
                var data = new Date();
                data.setSeconds(data.getSeconds() + secondsLeft * 1);

                $("#skip-to-content").after(($('<div class="left">&nbsp;Arriving at ' + data.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) + '</div>').css('margin', '8px 3px')));

                // ==/Money/==
                $("#skip-to-content").after($('<div class="left">&nbsp;Money: $' + fmtNumber(Math.round(apiResponse.money_onhand)) + '</div>').css('margin', '8px 3px'));
            }
        }
    }
});
