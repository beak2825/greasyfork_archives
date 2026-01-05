// ==UserScript==
// @name       Hybrid - Bloomberg
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/24535/Hybrid%20-%20Bloomberg.user.js
// @updateURL https://update.greasyfork.org/scripts/24535/Hybrid%20-%20Bloomberg.meta.js
// ==/UserScript==

if(document.URL.indexOf("https://www.gethybrid.io") >= 0) { 
    if ($('li:contains("Bloomberg")').length) {
        var name = $('p:contains("Name:")').text().replace('Name: ','');
        var address = $('p:contains("Address:")').text().replace('Address: ','');
        var phone = $('p:contains("Phone Number:")').text().replace('Phone Number: ','');
        var searchUrl1 = "http://www.google.com/search?q=" + address;
        var searchUrl2 = "http://www.google.com/search?q=" + name + ' ' + phone;
        searchUrl1 = searchUrl1.replace(/&/g, "%26").replace('#', '');
        var bind = $('div[class="item-response order-1"]').find('label[class="control-label"]');
        var firstOpen = $('div[class="item-response order-1"]').find('a').eq(0).text();
        $('<a>',{
            text: searchUrl1,
            title: 'Address',
            href: searchUrl1
        }).appendTo(bind);
        bind.append('<br>');
        $('<a>',{
            text: searchUrl2,
            title: 'Phone',
            href: searchUrl2
        }).appendTo(bind);

        var wleft = window.screenX;
        var halfScreen = window.outerWidth;
        var windowHeight = window.outerHeight - 70;
        var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

        window.addEventListener("message", function(e) { hitPageListener(e) ;}, false);
        popupX = window.open(firstOpen, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
        window.onbeforeunload = function (e) { popupX.close(); }
        
        $('a').click( function() { 
            if (this.href.indexOf('gethybrid') < 0) {
                var url = this.innerHTML;
        
                if (url.indexOf('google') > -1)
                    url = url.replace(/&/g, '%26').replace(/'/g, '%27');
        
                var wleft = window.screenX;
                var halfScreen = window.outerWidth-15;
                var windowHeight = window.outerHeight-68;
                var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

                popupX = window.open(url, 'remote', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
        
                window.onbeforeunload = function (e) { popupX.close(); };
        
                return false;
            }
        });
    }
}
