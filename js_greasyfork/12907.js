// ==UserScript==
// @name       jawz Hybrid - Verify an Email
// @version    1.5
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @match      https://www.google.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12907/jawz%20Hybrid%20-%20Verify%20an%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/12907/jawz%20Hybrid%20-%20Verify%20an%20Email.meta.js
// ==/UserScript==

if ($('h1:contains("Verify an email")').length) {
    $('div[class="item-response order-1"]').hide();
    for (i=15;i<28;i++) $('div[class="item-response order-2"]').find('p').eq(i).hide();
    var name = $('div[class="item-response order-2"]').find('p').eq(1).text();
    var email1 = $('div[class="item-response order-2"]').find('p').eq(10).text().replace('Email A: ', '');
    var email2 = $('div[class="item-response order-2"]').find('p').eq(13).text().replace('Email B: ', '');
    var url1 = "http://www.google.com/search?q=" + name + ' "' + email1 + '"';
    var url2 = "http://www.google.com/search?q=" + name + ' "' + email2 + '"';
    url1 = url1.replace(/&/g, "%26").replace(/#/g, "%23").replace(/[ ]/g, "+");
    url2 = url2.replace(/&/g, "%26").replace(/#/g, "%23").replace(/[ ]/g, "+");
    var windowLeft = window.screenX;
    var windowTop = window.screenY;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight + 47;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
    
    var popup = window.open(url1, 'remote', 'height=' + ((windowHeight / 2) - 50) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
    var popup2 = window.open(url2, 'remote1', 'height=' + (windowHeight / 2) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + (windowTop + windowHeight / 2) + specs,false);
        
    window.onbeforeunload = function (e) { 
        popup.close();
        popup2.close();
    }
    
    var nSpot1 = $('div[class="item-response order-3"]').find('p').eq(1);
    var nSpot2 = $('div[class="item-response order-5"]').find('p').eq(1);
    var eSpot1 = $('div[class="item-response order-4"]').find('p').eq(10);
    var eSpot2 = $('div[class="item-response order-6"]').find('p').eq(10);
    var bSpot1 = $('div[class="item-response order-7"]').find('p').eq(16);
    nSpot1.append('<br><b>' + name + '</b>');
    nSpot2.append('<br><b>' + name + '</b>');
    eSpot1.append('<br><b>' + email1 + '</b>');
    eSpot2.append('<br><b>' + email2 + '</b>');
    bSpot1.append('<br><b>' + 'A: ' + email1 + '<br>' + 'B: ' + email2 + '</b>');
    
    var no1 = $('div[class="item-response order-3"]').find('input').eq(6);
    var no2 = $('div[class="item-response order-5"]').find('input').eq(6);
    var last = $('div[class="item-response order-7"]').find('input').eq(4);
    no1.click(function() { last.prop('checked',true); });
    no2.click(function() { last.prop('checked',true); });
}

if (document.URL.indexOf("www.google.com") >= 0) { 
	var base = document.getElementById("resultStats");
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Search w/o Name";
    btn.type = "button";
    btn.onclick = function() { 
        var search = $('#lst-ib').val();
        search = search.split('"')[1];
        search = '"' + search;
        var searchUrl = "http://www.google.com/search?q=" + search + '"';
        window.location.href = searchUrl;
    }
    
    
    if ($('p:contains("did not match any documents")').text().length) { 
        var search = $('#lst-ib').val();
        if (search.charAt(0) !== '"' ) {
         search = search.split('"')[1];
         search = '"' + search;
         var searchUrl = "http://www.google.com/search?q=" + search + '"';
         window.location.href = searchUrl;
        }
    }
    
    base.appendChild(btn)
}