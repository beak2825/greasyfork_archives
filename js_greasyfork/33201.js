// ==UserScript==
// @name         Yangınbulur!
// @namespace    PPM
// @version      0.2
// @description  49 şehirdeki itfaiye merkezlerini tarayarak yangın bulmayı dener.
// @author       Anthony McDonald
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        htt*://*.popmundo.com/World/Popmundo.aspx/Character
// @match        htt*://*.popmundo.com/World/Popmundo.aspx/Locale/OngoingFires/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/33201/Yang%C4%B1nbulur%21.user.js
// @updateURL https://update.greasyfork.org/scripts/33201/Yang%C4%B1nbulur%21.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var path = window.location.pathname,
    server = window.location.hostname,
    protocol = window.location.protocol,
    currentCity = GM_getValue('ongoingFiresCurrentCity') || 0,
    locales = [
        '176055', '249595', '2819616', '2507507', '176056',
        '282990', '176054', '188648', '773551', '653968',
        '176062', '2815427', '176067', '176074', '176072',
        '176064', '176075', '782572', '2365573', '1845329',
        '2434445', '176052', '176059', '176069', '2265028',
        '176057', '176077', '1886310', '358364', '176063',
        '176058', '176053', '176065', '176076', '176070',
        '176068', '176066', '1174007', '1349123', '670048',
        '473023', '1958372', '176051', '195089', '3046822',
        '176061', '176071', '847924', '176073'
    ];

var requestLocaleByIndex = function (index) {
    if (typeof locales[index] === 'undefined') {
        return;
    }

    window.open(protocol + '//' + server + '/World/Popmundo.aspx/Locale/OngoingFires/' + locales[index], '_blank');
};

if (path.match(/\/World\/Popmundo.aspx\/Character/g)) {
    $('#ppm-sidemenu div.menu:last-of-type > ul').append(
        '<li>' +
        '<a href="javascript:;" class="ongoing-fires-handler">Ongoing Fires</a>' +
        '<img src="/Static/Icons/TinyStar_VIP.png" alt="VIP only" title="VIP only" class="viponly">' +
        '</li>'
    );

    $('#ppm-sidemenu').on('click', '.ongoing-fires-handler', function () {
        GM_setValue('ongoingFiresCurrentCity', 0);
        requestLocaleByIndex(currentCity);
    });
}

if (path.match(/\/World\/Popmundo.aspx\/Locale\/OngoingFires/g)) {
    if (!$('#ctl00_cphLeftColumn_ctl00_pnlNoOngoingFires').length) {
        return;
    }

    GM_setValue('ongoingFiresCurrentCity', currentCity + 1);
    requestLocaleByIndex(currentCity + 1);
    window.close();
}
