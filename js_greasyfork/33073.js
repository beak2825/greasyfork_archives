// ==UserScript==
// @name             Amazon Smile Redirect
// @name:de          Amazon Smile Weiterleitung
// @namespace        http://amazon.com/
// @version          1.0.1
// @run-at           document-start
// @description      Redirect from amazon to smile.amazon, support helpful organizations
// @description:de   Leite automatisch von amazon zu smile.amazon weiter und unterstütze gemeinnützige Organisationen
// @author           Wolvan
// @icon             https://smile.amazon.com/favicon.ico
// @include          *://www.amazon.tld/*
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/33073/Amazon%20Smile%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/33073/Amazon%20Smile%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var windowUrl = window.location.href;

    if (windowUrl.toLowerCase().indexOf("smile.") === -1) {
        console.log("Doing redir");
        window.location.href = windowUrl.replace("www.amazon", "smile.amazon");
    }
})();