// ==UserScript==
// @name        Download Edge Store Extensions
// @namespace   https://greasyfork.org/en/users/860785-delphox
// @match       https://microsoftedge.microsoft.com/addons/*
// @grant       none
// @run-at      document-start
// @version     1.0
// @description Allows download extensions from Microsoft Edge Add-on Store in CRX format, to use in Chromium-based browsers.
// @author      Delphox, Arnaud (Kiwi Browser)
// @downloadURL https://update.greasyfork.org/scripts/439922/Download%20Edge%20Store%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/439922/Download%20Edge%20Store%20Extensions.meta.js
// ==/UserScript==
(function() {
    Object.defineProperty(navigator, 'userAgent', {
        value: window.navigator.userAgent + ' Edg/' + window.navigator.appVersion.match(/Chrome\/(\d+(:?\.\d+)+)/)[1]
    });
    var _kb_setIntervalCnt = 0;
    var _kb_setInterval = window.setInterval(function() {
        var xpath = function(xpathToExecute) {
            var result = [];
            var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                result.push(nodesSnapshot.snapshotItem(i));
            }
            return result;
        };
        xpath("//button[contains(@id,'getOrRemoveButton')]").forEach(function(individualButton) {
            individualButton.setAttribute('style', 'opacity: 1; background: rgb(0, 120, 212) !important; height: 60px; cursor: pointer !important;');
            individualButton.removeAttribute('disabled');
            individualButton.innerHTML = "<a href=https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&acceptformat=crx3&x=id%3D" + individualButton.id.split('-')[1] + "%26installsource%3Dondemand%26uc target='_blank' style='color: white; text-decoration: none'><b>Get CRX</b><br>(Right click and <br>Save Link As)</a>";
        });
        if (_kb_setIntervalCnt++ >= 10) { window.clearInterval(_kb_setInterval); }
    }, 1000);
})();