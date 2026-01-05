// ==UserScript==
// @name       Hybrid - Niftybrid
// @version    1.21
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/14027/Hybrid%20-%20Niftybrid.user.js
// @updateURL https://update.greasyfork.org/scripts/14027/Hybrid%20-%20Niftybrid.meta.js
// ==/UserScript==

$('a').click( function() { 
    if (this.href.indexOf('gethybrid') < 0) {
        var url = $(this).attr('href');
        
        if (url.indexOf('google') > -1)
            url = url.replace(/&/g, '%26').replace(/'/g, '%27');
        
        var wleft = window.screenX;
        var halfScreen = window.outerWidth-15;
        var windowHeight = window.outerHeight-68;
        var specs = 'height=' + windowHeight + ',width=' + halfScreen + ',left=' + (wleft + halfScreen) + ',top=0' + ',scrollbars=1,status=1,menubar=0,titlebar=1';

        var popupX = window.open(url, 'newWnd', specs);
        
        window.onbeforeunload = function (e) { popupX.close(); };
        
        return false;
    }
});