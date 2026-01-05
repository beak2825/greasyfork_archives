// ==UserScript==
// @name       Prospect Smarter
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://www.google.com/search*
// @match      https://www.mturkcontent.com/dynamic/hit?assignmentId*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23769/Prospect%20Smarter.user.js
// @updateURL https://update.greasyfork.org/scripts/23769/Prospect%20Smarter.meta.js
// ==/UserScript==

if ($('p:contains("do a google search")').length) {
    var addy = $('p:contains("do a google search")').text().replace('Click here to do a google search for this address: ', '');
    var url = 'https://www.google.com/search?q=' + addy;

    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); };

    var timer = setInterval(function(){ listenFor(); }, 250);
}

if (document.URL.indexOf("google.com/search?q=") > 0) {
    setTimeout(function(){
        var a = 'https://www.google.com' + $('a[href*="/maps/place/"]').eq(1).attr('href');
        if (a=='https://www.google.comundefined')
            a = 'NA';
        GM_setValue ('Msg', a);
    }, 200);
}

function listenFor() {
    if (GM_getValue("Msg")) {
        var data = GM_getValue("Msg");
        $('#web_url').val(data);
        GM_deleteValue("Msg");
        //$('input[name="commit"]').click();
    }
}
