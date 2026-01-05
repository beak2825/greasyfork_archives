// ==UserScript==
// @id             Amazon URL Cleaner
// @name           Amazon URL Cleaner
// @namespace      http://efcl.info/
// @description    replaceState for Amazon
// @include        http://www.amazon.*/dp/*
// @include        http://www.amazon.*/*gp/product/*
// @include        http://www.amazon.*/exec/obidos/ASIN/*
// @include        http://www.amazon.*/o/ASIN/*
// @version 0.0.1.20140518104255
// @downloadURL https://update.greasyfork.org/scripts/1162/Amazon%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/1162/Amazon%20URL%20Cleaner.meta.js
// ==/UserScript==
(function(doc) {
    // ASIN.0 in kindle store
    var asin = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
    if (asin) {
        asin = asin.value
        history.replaceState(null, "Amazon URL Cleaner", "/dp/" + asin + "/");
    }
})(document);