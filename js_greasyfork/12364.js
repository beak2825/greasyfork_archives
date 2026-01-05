// ==UserScript==
// @name       jawz DCF - 13D Data Extraction
// @version    1.04
// @author	   jawz
// @description  dcf
// @match      https://www.mturkcontent.com/dynamic/*
// @match      https://www.sec.gov/Archives/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12364/jawz%20DCF%20-%2013D%20Data%20Extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/12364/jawz%20DCF%20-%2013D%20Data%20Extraction.meta.js
// ==/UserScript==

if ($('td:contains("13D Data Extraction")').length) {
    var url = $('a')[1].href
        
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        
    popupX = window.open(url, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }
    var timer = setInterval(function(){ listenFor(); }, 500);
    
} else if (document.URL.indexOf("https://www.sec.gov") >= 0) {
    var dateTime = $('div[class="info"]').eq(1).text();
    var date = dateTime.split(' ')[0];
    var time = dateTime.split(' ')[1];
    GM_setValue('date', date);
    GM_setValue('time', time);
    
    var url = $('a').eq(8);
    console.log(url[0].href);
    if (!window.location.href.indexOf('.txt'))
        window.location.href = url;
}

function listenFor() {
    if (GM_getValue('date')) {
        $('#acceptance_date').val(GM_getValue('date'));
        GM_deleteValue('date');
        $('#acceptance_time').val(GM_getValue('time'));
        GM_deleteValue('time');
    }
}