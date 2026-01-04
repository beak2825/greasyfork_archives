// ==UserScript==
// @name       Hybrid - Ambulatory Surgery Center
// @version    1.04
// @author     jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/*
// @match      https://npiregistry.cms.hhs.gov/*
// @match      https://npidb.org/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @grant       GM_getValue
// @grant       GM_setValue
// @grant	    GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/373297/Hybrid%20-%20Ambulatory%20Surgery%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/373297/Hybrid%20-%20Ambulatory%20Surgery%20Center.meta.js
// ==/UserScript==

if ($('li:contains("Ambulatory Surgery Center")').length) {
    var addy = $('p:contains("ASC Name")').text().split('Address:')[1];
    $('p:contains("ASC Name")').text(addy);
    $('.instructions').hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().next().next().next().hide();
    //$('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().next().text('MD, DO, DPM');
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().next().hide();
    $('p:contains("The primary NPI lookup")').next().next().hide();
    $('p:contains("The primary NPI lookup")').next().hide();
    $('p:contains("The primary NPI lookup")').hide();
    var first = $('p:contains("Physician")').next().text().replace('Dr. ', '');
    first = first.split(' ')[0].replace('.','');
    var last = $('p:contains("Physician")').next().next().text().replace(', M.D.', '').replace(', MD', '').replace(', III', '').replace(', II', '').replace(', Jr.', '');
    var state = $('p:contains("State:")').text().replace('State: ', '');

    $('p:contains("State:")').text($('p:contains("State:")').text().replace('State: ', ''));
    $('p:contains("Physician")').next().text($('p:contains("Physician")').next().text() + ' ' + $('p:contains("Physician")').next().next().text());
    $('p:contains("Physician")').next().next().hide();

    var url = "https://npiregistry.cms.hhs.gov/registry/search-results-table?first_name=" + first + "&last_name=" + last + "&addressType=ANY";
    var url2= "https://npidb.org/npi-lookup/?npi=&fname=" + first + "&lname=" + last + " &state=" + state + "&sound=0&search=&org=";

    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var wleft = window.screenX;

    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    var popupX = window.open(url, 'remote1', 'height=' + windowHeight/2 + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    var popupY= window.open(url2, 'remote2', 'height=' + windowHeight/2 + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=' + windowHeight/2 + specs,false);
    //window.onbeforeunload = function (e) {
    //    popupX.close();
    //    popupY.close();
    //}

    setInterval(function(){ check(); }, 250);

    $('div[class="item-response order-1"]').find('input').eq(1).click(function() { $('input[name="commit"]').click(); });

    if ($('p:contains("Specialty")').text() == "Specialty: Optometrist" || $('p:contains("Specialty")').text() == "Specialty: Optometry") {
        $('div[class="item-response order-1"]').find('input').eq(1).prop( "checked", true );
        //$('input[name="commit"]').click();
    }
}

if (document.URL.indexOf("npiregistry.cms") >= 0) {
    $('a').click(function(e) {
        e.preventDefault();
        GM_setValue("npi", $(this).text())
    });
}

if (document.URL.indexOf("npidb.org") >= 0) {
    $('a').click(function(e) {
        e.preventDefault();
        GM_setValue("npi", $(this).text())
    });
}

function check() {
    if (GM_getValue('npi')) {
        $('div[class="item-response order-1"]').find('input').eq(0).prop( "checked", true );
        $('textarea').eq(0).text(GM_getValue('npi'));
        GM_deleteValue('npi');
        //setTimeout(function(){ $('input[name="commit"]').click(); }, 100);
    }
}