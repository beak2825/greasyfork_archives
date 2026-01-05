// ==UserScript==
// @name         Amazon Shortlinks
// @namespace    https://github.com/felixfischer/show-amazon-shortlinks
// @version      1.5
// @description  Adds a shortlink to Amazon product pages
// @supportURL   https://github.com/felixfischer/show-amazon-shortlinks/issues
// @author       Felix Fischer
// @include      *www.amazon.*
// @include      *smile.amazon.*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/23452/Amazon%20Shortlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/23452/Amazon%20Shortlinks.meta.js
// ==/UserScript==

(function(doc) {

    var ASIN = doc.getElementById("ASIN") || doc.getElementsByName("ASIN.0")[0];
    if (ASIN) {
        ASIN = ASIN.value;
        history.replaceState(null, "", "/dp/" + ASIN);
        var amznTLDs = ['com', 'co.uk', 'de', 'fr'];
        var noDpTLDs = ['com'];
        var domainParts = window.location.hostname.split('.');
        var TLD = domainParts.slice( domainParts.indexOf('amazon')+1 ).join('.');
        var SLD = amznTLDs.includes(TLD) ? 'amzn' : 'amazon';
        var pre = noDpTLDs.includes(TLD) ? '' : 'dp/';
        var URL = `${SLD}.${TLD}/${pre}${ASIN}`;
        var html =
            `<div class="a-spacing-large a-text-center" id="my-shortlink" title="click to copy">
                <a href="http://${URL}" onclick="return false">${URL}</a>
            </div>`;
        var pos = document.getElementById('tell-a-friend');
        pos.insertAdjacentHTML('afterend', html);
        var el = document.getElementById('my-shortlink');
        el.onclick = function() {
            GM_setClipboard('http://' + URL);
        };
    }

})(document);
