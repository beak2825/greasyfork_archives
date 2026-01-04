// ==UserScript==
// @name         AMP Redirect
// @namespace    ultrabenosaurus.AMP
// @version      0.2
// @description  Redirect AMP addresses to their non-AMP sources
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @match        http*://*.cdn.ampproject.org/*
// @icon         https://www.google.com/s2/favicons?domain=ampproject.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400161/AMP%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/400161/AMP%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
    * from: https://www-techradar-com.cdn.ampproject.org/v/s/www.techradar.com/amp/news/eliminating-vpns-for-more-secure-productive-remote-work?amp_js_v=a3&amp_gsa=1&usqp=mq331AQFKAGwASA%3D#referrer=https%3A%2F%2Fwww.google.com&amp_tf=From%20%251%24s
    * to: https://www.techradar.com/news/eliminating-vpns-for-more-secure-productive-remote-work
    */

    var a = document.location.href.split("/");
    var al = a.length;
    var d = a[2].split(".")[0].replace(/-/g,".");
    if(d == a[5]){
        var p = a[al-1].split("?")[0];
        //alert(p);
        for (var i = al-2; i > 6; i--) {
            if(a[i]!=="amp") { p = a[i]+"/"+p; }
            //alert(a[i]);
        }
        var s = a[0]+"//"+d+"/"+p;
        window.location.href = s;
        //alert(s);
    }
})();