// ==UserScript==
// @name       Hybrid - Check Google Finance
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      https://www.google.com/finance?q=*
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23738/Hybrid%20-%20Check%20Google%20Finance.user.js
// @updateURL https://update.greasyfork.org/scripts/23738/Hybrid%20-%20Check%20Google%20Finance.meta.js
// ==/UserScript==

if ($('li:contains("Check Google Finance")').length) {
    var ticker = $('p:contains("Ticker: ")').text().replace('Ticker: ', '');
    var url = 'https://www.google.com/finance?q=' + ticker;

    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); };

    var timer = setInterval(function(){ listenFor(); }, 250);
}

if (document.URL.indexOf("google.com/finance") > 0) {
    setTimeout(function(){
        $('a:contains("Financials")')[0].click();
        var a,b,c,d,e,f,g,h,i,j;
        a = $('th[class="rgt"]').text().replace(/13 weeks ending /g,'').split("\n");
        b = a[3];
        c = a[5];
        d = a[7];
        a = a[1];
        var z = $('td[class="lft lm bld"]:contains("Total Revenue")').next().text();
        e = z.substring(0, z.indexOf('.')+3);
        z = z = $('td[class="lft lm bld"]:contains("Total Revenue")').next().next().text();
        f = z.substring(0, z.indexOf('.')+3);
        z = z = $('td[class="lft lm bld"]:contains("Total Revenue")').next().next().next().text();
        g = z.substring(0, z.indexOf('.')+3);
        z = z = $('td[class="lft lm bld"]:contains("Total Revenue")').next().next().next().next().text();
        h = z.substring(0, z.indexOf('.')+3);
        GM_setValue ('Msg', [a,b,c,d,e,f,g,h]);
    }, 1000);
}

function listenFor() {
    if (GM_getValue("Msg")) {
        var data = GM_getValue("Msg");
        $('div[class="item-response order-2"]').find('textarea').val(data[0]);
        $('div[class="item-response order-4"]').find('textarea').val(data[1]);
        $('div[class="item-response order-6"]').find('textarea').val(data[2]);
        $('div[class="item-response order-8"]').find('textarea').val(data[3]);

        $('div[class="item-response order-3"]').find('textarea').val(data[4]);
        $('div[class="item-response order-5"]').find('textarea').val(data[5]);
        $('div[class="item-response order-7"]').find('textarea').val(data[6]);
        $('div[class="item-response order-9"]').find('textarea').val(data[7]);
        GM_deleteValue("Msg");
        //$('input[name="commit"]').click();
    }
}
