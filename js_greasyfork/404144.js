// ==UserScript==
// @name         Gazelle - Request JSON export
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add JSON export buttons to requests
// @author       pankkake@notwhat
// @author       pankkake@orpheus
// @include      https://orpheus.network/requests.php*
// @include      https://notwhat.cd/requests.php*
// @include      https://redacted.ch/requests.php*
// @downloadURL https://update.greasyfork.org/scripts/404144/Gazelle%20-%20Request%20JSON%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/404144/Gazelle%20-%20Request%20JSON%20export.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // only add one link, can get duplicates if using forward/back buttons in browser
    if (document.querySelectorAll('a[href*="ajax.php?action=request"]').length > 0) {
        return;
    }
    var requestlinkElms = document.querySelectorAll('a[href*="requests.php"]');
    console.log(requestlinkElms);
    for(var i=0,link, l=requestlinkElms.length;i<l;i++) {
        if(requestlinkElms[i].href.indexOf('action=view') != -1) {
            link = document.createElement('a');
            link.textContent = 'JS';
            var txtNode = document.createTextNode(' | ');
            var requestId = requestlinkElms[i].href.replace(/^.*&id=(\d+).*?$/,'$1');
            link.href= 'ajax.php?action=request&id=' + requestId;
            link.download = document.querySelector('h2').textContent + ' [' + requestId + '] ['+ location.host + '].json';
            requestlinkElms[i].parentElement.lastElementChild.before(txtNode);
            txtNode.after(link);
        }
    }
})();

