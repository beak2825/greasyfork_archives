// ==UserScript==
// @name       jawz William Kertzman - Domain Categorization/Data Collection
// @version    1.1
// @author	   jawz
// @description  will
// @match      https://www.mturkcontent.com/dynamic/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11975/jawz%20William%20Kertzman%20-%20Domain%20CategorizationData%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/11975/jawz%20William%20Kertzman%20-%20Domain%20CategorizationData%20Collection.meta.js
// ==/UserScript==

if ($('span:contains("WARNING: This HIT may contain adult content. Worker discretion is advised")').length) {
    $('select[name="Q1Answer"]').val('NoAds');
    $('select[name="Q2Answer"]').val('English');
    $('select[name="Q3Answer"]').val('No');
    $('select[name="Q4Answer"]').val('No');
    
    var url = $('a')[1].href
        
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        
    popupX = window.open(url, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }
    
    var timer = setInterval(function(){ listenFor(); }, 500);
}

function listenFor() {
    if ($('select[name="Q2Answer"]').val() !== 'English' && $('select[name="Q2Answer"]').val() !== 'broken')
        $('select[name="Q4Answer"]').val('Not English');
    
    if ($('select[name="Q1Answer"]').val() == 'broken') {
        $('select[name="Q2Answer"]').val('broken');
        $('select[name="Q3Answer"]').val('broken');
        $('select[name="Q4Answer"]').val('Broken Link');
    }
}