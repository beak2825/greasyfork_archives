// ==UserScript==
// @name             Google to Startpage
// @namespace        http://google.com
// @version          0.0.1
// @run-at           document-start
// @description      Redirect from Google results to Startpage results. Based on Amazon Smile Redirect by Wolvan (https://greasyfork.org/scripts/33073)
// @author           topre, Nieden
// @include          *://www.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/430089/Google%20to%20Startpage.user.js
// @updateURL https://update.greasyfork.org/scripts/430089/Google%20to%20Startpage.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
    var windowUrl = window.location.href;
 
    if (windowUrl.toLowerCase().indexOf("www.google.com/search?q=") !== -1) {
        console.log("Doing redir");
        window.location.href = windowUrl.replace("www.google.com/search?q=", "www.startpage.com/do/dsearch?query=");
    }
})();
