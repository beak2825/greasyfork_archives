// ==UserScript==
// @name       jawz OCMP35
// @version    1.2
// @description  something useful
// @match      https://grainger.crowdcomputingsystems.com/*
// @match      http://www.grainger.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11984/jawz%20OCMP35.user.js
// @updateURL https://update.greasyfork.org/scripts/11984/jawz%20OCMP35.meta.js
// ==/UserScript==

var allText = $('body').text();
if (allText.indexOf("Discovery Phase") >= 0) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    $('input[value="5"]').prop('checked',true);
    var url =  $('span[data-mce-style="background-color: #ffff99;"]').text();
    url = url.replace(/[" "]/g, "+");
    url = url.replace("&", "%26");
    url = url.replace(",", "%2C");
    url = url.replace("/", "%2F");
    var grainger_URL = "http://www.grainger.com/search?nls=1&searchQuery=" + url;
    
    var halfScreen = screen.width/2; 
    var windowHeight = screen.height; 
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupW = window.open(grainger_URL,'remote','height=' + windowHeight + ',width=' + halfScreen + ', left=' + halfScreen + ',top=0' + specs,false);
    
} else if (allText.indexOf("Place the Product in the Correct Category") >= 0) {
    window.onbeforeunload = function (e) {
        popupW.close();
    }
    var url = $('span[style="background-color: rgb(255, 255, 153);"]').text();
    url = url.replace(/[" "]/g, "+");
    url = url.replace("&", "%26");
    url = url.replace(",", "%2C");
    url = url.replace("/", "%2F");
    var grainger_URL = "http://www.grainger.com/search?nls=1&searchQuery=" + url;
    
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        
    popupW = window.open(grainger_URL, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    
    var timer = setInterval(function(){ listenFor(); }, 500);
    
    $('div[class="jslider-pointer"]').css('left', '75%');
    $('div[class="jslider-value"]').css('left', '74%');
    $('div[class="jslider-value"]').text('4');
} else if (document.URL.indexOf("http://www.grainger.com") >= 0) {
    GM_setValue('one', $('a[class="bread-link bread-first"]').text());
    GM_setValue('two', $('a[class="bread-link "]').eq(0).text());
    GM_setValue('three', $('a[class="bread-link "]').eq(1).text());
    console.log(GM_getValue('one'))
}

function listenFor() {
    if (GM_getValue('one').length) {
        $('input[value="' + GM_getValue('one') + '"]').click().attr( "checked", true );
        $('input[value="' + GM_getValue('two') + '"]').click().attr( "checked", true );
        $('input[value="' + GM_getValue('three') + '"]').click().attr( "checked", true );
        GM_deleteValue('one')
        GM_deleteValue('two')
        GM_deleteValue('three')
    }
}


//setTimeout(function(){ $('input[value="' + "Power Tools" + '"]').click().attr( "checked", true ); }, 500);