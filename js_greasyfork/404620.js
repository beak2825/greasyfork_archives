// ==UserScript==
// @id             Amazon URL Cleaner
// @name           Amazon URL Cleaner
// @description    replaceState for Amazon
// @include http://*amazon.*/dp/*
// @include http://*amazon.*/*/dp/*
// @include http://*amazon.*/*gp/product/*
// @include http://*amazon.*/exec/obidos/ASIN/*
// @include http://*amazon.*/o/ASIN/*
// @include https://*amazon.*/dp/*
// @include https://*amazon.*/*/dp/*
// @include https://*amazon.*/*gp/product/*
// @include https://*amazon.*/exec/obidos/ASIN/*
// @include https://*amazon.*/o/ASIN/*
// @version 0.0.1.20140518104255
// @namespace https://greasyfork.org/users/47450
// @downloadURL https://update.greasyfork.org/scripts/404620/Amazon%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/404620/Amazon%20URL%20Cleaner.meta.js
// ==/UserScript==
(function(doc) {
    // ASIN.0 in kindle store
    var asin = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
    if (asin) {
        asin = asin.value
        history.replaceState(null, "Amazon URL Cleaner", "/dp/" + asin + "/");
    }
})(document);