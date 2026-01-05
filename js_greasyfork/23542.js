// ==UserScript==
// @name       Hybrid - Bloomberg
// @author		jawz
// @version    1.0
// @description Doin stuff
// @match      http://www.bloomberg.com/Research/common/symbollookup/*
// @match      https://www.gethybrid.io/workers/tasks/*
// @match      http://www.bloomberg.com/Research/stocks/private/snapshot.asp?privcapid=*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant	     GM_deleteValue
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23542/Hybrid%20-%20Bloomberg.user.js
// @updateURL https://update.greasyfork.org/scripts/23542/Hybrid%20-%20Bloomberg.meta.js
// ==/UserScript==

if ($('li:contains("Look up company info")').length) {
    var letter = $('p:contains("Bloomberg Letter:")').text().replace('Bloomberg Letter: ', '');
    var page = $('p:contains("Bloomberg Letter Page:")').text().replace('Bloomberg Letter Page: ', '');
    if ($('p:contains("Select Randomly")').text().match(/\d+/g))
        var count = $('p:contains("Select Randomly")').text().match(/\d+/g);
    else
        var count = 180;
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); };
    $('p:contains("Select Randomly")').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); };
    $('p:contains("Select Randomly")').append(btn);
    
    if (count[1])
        count = rando(Number(count[0]),Number(count[1]));
    //alert(count);
    GM_setValue('count',count);
    page--;
    page = page*180;
    $('div[class="item-response order-2"]').find('textarea').val('NA');
    $('div[class="item-response order-3"]').find('textarea').val('NA');
    $('div[class="item-response order-17"]').find('textarea').val('Not enough companies');
    $('div[class="item-response order-4"]').find('input').eq(5).prop( "checked", true );
    $('div[class="item-response order-6"]').find('input').eq(5).prop( "checked", true );
    $('div[class="item-response order-8"]').find('input').eq(5).prop( "checked", true );
    $('div[class="item-response order-10"]').find('input').eq(5).prop( "checked", true );
    $('div[class="item-response order-14"]').find('input').eq(5).prop( "checked", true );
    $('div[class="item-response order-16"]').find('input').eq(5).prop( "checked", true );
    
    var url = 'http://www.bloomberg.com/Research/common/symbollookup/symbollookup.asp?lookuptype=private&region=US&letterIn=' + letter + '&firstrow=' + page;
                       
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);

    window.onbeforeunload = function (e) { popupX.close(); };
    
    var timer = setInterval(function(){ listenFor(); }, 250);
    
    
    
}

if (document.URL.indexOf("bloomberg.com/Research/common/symbollookup/") > 0) {
    $('table tbody tr').each(function(idx){
        $(this).children(":eq(0)").html(' ' + idx + ') ' + $(this).children(":eq(0)").html());
    });
    var count2 = GM_getValue('count');
    GM_deleteValue('count');
    $('td:contains(" ' + count2 + ')")').find('a')[0].click();
    
}

if (document.URL.indexOf("bloomberg.com/Research/stocks/private/snapshot.asp?privcapid=") > 0) {
    var a,b,c,d,e,f,g,h,i,j;
    var a = window.location.href;
    var b = $('span[itemprop="name"]').text();
    var c = $('div[itemprop="address"]').find('p').eq(0).text() + ' ' + $('div[itemprop="address"]').find('p').eq(1).text() + ' ' + $('div[itemprop="address"]').find('p').eq(2).text() + ' ' + $('div[itemprop="address"]').find('p').eq(3).text() + ' ' + $('div[itemprop="address"]').find('p').eq(4).text();
    if ($('a[itemprop="url"]').attr('href'))
        var d = $('a[itemprop="url"]').attr('href');
    else
        d = '';
    var e = $('p[itemprop="telephone"]').text();
    var f = $('a[itemprop="member"]').length;
    var f = f === 0 ? '' : f;
    var g = $('a[itemprop="member"]').eq(0).text();
    var h = $('div[class="officerInner"]').eq(0).find('div').eq(1).text().trim();
    var i = $('span[itemprop="foundingDate"]').text();
    var j = $('h2:contains("Key Developments")').length > 0 ? true : false;
    GM_setValue ('Msg', [a,b,c,d,e,f,g,h,i,j]);
}

function listenFor() {
    if (GM_getValue("Msg")) {
        var data = GM_getValue("Msg");
        $('div[class="item-response order-2"]').find('textarea').val(data[0]);
        $('div[class="item-response order-3"]').find('textarea').val(data[1]);
        if (data[2].length > 0)
            $('div[class="item-response order-4"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-4"]').find('input').eq(5).prop( "checked", true );
        data[2] = data[2].replace(' ,   ','').replace(' , ','');
        $('div[class="item-response order-5"]').find('textarea').val(data[2]);
        if (data[3].length > 0)
            $('div[class="item-response order-6"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-6"]').find('input').eq(5).prop( "checked", true );
        $('div[class="item-response order-7"]').find('textarea').val(data[3]);
        if (data[4].length > 0)
            $('div[class="item-response order-8"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-8"]').find('input').eq(5).prop( "checked", true );
        $('div[class="item-response order-9"]').find('textarea').val(data[4]);
        if (data[6].length > 0)
            $('div[class="item-response order-10"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-10"]').find('input').eq(5).prop( "checked", true );
        $('div[class="item-response order-11"]').find('textarea').val(data[5]);
        $('div[class="item-response order-12"]').find('textarea').val(data[6]);
        $('div[class="item-response order-13"]').find('textarea').val(data[7]);
        if (data[8].length > 0)
            $('div[class="item-response order-14"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-14"]').find('input').eq(5).prop( "checked", true );
        $('div[class="item-response order-15"]').find('textarea').val(data[8]);
        if (data[9] == true)
            $('div[class="item-response order-16"]').find('input').eq(4).prop( "checked", true );
        else
            $('div[class="item-response order-16"]').find('input').eq(5).prop( "checked", true );
        
        $('div[class="item-response order-17"]').find('textarea').val('');
        GM_deleteValue("Msg");
        //$('input[name="commit"]').click();
    }
}

function rando(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}