// ==UserScript==
// @name           Lucifers HappyPlace Redirect
// @version        0.1.6
// @namespace      HappyPlace
// @description    Forces to load of happyplace copyright mwscripts.com
// @include        http://apps.facebook.com/inthemafia/*
// @include        https://apps.facebook.com/inthemafia/*
// @match          http://apps.facebook.com/inthemafia/*
// @match          https://apps.facebook.com/inthemafia/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/1284/Lucifers%20HappyPlace%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/1284/Lucifers%20HappyPlace%20Redirect.meta.js
// ==/UserScript==
var script_version = '0.1.6';

javascript: (function () {
    var http = 'http://';
    if (/https/.test(document.location)) {
        http = 'https://';
    }
    //    try{ 
    if ((/apps.facebook.com\/inthemafia/.test(document.location.href)) || (/facebook.mafiawars.zynga.com/.test(document.location.href))) {
        var happyplace_url = document.location.href.replace(http + 'apps.facebook.com', '')


        if (/happyplace_nofollow/.test(document.location.href)) {
            return false;
        }

        /*
         if (/next_params\=/.test(document.location.href)) {
           redirect(happyplace_url);
         }
         
        if (/inthemafia\/\?/.test(document.location.href)) {
            redirect(happyplace_url);
         }
         */
        if (/index.php/.test(document.location.href)) {
            redirect(happyplace_url)
        }
        if (((/appage&ref=bookmarks/.test(document.location.href)) || (document.location.href == http + "apps.facebook.com/inthemafia/"))) {
            //(/inthemafia\/\?next_params/.test(document.location.href)
            redirect();
        }
    }
    //        }catch(e){} 

    function redirect(parsedata) {
        var redirectto = 'http://mwscripts.com/happyplace'
        if (parsedata) redirectto += parsedata + '&happyplace_redirect_v2=true';


        document.location.href = redirectto;
    }



}())